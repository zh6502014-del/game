# ART-RECORDER-028｜錄音裝置維修美術

2026-10-01，錄音裝置美術／UI 已經獨立工程審查與產品驗收；外部並行整合待確認，未標全專案完成。使用者要求優化截圖中的「共同主線・修復錄音裝置」遊戲美術。

## 成果與範圍

把平面格線＋三個空洞的版面改為古金／墨綠器械維修面板：實體機殼底圖、凹入金屬接槽、更大且一致的可互動 SVG 零件、接妥後明確的視覺狀態。桌面採工作面板與零件／進度側欄，窄畫面上下排列。保留既有三個零件的身分、輪廓、座標、接合答案、提示規則及所有完成／取消／回呼／存檔行為。

唯一寫入者：

- `recorder_ui`：`src/js/story-puzzles.js` 的 recorder paths、recorder 專用呈現 markup／dataset、沿用既有圖片載入守衛；`src/css/story-puzzles.css` 只新增 recorder 專用 selector；新增 `assets/puzzles/recorder-028/recorder-{0,1,2}.svg`。不得改其他題目的資料、幾何、文案、判定、拖曳、完成／回呼、RNG 或存檔。不改 HTML 或共用樣式檔。
- product：新 `assets/story/backgrounds/recorder-028.webp` 及單份原稿／生成紀錄 `source-art/ART-RECORDER-028/`；`assets/puzzles/recorder/manifest.json`；本文件和工作板本列。凍結後序列執行版本整合，允許六個根 HTML 入口只有資源版本值。
- engineer：凍結後唯讀審查，只寫 `test-results/recorder-art-028/engineering-review.md`。

可信基線：`test-results/change-scopes/ART-RECORDER-028-before.json`。未使用 Git，保留所有舊素材，不覆蓋其他進行中改動。若需要擴大範圍，先通知產品，不能自行改共用檔案。

## 素材契約與預算

底圖是一張不含文字、零件或答案輪廓的器械維修面板，使用既有錄音裝置 `assets/story/props/recorder.webp` 作造型與材質參照。寬高比約 1.65，正上方視角，中央 x=8–93%、y=25–72% 保留平整墨綠金屬面；按鈕／接槽由 SVG 疊加，不能烘進不可操作圖片。既有三接槽 x=12/39/66%、y=29%、w=23%、h=38% 全保留。

生成 1 張，目標約 1536×930；runtime 長邊 1280、另一邊約776，WebP ≤600 KiB，不放大。原稿 ≤2048×1536、5MiB。三個原生 SVG 零件各 ≤20KiB，viewBox 0 0 100 100，外輪廓精確沿用。總新增 runtime 上限 660KiB，素材原稿／紀錄另列實際容量。舊SVG保留，新SVG自帶材質漸層與細節，不用重生點陣圖取代精確輪廓。

## 必要驗收／唯一執行者

product 在隔離 Chrome、新資料及臨時 origin 檢查：桌面1440×900、手機390×844與320寬、橫向844×390、200%字級；面板與零件對齊、無水平溢出、控制項可用、焦點清楚。驗證 recorder 選取、錯配、拖放／靠近預覽、提示、重置、鍵盤完成、取消／關閉、完成回呼恰一次、練習不改進度。新增 recorder 圖片守衛時驗證失敗／重試與載入中關閉。抽樣其他三題防止共用CSS／模板退化，不聲稱全遊戲覆蓋。

新 runtime/source strict budget；版本腳本與98筆引用測試；真實 diff 人工審查；素材尺寸／bytes／SHA、依賴指紋、測試腳本與截圖保存 `test-results/recorder-art-028/`。不重載使用者頁面，不更動真實存檔。

## 交付

實際改動：

