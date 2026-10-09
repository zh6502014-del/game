# PROJECT-CLEANUP-062｜GitHub 上傳前整理

日期：2026-10-07。需求：清楚分類專案，不用的內容集中存放，準備上傳 GitHub。

## 範圍與分工

- 產品：本工單、README.md、AGENTS.md 及 docs/ 內路徑文件、.gitignore、.gitattributes、storage/README.md、storage/moved-files.json；移動 source-art/ → storage/source-art/、backups/ → storage/backups/、Claude outputs/ → storage/previews/、_tmp/ → storage/temp/、_to_delete/ → storage/unused/。檢查無執行期引用後才封存額外素材；不刪除內容。追加已確認範圍：assets/audio/dark-051/、assets/frames/v1/originals/、assets/frames/v1/slices/，已撤回的 combat-visuals.css → storage/unused-code/，以及系統 .DS_Store；assets/ 內 JSON 僅修正原稿來源位置。
- 工程實作唯一寫入者：根目錄所有 JS 移至 src/js/、CSS 移至 src/css/，六個根 HTML 的檔案引用；scripts/、tests/、config/ 僅修改對應路徑與必要工具支援。依賴備份的測試改用 tests/fixtures/ 明列所需檔案，讓 GitHub checkout 可驗證。生成工具原稿路徑改到 storage/source-art/。保留遊戲 HTML URL、localStorage key、邏輯及素材相對於頁面的 URL。CSS url() 改為相對新 CSS 位置。整合者為工程實作者，最後更新版本戳記。
- 之後另喚起工程師唯讀審查，僅寫 docs/design/project/PROJECT-CLEANUP-062-review.md。
- 不上傳、不建立遠端、不刪原稿，不變更平衡、故事、AI、RNG、存檔或 UI。素材不能單憑未搜尋到檔名就判定無用，動態拼接仍需核對。

## 基線與驗收

無 Git；修改前全檔 SHA-256/bytes 在 test-results/project-cleanup/before-manifest.json；有效文字檔原文在 test-results/project-cleanup/before/。基線先於本工單建立，不代表歷史改動作者可辨認。

驗收：逐檔搬移雜湊比對、真實 diff、HTML/CSS 本機引用、JS 語法、資源版本、工作流／容量／範圍工具自身測試、受影響純 Node 測試、隔離瀏覽器首頁／故事／決鬥載入。以暫存 Git index 驗證忽略規則及預計上傳清單；不動使用者存檔。

## 狀態

本次整理驗收通過；工程師未發現本次相關 P0／P1／P2。既有測試失敗及未驗證內容保留如下，不列為通過。


## 交付成果

- 現用 50 份 JS／CSS 分別在 `src/js/`、`src/css/`；六個 HTML 維持原網址。JS 原文不變，CSS 僅調整素材相對路徑，HTML 僅路徑與資源版本。已撤回 `combat-visuals.css` 另存 `storage/unused-code/`。
- `storage/` 共接收 903 份既有檔案，979,726,487 bytes（約 934.34 MiB）；逐份 SHA-256 與整理前相符。原稿、備份、未採用音效、預覽、暫存、系統 metadata 及舊樣式均未刪除。全部 1,785 份原始檔案在新位置或原位置仍可找到。
- `.gitignore`、`.gitattributes`、README.md 建立上傳範圍及操作指引。預計 Git 收錄 799 份檔案、約 49 MiB，storage 僅含說明及搬移索引，無 test-results 或 node_modules；最大檔約 487 KiB。未初始化 Git、commit 或上傳遠端。
- scripts／tests／config 依新結構更新；9 份必要歷史 fixtures 共 413,172 bytes 隨 Git 收錄，內容與歷史備份完全一致。source 原稿依賴維持本機。
- AGENTS.md、docs 中現行入口及相關連結、assets 的原稿來源 JSON metadata 更新；檔案路徑及內容差異見 `test-results/project-cleanup/preservation-final.json`、`implementation-files.json`，新增檔案總清單見 `upload-files.txt`。歷史證據與備份原文不改寫。

## 驗收證據

證據根目錄：`test-results/project-cleanup/`（本機保留，不上傳）。

| 檢查 | 結果／證據 |
| --- | --- |
| 原檔保存與封存內容 | 1,785 原檔零遺失，903 封存零內容變更；`preservation-final.json` |
| 程式語意範圍 | 工程師逐份比較 57 JS/CSS/HTML（含最後封存1CSS），去除路徑與版本後相同；[獨立審查](PROJECT-CLEANUP-062-review.md) |
| 本機 HTML/CSS 引用 | 287 筆存在；`static-links.json`、`local-references.json` |
| 版本與語法 | `python3 tests/asset-versions.py`：114 筆；82 JS/CJS 語法檢查通過；`asset-versions.log`、`syntax.json` |
| 工具測試 | workflow 16、change-scope 8、art-budget 9，共 33 案例通過；同名 `.log` |
| 戰鬥引擎 | `tests/story-energy-engine.cjs`：72/72；`story-energy-engine.log` |
| 瀏覽器 | 全新 Chrome context 六入口載入及自由決鬥 start，無 pageerror／本機 HTTP 錯誤；`browser-report.json` 及六張截圖。產品檢視首頁、故事總覽、戰鬥畫面 |
| 文件連結 | 沒有新增的缺失相對連結；`document-links.json`（不代表全部歷史連結原本有效） |
| Git 清單 | 暫存 bare Git 配合本專案 work-tree 檢查 exclude-standard，未於專案建立 .git；`upload-report.json`、`upload-files.txt` |

CSS 路徑搬移後已由工程實作者執行 `scripts/version-assets.py`；最後僅封存未載入且 bytes 未變的 combat-visuals.css，不需再次變更資源版本。無新生成或替換圖片，無新增 runtime 素材容量。

## 未驗證、既有失敗與後續依賴

- `story-battle`、`skin-store`、`story-chapter-art` 的舊斷言失敗，已在 before 原文重現，log 保留；本次未改規則讓測試過關。
- `story-stage-assets.py` 初次缺 Pillow；改用 bundled Python 後，現行與 before 都在 resolve(image.title) 遇 undefined。此測試仍失敗，並非已通過或僅環境限制。
- `story-energy-frames` 缺可信 `STORY-BATTLE-UI-001-before.json`；`story-complete`、`story-second-bell` 仍有原先不存在的舊模組依賴。部分測試有既有本機 Node／Playwright／Chrome／伺服器要求。`story-layers-art` 初次未能解析 Playwright，未重跑完整套件。
- Chrome 入口檢查使用獨立暫存資料並阻擋外部音訊來源；未改真實 localStorage 或重載使用者頁面。未遍歷全章節、所有戰鬥分支、手機尺寸或聽測外部音訊。圖片檢查為載入頁面抽樣，不宣稱全部動態素材覆蓋。
- `assets/` 保留現行映射及生成器有用途的素材，不因字串搜尋未命中就刪動態資源。source-art 及歷史生成工具不隨 Git clone 提供原稿；原稿另存備份，歷史套件修復需後續獨立工單。
- 整理前不存在 Git，不能從本次檔案基線宣稱历史未越權。GitHub 遠端建立與 push 由使用者下一步執行，README 已提供指令。
