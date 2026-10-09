/* PRELOADER: loads the core asset set behind a loading screen (first visit only), registers the asset cache
   service worker, then quietly prefetches story art for the nodes the player can reach next.
   Needs src/js/preload-manifest.js (scripts/build-preload-manifest.py). Never blocks or alters game logic. */
(function () {
  'use strict';
  var M = window.NDPreloadManifest;
  if (!M || window.NDPreload) return;
  var KEY = 'nd-preload-v';
  var seen = false;
  try { seen = localStorage.getItem(KEY) === M.version; } catch (e) {}
  var conn = navigator.connection || {};
  var constrained = !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  var held = [];
  var loaded = Object.create(null);
  var dead = Object.create(null);
  var inflight = Object.create(null);
  var failed = 0;

  function isAudio(url) { return /\.(mp3|wav|ogg)$/i.test(url); }

  function loadOne(url, hold) {
    if (loaded[url]) return Promise.resolve(true);
    if (inflight[url]) return inflight[url];
    var p = new Promise(function (resolve) {
      var tries = 0;
      (function attempt() {
        tries++;
        var finished = false;
        var timer = setTimeout(function () { fail(); }, 15000);
        function ok() { if (finished) return; finished = true; clearTimeout(timer); loaded[url] = 1; resolve(true); }
        function fail() { if (finished) return; finished = true; clearTimeout(timer); if (tries < 2) attempt(); else { dead[url] = 1; resolve(false); } }
        if (isAudio(url)) {
          fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }).then(ok, fail);
        } else {
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            if (hold) held.push(img);
            (img.decode ? img.decode() : Promise.resolve()).then(ok, ok);
          };
          img.onerror = fail;
          img.src = url;
        }
      })();
    }).then(function (ok) { delete inflight[url]; return ok; });
    inflight[url] = p;
    return p;
  }

  function runPool(urls, limit, hold, onEach) {
    return new Promise(function (resolve) {
      var i = 0, active = 0, done = 0, total = urls.length;
      if (!total) return resolve();
      (function next() {
        while (active < limit && i < total) {
          active++;
          loadOne(urls[i++], hold).then(function (ok) {
            active--; done++;
            if (!ok) failed++;
            if (onEach) onEach(done, total);
            if (done === total) resolve(); else next();
          });
        }
      })();
    });
  }

  /* ---------- loading screen ---------- */
  var overlay, bar, count, hintEl, hintTimer;
  var HINTS = ['正在準備卡牌與角色…', '夜域退去之前，先整理好牌組。', '第一次進入會稍久，之後會直接開始。'];
  function showOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'nd-loading';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = '<div class="nd-loading-inner"><div class="nd-loading-mark"></div><h1>NIGHTFALL DUEL</h1>' +
      '<p class="nd-loading-hint"></p><div class="nd-loading-bar"><i></i></div><small class="nd-loading-count">準備素材 0%</small></div>';
    (document.body || document.documentElement).appendChild(overlay);
    bar = overlay.querySelector('i'); count = overlay.querySelector('.nd-loading-count'); hintEl = overlay.querySelector('.nd-loading-hint');
    var h = 0; hintEl.textContent = HINTS[0];
    hintTimer = setInterval(function () { h = (h + 1) % HINTS.length; hintEl.style.opacity = 0; setTimeout(function () { hintEl.textContent = HINTS[h]; hintEl.style.opacity = 1; }, 250); }, 2800);
  }
  function progress(done, total) {
    if (!overlay) return;
    var pct = Math.round(done / total * 100);
    bar.style.width = pct + '%';
    count.textContent = '準備素材 ' + pct + '%';
  }
  function hideOverlay() {
    if (!overlay) return;
    clearInterval(hintTimer);
    overlay.classList.add('is-done');
    var el = overlay; overlay = null;
    setTimeout(function () { el.remove(); }, 600);
  }

  /* ---------- story prefetch (per node, in play order) ---------- */
  var ASSET_RE = /assets\/[A-Za-z0-9_\-./]+\.(?:webp|png|jpe?g|mp3|wav|ogg)/g;
  var nodeCache = Object.create(null);
  function nodeAssets(id) {
    if (nodeCache[id]) return nodeCache[id];
    var out = [], seenPath = Object.create(null);
    function add(p) { if (typeof p === 'string' && p.indexOf('assets/') === 0 && !seenPath[p]) { seenPath[p] = 1; out.push(p); } }
    var perf = window.NDStoryPerformances && window.NDStoryPerformances[id];
    if (perf) {
      var SA = window.NDStageAssets;
      (perf.allSteps || perf.steps || []).forEach(function (step) {
        try {
          var s = SA && SA.resolve(id, step);
          if (!s) { var fr = perf.frames && perf.frames[step.frame]; if (fr) add(fr.path); return; }
          if (s.background) add(s.background.path);
          (s.actors || []).forEach(function (a) { add(a && a.path); });
        } catch (e) {}
      });
    }
    var enc = window.NDCampaign && window.NDCampaign.encounters;
    if (enc) Object.keys(enc).forEach(function (k) {
      if (k === id || k.indexOf(id + '-') === 0) (JSON.stringify(enc[k]).match(ASSET_RE) || []).forEach(add);
    });
    if (perf || enc) nodeCache[id] = out;
    return out;
  }

  function pendingOrder() {
    var C = window.NDCampaign;
    if (!C || !C.nodes) return [];
    var snap = {}; try { snap = C.snapshot(); } catch (e) {}
    var doneNodes = snap.completedNodes || [];
    var todo = C.nodes.filter(function (n) { return doneNodes.indexOf(n.id) < 0; });
    var open = [], rest = [];
    todo.forEach(function (n) { var u = false; try { u = C.unlocked(n.id); } catch (e) {} (u ? open : rest).push(n.id); });
    return open.concat(rest);
  }

  var pumping = 0;
  function nextBackgroundUrl() {
    var order = pendingOrder();
    if (constrained) order = order.slice(0, 2);
    for (var i = 0; i < order.length; i++) {
      var list = nodeAssets(order[i]);
      for (var j = 0; j < list.length; j++) if (!loaded[list[j]] && !dead[list[j]] && !inflight[list[j]]) return list[j];
    }
    if (!constrained) for (var k = 0; k < M.story.length; k++) if (!loaded[M.story[k]] && !dead[M.story[k]] && !inflight[M.story[k]]) return M.story[k];
    return null;
  }
  function pump() {
    while (pumping < 2) {
      var url = nextBackgroundUrl();
      if (!url) return;
      pumping++;
      loadOne(url, false).then(function () {
        pumping--;
        setTimeout(pump, 120);
      });
    }
  }
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 400); };

  window.NDPreload = {
    node: function (id) { return runPool(nodeAssets(id), 4, false); },
    nodeAssets: nodeAssets,
    refresh: function () { idle(pump); },
    stats: function () { return { loaded: Object.keys(loaded).length, failed: failed }; }
  };

  /* ---------- boot ---------- */
  function registerSW() {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol) || /[?&]nosw\b/.test(location.search)) return Promise.resolve();
    return navigator.serviceWorker.register('sw.js').then(function () {
      return Promise.race([navigator.serviceWorker.ready, new Promise(function (r) { setTimeout(r, 1500); })]);
    }).catch(function () {});
  }

  function boot() {
    if (!seen) showOverlay();
    var started = Date.now();
    registerSW().then(function () {
      var cap = new Promise(function (r) { setTimeout(r, 20000); });
      return Promise.race([runPool(M.core, 6, true, progress), cap]);
    }).then(function () {
      var wait = overlay ? Math.max(0, 450 - (Date.now() - started)) : 0;
      setTimeout(function () {
        hideOverlay();
        if (!failed) { try { localStorage.setItem(KEY, M.version); } catch (e) {} }
        document.dispatchEvent(new Event('nd:assets-ready'));
        idle(pump);
        setInterval(function () { if (!document.hidden) pump(); }, 20000);
      }, wait);
    });
  }
  boot();
})();