- `src/js/story-puzzles.js`：三個 recorder SVG 路徑換版；專屬凹槽與線路／指示燈 markup；recorder dialog dataset；recorder 沿用既有圖片解碼、錯誤與重試守衛；未選取就點槽時以「零件區」取代不符桌面側欄的「下方圖塊」。產品核定最後一項提示修正，其他題目文案不變。
- `src/css/story-puzzles.css`：末尾新增 recorder 專屬樣式，不修改原樣式；雙欄工作區、零件卡、金屬接槽及已接通燈。手機直向上下排，低高度橫向採頂端對齊的緊湊側欄；保留44px控制、換行與捲動。
- 新增機身底圖、三個SVG及 manifest；所有舊圖保留。文字／狀態／可操作接槽均未烘進底圖。
- 產品執行版本整合，`Nightfall-Duel-Story.html` 更新 story-puzzles CSS/JS 版本。基線以後其他寫入者也更動三個根入口的外部依賴版本，不將該程式改動列入本工單。

| 素材 | 實際尺寸 | bytes |
| --- | --- | --- |
| `assets/story/backgrounds/recorder-028.webp` | 1280×775 | 236,908 |
| `assets/puzzles/recorder-028/recorder-0.svg` | viewBox 0 0 100 100 | 2,516 |
| `assets/puzzles/recorder-028/recorder-1.svg` | viewBox 0 0 100 100 | 2,914 |
| `assets/puzzles/recorder-028/recorder-2.svg` | viewBox 0 0 100 100 | 2,899 |
| `source-art/ART-RECORDER-028/recorder-panel.png` | 1612×976 | 2,918,345 |

新增 runtime 四檔合計 **245,237 bytes（239.49 KiB）**，低於660KiB工單上限；單份點陣原稿2.78MiB，圖片檔總新增3,163,582bytes，不含紀錄／測試截圖。SVG為原生向量編輯，既有SVG即保留的來源，沒有另生成點陣零件。底圖使用內建 imagegen、參照既有錄音裝置；[完整提示詞](../../storage/source-art/ART-RECORDER-028/request.json)、[尺寸／轉檔／雜湊紀錄](../../storage/source-art/ART-RECORDER-028/generation.json)、[runtime manifest](../../assets/puzzles/recorder/manifest.json)。Sharp等比inside縮到1280×776內、quality84／effort6，不放大。

## 驗收證據

產品本次實跑（Node使用bundled絕對路徑）：

- `python3 scripts/check-art-budget.py --strict assets/puzzles/recorder-028/ assets/story/backgrounds/recorder-028.webp`：4檔 WITHIN_BUDGET；`--strict --kind source source-art/ART-RECORDER-028/`：1檔通過。
- `shared-feedback.cjs`：沿用現有 `tests/story-puzzle-feedback.cjs`，只調整模組require、工作目錄、隔離輸出位置，原測試雜湊與改動理由見 [provenance](../../test-results/recorder-art-028/shared-feedback-provenance.json)。四題共16件用途／回饋、錯配、實際滑鼠拖放、重置、鍵盤完成、關閉不完成／回呼恰一次、練習不改存檔；1440／900／700／390／320寬迴圈針對既有gun題，recorder另驗390寬200%文字，均通過。[結果](../../test-results/recorder-art-028/shared-feedback/story-puzzle-feedback-results.json)。recorder五尺寸另見下一項；未宣稱四題各跑遍所有尺寸，非全遊戲覆蓋。
- `visual-loading.cjs`：1440×900、1024×768、390×844、320×844、844×390；接槽／零件≥44px、無水平溢出、hint前不顯答案標籤；選取、1/3及3/3狀態與指示燈；原生Chrome觸控拖放；SVG載入失敗禁用6個接合控制、retry恢復；載入中關閉後重新開啟；底圖404時原生接槽仍能操作；存檔不變、無pageerror。最終通過那次前後42個入口／JS／CSS依賴指紋完全相同。[報告](../../test-results/recorder-art-028/visual-loading-report.json)。
- 初次錯誤注入在同頁已解碼圖片上未觸發錯誤狀態，屬測試設定問題，保存 [首次失敗](../../test-results/recorder-art-028/visual-loading-first-failure.json)。改用新context，並斷言確實攔截新資源請求；未放寬錯誤／禁用／retry斷言。第二次執行所有UI案例通過，但外部game與入口在途中改變，依賴斷言正確失敗，保存 [並行失敗](../../test-results/recorder-art-028/visual-loading-concurrent-failure.json)；再跑同一測試通過，不把失敗寫成通過。
- 產品視驗發現低高度橫向面板居中導致頂部留白，指定recorder_ui只補 scoped media；`visual-loading.cjs --landscape-only` 在844／660／551×390重新確認頂端對齊、44px控制，捲到工作區後每個寬度都實際拖入3件，起點與目標同時可見、存檔不變，[橫向結果](../../test-results/recorder-art-028/landscape-report.json)。前一完整測試的原始橫向截圖留作修正前證據，以新 `recorder-landscape-*-ready.png` 為準。JS與素材未變，新media不匹配原200%文字／桌面／直向測試視窗，故沿用其有效證據。
- [差異稽核](../../test-results/recorder-art-028/implementation-audit.json)：所有題目 shape／x／y／w／h／id／label完全不變，僅三個recorder path替換；loadImages函式、選取／接合／提示／拖曳輔助、pointer／keydown／close回呼全文與基線相同；CSS只附加。manifest與檔案hash／bytes一致。
- `python3 scripts/version-assets.py`、`python3 tests/asset-versions.py`：98筆本機JS/CSS引用符合版本；橫向CSS補正後再同步及通過。

