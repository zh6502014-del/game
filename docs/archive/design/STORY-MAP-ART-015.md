# STORY-MAP-ART-015｜精繪撤離與觀測地圖

2026-09-25，完成；產品視覺驗收與工程最終審查通過。使用者要求「格蘭 · 撤離簡圖這類型的美術要再精緻」。

## 可见成果與範圍

撤離簡圖、觀測區資料各換成一幅精繪手稿：紙張纖維、建築、地形排線、河道與可辨地標。每幅完整原畫派生四塊透明拼片，保留舊 SVG、不以四次獨立生成破壞接縫。地圖是既有線索的局部示意，不新增地名、預知、身世答案或可永久安全通行的保證。

兩幅內建 imagegen 原稿，目標 1024×1024、各 ≤5 MiB，保存於 `source-art/STORY-MAP-ART-015/`；八塊 runtime 存 `assets/story/props/map-art-v2/`，各 ≤512×512 / 100 KiB，總新增上限 800 KiB。原稿不隨遊戲載入。最大地圖顯示約 560 CSS px；拼片保留原 176 單位透明畫布與 100 單位邏輯格，裁切從同一整圖取樣。

## 單一寫入者與保護範圍

- 美術 hidden_object_art：僅兩份原稿及同資料夾 prompts.json；不改 runtime。
- 產品：`scripts/export-map-puzzles.py`、八份輸出、`assets/story/_records/map-puzzle-art.json`；`story-puzzles.js` 僅八張 map 路徑與圖片載入防護；`story-puzzles.css` 僅地圖片呈現及載入狀態；`tests/story-map-art.cjs`；本工單、`assets/puzzles/README.md` 與 WORKBOARD 本單區段。
- 產品於 014 明示凍結釋出後，才寫 runtime 與 `Nightfall-Duel-Story.html` 內容版本。014 所有其他 driver/data/CSS/source 保持原責任人。
- 工程師唯讀差異審查與定向風險驗證，報告寫 test-results。

不改配對 ID、形狀、位置、答案、回呼、拼圖數量、story steps、存檔、解鎖、戰鬥或 RNG。不實作另單 013 宮格連路。

修改前基線：`test-results/change-scopes/STORY-MAP-ART-015-before.json`。並行 014 差異另歸屬，不擴白名單掩蓋。

## 驗證與證據

產品單次跑兩 map 在 1440×900、1280×720、390×844 的圖片解碼、四片連續性、錯放、拖曳與鍵盤完成、離開/重試；必要時新增失敗/慢載入測試。檢視桌面/手機實圖，strict 檢查 runtime 和原稿，保存 bytes、尺寸、sha256、完整提示詞、參考與切片參數。修改 JS/CSS 後序列執行版本腳本與 83 引用檢查。

獨立工程 review 先核真實 diff、裁切與遮罩、載入生命週期及來源範圍；有問題集中補正。產品不重跑無關戰鬥/Skin/全部劇情；本次不宣稱那些功能重新驗收。

## 交付

撤離、觀測各一幅精繪原畫；城鎮、石壁通道／河道、梯田高地／災區與接應營地／採掘地形具有不同輪廓。兩次獨立生成及一次撤離圖路線定向修正，使用內建 imagegen；只保存兩張最終選定原稿。完整提示詞、原生工具路徑、修正來源及 SHA-256 在 [prompts.json](../../../storage/source-art/STORY-MAP-ART-015/prompts.json)。原 SVG 仍在原路徑，配對與劇情未改。

| 遊戲拼片 | 尺寸 | bytes |
| --- | --- | ---: |
| evac-0／街口 | 512×512 | 34,612 |
| evac-1／通道 | 512×512 | 40,912 |
| evac-2／高地 | 512×512 | 41,830 |
| evac-3／接應處 | 512×512 | 48,234 |
| archive-0／舊街區 | 512×512 | 37,704 |
| archive-1／河道記錄 | 512×512 | 44,366 |
| archive-2／災區地形 | 512×512 | 45,288 |
| archive-3／採掘標記 | 512×512 | 53,690 |

