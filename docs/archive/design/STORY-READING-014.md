# STORY-READING-014｜完整交談與事件閱讀分組

2026-09-25，完成；獨立工程審查及產品驗收通過。使用者實玩回饋：對話過碎、還沒讀進故事就一直按下一步，要求故事模式繼續完成。由本產品承接，其他產品任務已交接，不需使用者重新派工。

## 可見成果與責任

將同一段完整交談或事件分組閱讀；保留267個原step ID、原順序、全文及每人署名。換人說一句短答不再必然換頁。重大轉折保留停頓；inspect/search/puzzle/battle/choice/complete都是硬邊界，不能因聚合而代替使用者操作。action預設保留，僅劇情與工程核對的純觀察白名單可作閱讀呈現。

- art_ui_card_back唯一runtime寫入：`story-campaign.js`的分組、cursor/frontier閱讀導航、remember、stage/paintImage/preload；`story-campaign-data.js`只追加閱讀分組metadata，不改任何原steps；`story-performance.css`分組字幕樣式；`tests/story-reading.cjs`新針對性測試。
- 劇情唯一文稿：`STORY-READING-014-narrative.md`，28節點分組、29個action及重大轉折逐項核對。
- 美術/UI架構稿：`STORY-READING-014-ui-plan.md`。
- 產品唯一寫入：本文件、本工作板014區段；`tests/story-performance.cjs`將原每句+1期望改成經獨立核對的閱讀組邊界，保留全部互動/回看/載入/完成斷言；`tests/story-storage.cjs`僅必要定位器適配，不放寬存檔行為。
- 工程師只讀來源與diff，唯一報告 `test-results/story-reading-014-review.md`。

基線：`test-results/change-scopes/STORY-READING-014-before.json`。012另持有search/puzzles及其測試/helper，014不得寫這些檔案。012已同意campaign/data/performance並行，只要三節點的原ID、硬互動邊界及回呼時點不變；HTML仍由012產品唯一整合。兩方來源凍結後安排正式整合測試一次，避免中間版本重跑。不加入013宮格玩法。

## 閱讀與狀態契約

- cursor/frontier仍用原步驟索引，分別指目前／最遠已到達閱讀單位的起始位置；group只包含連續原ID。
- 下一段跳至目前組尾之後；上一段回前一組起點。互動一律單獨成組，因此cursor===frontier守衛維持；回看不執行動作、點燈、戰鬥或獎勵。
- 逐條將本組實際呈現全文與原署名寫入已讀紀錄，去重仍用原ID；不把七人台詞串成一個人的發言。
- 首版每組使用經核對的安全首圖；不靠自動播放、滑動換圖或觀察器推進。多說話者組不將單一立繪標成整段唯一發言者。
- 010的單句薄字幕與聲源標示保留；多句可自然增高。手機完整閱讀同一交談，長文允許捲動，不縮字或塞整章一頁。
- 正式收錄與存檔、戰鬥、RNG、獎勵、searchFound、C9點燈/接線/錄音順序保持。

## 驗收與唯一執行者

1. 美術/UI：先短smoke，後`tests/story-reading.cjs`核對S1/A2閱讀點擊前後、全分組保文/順序、硬邊界、transcript去重、前進/回看、44px及1440/900/700/390/320與200%文字，提供實圖與hash。新組的閱讀與互動點擊分開計數。
2. 產品：012與014都freeze後，`ACTUAL_ART=1 tests/story-performance.cjs`一次正式28節點流程；`tests/story-storage.cjs`保存拒寫/恢復、分支保存與舊檔；定位器或測試協議改動先分類，不用刪斷言換綠燈。
3. 工程師：真實差異、允許範圍、狀態保護與測試品質審查，獨立抽驗最重要的回看/未來內容/重複回呼風險；必要補正與複審。
4. 012產品最後序列版本整合；本產品核對版本結果及視覺/證據後交付。其他工單差異逐項歸屬，不擴白名單。

所有測試用獨立context與測試資料，不重載使用者分頁。此工單不宣稱已完成面對面新立繪、宮格或新互動機制，也不重測未改動戰鬥平衡。

## 凍結實作與驗收紀錄

014來源於2026-09-25 01:33:21 +08凍結。28節點的267原步全文、ID、署名、順序及型別保留；在data尾端追加78閱讀組。27個行動和53個硬互動停頓仍獨立，共158個呈現單位。只有`P3-step-04`與`C2-step-03`兩個已核定觀察動作轉為閱讀。S1純閱讀9→2頁，A2 7→4頁；戰鬥內操作與收錄不計入閱讀減少數。

每組固定首個安全場景，每段明示說話者；父親錄音不生成現場父親。多句不將任何單一人物高亮成整段發言人。未知／無效分組保守回到原單步；回看逐組移動但不重新執行互動，紀錄按原ID去重。`performanceState()`在既有欄位外**追加只讀拷貝`reading`**，並非公開資料完全零變更；既有cursor/frontier仍是原索引。

實際修改：`story-campaign.js`、`story-campaign-data.js`、`story-performance.css`、新`tests/story-reading.cjs`、`tests/story-performance.cjs`、`tests/story-storage.cjs`，以及本工單／敘事／UI方案／工作板文件。012主責另依`STORY-READING-014-HELPER-before.json`修改helper的閱讀分支，工程師核對兩白名單及硬互動拒絕。沒有新增圖片。

