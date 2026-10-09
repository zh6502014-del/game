# ART-ARCHIVE-UI-053｜文件庫尋物介面

2026-10-04。使用者提供「行政文件庫・乙列第四櫃」截圖並要求優化美術 UI。產品主責 root，美術實作 archive_ui，工程師凍結後唯讀審查。

## 可見成果與完成條件

- 保持古金／深綠風格，明顯改善抽屜卷宗層次及標籤可讀性。
- 桌面場景與閱讀側欄並排，詳情不遮場景；手機直向及橫向均可操作，重要文字與按鈕不裁切。
- 目標、尋找狀態、查看內容與收取動作形成清楚順序，移除檔案庫畫面的重複資訊與過大通用紙張圖示。
- 保持真實標籤、尋找／提示／查看／收取／返回／重讀／繼續／關閉契約，保留键盤與觸控可用性；不把未查看的目標直接收取。

## 單一寫入者與精確範圍

- archive_ui：`src/css/story-search.css` 以 archive-vault 範圍為主的樣式；`src/js/story-search.js` 的文件庫呈現建構、paintWorld/paintLists/paintDetail、相關狀態呈現和焦點配合；`src/js/story-search-assets.js` 僅 archive-vault 的呈現資料與座標，不改 target IDs／targets 關係或其他場景。
- archive_ui：新增 `tests/archive-search-ui.cjs`，只使用獨立頁面與測試資料；證據存 `test-results/ART-ARCHIVE-UI-053/`。可寫本工單「實作交付」區段。
- product：本工單其他段落、`docs/agents/WORKBOARD.md` 本列，最後序列執行 `scripts/version-assets.py` 更新 `Nightfall-Duel-Story.html` 資源版本；禁止其他實作者寫 HTML。
- engineer：只寫 `docs/design/art/ART-ARCHIVE-UI-053-review.md` 與審查證據。
- 優先沿用現有本地素材、CSS／原生 SVG；若確實需新生成素材，先回產品指定檔案及預算。

## 保護範圍與依賴

不得修改 AI、RNG、戰鬥、章節文案、解鎖、存檔、收取判定與回呼次序。一般尋物場景維持原互動與呈現；共用函式的必要改動須回歸非文件庫場景。不重新載入使用者正在進行的遊戲。

現有地圖：`python3 scripts/workflow.py map --area story-search`。實際共用 CSS 在 story-search.css 後還會載入 visual-system.css、png-frames.css、story-frames.css，驗收頁須包含正式樣式次序。

## 基線與驗收

- 修改前：`test-results/change-scopes/ART-ARCHIVE-UI-053-before.json`，完整文字差異由工程師核對。建立時現有 HTML 資源版本均一致。
- archive_ui 執行定向測試：桌面1440×900、截圖接近比例1920×960、手機390×844及844×390；初始／錯件號／正確卷宗露出／查看／收取／重讀／繼續；提示、Tab/Enter/Esc、縮放文字、reduced-motion、載入失敗重試。確認互動仍經真實公開 controls，無真實存檔寫入。
- 若觸及共用呈現函式，執行現有 `tests/story-interact-search.cjs` 對應回歸；不因舊工單敘事變動機械跑全故事。
- product 檢視實際截圖；engineer 獨立審查真實 diff、測試品質及相關風險。相關 P0/P1/P2 補正複審後才完成。
- product 最後執行 `python3 scripts/version-assets.py`、`python3 tests/asset-versions.py` 並保存結果。

## 狀態

進行中。先完成檔案庫 UI 優化；先前21張美術生成批次保留已有原稿與紀錄，尚未整批驗收。

## 實作交付

美術/UI 實作已凍結，待工程師審查與產品驗收，尚未標為完成。

- `src/css/story-search.css`：限定 `archive-vault` 的兩欄閱讀桌、古金／暗綠色階、紙色摘錄面板、扇形卷宗與局部細節；桌面閱讀不再遮場景，手機直向採上下流式排版、橫向維持雙欄。小螢幕提供 44px 以上件號索引操作，內容超過視窗時可垂直捲動；未壓縮字級塞入一屏。
- `src/js/story-search.js`：文件庫專用索引／閱讀呈現、移除重複縮圖及收取匣列、返回及查看的焦點配合。其他尋物仍用原詳情面板。公開 reveal/item/collect/found/continue 契約、收取 guard、回呼及存檔責任維持原樣。
- `src/js/story-search-assets.js`：僅文件庫的卷宗坐標／角度／抽出位置與引導呈現；件號、target IDs、targets 關係、note、線索內容未改。沿用全部素材，新增 runtime 圖片 0 張／0 bytes，不需圖片預算例外。
- `tests/archive-search-ui.cjs`：以正式 HTML 擷取完整 CSS 順序，但只載入隔離 public search API 及測試文案；不載 campaign、不寫真實存檔。四尺寸 1440×900、1920×960、390×844、844×390；測初始、錯件號、提示、逐一抽出全部七份卷宗、真實桌面標籤命中、觸控、鍵盤、查看／返回／收取／重讀／繼續／Esc、界線及側欄不遮場景、reduced-motion、圖片失敗／重試、手機介面文字 200% 放大；6 組案例通過。
- 共用 `tests/story-interact-search.cjs`：完整 10 組案例通過，涵蓋 research-files、gun-parts、hideout-recorder、cover guards、收取與繼續分離、焦點、回訪、缺圖重試與取消載入。

證據：`test-results/ART-ARCHIVE-UI-053/results.json`（含 runtime／browser／正式樣式順序／來源雜湊）、`before-results.json` 與 `before-*`／`after-*` 截圖；共用回歸 `test-results/story-interact-012-search/results.json`。建議視覺檢視 `after-1440x900-reading.png`、`after-390x844-initial.png`、`after-390x844-reading.png`、`after-844x390-reading.png`。錯誤日誌 `failure.txt` 是早期測試 locator 對隱藏重讀按鈕的重複命中，已移除文件庫隱藏重複列表並通過最終測試，不是最終失敗。

命令：`NODE_PATH=/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules /Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node tests/archive-search-ui.cjs`；共用回歸換成 `tests/story-interact-search.cjs`。基線截圖以相同測試 `--before` 於 UI 修改前執行。測試使用本機隔離 HTTP 及 Headless Chrome，因 sandbox 禁止 listen 而以核准 escalation 執行。

未驗證：真實章節存檔端到端、Safari／Firefox、實體手機、螢幕閱讀器語音輸出、所有任意視窗尺寸及所有長篇文案。200% 是固定場景座標不變的介面文字放大，非瀏覽器全頁縮放。手機／低高度閱讀時採自然捲動，查看會將收取按鈕帶入視窗；關閉及標題可往上捲回。版本腳本與 HTML 引用由產品最後序列整合；工程師尚待審查。

