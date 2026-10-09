# ART-SCENE-052｜武器與頭戴裝置修正

日期：2026-10-03。承接使用者兩張截圖：C8冥淵遭遇武器錯誤、G1頭戴裝置不易辨識。

唯一美術實作 art_scenes：只寫 `assets/story/corrections-052/`、`source-art/ART-SCENE-052/`、`test-results/art-scene-052/` 與本工單素材交付欄。產品唯一程式整合：`src/js/story-art.js` 僅 c9-abyss-emergence 路徑，`src/js/story-stage-assets.js` 僅 G1 royalCutaway 的頭戴裝置圖；不更動步驟、文字、角色身份、遊戲邏輯。基線 `test-results/change-scopes/ART-SCENE-052-before.json`。HTML由產品統一版本。

生成2張：C9武器修正、G1路易斯實際戴上暮晶頭戴裝置；沿用角色與材質風格，不新增劇情。朔單手長劍/刀、凜左短刃與右手完整包紮、格蘭盾、伊芙暮晶銃、磷受護無武器。先核對原畫。G1需明確可穿戴人頭尺度、沿額頭/太陽穴與後腦固定、導線連接控制台，路易斯頭上戴著；不畫成腰帶、項圈、獨立大圓環。

全幅約16:9（桌面最大2048×995，手機沿用既有裁切），目標1536×864，WebP各≤600KiB，2張總≤1200KiB；原稿各≤5MiB。保留單份原稿、完整prompt/ref/sha/實際尺寸bytes/轉檔設定，內建imagegen；strict預算驗證、人工檢視。產品檢查解析映射、桌面手機讀圖，不觸碰真實存檔。

狀態：進行中；與 AUDIO-DARK-051 並行、檔案分離，最終工程師審查整合路徑。

## 素材交付（art_scenes，2026-10-03）

內建 `image_gen.imagegen` 共 3 次：C8 初稿 1 次、定點內容補正 1 次，G1 1 次；最終選用 2 張。C8 初稿仍由包紮手握刃、可辨敵人僅 4 位，已記錄原因並補正；未把未選候選複製進專案。原有素材未覆寫。

| 素材 | 最終 runtime | runtime 尺寸／bytes | 單份原稿尺寸／bytes |
| --- | --- | --- | --- |
| 武器修正 | `assets/story/corrections-052/c9-abyss-emergence.webp` | 1535×864／290,050 | 1672×941／2,771,971 |
| 路易斯實戴頭戴裝置 | `assets/story/corrections-052/g1-headset-worn.webp` | 1535×864／199,520 | 1672×941／2,309,267 |

Runtime 合計 **489,570 bytes（478.10 KiB）**；兩份原稿合計 **5,081,238 bytes（4.85 MiB）**。原稿位於 `source-art/ART-SCENE-052/`，完整提示詞與兩次 C8 請求／一次 G1 請求各存 JSON；`assets/story/corrections-052/manifest.json` 保存選用稿及所有參考路徑、尺寸、bytes、SHA-256 與生成結果路徑。WebP 由 Sharp 等比例 `inside 1536×864`、不放大、quality 84、effort 6 轉出，未以程式改畫內容。轉檔腳本為 `test-results/art-scene-052/derive.cjs`。

`python3 scripts/check-art-budget.py --strict assets/story/corrections-052/`：2 檔 **WITHIN_BUDGET**；`python3 scripts/check-art-budget.py --strict --kind source source-art/ART-SCENE-052/`：2 檔 **WITHIN_BUDGET**。輸出保存在 `test-results/art-scene-052/runtime-budget.txt` 與 `source-budget.txt`。

最終 WebP 已實際解碼與人工檢視；凜右手完整包紮且空手貼胸、左黑手套持短刃，朔長劍、伊芙晶銃、格蘭盾及受護磷均清楚；5 名同伴、5 名晶化敵人可辨。G1 額頭／太陽穴裝置與後方線纜清楚，路易斯實際戴上並操作控制台。詳見 `test-results/art-scene-052/visual-review.json`。

素材凍結交產品整合；美術 agent 未寫 JS／HTML／WORKBOARD。尚未驗證實際舞台的桌面／手機裁切和 UI 遮擋，這由產品接續驗收。此素材檢查不代表全劇情狀態或工程整合通過。

## 產品整合紀錄與目前限制（2026-10-03）

兩張 WebP 已由產品及工程師實看。初次程式整合只替換 `src/js/story-art.js` 的 c9-abyss-emergence 路徑及 `src/js/story-stage-assets.js` 的 G1 royalCutaway 分支；在當時445步故事資料比對，變更僅C9-step14–17、G1-step05/06。獨立Chrome由公開閱讀控制、完成archive/recorder拼圖，抵達C8與G1並檢查桌面2048×995、手機390×844、下一段／回看、圖片完整解碼、無横向溢出與保存資料不變，曾通過；4張畫面仍保留於 `test-results/art-scene-052/`，產品已逐張檢視。手機延用全幅橫圖留邊，細節小於桌面，此工單未改版面。

後續外部 STORY-REWRITE-050 更新了劇情、場景及互動ID。最終重跑停在新的 `C9-r04` 戰鬥（46個閱讀單元），原 `C9-step-15` 已不能按舊路徑抵達。失敗原紀錄 `browser-report-after-external-story-change.json`、最新診斷 `browser-report.json` 均保留；沒有改戰鬥／新劇情去讓測試通過。`src/js/story-search-assets.js`、`src/js/story-chapters.js`、`src/js/story-chapter-art.js`、`src/js/story-stage-assets.js` 等相關來源已變，先前445步與瀏覽器證據僅代表當時版本，不作現行全劇情通過聲明。

當前狀態：**兩張素材已完成並保留；現行重寫劇情的映射／內容相容性待另行對接**。不覆寫外部劇情或重新塞回已移除的舊場景。完整提示、原稿與新素材路徑仍可供新劇情整合使用。與音訊工單分開驗收。