新增 runtime 共 **346,636 bytes（338.51 KiB）**，八片均透明 WebP、quality 87。兩份完全不透明的原稿各 1254×1254：撤離 3,328,067 bytes、觀測 3,809,730 bytes，共 **7,137,797 bytes（6.81 MiB）**。服务未採目標1024，不為尺寸重生；原稿不隨遊戲載入。 [Manifest](../../../assets/story/_records/map-puzzle-art.json) 保存每片原畫對照、遮罩、座標、尺寸與容量。strict runtime 8/8、source 2/2 通過。

實際修改清單：`story-puzzles.js`、`story-puzzles.css`、`Nightfall-Duel-Story.html`、`scripts/export-map-puzzles.py`、`tests/story-map-art.cjs`、`assets/story/_records/map-puzzle-art.json`、`assets/puzzles/README.md`、本文件與 WORKBOARD 本單；新增八份 `assets/story/props/map-art-v2/*.webp` 及上述原稿／提示詞紀錄。CSS 僅把載圖 guard 擴及地圖，HTML 僅內容版本；其他玩法與 source 無修改。

### 本次驗證

- 產品執行 `tests/story-map-art.cjs`：**9 組 PASS**，兩地圖 × 1440×900／1280×720／390×844，真圖解碼、連續格幾何抽樣、44px／可達性、錯放、提示、滑鼠拖曳、重置、鍵盤完成、缺图重試、慢載關閉重開，以及共用 loader 的五件武器組裝。試玩前後存檔內容一致。結果和59份來源／實際載入依賴指紋在 [results.json](../../../test-results/story-map-art-015/results.json)。
- 八片透明度與原畫座標色差抽樣通過；產品實際檢視兩幅原畫、兩幅桌面拼合圖、撤離手機開始／完成圖，地標可辨、圖面相接。截圖存 `test-results/story-map-art-015/`。像素與幾何抽樣不等於所有像素和所有狀態完全覆蓋。
- 第一輪缺圖測試未能到 error：已解碼圖像被瀏覽器重用，沒有真的送出可攔截的失敗請求。修正測試 fixture，缺圖與慢載分支另開全新隔離 context；沒有放寬原斷言或改 runtime，重跑完整9組後通過。首次六組圖像／尺寸結果保留 `attempt-1.json`，不將第一次整套記作PASS。
- 工程初審獨立3組 loader 競態與 export 座標／凹凸透明度／deterministic／拒絕透明 master 通過；詳細實跑與未驗事項在 [工程報告](../../../test-results/story-map-art-015-review.md)。
- `scripts/version-assets.py` 只更新故事HTML；`tests/asset-versions.py` **83/83 PASS**。容量及版本文字證據在同一測試資料夾。最終 [scope after](../../../test-results/change-scopes/STORY-MAP-ART-015-after.json) 為 WITHIN_FILE_SCOPE，未擴白名單。

限制：手機為 Chrome viewport 模擬，本次拖曳使用滑鼠及鍵盤，沒有重新測實體觸控／Safari。只測受影響拼圖載圖與呈現，未重跑完整故事、戰鬥、AI、Skin／舊存檔；相關規則／介面源碼無改，不冒稱這些已重新驗收。沒有重載使用者頁面或寫入其真實存檔。地圖仍是局部美術示意，路線不是導航引擎，013宮格新玩法不在本單。


最終結案：工程師已完成真實差異、10份圖檔、83版本及依賴核對，無已確認未解 P0／P1／P2。唯一P2為 archive 原始提示詞漏存，原美術已從实际呼叫前保存字串補回2397字元，並確認原呼叫無參考圖参数；未重畫圖片或改runtime。原9組測試結果完整保留，58份其他相依指紋不變，僅提示詞metadata變更；增量與59份最終指紋見 `test-results/story-map-art-015/metadata-final.json`，不為純紀錄補正重跑遊戲。
