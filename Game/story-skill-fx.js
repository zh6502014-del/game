/* STORY-SKILL-FX v2 (SKILL-FX-060): hand-painted sprite effects for the four story-battle skills.
 * Canvas overlay + sprite particles. Black-background sprites draw additively ("lighter"), alpha sprites normally.
 * Each skill = anticipation -> impact (+hit-stop, shake) -> dissipation. Purely visual; never touches combat results.
 * API: NDSkillFX.load(base|map) -> Promise; NDSkillFX.play(kind, ctx) -> Promise; NDSkillFX.timeScale = 1.
 *   ctx = {canvas, host (element to shake), source:{el}, target:{el}, reduced:false}
 */
(() => {
  'use strict';
  const FILES = {
    dust:'fx-dust-burst.webp', spikes:'fx-crystal-spikes.webp', fissure:'fx-ground-fissure.webp', shackle:'fx-crystal-shackle.webp',
    smoke:'fx-shadow-smoke.webp', arc:'fx-sword-arc.webp', shock:'fx-gold-shockwave.webp', orb:'fx-resonance-orb.webp', ripple:'fx-resonance-ripple.webp',
    rock1:'fx-rock-debris-1.webp', rock2:'fx-rock-debris-2.webp', rock3:'fx-rock-debris-3.webp', rock4:'fx-rock-debris-4.webp', rock5:'fx-rock-debris-5.webp', rock6:'fx-rock-debris-6.webp',
    wisp1:'fx-smoke-wisps-1.webp', wisp2:'fx-smoke-wisps-2.webp', wisp3:'fx-smoke-wisps-3.webp', wisp4:'fx-smoke-wisps-4.webp',
    mote1:'fx-gold-motes-1.webp', mote2:'fx-gold-motes-2.webp', mote3:'fx-gold-motes-3.webp', mote4:'fx-gold-motes-4.webp', mote5:'fx-gold-motes-5.webp',
    mote6:'fx-gold-motes-6.webp', mote7:'fx-gold-motes-7.webp', mote8:'fx-gold-motes-8.webp', mote9:'fx-gold-motes-9.webp',
    // king awakening (KING-AWAKEN-FX)
    awAura:'fx-awaken-aura.webp', awFlash:'fx-awaken-flash.webp', awRing:'fx-awaken-ring.webp', awSpike:'fx-awaken-spike.webp',
    awMote1:'fx-awaken-motes-1.webp', awMote2:'fx-awaken-motes-2.webp', awMote3:'fx-awaken-motes-3.webp', awMote4:'fx-awaken-motes-4.webp', awMote5:'fx-awaken-motes-5.webp',
    awMote6:'fx-awaken-motes-6.webp', awMote7:'fx-awaken-motes-7.webp', awMote8:'fx-awaken-motes-8.webp', awMote9:'fx-awaken-motes-9.webp',
    cone:'fx-crystal-cone.webp', // H2 晶錐
    awShard1:'fx-awaken-shard-1.webp', awShard2:'fx-awaken-shard-2.webp', awShard3:'fx-awaken-shard-3.webp', awShard4:'fx-awaken-shard-4.webp', awShard5:'fx-awaken-shard-5.webp', awShard6:'fx-awaken-shard-6.webp'
  };
  const ADD = new Set(['awAura','awRing','awFlash','awMote1','awMote2','awMote3','awMote4','awMote5','awMote6','awMote7','awMote8','awMote9','fissure','arc','shock','orb','ripple','mote1','mote2','mote3','mote4','mote5','mote6','mote7','mote8','mote9']);
  const img = {};
  const R = k => img[k];
  const pick = (pre, n, i) => R(pre + (1 + (i % n)));
  const ease = {
    out: t => 1 - Math.pow(1 - t, 3), in: t => t * t * t, inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    back: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  // Sound cues (recipes in skill-fx-sfx.js); ctx.sound overrides window.playSfx.
  const sfx = (c, n) => { try { const f = c.sound || window.playSfx; if (typeof f === 'function') f(n); } catch (e) {} };
  const lerp = (a, b, t) => a + (b - a) * t, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  // alpha envelope: fade in over `fi` of life, hold, fade out over `fo`
  const env = (t, fi = .12, fo = .45) => t < fi ? t / fi : t > 1 - fo ? (1 - t) / fo : 1;

  function load(src) {
    const map = typeof src === 'string' ? Object.fromEntries(Object.entries(FILES).map(([k, f]) => [k, src.replace(/\/?$/, '/') + f])) : src;
    return Promise.all(Object.entries(map).map(([k, url]) => new Promise((res, rej) => {
      const i = new Image(); i.onload = () => { img[k] = i; res(); }; i.onerror = () => rej(new Error('fx sprite ' + k)); i.src = url;
    })));
  }

  // ---- runtime ---------------------------------------------------------------------------------------------------
  function Stage(ctx) {
    const cv = ctx.canvas, g = cv.getContext('2d');
    const box = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(box.width * dpr); cv.height = Math.round(box.height * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Every element an effect measures is remembered (track); sprites born on top of one follow it afterwards, so effects stay
    // glued to the piece if its card moves, is re-laid-out (e.g. units re-ordered) or lunges while the effect plays.
    const track = [];
    const rect = el => { const r = el.getBoundingClientRect(); const o = {x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2, w: r.width, h: r.height, top: r.top - box.top, bottom: r.bottom - box.top};
      if (!track.some(t => t.el === el)) track.push({el, x: o.x, y: o.y, w: o.w, h: o.h, dx: 0, dy: 0}); return o; };
    return {cv, g, W: box.width, H: box.height, rect, track, parts: [], timers: [], clock: 0, stop: 0, dim: null, shake: null, anims: []};
  }
  function sprite(S, o) { o.born = S.clock; S.parts.push(o); return o; }
  function at(S, ms, fn) { S.timers.push({ms, fn}); }
  function hitstop(S, ms) { S.stop = Math.max(S.stop, ms); }
  function shake(S, amp, ms) { S.shake = {amp, ms, t0: S.clock}; }
  function dim(S, to, ms, hole) { S.dim = {from: S.dim ? S.dim.cur : 0, to, ms, t0: S.clock, cur: S.dim ? S.dim.cur : 0, hole: hole || (S.dim && S.dim.hole)}; }
  function cardAnim(S, el, frames, ms) { if (el && el.animate) S.anims.push(el.animate(frames, {duration: ms / NDSkillFX.timeScale, easing: 'ease-out'})); }
  function flash(S, x, y, r, color, life) { return sprite(S, {flash: true, x, y, r, color, life}); }

  function draw(S) {
    const g = S.g; g.clearRect(0, 0, S.W, S.H);
    if (S.dim) {
      const d = S.dim, t = clamp((S.clock - d.t0) / d.ms); d.cur = lerp(d.from, d.to, ease.out(t));
      if (d.cur > .001) {
        g.save(); g.globalCompositeOperation = 'source-over';
        if (d.hole) { const gr = g.createRadialGradient(d.hole.x, d.hole.y, d.hole.r * .55, d.hole.x, d.hole.y, d.hole.r * 1.6); gr.addColorStop(0, 'rgba(4,8,10,0)'); gr.addColorStop(1, 'rgba(4,8,10,' + d.cur + ')'); g.fillStyle = gr; }
        else g.fillStyle = 'rgba(4,8,10,' + d.cur + ')';
        g.fillRect(0, 0, S.W, S.H); g.restore();
      }
    }
    S.parts = S.parts.filter(p => S.clock - p.born < p.life);
    // live offset of every tracked piece relative to where it was when the effect measured it
    if (S.track.length) { const cb = S.cv.getBoundingClientRect(), box0 = S.box0 || (S.box0 = {l: cb.left, t: cb.top});
      for (const k of S.track) { if (!k.el.isConnected) continue; const r = k.el.getBoundingClientRect(); if (!r.width && !r.height) continue;
        k.dx = (r.left - cb.left + r.width / 2) - k.x; k.dy = (r.top - cb.top + r.height / 2) - k.y; } }
    for (const p of S.parts) {
      const t = clamp((S.clock - p.born) / p.life);
      if (p.update) p.update(p, t);
      if (p.trk === undefined) { // first drawn frame: attach to the piece it was born on, if any
        p.trk = null; let best = 1e9;
        for (const k of S.track) { const d = Math.hypot(p.x - k.x, p.y - k.y); if (Math.abs(p.x - k.x) <= k.w * .75 && Math.abs(p.y - k.y) <= k.h * .75 && d < best) { best = d; p.trk = k; } } }
      const ox = p.trk ? p.trk.dx : 0, oy = p.trk ? p.trk.dy : 0;
      g.save(); if (ox || oy) g.translate(ox, oy);
      if (p.flash) {
        const a = (1 - t) * (1 - t);
        g.save(); g.globalCompositeOperation = 'lighter';
        const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (0.6 + t * .6));
        gr.addColorStop(0, p.color.replace('A', String(a))); gr.addColorStop(1, p.color.replace('A', '0'));
        g.fillStyle = gr; g.fillRect(p.x - p.r * 2, p.y - p.r * 2, p.r * 4, p.r * 4); g.restore(); g.restore(); continue;
      }
      const im = p.img; if (!im || p.alpha <= 0) { g.restore(); continue; }
      g.save(); g.globalAlpha = clamp(p.alpha); g.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
      g.translate(p.x, p.y); if (p.rot) g.rotate(p.rot);
      const w = p.w * (p.sx ?? p.s ?? 1), h = p.h * (p.sy ?? p.s ?? 1), ax = p.ax ?? .5, ay = p.ay ?? .5;
      if (p.reveal != null) { // horizontal reveal (fissure)
        const rw = clamp(p.reveal); g.drawImage(im, 0, 0, im.width * rw, im.height, -w * ax, -h * ay, w * rw, h);
      } else g.drawImage(im, -w * ax, -h * ay, w, h);
      if (p.add && p.boost) { g.globalAlpha = clamp(p.alpha * p.boost); g.drawImage(im, -w * ax, -h * ay, w, h); }
      g.restore();
      g.restore();
    }
  }

  function run(S, total, ctx) {
    return new Promise(resolve => {
      let last = performance.now(), done = false;
      const host = ctx.host;
      const frame = now => {
        if (done) return;
        if (ctx.cancelled && ctx.cancelled()) { done = true; S.g.clearRect(0, 0, S.W, S.H); if (host) host.style.transform = ''; resolve(false); return; }
        let dt = Math.min(50, now - last) * NDSkillFX.timeScale; last = now;
        if (S.stop > 0) { S.stop -= dt; dt = 0; }
        S.clock += dt;
        const due = S.timers.filter(tm => tm.ms <= S.clock); S.timers = S.timers.filter(tm => tm.ms > S.clock); due.sort((x, y) => x.ms - y.ms).forEach(tm => tm.fn());
        if (S.shake && host) {
          const e = clamp((S.clock - S.shake.t0) / S.shake.ms);
          if (e >= 1) { host.style.transform = ''; S.shake = null; }
          else { const a = S.shake.amp * (1 - e) * (1 - e); host.style.transform = `translate(${(Math.random() * 2 - 1) * a}px,${(Math.random() * 2 - 1) * a}px)`; }
        }
        draw(S);
        if (S.clock >= total && !S.timers.length) { done = true; S.g.clearRect(0, 0, S.W, S.H); if (host) host.style.transform = ''; resolve(true); return; }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }

  // ---- shared emitters -------------------------------------------------------------------------------------------
  function rocks(S, x, y, n, power, spread = Math.PI * .9) {
    for (let i = 0; i < n; i++) {
      const im = pick('rock', 6, i + Math.floor(Math.random() * 6)), a = -Math.PI / 2 + (Math.random() - .5) * spread, v = power * (.55 + Math.random() * .6), s = .18 + Math.random() * .22;
      sprite(S, {img: im, w: im.width, h: im.height, s, x, y, life: 620 + Math.random() * 260, rot: Math.random() * 6, alpha: 1,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v, vr: (Math.random() - .5) * 10,
        update(p, t) { const k = t * p.life / 1000; p.x = x + p.vx * k; p.y = y + p.vy * k + 900 * k * k; p.rot += p.vr * .016; p.alpha = t > .7 ? (1 - t) / .3 : 1; }});
    }
  }
  function dustAt(S, x, y, width, life = 700) {
    const im = R('dust'), base = width / im.width;
    sprite(S, {img: im, w: im.width, h: im.height, x, y, ay: .78, life, alpha: 0,
      update(p, t) { p.sx = base * lerp(.55, 1.35, ease.out(t)); p.sy = base * lerp(.4, 1.1, ease.out(t)); p.alpha = env(t, .08, .6) * .95; p.y = y - 10 * t; }});
  }

  // ---- skills ----------------------------------------------------------------------------------------------------
  const SKILLS = {
    quake(S, c) { // 地遁
      at(S, 290, () => sfx(c, 'fxQuakeStomp')); at(S, 305, () => sfx(c, 'fxQuakeCrack')); at(S, 590, () => sfx(c, 'fxQuakeImpact'));
      const a = S.rect(c.source.el), b = S.rect(c.target.el), A = {x: a.x, y: a.bottom - a.h * .12}, B = {x: b.x, y: b.bottom - b.h * .12};
      dim(S, .42, 220, {x: a.x, y: a.y, r: a.w * .9});
      cardAnim(S, c.source.el, [{transform: 'translateY(0)'}, {transform: 'translateY(-16px) scale(1.03)', offset: .6}, {transform: 'translateY(4px) scale(1.04,.95)', offset: .8}, {transform: 'translateY(0)'}], 360);
      at(S, 290, () => { dustAt(S, A.x, A.y, a.w * 1.5, 620); rocks(S, A.x, A.y, 5, 260); shake(S, 4, 160); flash(S, A.x, A.y, a.w * .5, 'rgba(255,214,150,A)', 220); });
      const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), fis = R('fissure');
      at(S, 300, () => {
        sprite(S, {img: fis, add: true, boost: .6, w: fis.width, h: fis.height, x: A.x, y: A.y, ax: 0, ay: .5, rot: ang, life: 760, alpha: 1,
          update(p, t) { const k = clamp(t / .38); p.reveal = ease.inOut(k); p.sx = len / fis.width; p.sy = Math.max(.55, a.w / 260) * (1 + .25 * Math.sin(t * 20) * (1 - t)); p.alpha = t > .55 ? (1 - t) / .45 : 1; }});
        for (let i = 1; i <= 3; i++) at(S, 300 + i * 70, () => rocks(S, A.x + dx * i / 4, A.y + dy * i / 4, 2, 150));
      });
      at(S, 590, () => {
        hitstop(S, 70); shake(S, 8, 240);
        flash(S, B.x, B.y - b.h * .1, b.w * .8, 'rgba(255,214,150,A)', 260);
        dustAt(S, B.x, B.y, b.w * 1.4, 700); rocks(S, B.x, B.y, 7, 340);
        // 地遁 hits from below: a second, wider dust wave and rocks thrown up under the target; the card is heaved up and drops back.
        dustAt(S, B.x, B.y + b.h * .02, b.w * 1.9, 820);
        rocks(S, B.x, B.y, 6, 430, Math.PI * .5);
        cardAnim(S, c.target.el, [{transform: 'translateY(0) scale(1)', filter: 'brightness(1)'}, {transform: 'translateY(-22px) scale(1.03) rotate(-2deg)', filter: 'brightness(1.35)', offset: .28}, {transform: 'translateY(3px) scale(1.03,.96)', offset: .55}, {transform: 'translateY(0) scale(1)', filter: 'brightness(1)'}], 460);
      });
      at(S, 1000, () => dim(S, 0, 300));
      return 1350;
    },
    stun(S, c) { // 暈眩：星光繞著目標頭頂轉，卡片晃動、略失色
      sfx(c, 'fxStun');
      const b = S.rect(c.target.el), cx = b.x, cy = b.top - b.h * .01, rx = b.w * .46, ry = b.w * .14, stars = ['mote1', 'mote9', 'mote1', 'mote9'];
      stars.forEach((k, i) => { const im = R(k), s0 = (b.w * .5) / im.width;
        sprite(S, {img: im, add: true, w: im.width, h: im.height, x: cx, y: cy, life: 1300, alpha: 0,
          update(p, t) { const ang = i / stars.length * Math.PI * 2 + t * Math.PI * 2 * 1.6, depth = (Math.sin(ang) + 1) / 2;
            p.x = cx + Math.cos(ang) * rx; p.y = cy + Math.sin(ang) * ry; p.s = s0 * (.7 + .45 * depth); p.rot = t * 6; p.alpha = env(t, .12, .3) * (.45 + .55 * depth); }}); });
      cardAnim(S, c.target.el, [{transform: 'rotate(0deg)', filter: 'saturate(1) brightness(1)'}, {transform: 'rotate(-3deg)', filter: 'saturate(.55) brightness(.85)', offset: .2}, {transform: 'rotate(3deg)', offset: .45}, {transform: 'rotate(-2deg)', offset: .7}, {transform: 'rotate(0deg)', filter: 'saturate(1) brightness(1)'}], 1250);
      return 1350;
    },
    shadow(S, c) { // 殘影
      sfx(c, 'fxShadowGather'); at(S, 430, () => sfx(c, 'fxShadowBurst'));
      const a = S.rect(c.source.el);
      dim(S, .38, 220, {x: a.x, y: a.y, r: a.w * .9});
      for (let i = 0; i < 4; i++) {
        const im = pick('wisp', 4, i), ang = i * Math.PI / 2 + .6, d = a.w * 1.5, sx = a.x + Math.cos(ang) * d, sy = a.y + Math.sin(ang) * d * .8, sc = (a.w * 1.1) / im.width;
        sprite(S, {img: im, w: im.width, h: im.height, x: sx, y: sy, ax: 0, rot: ang + Math.PI, life: 460, alpha: 0, s: sc,
          update(p, t) { const k = ease.in(t); p.x = lerp(sx, a.x, k); p.y = lerp(sy, a.y, k); p.alpha = env(t, .25, .3) * .9; p.sx = sc * lerp(1, .6, t); }});
      }
      at(S, 430, () => {
        hitstop(S, 40);
        const sm = R('smoke'), base = (a.w * 1.5) / sm.width;
        sprite(S, {img: sm, w: sm.width, h: sm.height, x: a.x, y: a.y, life: 820, alpha: 0, update(p, t) { p.s = base * lerp(.55, 1.35, ease.out(t)); p.rot = t * .5; p.alpha = env(t, .1, .55); }});
        for (let i = 0; i < 3; i++) { const ox = (i - 1) * a.w * .45, oy = (i % 2 ? -1 : 1) * a.h * .18;
          sprite(S, {img: sm, w: sm.width, h: sm.height, x: a.x + ox, y: a.y + oy, life: 700, alpha: 0, update(p, t) { p.s = base * .55 * lerp(.4, 1.1, ease.out(t)); p.rot = -t * .8 + i; p.alpha = env(t, .15, .6) * .8; p.x = a.x + ox * (1 + t * .6); }}); }
        cardAnim(S, c.source.el, [{opacity: 1, transform: 'translateX(0)'}, {opacity: .08, transform: 'translateX(-6px)', offset: .15}, {opacity: .08, transform: 'translateX(6px)', offset: .55}, {opacity: 1, transform: 'translateX(0)'}], 800);
      });
      at(S, 760, () => { for (let i = 0; i < 3; i++) { const im = pick('wisp', 4, i + 1), ang = -Math.PI / 2 + (i - 1) * .9, sc = (a.w * .9) / im.width;
        sprite(S, {img: im, w: im.width, h: im.height, x: a.x, y: a.y, ax: 0, rot: ang, life: 560, alpha: 0, s: sc, update(p, t) { p.x = a.x + Math.cos(ang) * a.w * .6 * t; p.y = a.y + Math.sin(ang) * a.w * .6 * t; p.alpha = env(t, .2, .7) * .7; }}); } dim(S, 0, 320); });
      return 1300;
    },
    unity(S, c) { // 人劍合一
      sfx(c, 'fxUnityGather'); at(S, 470, () => sfx(c, 'fxUnityStrike'));
      const a = S.rect(c.source.el);
      dim(S, .45, 220, {x: a.x, y: a.y, r: a.w * .9});
      for (let i = 0; i < 14; i++) {
        const im = pick('mote', 9, i), ang = i / 14 * Math.PI * 2, r0 = a.w * (1.1 + (i % 3) * .25), s0 = .35 + Math.random() * .35, dl = (i * 23) % 140;
        at(S, dl, () => sprite(S, {img: im, add: true, w: im.width, h: im.height, x: 0, y: 0, life: 460, alpha: 0,
          update(p, t) { const k = ease.in(t), r = r0 * (1 - k), q = ang + k * 2.2; p.x = a.x + Math.cos(q) * r; p.y = a.y - a.h * .1 + Math.sin(q) * r * .75; p.s = s0 * lerp(1, .5, k); p.alpha = env(t, .3, .15); }}));
      }
      at(S, 470, () => {
        hitstop(S, 55); shake(S, 3, 160);
        const arc = R('arc'), hgt = a.h * 1.7, base = hgt / arc.height;
        sprite(S, {img: arc, add: true, boost: .8, w: arc.width, h: arc.height, x: a.x, y: a.top - a.h * .5, life: 520, alpha: 0,
          update(p, t) { const k = ease.out(clamp(t / .25)); p.y = lerp(a.top - a.h * .55, a.y, k); p.sx = base * lerp(1.4, .9, t); p.sy = base * lerp(.6, 1.05, k); p.alpha = t < .1 ? t / .1 : 1 - ease.in(clamp((t - .25) / .75)); }});
        flash(S, a.x, a.y, a.w * .9, 'rgba(255,236,190,A)', 300);
        const sh = R('shock'), base2 = (a.w * 2.1) / sh.width;
        at(S, 520, () => sprite(S, {img: sh, add: true, w: sh.width, h: sh.height, x: a.x, y: a.y, life: 560, alpha: 0, update(p, t) { p.s = base2 * lerp(.25, 1.1, ease.out(t)); p.sy = p.s * .82; p.alpha = env(t, .06, .7); }}));
        cardAnim(S, c.source.el, [{filter: 'brightness(1)', transform: 'translateY(0)'}, {filter: 'brightness(1.7) saturate(1.2)', transform: 'translateY(-6px)', offset: .25}, {filter: 'brightness(1.15)', transform: 'translateY(-2px)', offset: .6}, {filter: 'brightness(1)', transform: 'translateY(0)'}], 700);
      });
      at(S, 760, () => { for (let i = 0; i < 8; i++) { const im = pick('mote', 9, i + 3), x0 = a.x + (Math.random() - .5) * a.w * .9, y0 = a.bottom - a.h * .1, s0 = .25 + Math.random() * .2;
        sprite(S, {img: im, add: true, w: im.width, h: im.height, x: x0, y: y0, life: 700, alpha: 0, update(p, t) { p.y = y0 - a.h * .8 * t; p.x = x0 + Math.sin(t * 6 + i) * 6; p.s = s0; p.alpha = env(t, .2, .5) * .8; }}); } dim(S, 0, 320); });
      return 1250;
    },
    resonance(S, c) { // 共振彈
      sfx(c, 'fxResCharge'); at(S, 360, () => sfx(c, 'fxResFire')); at(S, 612, () => sfx(c, 'fxResImpact'));
      const a = S.rect(c.source.el), b = S.rect(c.target.el), M = {x: a.x, y: a.top + a.h * .28}, T = {x: b.x, y: b.y};
      dim(S, .4, 220, {x: a.x, y: a.y, r: a.w * .9});
      const rp = R('ripple'), orb = R('orb');
      for (let i = 0; i < 2; i++) at(S, i * 150, () => sprite(S, {img: rp, add: true, w: rp.width, h: rp.height, x: M.x, y: M.y, life: 330, alpha: 0, update(p, t) { p.s = (a.w * 1.6 / rp.width) * lerp(1, .15, ease.in(t)); p.alpha = env(t, .3, .25) * .85; }}));
      const ang = Math.atan2(T.y - M.y, T.x - M.x), size = (a.w * .9) / orb.width;
      const bullet = sprite(S, {img: orb, add: true, boost: .5, w: orb.width, h: orb.height, x: M.x, y: M.y, ax: .78, rot: ang, life: 640, alpha: 0,
        update(p, t) {
          const ms = t * p.life;
          if (ms < 360) { const k = ms / 360; p.s = size * lerp(.1, .55, ease.out(k)); p.alpha = k; p.x = M.x; p.y = M.y; }
          else { const k = ease.in(clamp((ms - 360) / 250)); p.x = lerp(M.x, T.x, k); p.y = lerp(M.y, T.y, k); p.s = size * lerp(.55, 1, k); p.alpha = 1;
            if (Math.random() < .9) sprite(S, {img: orb, add: true, w: orb.width, h: orb.height, x: p.x, y: p.y, ax: .78, rot: ang, life: 160, alpha: .4, s: p.s * .9, update(q, u) { q.alpha = .35 * (1 - u); }}); }
        }});
      at(S, 360, () => cardAnim(S, c.source.el, [{transform: 'translate(0,0)'}, {transform: `translate(${-Math.cos(ang) * 10}px,${-Math.sin(ang) * 10}px)`, offset: .3}, {transform: 'translate(0,0)'}], 260));
      at(S, 612, () => {
        bullet.life = 0; hitstop(S, 60); shake(S, 5, 200);
        flash(S, T.x, T.y, b.w * .85, 'rgba(170,255,240,A)', 300);
        for (let i = 0; i < 3; i++) at(S, 612 + i * 85, () => sprite(S, {img: rp, add: true, w: rp.width, h: rp.height, x: T.x, y: T.y, life: 520, alpha: 0, update(p, t) { p.s = (b.w * 1.9 / rp.width) * lerp(.2, 1, ease.out(t)); p.alpha = env(t, .08, .7) * (1 - i * .2); }}));
        cardAnim(S, c.target.el, [{transform: 'translate(0,0)', filter: 'brightness(1)'}, {transform: `translate(${Math.cos(ang) * 9}px,${Math.sin(ang) * 9}px) scale(.96)`, filter: 'brightness(1.6)', offset: .3}, {transform: 'translate(-2px,0)', offset: .55}, {transform: 'translate(0,0)', filter: 'brightness(1)'}], 360);
      });
      at(S, 1000, () => dim(S, 0, 320));
      return 1350;
    },
    cone(S, c) { // 晶錐：從凜身上射出暮晶尖錐，同時打向每個敵人，命中處炸開震盪波
      sfx(c, 'fxResCharge');
      const a = S.rect(c.source.el), M = {x: a.x, y: a.top + a.h * .32}, im = R('cone'), rp = R('ripple');
      const foes = (c.targets && c.targets.length ? c.targets : [c.target.el]).map(el => ({el, r: S.rect(el)}));
      dim(S, .38, 200, {x: a.x, y: a.y, r: a.w * .9});
      for (let i = 0; i < 3; i++) at(S, i * 90, () => sprite(S, {img: rp, add: true, w: rp.width, h: rp.height, x: M.x, y: M.y, life: 300, alpha: 0, update(p, t) { p.s = (a.w * 1.4 / rp.width) * lerp(1, .2, ease.in(t)); p.alpha = env(t, .3, .25) * .7; }}));
      const len = Math.max(a.w * 1.05, 90) / im.width, fire = 300, fly = 240;
      at(S, fire, () => { sfx(c, 'fxResFire'); cardAnim(S, c.source.el, [{transform: 'translateY(0)', filter: 'brightness(1)'}, {transform: 'translateY(6px) scale(1.03)', filter: 'brightness(1.5) saturate(1.2)', offset: .3}, {transform: 'translateY(0)', filter: 'brightness(1)'}], 320); });
      foes.forEach(({el, r}, i) => {
        const T = {x: r.x, y: r.y}, ang = Math.atan2(T.y - M.y, T.x - M.x), start = fire + i * 55;
        at(S, start, () => sprite(S, {img: im, w: im.width, h: im.height, x: M.x, y: M.y, ax: .92, rot: ang, life: fly, alpha: 0,
          update(p, t) { const k = ease.in(t); p.x = lerp(M.x, T.x, k); p.y = lerp(M.y, T.y, k); p.s = len * lerp(.55, 1, k); p.alpha = clamp(t * 4); }}));
        at(S, start + fly, () => {
          if (i === 0) { sfx(c, 'fxResImpact'); hitstop(S, 40); shake(S, 4, 180); }
          flash(S, T.x, T.y, r.w * .7, 'rgba(170,255,240,A)', 260);
          for (let j = 0; j < 2; j++) at(S, start + fly + j * 90, () => sprite(S, {img: rp, add: true, w: rp.width, h: rp.height, x: T.x, y: T.y, life: 480, alpha: 0, update(p, t) { p.s = (r.w * 1.6 / rp.width) * lerp(.2, 1, ease.out(t)); p.alpha = env(t, .08, .7) * (1 - j * .25); }}));
          cardAnim(S, el, [{transform: 'translate(0,0)', filter: 'brightness(1)'}, {transform: `translate(${Math.cos(ang) * 8}px,${Math.sin(ang) * 8}px) scale(.96)`, filter: 'brightness(1.6)', offset: .3}, {transform: 'translate(0,0)', filter: 'brightness(1)'}], 320);
        });
      });
      const end = fire + (foes.length - 1) * 55 + fly;
      at(S, end + 260, () => dim(S, 0, 300));
      return end + 600;
    },
    // ---- 國王異變覺醒 (two parts, played around the boss() waits in story-battle-fx.js; the dark veil, banner and shell shake stay CSS) ----
    awakenCharge(S, c) { // 蓄力：紫色旋渦光暈 + 暮晶尖刺長出 + 光點被吸入
      const a = S.rect(c.target.el), cx = a.x, cy = a.y, big = Math.max(a.w * 2.7, 300);
      const au = R('awAura');
      [[1, 1, 0], [-1, .62, 160]].forEach(([dir, k, dl]) => at(S, dl, () => sprite(S, {img: au, add: true, boost: .5, w: au.width, h: au.height, x: cx, y: cy, life: 1100 - dl, alpha: 0,
        update(p, t) { p.s = (big * k / au.width) * lerp(.35, 1, ease.out(clamp(t * 1.6))); p.rot = dir * t * 5.2; p.alpha = env(t, .22, .08) * (.55 + .45 * t); }})));
      const sp = R('awSpike'), n = 10, rad = a.w * .3, hgt = Math.max(a.h * .62, 110);
      const F = [1.55, .72, 1.15, .42, 1.35, .58, .95, .36, 1.45, .82];
      const order = F.map((f, i) => i).sort((p, q) => F[p] - F[q]); // small ones first so the big crystals stand in front
      order.forEach(i => {
        const ang = i / n * Math.PI * 2 + (i % 2 ? .1 : 0), dl = 60 + i * 55, sc = hgt * F[i] / sp.height, rr = rad * [1.0, 2.3, 1.5, .75, 2.0, 1.15, .6, 2.6, 1.3, 1.8][i];
        at(S, dl, () => sprite(S, {img: sp, w: sp.width, h: sp.height, x: cx, y: cy, ax: .5, ay: .92, rot: ang + Math.PI / 2, life: 1080 - dl, alpha: 0,
          update(p, t) { const k = ease.back(clamp(t / .38)); p.sx = sc * lerp(.7, 1, k); p.sy = sc * k; p.x = cx + Math.cos(ang) * rr * (.55 + .45 * k); p.y = cy + Math.sin(ang) * rr * (.55 + .45 * k); p.alpha = t < .1 ? t / .1 : t > .88 ? 1 - (t - .88) / .12 * .35 : 1; }}));
      });
      for (let i = 0; i < 22; i++) {
        const im = pick('awMote', 9, i), ang = (i * 47) % 360 * Math.PI / 180, r0 = a.w * (1.1 + ((i * 53) % 130) / 130 * .9), dl = (i * 41) % 620, s0 = .55 + (i % 4) * .15;
        at(S, dl, () => sprite(S, {img: im, add: true, w: im.width, h: im.height, x: 0, y: 0, life: 470, alpha: 0,
          update(p, t) { const k = ease.in(t), r = r0 * (1 - k), q = ang + k * 1.4; p.x = cx + Math.cos(q) * r; p.y = cy + Math.sin(q) * r * .8; p.s = s0 * lerp(1, .45, k); p.alpha = env(t, .25, .12); }}));
      }
      return 1120;
    },
    awakenBurst(S, c) { // 爆發：閃光 + 三層衝擊波環 + 晶體碎片向外炸飛
      const a = S.rect(c.target.el), cx = a.x, cy = a.y, big = Math.max(a.w * 5, 460);
      hitstop(S, 50);
      const fl = R('awFlash');
      sprite(S, {img: fl, add: true, boost: .7, w: fl.width, h: fl.height, x: cx, y: cy, life: 620, alpha: 0,
        update(p, t) { const k = ease.out(clamp(t / .3)); p.s = (big / fl.width) * lerp(.3, 1.15, k); p.rot = t * .25; p.alpha = t < .06 ? t / .06 : Math.pow(1 - clamp((t - .06) / .94), 1.6); }});
      flash(S, cx, cy, a.w * 1.6, 'rgba(240,226,255,A)', 380);
      const rg = R('awRing');
      for (let i = 0; i < 3; i++) at(S, 40 + i * 120, () => sprite(S, {img: rg, add: true, boost: .4, w: rg.width, h: rg.height, x: cx, y: cy, life: 760 - i * 60, alpha: 0,
        update(p, t) { p.s = (a.w * [4.6, 3.3, 2.2][i] / rg.width) * lerp(.12, 1, ease.out(t)); p.rot = i * 1.3 + t * .6; p.alpha = env(t, .06, .72) * (1 - i * .18); }}));
      for (let i = 0; i < 20; i++) {
        const im = pick('awShard', 6, i), ang = i / 20 * Math.PI * 2 + (i % 2 ? .12 : 0), dist = a.w * (1.0 + ((i * 37) % 150) / 150 * 1.9), s0 = (a.h * [.12,.5,.2,.36,.16,.62,.26,.42,.14,.3][i % 10]) / im.height, spin = (i % 2 ? 1 : -1) * (3 + (i % 5));
        sprite(S, {img: im, w: im.width, h: im.height, x: cx, y: cy, life: 820 + (i % 4) * 90, alpha: 1, s: s0, rot: ang,
          update(p, t) { const k = ease.out(t); p.x = cx + Math.cos(ang) * dist * k; p.y = cy + Math.sin(ang) * dist * k + 90 * t * t; p.rot = ang + spin * t; p.alpha = t > .55 ? (1 - t) / .45 : 1; }});
      }
      return 1000;
    },
    resonanceTick(S, c) { // 之後共振發作
      sfx(c, 'fxResTick');
      const b = S.rect(c.target.el), rp = R('ripple');
      for (let i = 0; i < 2; i++) at(S, i * 160, () => sprite(S, {img: rp, add: true, w: rp.width, h: rp.height, x: b.x, y: b.y, life: 520, alpha: 0, update(p, t) { p.s = (b.w * 1.5 / rp.width) * lerp(.3, 1, ease.out(t)); p.alpha = env(t, .1, .7) * .7; }}));
      return 700;
    }
  };

  async function play(kind, ctx) {
    if (!SKILLS[kind] || ctx.reduced) return false;
    const S = Stage(ctx), total = SKILLS[kind](S, ctx);
    const ok = await run(S, total, ctx);
    S.anims.forEach(a => a.cancel());
    return ok;
  }
  window.NDSkillFX = {load, play, timeScale: 1, kinds: Object.keys(SKILLS), ready: false};
  // In the game the sprites load from assets/story/fx-060 as soon as this file runs; the preview page loads its own copies.
  if (!window.ND_SKILL_FX_NO_AUTOLOAD && document.currentScript) {
    const base = 'assets/story/fx-060';
    load(base).then(() => { window.NDSkillFX.ready = true; }).catch(e => console.warn('skill fx sprites not loaded; using the simple fallback', e));
  }
})();
