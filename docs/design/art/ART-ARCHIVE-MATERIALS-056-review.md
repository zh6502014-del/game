# ART-ARCHIVE-MATERIALS-056｜工程審查

2026-10-04。工程師 archive_material_review；執行碼唯讀。依工單與 before 基線核對，未修改、還原其他任務檔案。

## 結論

**056 的精確素材實作技術審查通過；最終整合待外部範圍異常釐清。** 三張 runtime 圖、封皮映射及紙面背景未發現本次相關 P0／P1／P2 缺陷。隔離文件庫的美術與操作證據足以支持本輪實作，但審查期間外部技能特效內容加入工作區和正式 HTML，授權工單及實際寫入者尚未確認；按 AGENTS「未解的範圍異常……先補正再交付」，此時不可把 056 整體整合或全工作區標成驗收完成。產品最後驗收。

## 基線與精確差異

- 基線：`test-results/change-scopes/ART-ARCHIVE-MATERIALS-056-before.json`，無 Git；只能說明本輪 before 至審查時的最終差異，不能推定作者或歷史無越權。
- `story-search-assets.js:38`：只將 `props['archive-folder'].path` 由 `complete-020` 改為三張新素材目錄中的封皮。獨立比對確認全檔等於舊檔做一次該路徑替換；其他場景、文案、件號、targets、座標與幾何未變。
- `story-search.css:215`、`:223`、`:225`：僅 archive-vault 的 sheet、note、royal 三個指定 selector 的 background、background-image、background-size。HTML 文字、字型、尺寸、位置、邊框、陰影、捲動與控制項保留；不新增 RNG、玩法或狀態修改。正文與王室附頁共用 ivory 素材。
- `src/js/story-search.js` SHA 與任務前基線及瀏覽器驗收均相同。素材引用不指向 source-art、不依賴外部服務。
- 新增 `assets/story/props/archive-materials-056/` 三張 WebP 及 manifest。實作者 `implementation.diff`、28 筆 delivery SHA 均核對相符；原圖、衍生圖、prompt、generation、derive 紀錄及瀏覽器驗收的其餘來源 SHA 亦相符（HTML／後續 battle CSS 例外見下節）。
- 產品首次版本整合已獨立核對：HTML 僅 story-search.css 及 story-search-assets.js 兩處 query 更新，原本 story-search.js 引用不變；當時 HTML SHA 為 `66a24761e484ebff906a5472bfdbad8d57160a0194e5fcd99269cf8b5789d46f`。`version-integration.json` 保存版本腳本退出 0 及 105 引用 PASS。該 HTML 後來又被外部工作修改，不能把此證據稱作目前完整 HTML 驗收。

## 素材與測試

| 素材 | 尺寸 | bytes | 來源與判定 |
| --- | --- | ---: | --- |
| archive-folder-v2.webp | 406×510 | 78,758 | 055 封皮 runtime 原樣複製，alpha 保留 |
| archive-paper-ivory.webp | 512×512 | 15,566 | 055 ivory runtime 原樣複製，不透明 |
| archive-paper-note.webp | 512×512 | 21,530 | 055 note runtime 原樣複製，不透明 |

總新增 runtime **115,854 bytes／113.14 KiB**，低於 300 KiB 工單總量，每張均低於 512×512／100 KiB；新增生成 0 張、原稿新增 0 bytes。來源、現檔及 manifest 的 SHA／容量一致。保留舊 runtime，未刪除原稿或變更預算。

**本次實跑／獨立核對：** strict 素材檢查退出 0；基線至現檔的 JS、CSS、HTML 真實 diff；來源和交付證據 SHA；檔案範圍工具；後續 CSS 前綴 hash 與 selector 影響面。工程師檢視本輪桌面初始與手機 0428 截圖：封皮完整、件號可辨，批註和正文可讀。產品另已檢視桌面、手機、橫向畫面。

**沿用瀏覽器證據及依據：** `verify-runtime.cjs`／`results.json`，Chrome 154.0.8037.97、1440×900／390×844／844×390、reduced motion，13 筆 PASS、無 pageerror。測試讀正式 HTML 的完整 CSS 順序並載入正式 search JS 和素材映射，以公開 `NDStorySearch.open()` 開啟；獨立空白 context、fixture 文字，不載入 campaign 或真實存檔。斷言檢查：

