# ART-ARCHIVE-MATERIALS-056｜文件庫小遊戲素材接入

2026-10-04。使用者：「只優化，文件庫小遊戲的美術素材」。產品 root。

## 成果、範圍與唯一寫入者

沿用 ART-ARCHIVE-MATERIALS-055 已生成且保存的三張素材：暗綠布脊卷宗封皮、象牙正文紙、暖米色批註紙。完成正式 runtime 接入，原稿不複製、不重生，現有背景沿用。先前 055 僅獨立預覽的範圍不代表本輪不能接入；本輪使用者授權素材優化，僅做必要圖片引用。

- archive_materials：新增 `assets/story/props/archive-materials-056/archive-folder-v2.webp`、`archive-paper-ivory.webp`、`archive-paper-note.webp`、`manifest.json`。來源分別是 `source-art/ART-ARCHIVE-MATERIALS-055/folder/runtime/` 與 `paper/runtime/`，直接複製已驗過衍生圖，保存來源／SHA／尺寸／bytes／原始 prompt 連結。
- archive_materials：`src/js/story-search-assets.js` **僅** `props['archive-folder'].path`；`src/css/story-search.css` **僅** archive-vault 的 `.search-archive-sheet`、`.search-doc-part[data-kind=note]`、`.search-doc-part[data-kind=royal]` 的背景材質與色彩屬性（background 系列、border-color、box-shadow）。不修改尺寸、位置、字級、內容、捲動或控制項。
- archive_materials：獨立驗證腳本及結果只存 `test-results/ART-ARCHIVE-MATERIALS-056/`，可追加本工單「實作交付」。
- product：工單、工作板本列、最後執行版本腳本更新 `Nightfall-Duel-Story.html` 僅受影響引用。若腳本欲更改其他入口，先核對依賴與範圍。
- engineer：執行碼唯讀，只寫 `docs/design/art/ART-ARCHIVE-MATERIALS-056-review.md` 及本工單審查證據。

禁止更動 story-search.js、關卡/劇情/玩法/AI/RNG/存檔/收取/回呼、其他遊戲、UI 排版，或覆蓋 055 原稿及歷史證據。新 runtime 不引用 source-art 路徑。三張共用；不能按件號複製素材。

## 基線與預算

無 Git。可信修改前文字基線：`test-results/change-scopes/ART-ARCHIVE-MATERIALS-056-before.json`。二進位素材新增，舊 runtime 保留。055 的成果由本轮重新核對，不把旧截图当本轮驗收。

- 封皮約 406×510，最大場景顯示約 190×240 CSS px；沿用原比例、alpha 與 HTML 件號安全區。
- 正文與批註材質各 512×512、平鋪；不以閱讀面板尺寸生成整頁圖。文案保持 HTML。
- 3 張 prop，各 ≤512×512、≤100 KiB，runtime 合計 ≤300 KiB。原稿沿用 055 的一份，新增生成 0 張。

## 必要驗收與交付條件

archive_materials 唯一執行定向驗證：严格素材預算、完整解碼、來源 hash 一致；独立 Chromium 頁載入正式完整 CSS 次序與公開 search API，使用 fixture 與空白 browser context。

驗證 1440×900、390×844、844×390：封皮載入、件號標籤、0426 正文/王室附頁、0428 批註、收取/繼續與 localStorage 未變、紙紋失敗的實色備援、封皮失敗後重試。保留必要截圖與素材/JS/CSS/HTML/驗證腳本 SHA。現有 053 測試已早於新 reader，不能為通過而改其舊行為斷言，也不覆寫歷史證據。

product 檢視本輪畫面，engineer 核對真實 diff、範圍、測試與容量。product 最後序列執行 `python3 scripts/version-assets.py`、`python3 tests/asset-versions.py`。相關問題補正並複審後，產品才標完成。

## 狀態

素材已驗收；[工程審查](ART-ARCHIVE-MATERIALS-056-review.md)確認本工單精確美術差異技術通過，無相關 P0／P1／P2。整體整合待並行技能特效異動來源確認，不標整案完成。

## 實作交付

archive_materials 已實作並凍結，待工程師審查、product 資源版本整合及最終驗收。

