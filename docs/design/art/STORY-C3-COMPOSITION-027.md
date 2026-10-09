# STORY-C3-COMPOSITION-027｜凜現身的站位修正

日期：2026-10-01。狀態：C3 構圖美術已經工程審查及產品驗收；範圍外並行整合待確認，未標整體完成。

## 需求與完成條件

使用者指出 C3「凜現身」第 3 段圖片對位奇怪。原圖將凜與兩名追兵並列且朝向同伴，敵我關係不清楚。此圖是單張情境插畫，並非透明人物疊圖偏移。

重排為左側後門追兵、中央轉身面向追兵的凜、右側受保護的同伴。保持既有角色、暗黑奇幻寫實材質、紫／古金及冷月光／暖燈光；修正視線、站位及空間連續性。保留凜右手繃帶、左手持武器，傷口未再次裂開；伊芙帶資料、格蘭護磷、朔守另一入口。僅表現攔截前的對峙，不增加故事結果。

## 唯一寫入者與精確範圍

- product：`src/js/story-art.js` 只改 `c3-shelter-ambush` 的 path；不改 ID、台詞、步驟、戰鬥、存檔、RNG 或共用裁切樣式。
- product：新增 `assets/story/c3-027/c3-shelter-ambush.webp`、`assets/story/c3-027/manifest.json`；單份原稿及生成紀錄存 `source-art/STORY-C3-COMPOSITION-027/`。原圖保留。
- product：本文件及 `docs/agents/WORKBOARD.md` 本工單列；證據存 `test-results/c3-composition-027/`。
- product 序列整合：`index.html`、`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html`、`art-gallery.html`、`frame-gallery.html`、`icon-gallery.html` 僅資源版本雜湊。
- engineer：唯讀審查，報告存 `test-results/c3-composition-027/engineering-review.md`，不修改 runtime。

基線：`test-results/change-scopes/STORY-C3-COMPOSITION-027-before.json`，修改前保存完整允許文字及全專案文字雜湊。無 Git；不覆寫其他工單改動，範圍外差異獨立列出。

## 介面、素材預算與驗收

`src/js/story-stage-assets.js` 以圖庫 ID 取圖，C3-step-03／04 共用同一插畫；保持此介面。桌面全視窗 cover，手機直向 contain。生成一張約 1536×864、不透明、16:9 原稿；runtime 1536×864 內且不放大，WebP，單張與總新增預算 600 KiB。來源上限 2048×1536／5 MiB。工具模式為內建 imagegen；完整 prompt、參照、實際尺寸／bytes／SHA-256 記於來源 JSON。

驗收唯一執行者 product：

- 素材與原稿 strict budget；實際縮放畫面檢查敵我站位、角色、道具、手部及 UI 遮擋。
- 以基線與當前 VM 圖庫／全閱讀步驟解析比較，僅允許新圖片路徑；來源依賴指紋不變。
- 隔離 Chrome 測試存檔與頁面：從 C3 閱讀控制到第 3 段，檢查第 4 段及回看；桌面 2048×995、手機 390×844 圖片成功解碼、無橫向溢出、閱讀不改保存的進度。
- `python3 scripts/version-assets.py`、`python3 tests/asset-versions.py`。
- 凍結後工程師檢查真實差異；產品視覺驗收後更新狀態。未測完整劇情／戰鬥及所有裝置。

## 交付紀錄

本工單實際改動：一張新構圖，以及 `src/js/story-art.js` 中一筆圖片 path。`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html` 各一筆 story-art 版本雜湊更新。新增 manifest、本工單與工作板列，未改其他程式。後續並行寫入也更新 `index.html` 及前兩個入口內 game／story-energy-ui／story-stage-assets／story-campaign／story-performance 版本，這些變更不列成本工單實作；三個 gallery 入口未變。

| 素材 | 實際尺寸 | bytes | 檢查 |
| --- | --- | --- | --- |
| `assets/story/c3-027/c3-shelter-ambush.webp` | 1535×864 | 274,232（267.80 KiB） | runtime strict 通過，1 張，總新增相同 |
| `source-art/STORY-C3-COMPOSITION-027/c3-shelter-ambush.png` | 1672×941 | 2,744,759（2.62 MiB） | source strict 通過，單份原稿 |

使用內建 imagegen 編輯，原圖與凜透明人物為參照。完整 prompt 存 [request.json](../../storage/source-art/STORY-C3-COMPOSITION-027/request.json)，來源／衍生設定、各檔 SHA-256 存 [generation.json](../../storage/source-art/STORY-C3-COMPOSITION-027/generation.json)；Sharp 保持比例縮至 1536×864 內、WebP quality 84／effort 6，未放大。新增圖片檔合計 3,018,991 bytes，不含小型紀錄／測試截圖；既有原稿與 runtime 保留。

產品本次實跑：

