/* STORY-MAZE: tile-rotation route interactions (S2 escape route, T1 evacuation route). Local to the dialog: never touches combat rules, RNG or saves. */
(() => {
 'use strict';
 const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
 const SIZE = 5;
 const NAMES = ['上', '右', '下', '左'];
 // Openings before rotation; each 90 degree turn moves every opening one side clockwise.
 const BASE = { I: [UP, DOWN], L: [UP, RIGHT], T: [UP, RIGHT, LEFT], D: [UP] };
 const KIND = { I: '直路', L: '轉角', T: '岔路', D: '死巷' };
 const opposite = side => (side + 2) % 4;
 const sideBetween = (from, to) => to[0] > from[0] ? DOWN : to[0] < from[0] ? UP : to[1] > from[1] ? RIGHT : LEFT;
 const opens = (type, rot) => BASE[type].map(side => (side + rot) % 4);
 const serves = (type, rot, sides) => sides.every(side => opens(type, rot).includes(side));
 const DELTA = [[-1, 0], [0, 1], [1, 0], [0, -1]];

 const configs = {
  // S2: from the tower gate (west of 0,0) to the shift-change exit (east of 4,4).
  'escape-tiles': {
   title: '朔 · 鐘樓逃生路線',
   intro: '納爾瓦要出城警告莫爾威爾的居民，朔決定帶他離開。旋轉路段，接通左上的鐘樓側門與右下的撤離出口。',
   done: '路線接通：鐘樓側門經巷道連到換班出口。守衛換班只有一次空檔，朔把每個轉角都記在心裡。',
   note: '街區圖只用來規劃逃生路線，不能保證沿途沒有守衛，也不代表朋友已經安全離開。',
   mapLabel: '鐘樓周邊街區圖',
   inLabel: '左上：鐘樓側門', outLabel: '右下：換班出口',
   entry: { cell: [0, 0], side: LEFT }, exit: { cell: [4, 4], side: RIGHT },
   path: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [4, 2], [4, 3], [4, 4]],
   pathTypes: ['I', 'T', 'I', 'L', 'I', 'T', 'L', 'I', 'L', 'T', 'I'],
   decoys: { '0,4': 'D', '1,0': 'L', '1,1': 'I', '1,2': 'T', '1,4': 'L', '2,0': 'D', '2,1': 'L', '2,4': 'I', '3,0': 'I', '3,1': 'T', '3,3': 'L', '3,4': 'D', '4,0': 'L', '4,1': 'D' }
  },
  // T1: from the street corner (west of 4,0) to the highland pick-up point (east of 0,4), through the surveyed passage.
  'evac-tiles': {
   title: '格蘭 · 撤離路線',
   intro: '暮鐘還沒響，渡垣先把小城的撤離路線畫在街區圖上。點街區旋轉路口，把路從左下的街口，接到右上的高地接應處；只要接得通，怎麼接都可以。',
   done: '備用路線已確認：街口通往高地接應處。',
   note: '街區圖只整理已知路況，不能預知夜域，也不是永久安全的保證。',
   mapLabel: '小城撤離街區圖',
   inLabel: '左下：街口', outLabel: '右上：高地接應處',
   entry: { cell: [4, 0], side: LEFT }, exit: { cell: [0, 4], side: RIGHT },
   path: [[4, 0], [4, 1], [3, 1], [2, 1], [2, 2], [2, 3], [1, 3], [0, 3], [0, 4]],
   pathTypes: ['I', 'L', 'I', 'L', 'T', 'L', 'I', 'L', 'I'],
   decoys: { '0,0': 'L', '0,1': 'D', '0,2': 'T', '1,0': 'I', '1,1': 'L', '1,2': 'D', '1,4': 'D', '2,0': 'T', '2,4': 'L', '3,0': 'D', '3,2': 'L', '3,3': 'I', '3,4': 'T', '4,2': 'D', '4,3': 'L', '4,4': 'I' }
  }
 };

 function engine(cfg) {
  const { path, pathTypes, decoys, entry, exit } = cfg;
  const required = cfg.required ? cfg.required.join(',') : null;
  const key = ([r, c]) => r + ',' + c;
  // Sides each path cell must open for the route to pass through it.
  const needed = path.map((cell, i) => [
   i === 0 ? entry.side : opposite(sideBetween(path[i - 1], cell)),
   i === path.length - 1 ? exit.side : sideBetween(cell, path[i + 1])
  ]);
  function initial() {
   const grid = Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => ({ type: decoys[r + ',' + c] || 'I', rot: (r * 2 + c * 3 + 1) % 4 })));
   path.forEach(([r, c], i) => {
    let rot = (i * 2 + 1) % 4;
    while (serves(pathTypes[i], rot, needed[i])) rot = (rot + 1) % 4; // start every route tile unsolved
    grid[r][c] = { type: pathTypes[i], rot };
   });
   return grid;
  }
  // Cells reached from the entry gate through matching openings.
  function reach(grid) {
   const seen = new Set(), [sr, sc] = entry.cell, start = grid[sr][sc];
   if (!opens(start.type, start.rot).includes(entry.side)) return seen;
   const stack = [[sr, sc]];
   seen.add(key(entry.cell));
   while (stack.length) {
    const [r, c] = stack.pop();
    for (const side of opens(grid[r][c].type, grid[r][c].rot)) {
     const nr = r + DELTA[side][0], nc = c + DELTA[side][1];
     if (nr < 0 || nc < 0 || nr >= SIZE || nc >= SIZE || seen.has(nr + ',' + nc)) continue;
     const next = grid[nr][nc];
     if (!opens(next.type, next.rot).includes(opposite(side))) continue;
     seen.add(nr + ',' + nc);
     stack.push([nr, nc]);
    }
   }
   return seen;
  }
  // 'open' = exit not reached, 'skipped' = exit reached without the required passage, 'solved'.
  function state(grid) {
   const lit = reach(grid), [er, ec] = exit.cell, end = grid[er][ec];
   const atExit = lit.has(key(exit.cell)) && opens(end.type, end.rot).includes(exit.side);
   if (!atExit) return 'open';
   return required && !lit.has(required) ? 'skipped' : 'solved';
  }
  // STORY-MAZE-FIX-045: any connected route from the entry to the exit solves the puzzle (no required tile, no hint button).
  return { cfg, path, pathTypes, needed, initial, reach, state, solved: grid => state(grid) === 'solved', required, key };
 }
 const engines = Object.fromEntries(Object.entries(configs).map(([id, cfg]) => [id, engine(cfg)]));

 // All street arms share the engine's BASE; only this layer rotates.
 const roadSvg = type => {
  const arms = { [UP]: 'M50 50V0', [RIGHT]: 'M50 50H100', [DOWN]: 'M50 50V100', [LEFT]: 'M50 50H0' };
  const route = BASE[type].map(side => arms[side]).join('');
  const paving = BASE[type].map(side => `<g transform="rotate(${side * 90} 50 50)"><path class="maze-paving" d="M42 8H58M42 18H58M42 28H58M42 38H58M50 0V8M47 8V18M53 18V28M47 28V38"/></g>`).join('');
  return `<svg class="story-maze-road" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path class="maze-road-edge" d="${route}"/><path class="maze-road-bed" d="${route}"/>${paving}<circle class="maze-junction" cx="50" cy="50" r="7"/><path class="maze-route-trace" d="${route}"/></svg>`;
 };
 // Rooftops stay inside the corner lots (clear of both possible street axes).
 // Geometry is deterministic and never consumes game RNG.
 const blocksSvg = (r, c) => {
  const lots = [[7, 7], [69, 7], [7, 69], [69, 69]];
  const houses = lots.map(([x, y], i) => {
   const tall = (r + c + i) % 2 === 0, w = tall ? 20 : 25, h = tall ? 25 : 19;
   return `<g class="maze-house" transform="translate(${x} ${y})"><rect class="maze-house-shadow" x="3" y="4" width="${w}" height="${h}"/><rect class="maze-house-wall" width="${w}" height="${h}"/><path class="maze-roof-light" d="M0 0H${w}L${w - 4} ${h / 2}H4Z"/><path class="maze-roof-dark" d="M0 ${h}H${w}L${w - 4} ${h / 2}H4Z"/><path class="maze-roof-lines" d="M0 0L4 ${h / 2}L0 ${h}M${w} 0L${w - 4} ${h / 2}L${w} ${h}M4 ${h / 2}H${w - 4}M4 4H${w - 4}M4 ${h - 4}H${w - 4}"/><rect class="maze-chimney" x="${w - 7}" y="3" width="3" height="5"/><path class="maze-window" d="M6 ${h + 1}h3m5 0h3"/></g>`;
  }).join('');
  return `<svg class="story-maze-blocks" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path class="maze-survey" d="M3 34H34V3M66 3V34H97M3 66H34V97M66 97V66H97"/>${houses}</svg>`;
 };
 const gateSvg = kind => `<svg class="story-maze-gate story-maze-gate-${kind}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g transform="${kind === 'in' ? '' : 'translate(100 0) scale(-1 1)'}"><path class="maze-gate-post" d="M0 33H7V40H0M0 60H7V67H0"/><polygon points="1,41 13,50 1,59"/></g></svg>`;
 const starSvg = () => '<svg class="story-maze-star" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polygon points="50,6 61,36 93,36 67,55 77,86 50,67 23,86 33,55 7,36 39,36"/></svg>';

 let active = null;
 function open(id, { onComplete, practice = false, trigger = document.activeElement } = {}) {
  const eng = engines[id];
  // A dialog that vanished without its close event must not block the next attempt.
  if (active && !active.isConnected) active = null;
  if (active || !eng) return null;
  const cfg = eng.cfg, key = eng.key;
  let grid = eng.initial(), turns = null; // STORY-MAZE-FIX-045: the drawn rotation must start at each tile's logical rotation (it used to start at 0, so the picture disagreed with the rules)
  const turnsOf = g => g.map(row => row.map(tile => tile.rot));
  turns = turnsOf(grid);
  let focus = [...cfg.entry.cell], closed = false, confirmed = false;
  const dialog = document.createElement('dialog');
  dialog.className = 'story-maze-dialog sq-dialog';
  dialog.dataset.sq = 'maze';
  dialog.dataset.scene = id;
  const same = (cell, r, c) => cell && cell[0] === r && cell[1] === c;
  const tile = (r, c) => `<button type="button" class="story-maze-tile" data-maze-cell="${r},${c}" data-kind="${grid[r][c].type}"${same(cfg.required, r, c) ? ' data-required="true"' : ''}>${blocksSvg(r, c)}<span class="story-maze-turn">${roadSvg(grid[r][c].type)}</span>${same(cfg.entry.cell, r, c) ? gateSvg('in') : ''}${same(cfg.exit.cell, r, c) ? gateSvg('out') : ''}${same(cfg.required, r, c) ? starSvg() : ''}</button>`;
  dialog.innerHTML = `<header><div><p class="sq-eyebrow"><b class="sq-badge">支線</b><span>路徑 · 故事互動</span></p><h2>${cfg.title}</h2></div><button type="button" data-maze-close>關閉</button></header><p class="story-maze-objective">${cfg.intro}</p><div class="story-maze-legend"><span><i class="story-maze-dot in"></i>${cfg.inLabel}</span><span><i class="story-maze-dot out"></i>${cfg.outLabel}</span>${cfg.requiredLabel ? `<span><i class="story-maze-legend-star"></i>${cfg.requiredLabel}</span>` : ''}</div><div class="story-maze-map" role="grid" aria-label="${cfg.mapLabel}">${Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => tile(r, c)).join('')).join('')}</div><p class="story-maze-status" role="status"></p><div class="story-maze-controls"><button type="button" data-maze-reset>重排街區</button><button type="button" data-maze-confirm disabled>確認路線</button></div><details><summary>操作說明</summary><p>點街區或按 Enter／空白鍵，讓路口順時針轉 90 度；方向鍵移動。路線亮起代表已從入口接通到那一格。入口與出口都接通${cfg.required ? '，而且經過標星的已勘查通道' : ''}後，才可確認。不限時，也不扣分。</p></details>`;
  const status = dialog.querySelector('.story-maze-status');
  const confirmButton = dialog.querySelector('[data-maze-confirm]');
  const cell = (r, c) => dialog.querySelector(`[data-maze-cell="${r},${c}"]`);
  const label = (r, c) => `第 ${r + 1} 列第 ${c + 1} 行，${KIND[grid[r][c].type]}，開口朝${opens(grid[r][c].type, grid[r][c].rot).map(s => NAMES[s]).sort().join('、')}${same(cfg.required, r, c) ? '，已勘查通道' : ''}`;
  function render(message) {
   const lit = eng.reach(grid), now = eng.state(grid);
   for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const button = cell(r, c), on = lit.has(key([r, c]));
    button.style.setProperty('--turns', turns[r][c]);
    button.dataset.lit = on ? 'true' : 'false';
    button.tabIndex = focus[0] === r && focus[1] === c ? 0 : -1;
    button.setAttribute('aria-label', `${label(r, c)}${on ? '，已接通' : ''}，點擊旋轉`);
   }
   confirmButton.disabled = now !== 'solved';
   if (message) status.textContent = message;
   else if (now === 'solved') status.textContent = '路線已接通：入口到出口都連上了。確認後繼續劇情。';
   else if (now === 'skipped') status.textContent = '路線雖然到了出口，卻沒有經過標星的已勘查通道。請改接路口。';
   else status.textContent = `已從入口接通 ${lit.size} 個街區。`;
  }
  function rotate(r, c) {
   focus = [r, c];
   grid[r][c].rot = (grid[r][c].rot + 1) % 4;
   turns[r][c] += 1;
   render();
  }
  dialog.addEventListener('click', event => {
   if (closed || !dialog.open) return;
   const button = event.target.closest('button');
   if (!button || button.disabled) return;
   if (button.hasAttribute('data-maze-close')) { dialog.close(); return; }
   if (button.dataset.mazeCell) { const [r, c] = button.dataset.mazeCell.split(',').map(Number); rotate(r, c); return; }
   if (button.hasAttribute('data-maze-reset')) { grid = eng.initial(); turns = turnsOf(grid); focus = [...cfg.entry.cell]; render('街區已回到最初的方向。'); return; }
   if (button.hasAttribute('data-maze-confirm') && eng.solved(grid) && !confirmed) { confirmed = true; status.textContent = '路線已確認。'; dialog.close('complete'); }
  });
  dialog.addEventListener('keydown', event => {
   if (closed || !dialog.open) return;
   if (event.key === 'Escape') { event.preventDefault(); dialog.close(); return; }
   const at = document.activeElement?.dataset?.mazeCell;
   if (!at) return;
   const [r, c] = at.split(',').map(Number);
   const move = { ArrowUp: [r - 1, c], ArrowDown: [r + 1, c], ArrowLeft: [r, c - 1], ArrowRight: [r, c + 1] }[event.key];
   if (move && move[0] >= 0 && move[1] >= 0 && move[0] < SIZE && move[1] < SIZE) { event.preventDefault(); focus = move; render(); cell(move[0], move[1]).focus(); }
  });
  dialog.addEventListener('close', () => {
   closed = true; dialog.remove();
   if (active === dialog) active = null;
   if (trigger?.isConnected) trigger.focus();
   if (confirmed && !practice) onComplete?.();
  }, { once: true });
  document.body.append(dialog);
  active = dialog;
  dialog.showModal();
  render();
  cell(cfg.entry.cell[0], cfg.entry.cell[1]).focus();
  return dialog;
 }
 window.NDStoryMaze = {
  open,
  scenes: Object.fromEntries(Object.entries(configs).map(([id, cfg]) => [id, { title: cfg.title, done: cfg.done, note: cfg.note }])),
  spec: Object.fromEntries(Object.entries(engines).map(([id, e]) => [id, { size: SIZE, path: e.path.map(cell => [...cell]), needed: e.needed.map(pair => [...pair]), required: e.cfg.required ? [...e.cfg.required] : null, initial: e.initial, state: e.state, solved: e.solved, reach: e.reach, opens }]))
 };
})();
