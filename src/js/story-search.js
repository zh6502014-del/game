/* Session-local searching: the campaign owns collected progress and story text. */
(() => {
  'use strict';
  let active = null;
  let serial = 0;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function button(text, attribute, value = '') {
    const node = element('button', '', text);
    node.type = 'button';
    node.setAttribute(attribute, value);
    return node;
  }

  function open(sceneId, options = {}) {
    const registry = window.NDStorySearchAssets;
    const scene = registry?.scenes[sceneId];
    if (active || !scene || !Array.isArray(options.targetIds)) return null;
    const placements = new Map(scene.placements.map(item => [item.id, item]));
    const targets = [...new Set(options.targetIds)];
    if (!targets.length || targets.some(id => !placements.has(id) || placements.get(id).decorative)) return null;
    const targetSet = new Set(targets);
    const covers = scene.covers || [];
    const isArchive = sceneId === 'archive-vault';
    const opened = new Set();
    const found = new Set([...(options.foundIds || [])].filter(id => placements.has(id) && !placements.get(id).decorative));
    const content = new Map((Array.isArray(options.items) ? options.items : []).map(item => [item.id, item]));
    const trigger = options.trigger || document.activeElement;
    const dialog = element('dialog', 'story-search-dialog sq-dialog');
    dialog.dataset.sq = 'search';
    dialog.id = 'story-search-dialog';
    const titleId = `story-search-title-${++serial}`;
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.dataset.scene = sceneId;
    dialog.dataset.state = 'loading';
    const mobileQuery = window.matchMedia('(max-width:760px)');
    const read = new Set();
    let current = null, lastDoc = null;
    let closed = false, completed = false, selected = null, view = 'all', hint = null, loadToken = 0;
    let cancelLoad = () => {};
    const loaded = new Map();
    let coverMotion = [];
    function stopCoverMotion() { coverMotion.forEach(motion => motion.cancel()); coverMotion = []; }
    const itemText = id => ({ label: content.get(id)?.label || placements.get(id)?.label || registry.props[placements.get(id)?.prop]?.label || id, text: content.get(id)?.text || '' });

    const head = element('header', 'search-head');
    const heading = element('div');
    const eyebrow = element('p', 'search-eyebrow sq-eyebrow');
    eyebrow.innerHTML = '<b class="sq-badge">支線</b>';
    eyebrow.append(element('span', '', isArchive ? '尋物 · 檔案調閱' : '尋物 · 不限時、不扣分'));
    heading.append(eyebrow);
    const title = element('h2', '', scene.title);
    title.id = titleId;
    heading.append(title);
    const close = button('關閉', 'data-search-close');
    close.setAttribute('aria-label', '關閉尋物');
    head.append(heading, close);
    const help = element('p', 'search-help', scene.helpText || '翻開文件夾或移開遮擋，露出物品後查看、收取。提示免費；Tab / Enter 操作，Esc 關閉。');
    const body = element('div', 'search-layout');
    const main = element('div', 'search-main');
    const toolbar = element('nav', 'search-views');
    toolbar.setAttribute('aria-label', '場景查看區域');
    for (const [value, label] of [['all', '返回全景'], ['left', '放大左側'], ['right', '放大右側']]) {
      const control = button(label, 'data-search-zoom', value);
      control.setAttribute('aria-pressed', String(value === view));
      toolbar.append(control);
    }
    // The zoom controls are not used: scenes always show the whole workbench.
    toolbar.hidden = true;
    const fallbackFocus = () => close;
    const viewport = element('div', 'search-viewport');
    viewport.dataset.view = view;
    const canvas = element('div', 'search-canvas');
    canvas.setAttribute('aria-label', scene.background.title);
    const background = element('img', 'search-background');
    background.alt = '';
    background.draggable = false;
    const world = element('div', 'search-props');
    const region = element('div', 'search-region');
    region.hidden = true;
    region.setAttribute('aria-hidden', 'true');
    canvas.append(background, region, world);
    const loading = element('div', 'search-loading');
    const loadText = element('p', '', '正在展開場景…');
    loadText.setAttribute('role', 'status');
    const retry = button('重試載入', 'data-search-retry');
    retry.hidden = true;
    loading.append(loadText, retry);
    viewport.append(canvas, loading);
    const status = element('p', 'search-status', '正在準備尋物場景。');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const detail = element('section', 'search-detail');
    detail.setAttribute('aria-label', '物品詳情');
    const archiveIndex = isArchive ? element('nav', 'search-archive-index') : null;
    if (archiveIndex) archiveIndex.setAttribute('aria-label', '卷宗件號索引');
    main.append(toolbar, viewport);
    if (archiveIndex) main.append(archiveIndex);
    main.append(status);
    const side = element('aside', 'search-side');
    const checklist = element('section', 'search-checklist');
    checklist.setAttribute('aria-label', '本次目標清單');
    const tray = element('section', 'search-found');
    tray.setAttribute('aria-label', '已收取物品');
    side.append(checklist, tray);
    if (isArchive) {
      side.append(detail);
      body.append(main, side);
    } else body.append(main, side, detail);
    const footer = element('footer', 'search-footer');
    const progress = element('p', 'search-progress');
    const advance = button('繼續劇情', 'data-search-continue');
    advance.disabled = true;
    footer.append(progress, advance);
    dialog.append(head, help, body, footer);

    function live() { return !closed && active === dialog && dialog.open; }
    function ready() { return live() && dialog.dataset.state === 'ready'; }
    function imageFor(prop) {
      const image = loaded.get(registry.props[prop].path)?.cloneNode() || element('img');
      image.alt = '';
      image.draggable = false;
      return image;
    }
    function blockedBy(id) { return covers.filter(cover => cover.targets.includes(id) && !opened.has(cover.id)); }
    function canInspect(id) { return found.has(id) || (targetSet.has(id) && blockedBy(id).length === 0); }
    function paperMotif(kind) {
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 80 80');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('search-paper-motif');
      const paths = {
        seal: ['M40 14 57 24 57 46 40 57 23 46 23 24Z', 'M30 34 38 43 51 27', 'M22 64H58'],
        diagram: ['M18 24H60V44H18Z M30 24V44 M49 24V44', 'M23 53H55 M39 44V64 M17 62H27 M51 62H61'],
        chart: ['M18 18V61H65', 'M22 51 32 39 40 48 51 26 62 33', 'M23 24H40 M23 30H31'],
        writing: ['M17 25H58 M17 35H53 M17 45H59 M17 55H36', 'M46 60 51 54 55 60 64 50']
      };
      for (const d of paths[kind] || paths.writing) {
        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d', d); svg.append(path);
      }
      return svg;
    }
    function sprite(placement) {
      const art = element('span', 'search-prop-art');
      art.dataset.prop = placement.prop;
      art.dataset.stack = String(placement.stack || 1);
      art.append(imageFor(placement.prop));
      if (placement.motif) {
        art.dataset.motif = placement.motif;
        const tab = element('span', 'search-paper-tab');
        tab.setAttribute('aria-hidden', 'true');
        art.append(tab, paperMotif(placement.motif));
      }
      return art;
    }
    function inView(placement) { return !!placement && (view === 'all' || (view === 'left' ? placement.x < 50 : placement.x >= 50)); }
    function clutterNode(item) {
      const node = element('span', 'search-clutter');
      node.dataset.layer = item.layer === 'over' ? 'over' : 'under';
      node.style.cssText = `left:${item.x}%;top:${item.y}%;width:${item.w}%;height:${item.h}%;--prop-rotate:${item.rotate || 0}deg`;
      node.dataset.hidden = String(!!item.hideUntil && !opened.has(item.hideUntil));
      node.setAttribute('aria-hidden', 'true');
      node.innerHTML = registry.clutter?.[item.art] || '';
      return node;
    }
    function paintArchiveIndex() {
      if (!archiveIndex) return;
      archiveIndex.replaceChildren();
      for (const cover of covers) {
        const isCurrent = current === cover.id;
        const control = button(cover.tag, 'data-search-reveal', cover.id);
        control.setAttribute('aria-label', `${read.has(cover.id) ? '已閱，' : ''}${cover.action || '移開'}${cover.label}`);
        control.setAttribute('aria-pressed', String(isCurrent));
        if (isCurrent) control.setAttribute('aria-current', 'true');
        control.dataset.read = String(read.has(cover.id));
        control.disabled = !ready();
        if (read.has(cover.id)) control.append(element('span', 'search-index-check', '已閱'));
        archiveIndex.append(control);
      }
    }
    function paintWorld() {
      stopCoverMotion();
      world.replaceChildren();
      for (const item of (scene.clutter || [])) if (item.layer !== 'over') world.append(clutterNode(item));
      for (const placement of scene.placements) {
        if (found.has(placement.id) || isArchive) continue;
        const covered = blockedBy(placement.id).length > 0;
        const available = !placement.decorative && targetSet.has(placement.id) && !covered;
        const node = element('span', 'search-prop' + (available ? '' : ' search-decoration'));
        node.classList.toggle('is-selected', selected === placement.id);
        node.style.cssText = `left:${placement.x}%;top:${placement.y}%;width:${placement.w}%;height:${placement.h}%;--prop-rotate:${placement.rotate || 0}deg`;
        node.dataset.prop = placement.prop;
        node.dataset.id = placement.id;
        node.dataset.covered = String(covered);
        node.append(sprite(placement));
        if (available) {
          const hotspot = button('', 'data-search-item', placement.id);
          hotspot.className = 'search-hotspot';
          hotspot.setAttribute('aria-label', `查看${itemText(placement.id).label}`);
          hotspot.disabled = !ready() || !inView(placement);
          // Keep a complete touch target inside a zoomed half, even at its seam.
          if (view !== 'all' && inView(placement) && canvas.clientWidth) {
            const hitWidth = Math.max(placement.w, 4400 / canvas.clientWidth);
            const start = view === 'left' ? 0 : 50;
            const centre = Math.max(start + hitWidth / 2, Math.min(start + 50 - hitWidth / 2, placement.x));
            hotspot.style.marginLeft = `${(centre - placement.x) / placement.w * 100}%`;
          }
          hotspot.setAttribute('aria-pressed', String(selected === placement.id));
          node.append(hotspot);
        } else node.setAttribute('aria-hidden', 'true');
        world.append(node);
      }
      for (const cover of covers) {
        const revealed = isArchive ? current === cover.id : opened.has(cover.id);
        const pose = revealed ? { ...cover, ...cover.open } : cover;
        const node = element('span', 'search-cover');
        node.dataset.open = String(revealed);
        if (isArchive) { node.dataset.current = String(revealed); node.dataset.read = String(read.has(cover.id)); }
        node.dataset.cover = cover.id;
        node.style.cssText = `left:${pose.x}%;top:${pose.y}%;width:${pose.w}%;height:${pose.h}%;--prop-rotate:${pose.rotate || 0}deg;--prop-skew-y:${pose.skewY || 0}deg`;
        node.append(sprite(cover));
        node.dataset.prop = cover.prop;
        if (cover.tag) (isArchive ? node.firstElementChild : node).append(element('span', 'search-cover-tag', cover.tag));
        if (isArchive && read.has(cover.id)) node.firstElementChild.append(element('span', 'search-cover-read', '已閱'));
        const control = button('', 'data-search-reveal', cover.id);
        control.className = 'search-hotspot search-cover-control';
        control.setAttribute('aria-label', `${isArchive && read.has(cover.id) ? '已閱，' : revealed && !isArchive ? '已' : ''}${cover.action || '移開'}${cover.label}`);
        if (isArchive) { control.setAttribute('aria-pressed', String(revealed)); if (revealed) control.setAttribute('aria-current', 'true'); }
        else control.setAttribute('aria-expanded', String(revealed));
        control.disabled = (!isArchive && revealed) || !ready() || !inView(cover);
        node.append(control);
        world.append(node);
      }
      for (const item of (scene.clutter || [])) if (item.layer === 'over') world.append(clutterNode(item));
      paintArchiveIndex();
    }
    function paintLists() {
      checklist.replaceChildren();
      if (isArchive) {
        const index = element('div', 'search-archive-ticket');
        const caption = element('span', '', '來信線索');
        const clue = element('strong', '', scene.clueText);
        index.append(caption, clue);
        checklist.append(index);
      }
      const list = element('ul');
      for (const id of targets) {
        const row = element('li');
        const thumb = isArchive ? null : element('span', 'search-thumb');
        if (thumb) thumb.append(sprite(placements.get(id)));
        const text = element('span', 'search-target-label', itemText(id).label);
        if (found.has(id)) {
          const review = button(isArchive ? '重讀' : '✓ 查看', 'data-search-found', id);
          review.disabled = !ready();
          if (!isArchive) row.append(thumb);
          row.append(text, review);
        } else {
          const hintButton = button('提示', 'data-search-hint', id);
          hintButton.setAttribute('aria-label', `${itemText(id).label}的區域提示`);
          hintButton.disabled = !ready();
          if (!isArchive) row.append(thumb);
          row.append(text, hintButton);
        }
        list.append(row);
      }
      checklist.append(list);
      tray.replaceChildren();
      tray.hidden = isArchive || found.size === 0;
      if (!isArchive) {
        tray.append(element('span', 'search-tray-label', `收取匣 ${found.size}`));
        const foundList = element('div', 'search-found-list');
        for (const placement of scene.placements) {
          if (!found.has(placement.id)) continue;
          const review = button(itemText(placement.id).label, 'data-search-found', placement.id);
          review.disabled = !ready();
          foundList.append(review);
        }
        tray.append(foundList.children.length ? foundList : element('p', '', '收取後可在這裡重讀內容。'));
      }
      const count = targets.filter(id => found.has(id)).length;
      progress.textContent = `已收取 ${count} / ${targets.length} · ${count === targets.length ? '全部找到，準備好後繼續。' : '找到場景中的物品後，按「收取」。'}`;
      if (isArchive) progress.textContent = count === targets.length ? `已收取 ${count} / ${targets.length} · 線索已存入收取匣` : `已收取 ${count} / ${targets.length} · 不限時，不扣分`;
      advance.disabled = !ready() || count !== targets.length;
    }
    function docTarget() { const cover = covers.find(item => item.id === current); return cover?.targets.find(id => targetSet.has(id)) || null; }
    function paintArchiveDetail() {
      const reading = !!current && mobileQuery.matches;
      detail.hidden = false;
      main.inert = reading; checklist.inert = reading; footer.inert = reading; head.inert = reading; help.inert = reading;
      side.inert = false;
      dialog.classList.toggle('has-detail', !!current);
      dialog.dataset.reading = String(reading);
      if (!current) {
        const done = targets.every(id => found.has(id));
        detail.append(element('p', 'search-reader-kicker', '檔案櫃'));
        detail.append(element('h3', '', done ? '線索已歸檔' : '查找物資去向'));
        detail.append(element('p', 'search-reader-empty', done ? '可重讀已收取的紀錄，或繼續劇情。' : '翻閱卷宗，留意研究物資的運送項目與收貨地點。'));
        detail.append(element('p', 'search-reader-keys', 'Tab / Enter 操作 · Esc 關閉'));
        return;
      }
      const cover = covers.find(item => item.id === current);
      const doc = scene.docs?.[current] || {};
      const title = doc.title || cover.label;
      const target = docTarget();
      const top = element('div', 'search-reader-top');
      const heading = element('div', 'search-reader-heading');
      heading.append(element('span', '', `件號 ${cover.tag}`), element('strong', '', title));
      const backTop = button('返回翻找', 'data-search-detail-close');
      backTop.classList.add('search-reader-back-top');
      top.append(backTop, heading);
      detail.append(top, element('p', 'search-reader-kicker', '檔案櫃'));
      const sheet = element('article', 'search-archive-sheet');
      sheet.tabIndex = 0;
      sheet.setAttribute('aria-label', `件號 ${cover.tag} ${title}`);
      sheet.append(element('p', 'search-record-number', `件號 ${cover.tag} · ${title}`));
      const body = element('div', 'search-doc-body');
      const sections = (doc.sections || []).map(part => part.useItem ? { ...part, text: [content.get(part.useItem)?.text || ''].filter(Boolean) } : part);
      for (const part of sections) {
        const block = element('section', 'search-doc-part');
        block.dataset.kind = part.kind || 'official';
        if (part.label) block.append(element('h4', '', part.label));
        for (const line of part.text || []) block.append(element('p', '', line));
        body.append(block);
      }
      sheet.append(body);
      detail.append(sheet);
      const actions = element('div', 'search-reader-actions');
      if (target) {
        if (found.has(target)) {
          actions.append(element('p', 'search-collected', '已收取'));
          const go = button('繼續劇情', 'data-search-continue');
          go.classList.add('search-reader-continue');
          go.disabled = !ready() || !targets.every(id => found.has(id));
          actions.append(go);
        } else {
          const collect = button(`收取${itemText(target).label}`, 'data-search-collect');
          collect.disabled = !ready() || !canInspect(target);
          actions.append(collect);
        }
      }
      const backBottom = button('返回翻找', 'data-search-detail-close');
      backBottom.classList.add('search-reader-back-bottom');
      actions.append(backBottom);
      detail.append(actions);
    }
    function paintDetail(focus = false) {
      detail.replaceChildren();
      if (isArchive) { paintArchiveDetail(); return; }
      detail.hidden = !selected;
      main.inert = !!selected;
      side.inert = !!selected;
      dialog.classList.toggle('has-detail', !!selected);
      if (!selected) return;
      const back = button('返回場景', 'data-search-detail-close');
      detail.append(back);
      const placement = placements.get(selected), text = itemText(selected);
      const art = element('div', 'search-detail-art');
      art.append(sprite(placement));
      detail.append(element('h3', '', text.label), art, element('p', 'search-detail-text', text.text));
      if (found.has(selected)) detail.append(element('p', 'search-collected', '✓ 已收取'));
      else {
        const collect = button('收取', 'data-search-collect');
        collect.disabled = !ready() || !canInspect(selected);
        detail.append(collect);
        if (focus) collect.focus({ preventScroll: true });
      }
    }
    function paint() { paintWorld(); paintLists(); paintDetail(); }
    function setView(value) {
      if (!['all', 'left', 'right'].includes(value)) return;
      view = value;
      viewport.dataset.view = value;
      toolbar.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control.dataset.searchZoom === value)));
      paintWorld();
    }
    function showDetail(id) {
      if (isArchive) { const owner = covers.find(item => item.targets.includes(id)); if (owner) openDoc(owner.id); return; }
      if (!ready() || !placements.has(id) || !canInspect(id)) return;
      selected = id;
      hint = null;
      region.hidden = true;
      paintWorld();
      paintDetail(!found.has(id));
      if (found.has(id)) detail.querySelector('button').focus({ preventScroll: !isArchive });
      status.textContent = `正在查看「${itemText(id).label}」。${found.has(id) ? '這件物品已收取。' : '查看內容後可按收取。'}`;
    }
    function collectSelected() {
      if (!ready() || !selected || !targetSet.has(selected) || found.has(selected) || !canInspect(selected)) return;
      const id = selected;
      // Disable immediately before notifying the owner so queued clicks cannot collect twice.
      found.add(id);
      selected = null;
      paint();
      status.textContent = `已收取「${itemText(id).label}」。`;
      try { options.onCollect?.(id); }
      catch (error) {
        found.delete(id);
        selected = id;
        if (live()) {
          paint();
          status.textContent = '收取未完成，請再試一次。';
        }
        console.error('Story search collection callback failed.', error);
        return;
      }
      if (!live()) return;
      if (!advance.disabled) advance.focus({ preventScroll: true });
      else (world.querySelector('button:not(:disabled)') || fallbackFocus()).focus({ preventScroll: true });
    }
    // Hidden-object scenes collect on the first tap; the item text stays readable from the collected tray.
    function quickCollect(id) {
      if (!ready() || !targetSet.has(id) || found.has(id) || !canInspect(id)) return;
      selected = id;
      collectSelected();
      if (found.has(id)) status.textContent = `找到了「${itemText(id).label}」。${itemText(id).text}`;
    }
    function missAt(event) {
      if (!ready() || !scene.quickCollect || event.target.closest('button')) return;
      const box = canvas.getBoundingClientRect();
      if (!box.width) return;
      const ripple = element('span', 'search-miss');
      ripple.style.left = `${(event.clientX - box.left) / box.width * 100}%`;
      ripple.style.top = `${(event.clientY - box.top) / box.height * 100}%`;
      canvas.append(ripple);
      setTimeout(() => ripple.remove(), 600);
      status.textContent = '那只是工作臺上的雜物。再找找看，需要時可按清單旁的提示。';
    }
    canvas.addEventListener('click', missAt);
    function load() {
      cancelLoad();
      const token = ++loadToken;
      dialog.dataset.state = 'loading';
      loading.hidden = false;
      canvas.hidden = true;
      retry.hidden = true;
      loadText.textContent = '正在展開場景…';
      status.textContent = '場景載入完成後即可開始尋找。';
      paintLists();
      const paths = [...new Set([scene.background.path, ...covers.map(cover => registry.props[cover.prop].path), ...scene.placements.filter(p => !found.has(p.id)).map(p => registry.props[p.prop].path), ...[...found].map(id => registry.props[placements.get(id).prop].path)])];
      const cleanups = new Set();
      cancelLoad = () => { for (const cleanup of [...cleanups]) cleanup(); cleanups.clear(); };
      const decode = path => {
        if (loaded.has(path)) return Promise.resolve();
        return new Promise((resolve, reject) => {
          const image = new Image();
          let settled = false;
          const finish = (error, cancelled = false) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            image.onload = image.onerror = null;
            cleanups.delete(cancel);
            if (error || cancelled) image.removeAttribute('src');
            if (error) reject(error);
            else {
              if (!cancelled && token === loadToken && !closed) loaded.set(path, image);
              resolve();
            }
          };
          const cancel = () => finish(null, true);
          cleanups.add(cancel);
          const timer = setTimeout(() => finish(new Error('Image loading timed out')), 15000);
          image.onload = () => {
            if (!image.naturalWidth) { finish(new Error('Empty image')); return; }
            if (typeof image.decode === 'function') image.decode().then(() => finish(), error => finish(error));
            else finish();
          };
          image.onerror = () => finish(new Error('Image failed to load'));
          image.src = path;
        });
      };
      Promise.all(paths.map(decode)).then(() => {
        if (!live() || token !== loadToken) return;
        dialog.dataset.state = 'ready';
        background.src = scene.background.path;
        canvas.hidden = false;
        loading.hidden = true;
        paint();
        status.textContent = isArchive ? '點選卷宗標籤，抽出檔案。' : '先翻找場景，再查看露出的物品。需要時可點清單旁的提示。';
      }).catch(() => {
        if (!live() || token !== loadToken) return;
        cancelLoad();
        dialog.dataset.state = 'error';
        loadText.textContent = '場景或物品圖片未能載入，請重試。';
        status.textContent = '尚未收取任何新物品。';
        retry.hidden = false;
        paintLists();
      });
    }
    function focusDoc(id) {
      if (mobileQuery.matches && current) { detail.querySelector('.search-reader-back-top')?.focus({ preventScroll: true }); return; }
      const control = [...dialog.querySelectorAll(`[data-search-reveal="${id}"]`)].find(node => !node.disabled && node.getClientRects().length);
      (control || fallbackFocus()).focus({ preventScroll: true });
    }
    function returnToScene(id = selected) {
      if (isArchive) {
        const back = lastDoc;
        current = null; selected = null;
        paintWorld(); paintLists(); paintDetail();
        status.textContent = '已返回翻找。已閱的卷宗仍可重讀。';
        focusDoc(back);
        return;
      }
      selected = null;
      paintWorld(); paintDetail();
      if (isArchive) status.textContent = found.has(id) ? '紀錄已收取，可重讀或繼續劇情。' : '紀錄已露出，點選文件即可重新查閱。';
      const control = [...world.querySelectorAll('[data-search-item]')].find(node => node.dataset.searchItem === id);
      const review = isArchive ? checklist.querySelector('[data-search-found]') : null;
      (control && !control.disabled ? control : review || fallbackFocus()).focus({ preventScroll: !isArchive });
    }
    function openDoc(id) {
      const cover = covers.find(item => item.id === id);
      if (!ready() || !cover || current === id) { if (current === id) focusDoc(id); return; }
      const previous = covers.find(item => item.id === current);
      current = id; lastDoc = id; opened.add(id); read.add(id);
      selected = null; hint = null; region.hidden = true;
      paintWorld(); paintLists(); paintDetail();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const box = pose => ({ left: `${pose.x}%`, top: `${pose.y}%`, width: `${pose.w}%`, height: `${pose.h}%` });
        const timing = { duration: 240, easing: 'cubic-bezier(.2,.7,.3,1)' };
        const slide = (item, from, to) => {
          const node = [...world.querySelectorAll('.search-cover')].find(entry => entry.dataset.cover === item.id);
          if (node?.animate) coverMotion.push(node.animate([box(from), box(to)], timing));
        };
        slide(cover, cover, { ...cover, ...cover.open });
        if (previous) slide(previous, { ...previous, ...previous.open }, previous);
      }
      const doc = scene.docs?.[id];
      status.textContent = `正在閱讀件號 ${cover.tag}${doc?.title ? ' · ' + doc.title : ''}。`;
      focusDoc(id);
    }
    function reveal(id) {
      const cover = covers.find(item => item.id === id);
      if (!ready() || !cover || opened.has(id) || !inView(cover)) return;
      opened.add(id);
      hint = null; region.hidden = true;
      paintWorld();
      // Feedback belongs to this reveal only; later renders start at the final pose.
      const node = [...world.querySelectorAll('.search-cover')].find(item => item.dataset.cover === id);
      if (node?.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const end = { ...cover, ...cover.open };
        const box = pose => ({ left: `${pose.x}%`, top: `${pose.y}%`, width: `${pose.w}%`, height: `${pose.h}%` });
        const timing = { duration: 240, easing: 'cubic-bezier(.2,.7,.3,1)' };
        coverMotion.push(node.animate([box(cover), box(end)], timing));
        coverMotion.push(node.firstElementChild.animate([
          { transform: `rotate(${cover.rotate || 0}deg) skewY(${cover.skewY || 0}deg)` },
          { transform: `translateY(-7px) rotate(${((cover.rotate || 0) + (end.rotate || 0)) / 2}deg) skewY(${((cover.skewY || 0) + (end.skewY || 0)) / 2}deg) scaleY(.94)` },
          { transform: `rotate(${end.rotate || 0}deg) skewY(${end.skewY || 0}deg)` }
        ], timing));
      }
      status.textContent = `已${cover.action || '移開'}${cover.label}。${cover.note || '看看下面有什麼。'}`;
      const revealed = cover.targets.find(target => targetSet.has(target) && !found.has(target) && !blockedBy(target).length && inView(placements.get(target)));
      const target = [...world.querySelectorAll('[data-search-item]')].find(node => node.dataset.searchItem === revealed);
      const nextArchiveControl = isArchive ? [...dialog.querySelectorAll('[data-search-reveal]:not(:disabled)')].find(control => control.getClientRects().length) : null;
      (target || nextArchiveControl || fallbackFocus()).focus({ preventScroll: true });
    }
    function finish(complete = false) {
      if (closed) return;
      closed = true;
      mobileQuery.removeEventListener?.('change', onViewport);
      completed = complete;
      loadToken++;
      cancelLoad();
      stopCoverMotion();
      loaded.clear();
      if (dialog.open) dialog.close(complete ? 'complete' : 'cancel');
      dialog.remove();
      if (active === dialog) active = null;
      if (trigger?.isConnected && typeof trigger.focus === 'function') trigger.focus({ preventScroll: true });
      if (completed) options.onComplete?.();
      else options.onCancel?.();
    }
    dialog.addEventListener('click', event => {
      const control = event.target.closest('button');
      if (!live() || !control || !dialog.contains(control) || control.disabled || event.detail > 1) return;
      if (control.hasAttribute('data-search-close')) { finish(); return; }
      if (control.hasAttribute('data-search-retry')) { if (dialog.dataset.state === 'error') load(); return; }
      if (control.hasAttribute('data-search-zoom')) { if (ready()) setView(control.dataset.searchZoom); return; }
      if (!ready()) return;
      if (control.hasAttribute('data-search-detail-close')) { returnToScene(); return; }
      if (control.hasAttribute('data-search-reveal')) { if (isArchive) openDoc(control.dataset.searchReveal); else reveal(control.dataset.searchReveal); return; }
      if (control.hasAttribute('data-search-item')) {
        if (scene.quickCollect && inView(placements.get(control.dataset.searchItem))) quickCollect(control.dataset.searchItem);
        else if (inView(placements.get(control.dataset.searchItem))) showDetail(control.dataset.searchItem);
      } else if (control.hasAttribute('data-search-found')) {
        if (found.has(control.dataset.searchFound)) showDetail(control.dataset.searchFound);
      } else if (control.hasAttribute('data-search-collect')) {
        if (isArchive) { const target = docTarget(); if (!target) return; selected = target; }
        collectSelected();
      }
      else if (control.hasAttribute('data-search-hint')) {
        const id = control.dataset.searchHint;
        if (!targetSet.has(id) || found.has(id)) return;
        const cover = blockedBy(id)[0];
        if (scene.noRegionHint && placements.get(id).hintText) { status.textContent = placements.get(id).hintText; return; }
        hint = (cover || placements.get(id)).x < 50 ? 'left' : 'right';
        region.dataset.region = hint;
        region.hidden = false;
        if (view !== 'all') setView(hint);
        status.textContent = cover ? `先${cover.action || '移開'}${cover.label}。它在場景${hint === 'left' ? '左' : '右'}側。` : `「${itemText(id).label}」已露出，在場景${hint === 'left' ? '左' : '右'}側。可放大仔細查看。`;
      } else if (control.hasAttribute('data-search-continue') && targets.every(id => found.has(id))) finish(true);
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); if (isArchive && current && mobileQuery.matches) returnToScene(); else finish(); });
    const onViewport = () => { if (live() && isArchive) paintDetail(); };
    mobileQuery.addEventListener?.('change', onViewport);
    dialog.addEventListener('close', () => { if (!closed) finish(); }, { once: true });
    active = dialog;
    document.body.append(dialog);
    dialog.showModal();
    paint();
    load();
    close.focus({ preventScroll: true });
    return dialog;
  }
  window.NDStorySearch = { open };
})();
