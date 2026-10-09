# ART-UI-021｜全介面美術與圖片呈現一致化

需求：2026-09-30 使用者「優化所有的美術UI 圖片，風格都要有一致性」。

狀態：本票美術與詳情增量已驗收；並行故事修改的跨任務整合待確認。未將整個工作目錄標為完成。

成果：以既有古金、墨綠、暗黑奇幻原畫為基礎，統一首頁、選角、決鬥、詳情／設定、故事地圖／舞台／收藏／工作坊／戰鬥以及展示頁的色彩、面板、按鈕、圖片框與閱讀層級。保留人物身份、場景敘事、原畫來源。不是逐張重新生成原畫；對既有圖片全盤檢視，透過共用呈現與材質建立一致性。若發現無法透過呈現改善的原畫風格問題，由產品追加具體素材單。

## 寫入責任及基線

- 美術唯一實作者：新增 `src/css/visual-system.css`，只寫呈現；新增 `tests/visual-system.cjs` 驗證受影響 UI。禁止寫其他 runtime 檔。
- 產品：`src/css/png-frames.css` 僅替換九宮格檔與對應切線；`assets/frames/v2/manifest.json` 及新 runtime 圖；三主入口 `index.html`、`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html` 和三展示入口 `art-gallery.html`、`frame-gallery.html`、`icon-gallery.html` 引入共用 CSS／同步版本，frame gallery 對应更新切線和manifest；`config/workflow-map.json` 登錄新檔與測試；本單及 WORKBOARD。
- 工程師：凍結後唯讀審查；只在 `test-results/art-ui-021/` 留審查與必要獨立驗證。
- 所有未列檔案唯讀，尤其 `src/js/game.js`／故事 JS 不變；不碰 CARD-DROP-040 及其他工單的邏輯。
- 基線：`test-results/change-scopes/ART-UI-021-before.json`。沒有 Git，使用快照；不存在工作樹隔離。

## 視覺與素材規範

古金為主操作與裝飾、墨綠為資訊面板、暖象牙為正文；狀態保留原語意色、圖示及文字。保留角色原畫及裁切映射，不全圖套濾鏡，不扁平化3D牌面。既有 SVG 圖示保持同一系統。正文／數值不得因裝飾縮小或裁切；圓形控制保留形状；鍵盤焦點可見；減少動態下仍可讀可操作。

素材候選：既有3張九宮格框 atlas 衍生為v2，共3張，長邊≤1024px、單檔≤350KiB、總新增≤1050KiB，alpha保留，切線等比例更新。現有原稿保持原位，不複製；manifest記來源SHA256、實際尺寸與bytes、衍生工具／參數。其他原畫維持既有runtime；不做無依據批次重生。不新增外部字型、圖示、圖片依賴。

## 驗收與證據

- 產品先盤點所有 assets，保存實際修改前 UI；審閱圖片樣本與所有圖片解碼／載入證據。
- 美術實作驗收：獨立Chrome context，1440／900／700／390／320寬度、844×390橫向；主要頁／彈窗、story相關介面、overflow、選取／焦點／停用、圖片載入、減少動態、主要按鈕操作與牌面保護。報告列實際樣本，不能宣稱全狀態。
- 產品：新素材strict、CSS parser、必要互動回歸、人工看最終截圖；序列執行 `scripts/version-assets.py` 與 `tests/asset-versions.py`，最後snapshot diff。
- 工程師核對真實diff、範圍與關鍵風險；相關P0/P1/P2補正複審後產品才結案。
- 證據：`test-results/art-ui-021/`。不重新載入使用者頁面、不使用真實存檔。未測實體手機／Safari明列。

## 框圖接線追加（動工前）

實際依賴檢查發現 `src/css/story-performance.css` 的對話面板，以及 `src/css/story-energy-ui.css` 的7個框圖規則直接寫死舊切線，須與v2 atlas同時遷移。產品唯一修改這兩檔的 `border-image-slice` 至共用切線變數，不改其他樣式；`tests/png-frames.cjs` 同步v2路徑、alpha與失敗備援驗證，輸出改本票目錄。追加基線 `test-results/change-scopes/ART-UI-021-FRAME-before.json`。原before白名單不回改；差異按此明確歸屬。