| 驗證／唯一執行者 | 實際結果與證據 |
| --- | --- |
| 新閱讀／UI | 40個排版案例：1440／900／700／390／320px × 100／200%文字 × S1／C7／C9／C2。全部原ID與核定表對照、逐句署名／全文、S1紀錄與commit、A2取消敗北及事故／死亡停頓、E2立繪移除、安全首圖失敗重試、未知ID fallback均PASS。[報告](../../../test-results/story-reading/report.json) |
| 010單句相容／UI | 兩尺寸×兩字級，32案例PASS，包含旁白／畫外音／錄音、特殊字元、單句角色標記、互動與回看。[報告](../../../test-results/story-dialogue-smoke/report.json) |
| 全故事／產品 | `ACTUAL_ART=1 tests/story-performance.cjs`：28節點267原步以158核定單位完整走過；四拼圖取消／成功、四戰取消／失敗／成功、只讀回看、stale click、圖像重試PASS。每個**呈現單位首圖**實際解碼，不宣稱267個舊鏡位都逐一播放。[日誌](../../../test-results/story-reading-014-performance.log) |
| 存檔／產品 | 舊檔遷移、壞檔、無效前置、拒寫與恢復、C7另選／C8回應、一次真實戰鬥回合與離開PASS。[最終日誌](../../../test-results/story-reading-014-storage-retry.log) |
| 012整合／012產品 | E2／E3／C9六情境PASS，涵蓋遮擋翻找、收取、拼圖取消、勝敗返回、C9點燈／錄音與儲存失敗。[結果](../../../test-results/story-search.json) |
| 資源版本／012產品 | 最後執行`version-assets.py`及`asset-versions.py`，83筆本機JS/CSS引用PASS，僅故事HTML版本引用改動。[012最終指紋](../../../test-results/story-interact-012-final.json) |

存檔測試初輪在最後離開戰鬥時，舊`data-seb-action=leave`定位器同時命中導覽鈕與隱藏橫向提示鈕，屬測試定位歧義。產品只改為可讀名稱精確「離開」，保留所有行為斷言，重跑通過；[初輪失敗](../../../test-results/story-reading-014-storage.log)保留，不冒稱首輪全綠。UI字級測試另先等待實際36px套用後量測，沒有降低字級斷言。

產品人工看過[桌面](../../../test-results/story-reading/S1-1440.png)、[手機](../../../test-results/story-reading/S1-390.png)、[320px／200%](../../../test-results/story-reading/S1-320-text200.png)與[C9錄音](../../../test-results/story-reading/C9-390.png)。多句頁在手機自然向下捲動、逐段署名、不裁字；首圖與人物可辨。這些排版截圖使用保留原ID／原文的單組測試資料，頁碼是測試局部值，完整進程另由全故事測試驗證。

[整合證據與依賴指紋](../../../test-results/story-reading-014-evidence.json)列命令、Node24.19.0／Playwright1.62.1／Chrome154.0.8037.58、來源／素材／測試雜湊。工程審查：[獨立報告](../../../test-results/story-reading-014-review.md)。

最終工程與產品均PASS；187／187指紋及012的32／32最終相依吻合。工程師獨立驗證C7逐句署名／無未來紀錄、回看不重做分支、C8回應、API拷貝、重複及跨場次戰鬥回呼，沒有未解P0／P1／P2或未分類範圍異常。後續STORY-MAP-ART-015另做地圖美術，來源與HTML所有權於本票結案後釋出；本票證據限定此處凍結版本，不冒稱已驗收015新圖。

## 並行範圍人工歸屬

[after](../../../test-results/change-scopes/STORY-READING-014-after.json)仍為`REVIEW_REQUIRED`（exit1），不是未辨識改碼；不擴大原白名單。下列九項是012產品已書面交接的同時工單，014產品沒有還原或接管。

| 清單外檔案 | 單一主責／依據 |
| --- | --- |
| `Nightfall-Duel-Story.html` | 012產品持有入口，完成兩單最後資源版本整合 |
| `assets/story/search-interact-manifest.json` | 012美術，三張遮擋素材與生成／容量紀錄 |
| `docs/design/STORY-INTERACT-012.md` | 012產品工單與驗收 |
| `story-search-assets.js`、`story-search.js`、`story-search.css` | 012尋物主責；CSS末段另為012產品stage追加基線的木板斜切呈現 |
| `story-stage-assets.js` | 012-STAGE追加基線，尚未發現物品在舞台也保持遮擋，不提前洩露 |
| `tests/story-search.cjs` | 012產品整合測試；最後僅展開操作說明後保留原因果文字斷言 |
| `tests/story-test-helpers.cjs` | 012尋物操作helper；014閱讀相容增量另有HELPER基線，本單工程師審查 |

HELPER追加基線的[最新after](../../../test-results/change-scopes/STORY-READING-014-HELPER-after.json)有14項差異，其中13項清單外，皆為上述012差異或本票014後續來源／測試／文件；工程師已逐項核對，仍保留exit1。

限制：Chrome尺寸／觸控模擬不是實體手機與Safari；未聽測音效。全故事戰鬥返回用terminal fixture，存檔測試只補一個真實回合，不宣稱戰鬥平衡全覆蓋。原畫與新面對面構圖未改；013宮格仍為設計方案。新閱讀頁更長是完整交談的取捨，允許捲動而不縮字。HTML最後只同步cache key，受測runtime位元組保持凍結。
