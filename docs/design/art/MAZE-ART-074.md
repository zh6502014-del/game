# MAZE-ART-074｜逃生街區圖精緻化

兩張使用者截圖為S2/T1共用旋轉道路小遊戲。僅本地美術/UI優化。art_ui唯一實作src/js/story-maze.js中roadSvg/blocksSvg/gateSvg及必要呈現class/標記（不改engine/configs/旋轉/判定/事件/保存）；src/css/story-maze.css的地圖、格子、道路、建物、起終點/已接通/焦點樣式。使用既有inline SVG/CSS，不生成點陣圖；延續古金墨綠、舊紙城市地圖，加入石板路、屋頂輪廓/陰影、細節而不遮路口。道路邊緣與旋轉中心精確，屋頂固定且不與旋轉道路相撞；起點出口保持固定。手機5×5可辨識，focus/減少動態保留，裝飾pointer-events:none。不得改文案、解法、RNG、戰鬥、存檔；S2文案建議仍待確認。

允許tests/maze-art-074.cjs定向SVG/引擎不變/呈現檢查，證據test-results/MAZE-ART-074/；三HTML由產品版本工具整合。產品只写本單/工作板，工程師只寫review。基線test-results/change-scopes/MAZE-ART-074-before.json。瀏覽器file URL政策限制不繞行，不開server；可用合法離線SVG渲染工具檢視素材（非模擬網頁或瀏覽器），未測真實版面必說明。零新runtime圖片，不需素材bytes例外。

交付：兩關共用新SVG街區，四角屋頂/屋脊/煙囪/陰影、石板道路與邊沿；限定maze格子覆寫全域厚金框，保留focus。接通以古金＋虛線表示。新增runtime點陣素材0 bytes。除三SVG helpers外，JS configs/engine/handler/API與基線逐字相同。tests/maze-art-074.cjs核對四路型×四方向幾何、兩關原路徑仍可解與語法，PASS。產品版本整合只Story HTML，117 refs PASS。

產品已檢視test-results/MAZE-ART-074/art-preview.png（1020px）與art-preview-small.png（290px），離線SVG美術樣張可辨識道路與建物；不等於遊戲版面驗收。report.json保存雜湊與限制。未驗瀏覽器層疊、真實滑鼠/鍵盤/手機畫面；未發布。

工程P2已補正：maze局部frame reset選擇器(0,7,1)勝過全域(0,6,1)，定向測試讀真實CSS驗權重及DOM標記。最終scope/117版本/工程複審通過，產品接受本地美術及靜態交付，頁面與實際操作待驗。修改檔案為上述JS/CSS/測試、Story HTML及工單文件；無未解相關P0/P1/P2。
