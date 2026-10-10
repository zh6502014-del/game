/* Archive wall (C4): 8x8 filing-cabinet wall. Cooperative search; every 8 newly opened drawers a patrol fight.
   The module owns only the wall UI; the campaign owns battles and story state (see openArchiveWall in story-campaign.js). */
(() => {
  'use strict';
  const ROWS = 8, COLS = 8, PER_PATROL = 8, KEY = [7, 6];
  const COPY = [[["薪餉簽收冊","本季簽收完畢。"],["請假紀錄","多是病假。"],["值夜名冊","輪值每週調換。"],["新兵登記","本季五人，兩人已調走。"],["空抽屜","只有一層灰。","e"],["人事調動單","舊的人事調動單。"],["制服領用簿","外套尺寸欄多半填「大」。"],["退役申請","三份，均已批准。"]],[["文書科考績","全部是「尚可」。"],["宿舍分配表","東棟已滿。"],["懲戒紀錄","遲到與遺失鑰匙。"],["空抽屜","一把生鏽的鑰匙。","e"],["交接簿","交接人與接收人字跡相同。"],["進修申請","獲准的只有一份。"],["出勤簽到","深夜欄位常是空白。"],["通知存檔","「請勿私自調閱封存卷宗。」"]],[["補給帳冊附件","補給帳冊的附件。"],["燈油領用單","每月一桶。"],["糧食配給表","按人頭，不按需要。"],["修繕申請","屋頂漏水，已退回兩次。"],["空抽屜","一枚生鏽的迴紋針。","e"],["炭火申請","冬季加倍。"],["文具請購單","墨水永遠不夠。"],["鐘樓清掃簿","由雜役簽名。"]],[["巡防輪值表","巡防輪值表。"],["稅收明細","南區拖欠。"],["市集許可","麵包師傅的續期申請。"],["儀式排班表","祭司就位時間，一律早於暮鐘啟動。"],["路橋維修紀錄","第二座石橋的欄杆已鬆動。"],["空抽屜","抽屜是歪的，什麼也沒有。","e"],["水井檢查","三口井水質良好。"],["失物招領","一隻手套。"]],[["城門出入簿","黃昏後僅限公務。"],["馬匹登記","兩匹退役。"],["鐵匠鋪訂單","箭頭三百。"],["夜域預警紀錄","本月兩次，均已退去。"],["空抽屜","只有一把梳子。","e"],["公告底稿","寫著「請勿恐慌」，沒有發布。"],["倉庫盤點","數量與帳冊相符。"],["郵遞簿","寄往城外的信件須經檢查。"]],[["研究所採購單","玻璃器皿與燈油。"],["設備借用簿","實驗台兩張，已歸還。"],["轉運申請副本","轉運申請的副本。"],["訪客登記","這一季只有三位訪客。"],["物資領取單","內容空白，背面批註「只准核對箱號，卻要我簽『內容無誤』。這一欄究竟該怎麼填？」"],["研究經費核銷","金額與申請相符。"],["空抽屜","一個乾掉的墨水瓶。","e"],["實驗室保養簿","暮晶燈更換三盞。"]],[["迪普霍姆礦工薪餉冊","按月發放。"],["礦車維修紀錄","車輪第四次更換。"],["通行證核發","本月新增兩份。"],["民用運送紀錄","只有糧食與工具。"],["鼠患處理單","捕獲數十隻，其中幾隻的爪子已經晶化。"],["蘭維爾撤離令副本","簽發日與送達日相差一天。"],["空抽屜","一排釘子，沒有東西。","e"],["坑道通風檢查","合格。"]],[["封存清冊","只有目錄，沒有內文。"],["待銷毀卷宗","已蓋章，尚未焚毀。"],["過期未領","三年以上。"],["遺失補發申請","同一個人，第四份。"],["舊卷","封條褪色的舊卷。"],["莫爾威爾戶籍冊","整冊蓋著「已註銷」，日期相同。"],["運送紀錄","物資來源研究所；運送項目測試品、暮晶、實驗物資；收貨地點迪普霍姆礦坑。附王室命令：派士兵團看守迪普霍姆的礦坑。","k"],["空抽屜","只有一層灰。","e"]]];
  const ART = {
    plate: 'assets/story/backgrounds/locations/archive-wall-plate.webp',
    pulled: 'assets/story/props/archive-wall/archive-drawer-pulled.webp',
    closed: ['a', 'b', 'c'].map(k => `assets/story/props/archive-wall/archive-drawer-closed-${k}.webp`),
    prebattle: 'assets/story/illustrations/chapters/archive-patrol-prebattle.webp'
  };
  // Inner recessed panel of the plate, in % of the 1536x864 plate.
  const GRID = { x: 26.9, y: 6.4, w: 46.2, h: 76.2 };
  const HINT = '越不想被人找到的東西，越會放在低處。';
  const KEY_SECTIONS = [
    { kind: 'official', text: ['物資來源：研究所。', '運送項目：測試品、暮晶、實驗物資。', '收貨地點：迪普霍姆礦坑。'] },
    { kind: 'royal', label: '王室命令附頁', text: ['派士兵團看守迪普霍姆的礦坑。'] }
  ];
  let active = null;

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const id = (r, c) => r * COLS + c;
  function newState() { return { opened: [], fights: 0, sinceFight: 0, pending: false, hintShown: false, found: false }; }
  function entry(r, c) { const e = COPY[r][c]; return { title: e[0], text: e[1], key: e[2] === 'k', empty: e[0] === '空抽屜' }; }

  function open(opts = {}) {
    if (active) return null;
    const state = opts.state || newState();
    const opened = new Set(state.opened);
    const dialog = el('dialog', 'story-search-dialog aw-dialog');
    dialog.id = 'story-search-dialog';
    dialog.dataset.scene = 'archive-wall';
    dialog.setAttribute('aria-labelledby', 'aw-title');
    let closing = false, reader = null;
    const trigger = opts.trigger || document.activeElement;

    const head = el('header', 'search-head');
    const heading = el('div');
    const eyebrow = el('p', 'search-eyebrow sq-eyebrow');
    const badge = el('b', 'sq-badge', '支線'); eyebrow.append(badge, el('span', '', ' 尋物 · 檔案調閱'));
    const title = el('h2', '', '行政文件庫 · 檔案櫃'); title.id = 'aw-title';
    heading.append(eyebrow, title);
    const closeBtn = el('button', '', '離開'); closeBtn.type = 'button'; closeBtn.dataset.searchClose = '';
    closeBtn.setAttribute('aria-label', '離開檔案櫃');
    head.append(heading, closeBtn);
    const status = el('p', 'search-help aw-status'); status.setAttribute('role', 'status');
    const viewport = el('div', 'aw-viewport');
    const world = el('div', 'aw-world');
    const plate = el('img', 'aw-plate'); plate.alt = ''; plate.src = ART.plate; plate.draggable = false;
    const grid = el('div', 'aw-grid');
    grid.style.cssText = `left:${GRID.x}%;top:${GRID.y}%;width:${GRID.w}%;height:${GRID.h}%`;
    world.append(plate, grid);
    const tools = el('div', 'aw-tools');
    const mk = (t, label, fn) => { const b = el('button', '', t); b.type = 'button'; b.setAttribute('aria-label', label); b.addEventListener('click', fn); return b; };
    tools.append(mk('放大', '放大', () => zoomBy(1.35)), mk('縮小', '縮小', () => zoomBy(1 / 1.35)), mk('全景', '返回全景', () => reset()));
    viewport.append(world);
    const panel = el('div', 'aw-panel'); panel.hidden = true;
    viewport.append(panel);
    dialog.append(head, status, viewport, tools);

    // ---- grid
    const cells = [];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const b = el('button', 'aw-drawer'); b.type = 'button'; b.dataset.drawer = String(id(r, c));
      const img = el('img'); img.alt = ''; img.draggable = false; b.append(img, el('span', 'aw-tag'));
      b.addEventListener('click', () => { if (!moved) pull(r, c); });
      grid.append(b); cells.push(b);
    }
    function paint(r, c) {
      const b = cells[id(r, c)], isOpen = opened.has(id(r, c));
      b.classList.toggle('is-open', isOpen);
      b.querySelector('img').src = isOpen ? ART.pulled : ART.closed[(r * 3 + c * 5) % 3];
      b.querySelector('.aw-tag').textContent = isOpen ? entry(r, c).title : '';
      b.setAttribute('aria-label', isOpen ? `已查閱：${entry(r, c).title}` : '檔案櫃抽屜');
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) paint(r, c);

    function note() {
      if (state.found) status.textContent = '找到了運送紀錄。';
      else if (state.sinceFight >= PER_PATROL) status.textContent = '查勤的士兵來了。';
      else status.textContent = `已查閱 ${opened.size} / ${ROWS * COLS} 個抽屜 · 再開 ${PER_PATROL - state.sinceFight} 個抽屜，查勤的士兵就會來。${state.hintShown ? '伊芙：「' + HINT + '」' : ''}`;
    }

    // ---- reader panel
    function showPanel(node) { panel.replaceChildren(node); panel.hidden = false; reader = node; (node.querySelector('button') || panel).focus?.(); }
    function hidePanel() { panel.hidden = true; panel.replaceChildren(); reader = null; }
    function readDoc(r, c, first) {
      const e = entry(r, c), box = el('div', 'aw-doc');
      box.append(el('h3', '', e.title));
      if (e.key) {
        for (const s of KEY_SECTIONS) {
          if (s.label) box.append(el('p', 'aw-label', s.label));
          s.text.forEach(t => box.append(el('p', s.kind === 'royal' ? 'aw-royal' : '', t)));
        }
      } else box.append(el('p', '', e.text));
      const row = el('div', 'aw-actions');
      if (e.key) {
        const take = el('button', 'aw-primary', '收取運送紀錄'); take.type = 'button'; take.dataset.awTake = '';
        take.addEventListener('click', () => { state.found = true; state.opened = [...opened]; hidePanel(); note(); opts.onFound?.(); finish(true); });
        row.append(take);
      }
      const back = el('button', '', '合上抽屜'); back.type = 'button'; back.dataset.awCloseDoc = '';
      back.addEventListener('click', () => { hidePanel(); if (first) afterOpen(); });
      row.append(back);
      box.append(row);
      showPanel(box);
    }
    function patrolNotice() {
      const box = el('div', 'aw-doc aw-patrol');
      const img = el('img'); img.alt = ''; img.src = ART.prebattle;
      box.append(img, el('h3', '', '查勤的士兵來了'), el('p', '', '腳步聲逼近。要繼續找，就得先擋下他們。'));
      const go = el('button', 'aw-primary', '迎戰'); go.type = 'button'; go.dataset.awFight = '';
      go.addEventListener('click', () => {
        state.opened = [...opened];
        dialog.close();
        opts.onPatrol?.(state.fights + 1, success => {
          if (success) { state.fights++; state.sinceFight = 0; state.pending = false; if (state.fights === 3 && !state.hintShown) { state.hintShown = true; opts.onHint?.(HINT); } }
          // The campaign reopens the wall with the same state.
          opts.onResume?.(success);
        });
      });
      box.append(el('div', 'aw-actions').appendChild(go).parentNode);
      showPanel(box);
    }
    function afterOpen() {
      state.opened = [...opened];
      if (state.found) return;
      if (state.sinceFight >= PER_PATROL) { state.pending = true; patrolNotice(); }
      note();
    }
    function pull(r, c) {
      if (closing || reader && !panel.hidden) return;
      const first = !opened.has(id(r, c));
      if (first) { opened.add(id(r, c)); state.sinceFight++; state.opened = [...opened]; paint(r, c); opts.onOpen?.(entry(r, c)); }
      note();
      readDoc(r, c, first && !entry(r, c).key);
    }

    // ---- zoom / drag / pinch
    let scale = 1, tx = 0, ty = 0, moved = false;
    const pointers = new Map();
    const MAXZ = 4;
    function clamp() {
      const vw = viewport.clientWidth, vh = viewport.clientHeight;
      const ww = world.offsetWidth * scale, wh = world.offsetHeight * scale;
      tx = ww <= vw ? (vw - ww) / 2 : Math.min(0, Math.max(vw - ww, tx));
      ty = wh <= vh ? (vh - wh) / 2 : Math.min(0, Math.max(vh - wh, ty));
    }
    function apply() { clamp(); world.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; viewport.dataset.zoom = scale > 1.02 || wide() ? 'in' : 'out'; }
    function zoomAt(f, px, py) {
      const ns = Math.min(MAXZ, Math.max(1, scale * f)); if (ns === scale) return;
      tx = px - (px - tx) * ns / scale; ty = py - (py - ty) * ns / scale; scale = ns; apply();
    }
    function zoomBy(f) { zoomAt(f, viewport.clientWidth / 2, viewport.clientHeight / 2); }
    function reset() { scale = 1; tx = ty = 0; apply(); }
    function wide() { return world.offsetWidth > viewport.clientWidth + 1; }
    viewport.addEventListener('wheel', e => { e.preventDefault(); const b = viewport.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - b.left, e.clientY - b.top); }, { passive: false });
    let pinch = 0, down = null;
    viewport.addEventListener('pointerdown', e => {
      if (e.target.closest('.aw-panel')) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); down = { x: e.clientX, y: e.clientY, tx, ty }; moved = false;
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    });
    viewport.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y), r = viewport.getBoundingClientRect();
        if (pinch) zoomAt(d / pinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        pinch = d; moved = true; return;
      }
      if (down && (scale > 1 || wide())) {
        const dx = e.clientX - down.x, dy = e.clientY - down.y;
        if (moved || Math.hypot(dx, dy) > 6) { moved = true; tx = down.tx + dx; ty = down.ty + dy; apply(); }
      }
    });
    const up = e => { pointers.delete(e.pointerId); pinch = 0; if (!pointers.size) { down = null; setTimeout(() => { moved = false; }, 0); } };
    viewport.addEventListener('pointerup', up); viewport.addEventListener('pointercancel', up);
    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    // ---- lifecycle
    function finish(done) {
      if (closing) return; closing = true;
      window.removeEventListener('resize', onResize);
      state.opened = [...opened];
      if (dialog.open) dialog.close();
      dialog.remove(); active = null;
      if (done) opts.onComplete?.(state); else opts.onCancel?.(state);
      try { trigger?.focus?.(); } catch {}
    }
    closeBtn.addEventListener('click', () => { state.opened = [...opened]; closing = false; leave(); });
    function leave() { if (closing) return; closing = true; window.removeEventListener('resize', onResize); if (dialog.open) dialog.close(); dialog.remove(); active = null; opts.onCancel?.(state); try { trigger?.focus?.(); } catch {} }
    dialog.addEventListener('cancel', e => { e.preventDefault(); if (!panel.hidden && !dialog.querySelector('.aw-patrol')) { hidePanel(); return; } if (!dialog.querySelector('.aw-patrol')) leave(); });
    dialog.addEventListener('close', () => { /* closed for a patrol fight: keep module state, release the slot */ if (!closing) { closing = true; window.removeEventListener('resize', onResize); dialog.remove(); active = null; } });

    document.body.append(dialog);
    dialog.showModal();
    active = { dialog, state };
    if (wide()) tx = -(world.offsetWidth - viewport.clientWidth) / 2;
    apply(); note();
    if (state.pending && !state.found) patrolNotice();
    return dialog;
  }

  window.NDArchiveWall = { open, newState, COPY, GRID, HINT, PER_PATROL, KEY, isOpen: () => !!active };
})();