## 實作與本次驗證（詳情增量待複審）

- 全體304張既有素材已盤點；274張非框圖以7份contact sheet全覽，卡牌／角色／場景沿用同一繪畫方向，保留原画。共用框圖在畫面與gallery檢查。沒有重新生成圖像。
- `src/css/visual-system.css` 統一古金／墨綠面板、次級按鈕、圖文層級，首頁頂部對齊保留面部；收藏圖片與說明各自佔位；故事節點去藍灰，鎖定增加虛線與可讀說明。
- 六入口載入新樣式；`src/css/png-frames.css` 換v2，故事2個CSS及frame gallery切線共用变量；新manifest记录来源SHA256與sharp 0.35.4／lanczos3／無損WebP衍生參數。
- v2 hero 768×758／217,518 bytes，panel 767×768／227,986 bytes，thin 768×764／135,806 bytes。新增runtime總581,310 bytes（567.69KiB），舊載入三圖1,238,450bytes→581,310bytes，減657,140bytes（53.06%）。既有原稿和v1保留，這是載入量減少，並非專案磁碟總量減少。新圖strict 3/3通過。
- 主UI `tests/visual-system.cjs`：1440×1000、900×1000、700×1000、390×844、320×844、844×390；8組場景、68圖。真實鍵盤選角、出牌、故事推進、拼圖放置、尋物收集與故事戰鬥結束回合通過。縮放/操作抽樣，不宣稱全章節。
- 产品本次實跑：`tests/png-frames.cjs` 5寬度、對話框/結算、阻擋框圖後CSS邊框與點牌PASS；`asset-decode.cjs` 全307圖解碼與v2透明中心PASS；既有text-zoom/flip-material/drag-surface僅將輸出路徑改到本票目錄後執行，200%桌面6畫面、兩尺寸9翻牌進度、5寬度45牌面+4skin與實際出牌PASS。完整指令／檔案與報告見 `test-results/art-ui-021/verification.json`、對應 `*-run.cjs`、logs/json。
- 初次素材alpha測試把「有不透明金屬像素」寫成必須alpha=255；sharp縮放後最大254，原色alpha平均不變且中心0。修測試為近不透明>=250並保留中心嚴格0，未改素材迎合測試。此為測試假設修正。
- UI首輪選角fullPage截圖會改carousel scrollLeft，正式選角截圖改viewport並在擷取前斷言selected完整可見；診斷圖carousel-probe不可作交付畫面。直向故事戰鬥驗可見旋轉提示，不以隱藏橫向內容誤報overflow。
- 產品人工已看首頁桌面/手機、選角390、決鬥1440/390、故事地圖1440/320、收藏1440/390、閱讀390、尋物390及橫向戰鬥844。另要求詳情圖窗局部置中精修，僅授權原CSS的 `.detail-card .detail-icon`／子圖與相關定向測試；不改JS。

## 範圍歸屬、限制及依賴

`scope.json` 保留REVIEW_REQUIRED，主基線外3檔 `src/css/story-energy-ui.css`、`src/css/story-performance.css`、`tests/png-frames.cjs` 明確屬動工前追加ART-UI-021-FRAME，工程已逐字核对。沒有把原白名單事後擴大；規則、AI、RNG、故事文字、存檔與玩法JS皆未變。

未驗證實體手機、Safari、所有故事章節/戰鬥狀態、全量圖片大尺寸藝術細節；全部縮圖已看與全量解碼並不等於逐張原解析度鑑修。舊v1與slices的歷史超標保留，新v2三檔合格。所有測試使用獨立context和測試存檔，未刷新使用者對局。後續若擴充新圖，沿用本票材質／圖文分離及預算；不要求再生成全部原畫。

## 中斷後責任交接

2026-09-30 工作中斷後確認原美術／工程子程序已不活躍，詳情增量尚無源檔修改（visual-system CSS仍ad661667f1b4、test仍3b0adeb7fcc9）。本次詳情CSS及定向測試改由產品唯一寫入，保存追加快照 `ART-UI-021-DETAIL-before.json`，不與原美術同時寫入。完成後由重新喚起的工程角色核增量；不重做已完成UI矩陣與原畫盤點。