- `python3 scripts/check-art-budget.py --strict assets/story/c3-027/c3-shelter-ambush.webp`：1 檔 WITHIN_BUDGET。
- `python3 scripts/check-art-budget.py --strict --kind source source-art/STORY-C3-COMPOSITION-027/`：1 檔 WITHIN_BUDGET。
- `node test-results/c3-composition-027/verify.cjs`（使用 bundled Node 絕對路徑）：全圖庫／章節圖庫及 442 步解析對照，僅 `C3-step-03`、`C3-step-04` 圖片路徑改動，[結果](../../test-results/c3-composition-027/mapping-report.json)。其餘解析依賴與基線雜湊一致。
- `node test-results/c3-composition-027/browser.cjs`：隔離 Chrome、新 context 及合併章節完整測試存檔，透過公開 UI 到第 3 段→第 4 段戰鬥提示→上一段回看；2048×995、390×844 新圖成功解碼、無橫向溢出／頁面例外／重試提示，保存進度與線索不變，沒有啟動戰鬥。入口與所有載入 JS/CSS 前後雜湊一致。[報告](../../test-results/c3-composition-027/browser-report.json)。
- 首次瀏覽器測試 fixture 沿用較早的合併節點清單，缺 B2／C2 等標記，因此 C3 按鈕仍鎖定；失敗記錄保留 [fixture failure](../../test-results/c3-composition-027/browser-report-fixture-failure.json)。測試改用現行 `NDStoryMergedNodes` 建立完整標記，並先斷言 C3 已正常解鎖，重跑上述流程通過。沒有改解鎖邏輯或略過 disabled。
- `python3 scripts/version-assets.py`、`python3 tests/asset-versions.py`：98 筆本機 JS/CSS 引用符合內容版本。
- 首次範圍比對 `WITHIN_FILE_SCOPE`；完成瀏覽器檢查後偵測 `src/js/story-stage-assets.js`，接著 `src/js/game.js`、`src/js/story-energy-ui.js`、`src/css/story-energy-ui.css`，以及 `src/js/story-campaign.js`、`src/css/story-performance.css` 範圍外變更，最新版 [after](../../test-results/change-scopes/STORY-C3-COMPOSITION-027-after.json) 保留 `REVIEW_REQUIRED`。這些檔未列可寫範圍，基線僅保留雜湊，故不宣稱掌握完整歷史 diff 或作者。不還原、不擴原白名單。範圍外整合待該寫入者確認，未納入本工單完成結論。
- 共用場景依賴改動後，保存 `stage-integration-snapshot.js`，補跑 `verify-integration.cjs`：以同一現行依賴分別載入舊／新 story-art，442 步中仍僅 C3-step-03／04 受此路徑替換影響；[整合映射結果](../../test-results/c3-composition-027/integration-mapping-report.json)。這是隔離本次換圖效果的比較，不是宣稱新依賴與原始基線相同。首次執行因快照尚未產生而 ENOENT，補存實際當前依賴後再執行通過。
- 新場景依賴下已重跑上述獨立瀏覽器流程通過，之前那次報告保留為 `browser-report-before-external-stage.json`。外部來源仍可繼續改動；報告只保證所載明依賴雜湊下的 C3 畫面。

產品已檢視 [桌面回看](../../test-results/c3-composition-027/C3-step03-review-2048.png) 與 [手機回看](../../test-results/c3-composition-027/C3-step03-review-390.png)：兩名追兵在左、凜中央面向追兵、同伴在右，七人與繃帶／資料保留；桌面頭部不被標題或字幕遮住。手機沿用全圖 contain，人物較小，未宣稱手機近景細節可讀性。

未驗證／風險／後續依賴：未跑全劇情、戰鬥規則、手機橫向或所有裝置；本次未改版面，沿用既有直向留白。已開啟頁面需在章節安全保存後重新載入才會取得新 JS；未操作使用者頁面。此單只驗收 C3 構圖，較早工單的並行整合限制仍以各單為準。

工程師結論：[獨立審查](../../test-results/c3-composition-027/engineering-review.md) 確認一張 C3 構圖與單一路徑替換可交付，無本次相關 P0／P1／P2。工程師獨立解碼及核對來源、實際 UI、當前依賴下 442 步比較／2 步換圖、42 個瀏覽器依賴指紋及 98 筆版本引用；產品讀報告並完成最終視覺驗收。

交付界線：本張美術與 C3 使用點驗收通過；六個外部程式檔的作者／完整差異與整體並行整合仍待確認。工作板保留此依賴，不把它們標成已審或完成。

交付前又有外部閱讀 CSS／JS 更新，新增按鈕快捷鍵提示。產品已以同一 browser.cjs 再跑一次完整 C3 定向流程，PASS；最新 browser-report.json 與桌面／手機截圖為此版本，前次報告另存 browser-report-before-external-reading.json。新 UI 下人物頭部、凜的站位與繃帶未被覆蓋，98 筆資源版本再檢查通過。外部快捷鍵功能的完整行為不在此圖像工單驗收範圍。
