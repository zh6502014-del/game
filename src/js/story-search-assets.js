/* One sprite per physical object, shared by search, stage and assembly. */
(() => {
  'use strict';
  const prop = (id, label) => ({ id, label, path: `assets/story/props/${id}.webp` });
  const props = {
    paper: prop('paper', '研究文件'),
    'gun-0': { id: 'gun-0', label: '本體', path: 'assets/story/props/guns/gun0.webp' },
    'gun-1': { id: 'gun-1', label: '槍管外殼', path: 'assets/story/props/guns/gun1.webp' },
    'gun-2': { id: 'gun-2', label: '木握柄', path: 'assets/story/props/guns/gun2.webp' },
    'gun-3': { id: 'gun-3', label: '菱形暮晶', path: 'assets/story/props/guns/gun3.webp' },
    'gun-4': { id: 'gun-4', label: '側蓋', path: 'assets/story/props/guns/gun4.webp' },
    recorder: prop('recorder', '夾層紀錄器'),
    lamp: prop('lamp', '桌上的燈'),
    'search-folio': prop('search-folio', '舊文件夾'),
    'search-cloth': prop('search-cloth', '工具覆布'),
    'search-panel': prop('search-panel', '夾層木蓋'),
    'archive-books': prop('archive-books', '一疊舊書'),
    'archive-candle': prop('archive-candle', '燭台'),
    'archive-ink-quill': prop('archive-ink-quill', '墨水與羽毛筆'),
    'archive-compass': prop('archive-compass', '銅製羅盤'),
    'archive-crystal': prop('archive-crystal', '水晶簇'),
    'archive-hourglass': prop('archive-hourglass', '沙漏'),
    'archive-globe': prop('archive-globe', '渾天儀'),
    'archive-watch': prop('archive-watch', '懷錶'),
    'archive-key': prop('archive-key', '老式鑰匙'),
    'archive-map': prop('archive-map', '捲軸地圖'),
    'archive-journal': prop('archive-journal', '皮革筆記本'),
    'archive-scroll': prop('archive-scroll', '封蠟捲軸'),
    'archive-vial': prop('archive-vial', '藥水瓶'),
    'archive-mortar': prop('archive-mortar', '研磨缽'),
    'archive-lens': prop('archive-lens', '放大鏡'),
    'archive-glasses': prop('archive-glasses', '圓框眼鏡'),
    'archive-pouch': prop('archive-pouch', '皮革錢袋'),
    'archive-coins': prop('archive-coins', '銅幣堆'),
    'archive-papers': prop('archive-papers', '夾紙筆記'),
    'archive-cabinet-body': { id: 'archive-cabinet-body', label: '檔案櫃', path: 'assets/story/props/chapter-props/archive-cabinet-body.webp' },
    'archive-drawer-front': { id: 'archive-drawer-front', label: '抽屜', path: 'assets/story/props/chapter-props/archive-drawer-front.webp' },
    'archive-folder': { id: 'archive-folder', label: '卷宗', path: 'assets/story/props/archive-materials/archive-folder-v2.webp' }
  };
  // Inline vector clutter for hidden-object scenes; static markup owned by this file.
  const clutterArt = {"wrench": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><path fill=\"#77878c\" d=\"M8 38 L26 38 A16 16 0 1 1 26 62 L8 62 L8 54 L20 54 L20 46 L8 46Z\" transform=\"translate(0 0)\"/><rect x=\"34\" y=\"42\" width=\"60\" height=\"16\" rx=\"8\" fill=\"#77878c\"/></g><circle cx=\"86\" cy=\"50\" r=\"3.5\" fill=\"#2e3a3e\"/></svg>", "pliers": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><path fill=\"#77878c\" d=\"M6 40 L38 46 L44 50 L38 54 L6 60 L14 50Z\"/><path fill=\"#77878c\" d=\"M38 46 L70 30 L92 18 L96 26 L76 42 L52 52Z\"/><path fill=\"#77878c\" d=\"M38 54 L70 70 L92 82 L96 74 L76 58 L52 48Z\"/></g><circle cx=\"46\" cy=\"50\" r=\"4\" fill=\"#a98449\" stroke=\"#2e3a3e\" stroke-width=\"2\"/><path d=\"M74 36 L92 22 M74 64 L92 78\" stroke=\"#2f6a5a\" stroke-width=\"6\" stroke-linecap=\"round\"/></svg>", "gear": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M84.4 43.4 L95.7 45.1 L95.7 54.9 L84.4 56.6 L81.7 64.9 L89.9 72.9 L84.1 80.9 L74.0 75.5 L66.9 80.7 L68.8 92.0 L59.5 95.0 L54.4 84.7 L45.6 84.7 L40.5 95.0 L31.2 92.0 L33.1 80.7 L26.0 75.5 L15.9 80.9 L10.1 72.9 L18.3 64.9 L15.6 56.6 L4.3 54.9 L4.3 45.1 L15.6 43.4 L18.3 35.1 L10.1 27.1 L15.9 19.1 L26.0 24.5 L33.1 19.3 L31.2 8.0 L40.5 5.0 L45.6 15.3 L54.4 15.3 L59.5 5.0 L68.8 8.0 L66.9 19.3 L74.0 24.5 L84.1 19.1 L89.9 27.1 L81.7 35.1Z M61 50 A11 11 0 1 0 39 50 A11 11 0 1 0 61 50Z\" fill=\"#a98449\" fill-rule=\"evenodd\" stroke=\"#6f5730\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/><circle cx=\"50\" cy=\"50\" r=\"24\" fill=\"none\" stroke=\"#6f5730\" stroke-width=\"2\"/></svg>", "gear-small": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M85.0 41.6 L95.6 43.9 L95.6 56.1 L85.0 58.4 L80.7 68.8 L86.6 77.9 L77.9 86.6 L68.8 80.7 L58.4 85.0 L56.1 95.6 L43.9 95.6 L41.6 85.0 L31.2 80.7 L22.1 86.6 L13.4 77.9 L19.3 68.8 L15.0 58.4 L4.4 56.1 L4.4 43.9 L15.0 41.6 L19.3 31.2 L13.4 22.1 L22.1 13.4 L31.2 19.3 L41.6 15.0 L43.9 4.4 L56.1 4.4 L58.4 15.0 L68.8 19.3 L77.9 13.4 L86.6 22.1 L80.7 31.2Z M59 50 A9 9 0 1 0 41 50 A9 9 0 1 0 59 50Z\" fill=\"#77878c\" fill-rule=\"evenodd\" stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/></svg>", "bolt": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><path fill=\"#77878c\" d=\"M6 34 L20 26 L34 34 L34 66 L20 74 L6 66Z\"/><rect x=\"34\" y=\"40\" width=\"58\" height=\"20\" fill=\"#77878c\"/></g><path d=\"M44 40 V60 M54 40 V60 M64 40 V60 M74 40 V60 M84 40 V60\" stroke=\"#2e3a3e\" stroke-width=\"2.5\"/></svg>", "nut": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M88.1 72.0 L50.0 94.0 L11.9 72.0 L11.9 28.0 L50.0 6.0 L88.1 28.0Z M65 50 A15 15 0 1 0 35 50 A15 15 0 1 0 65 50Z\" fill=\"#a98449\" fill-rule=\"evenodd\" stroke=\"#6f5730\" stroke-width=\"3\" stroke-linejoin=\"round\"/><circle cx=\"50\" cy=\"50\" r=\"24\" fill=\"none\" stroke=\"#6f5730\" stroke-width=\"2\"/></svg>", "screwdriver": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"38\" width=\"34\" height=\"24\" rx=\"10\" fill=\"#2f6a5a\"/><rect x=\"40\" y=\"46\" width=\"48\" height=\"8\" fill=\"#77878c\"/><path d=\"M88 44 L96 50 L88 56Z\" fill=\"#77878c\"/></g><path d=\"M14 44 V56 M22 44 V56 M30 44 V56\" stroke=\"#2e3a3e\" stroke-width=\"2\"/></svg>", "spring": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 50 L14 30 L22 70 L30 30 L38 70 L46 30 L54 70 L62 30 L70 70 L78 30 L86 70 L94 50\" fill=\"none\" stroke=\"#77878c\" stroke-width=\"6\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><path d=\"M6 50 L14 30 L22 70 L30 30 L38 70 L46 30 L54 70 L62 30 L70 70 L78 30 L86 70 L94 50\" fill=\"none\" stroke=\"#2e3a3e\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/></svg>", "cable": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g fill=\"none\" stroke-linecap=\"round\"><ellipse cx=\"50\" cy=\"50\" rx=\"42\" ry=\"30\" stroke=\"#2e3a3e\" stroke-width=\"12\"/><ellipse cx=\"50\" cy=\"50\" rx=\"42\" ry=\"30\" stroke=\"#8b6f45\" stroke-width=\"7\"/><ellipse cx=\"50\" cy=\"50\" rx=\"27\" ry=\"17\" stroke=\"#2e3a3e\" stroke-width=\"10\"/><ellipse cx=\"50\" cy=\"50\" rx=\"27\" ry=\"17\" stroke=\"#8b6f45\" stroke-width=\"5\"/><path d=\"M92 50 C98 62 84 80 66 88\" stroke=\"#2e3a3e\" stroke-width=\"9\"/><path d=\"M92 50 C98 62 84 80 66 88\" stroke=\"#8b6f45\" stroke-width=\"5\"/></g></svg>", "vial": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"38\" width=\"12\" height=\"24\" rx=\"3\" fill=\"#6f5730\"/><rect x=\"20\" y=\"34\" width=\"70\" height=\"32\" rx=\"14\" fill=\"#a9c9c2\" fill-opacity=\".55\"/><rect x=\"34\" y=\"44\" width=\"52\" height=\"16\" rx=\"8\" fill=\"#2f6a5a\" stroke=\"none\"/></g><path d=\"M36 42 H70\" stroke=\"#e5f3ef\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>", "lens": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\"><circle cx=\"36\" cy=\"46\" r=\"28\" fill=\"#a9c9c2\" fill-opacity=\".4\" stroke=\"#a98449\" stroke-width=\"7\"/><path d=\"M58 66 L92 92\" stroke=\"#6f5730\" stroke-width=\"9\" stroke-linecap=\"round\"/></g><path d=\"M22 34 Q30 26 40 26\" stroke=\"#e5f3ef\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "notebook": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3a2c1c\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"8\" y=\"14\" width=\"84\" height=\"72\" rx=\"5\" fill=\"#4a3a28\"/><rect x=\"18\" y=\"14\" width=\"10\" height=\"72\" fill=\"#6f5730\"/><rect x=\"36\" y=\"26\" width=\"46\" height=\"26\" rx=\"2\" fill=\"#c9b48a\"/></g><path d=\"M42 34 H76 M42 42 H70\" stroke=\"#3a2c1c\" stroke-width=\"2.5\"/></svg>", "ruler": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"4\" y=\"34\" width=\"92\" height=\"32\" rx=\"3\" fill=\"#b09a68\" stroke=\"#3a2c1c\" stroke-width=\"2.5\"/><path d=\"M12 34 V48 M22 34 V44 M32 34 V48 M42 34 V44 M52 34 V48 M62 34 V44 M72 34 V48 M82 34 V44 M90 34 V48\" stroke=\"#3a2c1c\" stroke-width=\"2.5\"/></svg>", "key": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#6f5730\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><circle cx=\"24\" cy=\"50\" r=\"19\" fill=\"#a98449\"/><circle cx=\"24\" cy=\"50\" r=\"8\" fill=\"#16241f\"/><rect x=\"42\" y=\"45\" width=\"52\" height=\"10\" fill=\"#a98449\"/><path d=\"M76 55 V68 H84 V55Z M62 55 V64 H68 V55Z\" fill=\"#a98449\"/></g></svg>", "tape": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"50\" cy=\"50\" r=\"44\" fill=\"#8b7a55\" stroke=\"#3a2c1c\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"50\" r=\"24\" fill=\"#16241f\" stroke=\"#3a2c1c\" stroke-width=\"2.5\"/><path d=\"M92 62 L100 92 L70 88\" fill=\"#8b7a55\" stroke=\"#3a2c1c\" stroke-width=\"2.5\" stroke-linejoin=\"round\"/></svg>", "compass": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"M50 12 L18 90 M50 12 L82 90\" fill=\"none\" stroke-width=\"7\" stroke=\"#77878c\"/><path d=\"M50 12 L18 90 M50 12 L82 90\" fill=\"none\" stroke-width=\"1.5\"/><circle cx=\"50\" cy=\"16\" r=\"8\" fill=\"#a98449\"/><path d=\"M34 58 H66\" stroke=\"#77878c\" stroke-width=\"5\"/></g></svg>", "scissors": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><path fill=\"#77878c\" d=\"M94 22 L48 48 L52 56 L96 32Z\"/><path fill=\"#77878c\" d=\"M94 78 L48 52 L52 44 L96 68Z\"/><circle cx=\"24\" cy=\"30\" r=\"14\" fill=\"none\" stroke=\"#2f6a5a\" stroke-width=\"7\"/><circle cx=\"24\" cy=\"70\" r=\"14\" fill=\"none\" stroke=\"#2f6a5a\" stroke-width=\"7\"/><path d=\"M34 38 L52 50 M34 62 L52 50\" stroke=\"#77878c\" stroke-width=\"7\" fill=\"none\"/></g><circle cx=\"50\" cy=\"50\" r=\"3.5\" fill=\"#a98449\"/></svg>", "brush": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3a2c1c\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"42\" width=\"52\" height=\"16\" rx=\"8\" fill=\"#6b4a2c\"/><rect x=\"56\" y=\"40\" width=\"14\" height=\"20\" fill=\"#77878c\"/><path d=\"M70 40 L96 46 L96 54 L70 60Z\" fill=\"#d8c79a\"/></g></svg>", "gauge": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><circle cx=\"50\" cy=\"50\" r=\"44\" fill=\"#a98449\" stroke=\"#6f5730\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"50\" r=\"34\" fill=\"#c9d6cf\" stroke=\"#2e3a3e\" stroke-width=\"2.5\"/><path d=\"M50 50 L68 30\" stroke=\"#8a2f22\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"50\" cy=\"50\" r=\"5\" fill=\"#2e3a3e\"/><path d=\"M22 60 A30 30 0 0 1 50 20 M78 60 A30 30 0 0 0 50 20\" stroke=\"#2e3a3e\" stroke-width=\"2\" fill=\"none\" stroke-dasharray=\"3 5\"/></svg>", "plate": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><rect x=\"8\" y=\"16\" width=\"84\" height=\"68\" rx=\"6\" fill=\"#586a6a\" stroke=\"#2e3a3e\" stroke-width=\"2.5\"/><g fill=\"#2e3a3e\"><circle cx=\"22\" cy=\"30\" r=\"5\"/><circle cx=\"78\" cy=\"30\" r=\"5\"/><circle cx=\"22\" cy=\"70\" r=\"5\"/><circle cx=\"78\" cy=\"70\" r=\"5\"/><rect x=\"38\" y=\"42\" width=\"24\" height=\"16\" rx=\"3\"/></g></svg>", "ink": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3a2c1c\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"20\" y=\"36\" width=\"60\" height=\"52\" rx=\"12\" fill=\"#26343a\"/><rect x=\"38\" y=\"20\" width=\"24\" height=\"18\" fill=\"#26343a\"/><rect x=\"34\" y=\"12\" width=\"32\" height=\"10\" rx=\"3\" fill=\"#6f5730\"/></g><path d=\"M30 52 V74\" stroke=\"#7ea3a0\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>", "pencil": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#3a2c1c\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><rect x=\"4\" y=\"42\" width=\"66\" height=\"16\" fill=\"#b8892f\"/><path d=\"M70 42 L96 50 L70 58Z\" fill=\"#d8c79a\"/><path d=\"M88 47 L96 50 L88 53Z\" fill=\"#3a2c1c\"/><rect x=\"4\" y=\"42\" width=\"10\" height=\"16\" fill=\"#9a4a3a\"/></g></svg>", "clamp": "<svg viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\"><g stroke=\"#2e3a3e\" stroke-width=\"2.5\" stroke-linejoin=\"round\"><path fill=\"#77878c\" d=\"M14 14 H74 V28 H30 V72 H74 V86 H14Z\"/><rect x=\"26\" y=\"40\" width=\"58\" height=\"20\" rx=\"3\" fill=\"#77878c\"/></g><path d=\"M84 36 V64\" stroke=\"#a98449\" stroke-width=\"8\" stroke-linecap=\"round\"/></svg>"};
  const c = (art, x, y, size, rotate = 0, layer = 'under', hideUntil = '') => ({ art, x, y, w: size, h: +(size * 16 / 9).toFixed(2), rotate, layer, hideUntil });
  // x/y are the centre of the visual box, in a fixed 16:9 scene.
  const scenes = {
    'research-files': {
      id: 'research-files', title: '地下三層 · 研究資料',
      background: { path: 'assets/story/backgrounds/search-lab.webp', title: '被翻過的研究室' },
      placements: [
        { id: 'research-copy', label: '研究副本', prop: 'paper', x: 20, y: 54, w: 15, h: 19, rotate: -8, motif: 'seal', stack: 3 },
        { id: 'spare-design', label: '備用設計', prop: 'paper', x: 39, y: 56, w: 15, h: 19, rotate: 6, motif: 'diagram', stack: 1 },
        { id: 'readings', label: '自動備份讀值', prop: 'paper', x: 62, y: 54, w: 15, h: 19, rotate: -5, motif: 'chart', stack: 2 },
        { id: 'mentor-note', label: '導師備註', prop: 'paper', x: 81, y: 56, w: 15, h: 19, rotate: 9, motif: 'writing', stack: 1 },
        { id: 'archive-books', prop: 'archive-books', x: 5, y: 13, w: 9, h: 14.68, rotate: -6, decorative: true },
        { id: 'archive-candle', prop: 'archive-candle', x: 16, y: 11, w: 7, h: 12.12, rotate: 4, decorative: true },
        { id: 'archive-ink-quill', prop: 'archive-ink-quill', x: 27, y: 14, w: 7, h: 14.12, rotate: -8, decorative: true },
        { id: 'archive-compass', prop: 'archive-compass', x: 38, y: 12, w: 7, h: 12.21, rotate: 7, decorative: true },
        { id: 'archive-crystal', prop: 'archive-crystal', x: 50, y: 10, w: 7, h: 12.06, rotate: 0, decorative: true },
        { id: 'archive-hourglass', prop: 'archive-hourglass', x: 62, y: 15, w: 7, h: 13.19, rotate: -5, decorative: true },
        { id: 'archive-globe', prop: 'archive-globe', x: 74, y: 17, w: 8, h: 18.63, rotate: 6, decorative: true },
        { id: 'archive-watch', prop: 'archive-watch', x: 85, y: 13, w: 6, h: 10.54, rotate: -10, decorative: true },
        { id: 'archive-key', prop: 'archive-key', x: 93, y: 13, w: 5.5, h: 8.22, rotate: 12, decorative: true },
        { id: 'archive-map', prop: 'archive-map', x: 6, y: 87, w: 10, h: 17.62, rotate: -4, decorative: true },
        { id: 'archive-journal', prop: 'archive-journal', x: 18, y: 85, w: 8, h: 14.67, rotate: 5, decorative: true },
        { id: 'archive-scroll', prop: 'archive-scroll', x: 29, y: 88, w: 6.5, h: 15.18, rotate: -9, decorative: true },
        { id: 'archive-vial', prop: 'archive-vial', x: 40, y: 86, w: 6, h: 10.83, rotate: 8, decorative: true },
        { id: 'archive-mortar', prop: 'archive-mortar', x: 50, y: 89, w: 7, h: 13.17, rotate: 0, decorative: true },
        { id: 'archive-lens', prop: 'archive-lens', x: 60, y: 85, w: 6, h: 12.4, rotate: -12, decorative: true },
        { id: 'archive-glasses', prop: 'archive-glasses', x: 70, y: 88, w: 7, h: 9.59, rotate: 10, decorative: true },
        { id: 'archive-pouch', prop: 'archive-pouch', x: 80, y: 86, w: 7.5, h: 9.85, rotate: -6, decorative: true },
        { id: 'archive-coins', prop: 'archive-coins', x: 90, y: 89, w: 6, h: 10.58, rotate: 4, decorative: true },
        { id: 'archive-papers', prop: 'archive-papers', x: 94, y: 85, w: 7.5, h: 12.86, rotate: -3, decorative: true }
      ],
      covers: [
        { id: 'research-folio', prop: 'search-folio', label: '左側文件夾', action: '翻開', x: 29, y: 54, w: 37, h: 36, rotate: -3, targets: ['research-copy', 'spare-design'], open: { x: 29, y: 34, w: 30, h: 23, rotate: -10 } },
        { id: 'readings-folio', prop: 'search-folio', label: '右側文件夾', action: '翻開', x: 71, y: 54, w: 37, h: 36, rotate: 3, targets: ['readings', 'mentor-note'], open: { x: 71, y: 34, w: 30, h: 23, rotate: 11 } }
      ]
    },
    'archive-vault': {
      id: 'archive-vault', title: '行政文件庫 · 乙列第四櫃',
      // 卷宗號碼只作行政標籤；玩家依來信內容查找物資去向。
      clueText: '物資去向',
      helpText: '查閱卷宗內容，找出研究物資送往礦區的紀錄。',
      noRegionHint: true,
      background: { path: 'assets/story/backgrounds/locations/archive-drawer-closeup.webp', title: '打開的文件櫃抽屜' },
      placements: [
        { id: 'sealed-order', label: '運送紀錄', prop: 'paper', x: 50, y: 62, w: 13, h: 22, rotate: -4, motif: 'seal', stack: 1,
          hintText: '留意文件裡的運送項目與收貨地點：要找的是研究物資送往礦區的紀錄。' }
      ],
      // 閱讀區文件。sections 的 kind：official 公文正文、note 手寫批註、royal 王室命令附頁。
      // 文件內容用於判斷是否符合來信線索；號碼不作答題提示。
      docs: {
        'folio-0423': { title: '轉運申請副本', sections: [{ kind: 'official', text: ['轉運申請的副本。'] }] },
        'folio-0424': { title: '人事調動單', sections: [{ kind: 'official', text: ['舊的人事調動單。'] }] },
        'folio-0425': { title: '補給帳冊附件', sections: [{ kind: 'official', text: ['補給帳冊的附件。'] }] },
        'folio-0426': { title: '運送紀錄', sections: [
          { kind: 'official', text: ['物資來源：研究所。', '運送項目：測試品、暮晶、實驗物資。', '收貨地點：迪普霍姆礦坑。'] },
          { kind: 'royal', label: '王室命令附頁', text: ['派士兵團看守迪普霍姆的礦坑。'] }
        ] },
        'folio-0427': { title: '巡防輪值表', sections: [{ kind: 'official', text: ['巡防輪值表。'] }] },
        'folio-0428': { title: '物資領取單', sections: [
          { kind: 'official', text: ['物資領取單，內容空白。'] },
          { kind: 'note', label: '背面批註', text: ['只准核對箱號，卻要我簽「內容無誤」。這一欄究竟該怎麼填？'] }
        ] },
        'folio-0429': { title: '舊卷', sections: [{ kind: 'official', text: ['封條褪色的舊卷。'] }] }
      },
      covers: [
        { id: 'folio-0423', prop: 'archive-folder', tag: '0423', label: '件號 0423 的卷宗', action: '抽出', x: 23, y: 49, w: 14, h: 31.4, rotate: -9, targets: [], note: '這是轉運申請，沒有研究物資的運送紀錄。', open: { x: 23, y: 63, w: 17, h: 38.1, rotate: -9 } },
        { id: 'folio-0424', prop: 'archive-folder', tag: '0424', label: '件號 0424 的卷宗', action: '抽出', x: 32, y: 47, w: 14, h: 31.4, rotate: -6, targets: [], note: '這份調動單記的是人員安排，不是物資去向。', open: { x: 32, y: 63, w: 17, h: 38.1, rotate: -6 } },
        { id: 'folio-0425', prop: 'archive-folder', tag: '0425', label: '件號 0425 的卷宗', action: '抽出', x: 41, y: 46, w: 14, h: 31.4, rotate: -3, targets: [], note: '這是日常補給的帳冊附件，沒有提到研究物資。', open: { x: 41, y: 63, w: 17, h: 38.1, rotate: -3 } },
        { id: 'folio-0426', prop: 'archive-folder', tag: '0426', label: '件號 0426 的卷宗', action: '抽出', x: 50, y: 45, w: 14, h: 31.4, rotate: 0, targets: ['sealed-order'], note: '裡面夾著一疊運送紀錄。', open: { x: 50, y: 63, w: 17, h: 38.1, rotate: 0 } },
        { id: 'folio-0427', prop: 'archive-folder', tag: '0427', label: '件號 0427 的卷宗', action: '抽出', x: 59, y: 46, w: 14, h: 31.4, rotate: 3, targets: [], note: '表上列的是巡防班次，沒有運送紀錄。', open: { x: 59, y: 63, w: 17, h: 38.1, rotate: 3 } },
        { id: 'folio-0428', prop: 'archive-folder', tag: '0428', label: '件號 0428 的卷宗', action: '抽出', x: 68, y: 47, w: 14, h: 31.4, rotate: 6, targets: [], note: '領取單沒有填寫物資或去向，背面留著一段批註。', open: { x: 68, y: 63, w: 17, h: 38.1, rotate: 6 } },
        { id: 'folio-0429', prop: 'archive-folder', tag: '0429', label: '件號 0429 的卷宗', action: '抽出', x: 77, y: 49, w: 14, h: 31.4, rotate: 9, targets: [], note: '這份舊卷沒有留下可辨認的物資去向。', open: { x: 77, y: 63, w: 17, h: 38.1, rotate: 9 } }
      ]
    },
    'gun-parts': {
      id: 'gun-parts', title: '保險箱 · 博士留下的槍零件',
      quickCollect: true,
      helpText: '布包裡的零件散在雜物之間。找出清單上的五件零件，點到就會收進收取匣；有些零件壓在別的東西下面。找不到可按清單旁的提示，不限時、不扣分。',
      // Flat-vector clutter removed 2026-10-01: clashed with the painted background/cloth art style.
      clutter: [],
      background: { path: 'assets/story/backgrounds/search-lab.webp', title: '被翻過的研究室' },
      placements: [
        { id: 'gun-0', prop: 'gun-0', x: 14, y: 55, w: 16, h: 22, rotate: -8 },
        { id: 'gun-1', prop: 'gun-1', x: 71, y: 54, w: 18, h: 17, rotate: 7 },
        { id: 'gun-2', prop: 'gun-2', x: 30, y: 56, w: 11, h: 25, rotate: 12 },
        { id: 'gun-3', prop: 'gun-3', x: 44.5, y: 49, w: 10, h: 18, rotate: -60 },
        { id: 'gun-4', prop: 'gun-4', x: 88, y: 60, w: 8, h: 13, rotate: -15 }
      ],
      covers: [
        { id: 'workbench-cloth', prop: 'search-cloth', label: '工作臺左側的覆布', action: '移開', x: 30, y: 54, w: 49, h: 40, rotate: -4, targets: ['gun-0', 'gun-2', 'gun-3'], open: { x: 25, y: 33, w: 27, h: 23, rotate: -14 } }
      ]
    },
    'hideout-recorder': {
      id: 'hideout-recorder', title: '最後的藏身處 · 尋找紀錄器',
      background: { path: 'assets/story/backgrounds/search-hideout.webp', title: '納爾瓦最後停留的藏身處' },
      placements: [
        { id: 'recorder', prop: 'recorder', x: 27, y: 68, w: 19, h: 28, rotate: -7 },
        { id: 'lamp', prop: 'lamp', x: 78, y: 39, w: 18, h: 40, decorative: true }
      ],
      covers: [
        { id: 'shelf-cover', prop: 'search-panel', label: '左下方夾層木蓋', action: '移開', x: 24, y: 64.5, w: 32, h: 35.5, rotate: 0, skewY: 9, targets: ['recorder'], open: { x: 2, y: 67, w: 32, h: 35.5, rotate: -82, skewY: 0 } }
      ]
    }
  };
  window.NDStorySearchAssets = { props, scenes, clutter: clutterArt };
})();