## 最終詳情增量與產品驗收

產品補正14行detail專用CSS：把原畫限制在明確圖窗內、等比contain並置中；保留圖片失敗時SVG備援及獨立名稱／說明。沒有擴大至手牌、3D容器或JS。

`tests/visual-system.cjs --detail-only` 最終PASS：1440×1000、390×844、320×844、844×390，各3種圖片（基本、職業、origin），全圖窗幾何／置中、200%文字、真實出牌推進及冷啟動圖片失敗備援。12張新截圖，`detail-refinement-report.json` 保存全部觀察source hash與真正入口依賴；本次observedChanges=[]，27項依賴執行前後一致。產品已看390正常置中畫面；工程獨立另驗320/844各5圖源與2個冷context備援。

第一輪失敗是已decode的圖在相同context被Chrome重用，route abort沒有觸發圖片error；另檢出外部故事檔正在變更。`detail-refinement-first-failure.json/log`保留。修正fixture為全新context在goto前阻擋且斷言attack.webp實際被拒，沒有改runtime繞过斷言。依賴指紋仍保留所有觀察差異，但詳情限定模式只以Test.html真正載入CSS/JS、測試及v2檔案為PASS門檻；全UI模式仍包含六入口。舊完整矩陣報告不覆寫。

最終整合：產品再跑version-assets.py、asset-versions.py（98引用PASS）、v2 strict（3圖PASS）；Chrome CSSOM解析本次4CSS通過。詳情測試後27項依賴仍完全相同（`final-dependency-check.json`）。最後工程結論見 `review.md` 增量節。產品驗收本票可見成果通過，不將外部故事玩法修改算為本票交付。

## 實際修改檔案

- `src/css/visual-system.css`：共用美術呈現、detail局部圖窗。
- `src/css/png-frames.css`：三框圖v2路徑、等比例切線變數。
- `src/css/story-performance.css`／`src/css/story-energy-ui.css`：本票僅替換框圖切線；後者另有外部增量，不歸本票。
- `index.html`、`Nightfall-Duel-V12.12.39-Test.html`、`Nightfall-Duel-Story.html`、`art-gallery.html`、`frame-gallery.html`、`icon-gallery.html`：載入共用CSS及內容版本；frame gallery同步切線數字和manifest。
- `assets/frames/v2/hero.webp`、`panel.webp`、`thin.webp`、`manifest.json`：3張衍生框圖與來源記錄。
- `tests/visual-system.cjs`／`tests/png-frames.cjs`：UI／圖窗定向驗證與v2框圖契約。
- `config/workflow-map.json`、本工單、`docs/agents/WORKBOARD.md`：導航、交付與狀態。

## 並行差異與待確認整合

中斷期間及恢復後，另一程序修改 `src/js/story-campaign.js`、`src/js/story-chapters.js`、`src/js/story-energy-engine.js`、`src/js/story-energy-ui.js`、`src/js/story-stage-assets.js`、`src/css/story-energy-ui.css`，以及 `docs/design/story/STORY-NIGHT-SOVEREIGN-024.md`、`_audit2.js`～`_audit6.js`；六入口另被同步版本。這些非產品/本票美術/本票工程此次工具寫入，全部保留，未還原，也未事後擴大白名單。CSS注記含STORY-BATTLE-VISUAL-003，但目前沒有其完整工單與使用者來源確認，不能以註記推定授權。

`scope-current.json`保存實際差異。工程已從初審diff重建六入口原freeze，核對新HTML只變?v=值；307素材hash仍一致。詳情入口沒有載入上述故事JS/CSS，局部證據有效。原版故事8場景內相關證據不外推為新故事碼全數通過，故工作板保留「美術已驗收／並行整合待確認」。已於主對話詢問使用者是否另有Claude／其他工具同步工作，待回覆後協調剩餘範圍；不要求使用者自行往返專責agent。

本票後續依賴是確認並行修改來源／凍結時點，然後按其實際影響補做故事整合验收；不需再次重畫角色或重跑不受影響的自由決鬥。
