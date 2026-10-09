# MAZE-ART-074 工程審查

2026-10-08，最終複審：**可交付，初審P2已補正**。工程師唯讀runtime及測試；以下保留初審問題及證據。

P2：`src/css/story-maze.css:17` 的 `.story-maze-dialog.sq-dialog .story-maze-map .story-maze-tile` specificity為(0,4,0)，其border-image:none!important無法壓過 `src/css/png-frames.css:49` 六個:not class加button的(0,6,1)；後者亦!important且正式Story HTML更晚載入。結果地圖格仍使用8px全域裝飾框，與本單欲移除粗框的呈現不符，手機更明顯。請僅增加maze tile reset的精確權重，不更動全域；測試需驗此層疊條件而非僅assert存在border-image:none。

基線 `test-results/change-scopes/MAZE-ART-074-before.json`；精確diff為本單 `engineer-scope.json`，WITHIN_FILE_SCOPE。JS限roadSvg／blocksSvg／gateSvg：道路arms沿用BASE，順時針轉向對應engine opens；屋頂固定角落、不更動rot／判定／事件／保存。無RNG、新素材或外部依賴。焦點outline的局部selector高於全域focus selector，裝飾pointer-events:none、reduced-motion保留。

本次實跑tests/maze-art-074.cjs通過4種×4向、兩組解法等靜態／引擎檢查，engineer-test.log保存；117版本通過engineer-versions.log。現有測試的frame-reset檢查僅regex，未涵蓋上述CSS優先序；PASS不消除P2。獨立SVG样張不包含實際HTML層疊，不能冒充網頁驗證。

最終補正：局部selector增加實際存在的data-sq="maze"、data-scene、data-maze-cell及button限定，權重為(0,7,1)，高於全域(0,6,1)，所以important shorthand能覆寫全域important各border-image longhand。適用範圍僅maze dialog格子，不會移除其他按鈕外框。靜態核對dialog.className、dataset與tile HTML均符合selector。

補充測試直接讀取兩CSS競爭selector，展開:not參數權重；受限計算器拒絕未支援的函式pseudo class。本次兩個selector皆在可處理範圍內，獨立人工權重核對一致。測試也核對新增限定屬性在程式中存在。未為通過而放寬斷言。

複審相對初審新增差異僅上述CSS selector、定向測試、必要Story HTML版本、本單交付說明及本審查報告。最終scope為WITHIN_FILE_SCOPE、無清單外差異，保存engineer-final-scope.json。定向測試與117版本重跑PASS，保存engineer-final-test.log與engineer-final-versions.log。沒有剩餘本次P0／P1／P2。

未執行瀏覽器、server或真實焦點／旋轉／觸控；畫面裁切、CSS實際呈現待驗。離線SVG仍只代表素材，產品最後驗收應保留此限制。