- 三圖完整解碼、像素與 alpha 範圍；七份封皮的同一素材路徑／尺寸、件號（桌面另檢查命中）；三尺寸 0426 正文及王室附頁、0428 批註、背景 URL、紙面字級、dialog 界限與水平溢出。
- 返回、收取 ID 及回呼次數、收取後尚未完成、按繼續後完成一次並關閉；空白 localStorage 前後相同。
- 三尺寸攔截紙紋請求且斷言實色備援仍存在；桌面攔截封皮請求、錯誤狀態不收取、不完成，解除攔截後重試恢復。

測試 PASS 在行為斷言之後寫入，末尾再核對來源未變；最初 EPERM 是環境阻擋，單獨保留，未混作通過。沒有必要機械重跑相同瀏覽器套件或早期 053 測試。

## 外部範圍異常與證據適用性

審查初次 scope 重查為 exit 1／REVIEW_REQUIRED，出現外部 preview、skill FX、skill SFX；稍後快照又新增 battle CSS 和 energy UI。`review-final-scope.json` 記錄清單外檔案：

- `Claude outputs/skill-fx-preview.html`（修改）
- `src/css/story-battle-fx.css`（修改）
- `src/js/story-energy-ui.js`（修改）
- `src/js/story-skill-fx.js`、`src/js/story-skill-sfx.js`（新增）

`Nightfall-Duel-Story.html` 雖為允許檔案，最終差異額外包含兩支技能腳本引用、battle CSS／energy UI 版本，不屬 056 的兩處 query 授權。最後觀察 SHA 為 `0edb82d05cab9bd9c0564cead2196b1cd85d45ff5089cb54171e60799104281b`。scope 白名單不證明此內容合法。

產品明確確認上述技能整合不是本輪 product 或 archive_materials 所寫；檔頭／資產只能將其內容辨識為 SKILL-FX-060 類別，實際外部作者及授權工單未能證實，不歸咎特定工具或人。工程師沒有扩充白名單、還原或修正這些內容。最終工作區版本測試後來由產品回報 107 引用 PASS，該結果不能替代外部差異歸屬與審查。

對本輪文件庫 CSS 的影響已獨立核對：現有 `src/css/story-battle-fx.css` 的前 **26,404 bytes／191 行** SHA 恰等於原瀏覽器驗收版本；只追加一個 `.story-energy-overlay .seb-skill-canvas` selector（固定 canvas、不接收 pointer）。文件庫 dialog 不具有該祖先／class，故此追加不匹配文件庫、沒有直接紙面或封皮呈現影響。search JS／CSS、三圖與其他完整 CSS 來源仍與 13 筆隔離驗收一致，因此保留該局部證據。新增技能腳本及 energy UI 的完整正式遊戲整合未在本輪驗收，不能宣稱「最終 HTML 仍僅两引用」或「全工作區通過」。

解除待確認項需要：產品／外部主責確認授權與寫入範圍，保存外部任務差異並完成其相應審查；凍結共享入口後確認版本與本輪依賴。如果後續又改 search 相關來源或可匹配文件庫的 CSS，只重驗受影響項目。不可為取得綠燈自行刪除外部修改。

## 未驗證與證據路徑

未驗證 Safari／Firefox、實體手機、一般動態模式、完整正式章節、真實存檔及新增技能特效整合；空白 fixture 的 localStorage 不變不是完整存檔相容性測試，13 筆抽樣不是全部遊戲狀態。測試檢查 dialog 邊界並保留內部捲動；不把截圖的捲動位置當成全頁都同時可見。

- `test-results/ART-ARCHIVE-MATERIALS-056/review-verification.json`：初次 SHA、精確 diff、strict 與 scope 摘要（保留當時狀態）。
- `test-results/ART-ARCHIVE-MATERIALS-056/review-scope-check.json`：初次外部 scope 差異。
- `test-results/ART-ARCHIVE-MATERIALS-056/review-final-scope.json`、`review-external-drift.json`：後續外部清單、HTML diff、CSS 前綴證明與最後觀察 SHA。
- 沿用 `results.json`、`verify-runtime.cjs`、`strict-result.json`、`delivery-sha256.json`、`version-integration.json` 及本輪 PNG；未覆寫原驗收結果。