產品已查看 [桌面](../../test-results/recorder-art-028/recorder-ready-1440.png)、[手機直向](../../test-results/recorder-art-028/recorder-ready-390.png)、[橫向](../../test-results/recorder-art-028/recorder-landscape-844-ready.png)、[完成](../../test-results/recorder-art-028/recorder-complete-1440.png) 與200%文字實際畫面：器械與接槽對齊、選中／填入／已就位清楚；放大字級時保留自然換行和對話框捲動，不縮小文字。

## 限制與後續依賴

[after scope](../../test-results/change-scopes/ART-RECORDER-028-after.json) 保留 REVIEW_REQUIRED：基線以後的 `src/js/game.js`、`src/js/story-campaign.js`、`src/js/story-energy-engine.js`、`story-energy-ui.js/css` 及 `tmp/pdfs/portfolio/` 下的外部暫存 JSON／Python 檔（完整清單以 after 報告的 outside_scope 為準） 為本工單主責未寫入的外部差異；相關入口版本也隨外部變更。未追認作者、不擴白名單、不還原；這些檔的完整語意與整合待原寫入者確認。本次只對錄音裝置美術與所列相關互動驗收，不標全專案完成。

未驗證實體手機、Safari／Firefox、所有尺寸、200%瀏覽器整頁zoom、完整戰鬥與故事進度回歸。200%案例是文字放大。使用者正在進行的對局／頁面未重載；完成並保存章節後重新整理才取得新版本。

工程師已獨立核對真實 diff、原 SVG 精確輪廓、素材來源／解碼與容量、程式行為邊界、測試品質及實際桌面／直向／橫向／200%字級截圖，[審查報告](../../test-results/recorder-art-028/engineering-review.md) 結論為本工單限定可交付，無相關 P0／P1／P2。產品讀報告及最終畫面後驗收通過，程式／素材保持凍結。

最終相依限制：工程師第二次核對時，`Nightfall-Duel-Story.html`／`src/js/story-campaign.js` 又有報告之後的外部修改。本工單 JS／CSS／素材仍與通過版本雜湊完全相同，98筆版本引用仍通過；瀏覽器測試結論限各報告明列的相依版本，不冒稱最新全部外部整合已驗證。外部修改來源／語意及整合仍待確認，工作板保留此依賴。最新範圍外檔案清單以 after JSON 為準，工程報告列出的路徑反映其檢查時點。