- 實際程式差異只有 `src/js/story-search-assets.js` 的封皮 path，以及 `src/css/story-search.css` 三個指定 selector 的 background 系列屬性；保留所有 border、box-shadow、字級、排版與操作。精確差異：`test-results/ART-ARCHIVE-MATERIALS-056/implementation.diff`。
- 新增三張正式 WebP 與 `assets/story/props/archive-materials-056/manifest.json`。封皮 **406×510，78,758 bytes**；正文紙 **512×512，15,566 bytes**；批註紙 **512×512，21,530 bytes**；新增 runtime 圖片總量 **115,854 bytes（113.14 KiB）**。新增生成 **0 張**，原稿新增 **0 bytes**。三張均 byte-for-byte 沿用 055 衍生稿，manifest 記錄來源、原稿、提示詞／生成／轉檔紀錄、SHA-256、尺寸及容量。
- `python3 scripts/check-art-budget.py --strict assets/story/props/archive-materials-056/`：退出 0，3 張 `WITHIN_BUDGET`，0 超標；結果記錄於 `strict-result.json`。瀏覽器完整解碼與像素讀取確認尺寸及 alpha（封皮 0–255、兩紙紋 255）；來源及正式檔 hash 一致。
- `verify-runtime.cjs` 使用正式入口的完整 CSS 次序、正式素材映射與公開 `NDStorySearch.open()`，只注入 fixture 文案，未載入 campaign 或真實存檔。獨立 Chrome **154.0.8037.97** 在 **1440×900、390×844、844×390** 驗證封皮／件號、0426 正文與王室附頁、0428 批註、返回、收取與繼續回呼、localStorage 保持空白；三尺寸皆檢查紙紋請求故障時的實色備援；另驗桌面封皮載入故障與重試恢復。`results.json`：**13 筆 PASS、0 pageerror**，保存素材／JS／完整 CSS／正式 HTML／驗證腳本 SHA。
- 畫面證據：`runtime-1440-initial.png`、`runtime-1440-0426.png`、`runtime-390-0426.png`／`runtime-390-0428.png`、`runtime-844-initial.png`／`runtime-844-0426.png`／`runtime-844-0428.png`，以及 `paper-fallback-390-0428.png`、`folder-load-error.png`、`folder-retry-success.png`；全部位於本輪 `test-results/ART-ARCHIVE-MATERIALS-056/`。人工檢视封皮完整、HTML 件號對準、正文與批註可讀，未見明顯紙紋接縫。
- 初次受限沙箱的本機 HTTP 監聽被拒（EPERM），按工具規範取得環境授權後完成同一腳本；保留 `initial-environment-failure.json`，沒有將該次失敗當成 PASS。`node` 不在 shell PATH，使用既有 bundled Node 絕對路徑，未安裝依賴。
- `scope-check.json` 為本輪實作後的檔案範圍證據：`WITHIN_FILE_SCOPE`、無越界；含產品同時維護的工單／工作板差異，不能推定作者身分。區段合法性仍交工程師人工核對。
- 未驗證：Safari／Firefox、實體手機、一般動態模式、完整正式章節及真實存檔回歸；本輪為指定素材的隔離抽樣，不宣稱全狀態覆蓋。橫向小視窗沿用既有對話框與紙面捲動，截圖中上緣內容可能是捲動後位置。產品尚須執行版本更新與版本測試，之後工程師及產品完成審查驗收。
- 工作流觀察：沿用 055 原稿與環境，單一實作者；實作 1 次、有效瀏覽器驗證 1 次（另有 1 次環境阻擋）、無程式補正、無不必要的舊 053 測試重跑。沒有可靠工時計量，不宣稱 token 或時間節省。

## 產品驗收與並行異動

產品實際檢視本輪桌面初始／0426、手機0428、844橫向0426截圖。封皮輪廓及件號安全區吻合；象牙正文與較暖批註紙的區別清楚，細紋未壓過文字，素材視覺驗收通過。

產品執行 `scripts/version-assets.py`，當時只更新 `Nightfall-Duel-Story.html` 中 story-search.css 與 story-search-assets.js 的兩個 query 版本；`tests/asset-versions.py` 當次 105 引用通過，證據 `test-results/ART-ARCHIVE-MATERIALS-056/version-integration.json`。此後其他寫入改動了同一入口，不能將105筆結果當成目前完整入口的最終驗收。

工程唯讀複核期間發現本輪無人寫入的並行異動：`Claude outputs/skill-fx-preview.html`、`src/js/story-skill-fx.js`、`src/js/story-skill-sfx.js`、`src/css/story-battle-fx.css`、`src/js/story-energy-ui.js`，以及正式 HTML 對相關技能資源的引用。檔頭/素材目錄指向 SKILL-FX-060，但尚未證實外部寫入者及授權來源；不能僅由檔名推定作者。原檔保留，未擴大白名單、回退或接管技能實作。工程師已證實受測 battle-fx CSS 的原文前綴不變，僅追加 `.story-energy-overlay .seb-skill-canvas`，不匹配文件庫 DOM；本次三張圖片與 search JS/CSS 未變。

本工單限制與後續依賴：本輪只驗指定素材及隔離文件庫，不驗技能特效或完整章節存檔。素材可用；依 AGENTS 的交付閘門，共用入口的最後整合仍待並行工作來源釐清。已向使用者確認是否另有AI負責特效，未取得回覆前不標整個程式工單完成。

工程已獨立核對素材來源、strict、精確差異及13筆瀏覽器證據，詳見審查報告與 `review-verification.json`。產品原規劃重驗最新CSS，後因工程證明僅新增不相干selector而取消重複執行；`test-results/ART-ARCHIVE-MATERIALS-056-current/verify-runtime.cjs` 僅保留未交付的追加檢查腳本，沒有完成結果，不能列為第二次通過。對外交付使用056原始有效驗收證據。
