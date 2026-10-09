# STORY-INTERACT-012｜翻找與拼合操作重做

狀態：2026-09-25 完成，獨立工程最終審查及產品驗收通過。使用者指出尋物機制、美術簡陋，拼圖互動不足。本單以 STORY-DIALOGUE-010 凍結來源為基準，保留容易上手的形狀配對；難度選項未答覆不視為同意增加旋轉或新的解謎規則。

## 可見成果

- E2/E3/C9 增加可移開、翻開的模組化遮擋物；必須先露出物件，再查看收取。保留兩階段文件、五零件與紀錄器的來源、收取與後續流程。
- 調整擺放、紙面辨識及場景層次，移除巨大的羅馬數字答案標籤。沿用現有背景與目標圖，新增少量共用遮擋道具。
- 四個拼圖保留原本 ID／答案與回呼；操作區及零件盤同屏，拖曳圖像跟隨物件比例，接近合適位置有預覽與吸附，錯放可重試。點選與鍵盤仍可完成，不強迫拖曳。
- 預設不顯示每格答案名稱；選中、提示及已放入狀態提供必要指引。保留 010 的用途與結果文字，收斂側欄占用。

## 唯一寫入者與基線

修改前基線：`test-results/change-scopes/STORY-INTERACT-012-before.json`。

| 主責 | 允許檔案／區段 |
|---|---|
| search_runtime | story-search.js、story-search.css、story-search-assets.js；搜尋遮擋、載入、收取、提示、構圖與無障礙。tests/story-interact-search.cjs |
| puzzle_runtime | story-puzzles.js、story-puzzles.css；工作區、拖曳、預覽、吸附、重試與生命週期。tests/story-interact-puzzles.cjs |
| art_ui | assets/story/props/search-{folio,cloth,panel}.webp、assets/story/search-interact-manifest.json、source-art/STORY-INTERACT-012/；僅新素材及 manifest，不改 JS／CSS |
| product | 本文件、WORKBOARD 的012區段、tests/story-test-helpers.cjs、tests/story-search.cjs；新翻找操作的真實測試整合。三個根 HTML 只由版本腳本改引用 |
| engineer | 凍結後唯讀核對來源 diff／測試品質及定向關鍵風險，報告寫 test-results/story-interact-012-review.md |

不修改 campaign/data/stage、戰鬥/AI/RNG、Skin、存檔鍵、節點 ID、前置、獎勵、原稿或其他角色。若需擴範圍先留追加基線。不得覆蓋 010 的用途回饋。所有當前尋物公開回呼契約維持。

### 美術追加範圍

美術追加基線：`test-results/change-scopes/STORY-INTERACT-012-ART-before.json`。新增3件可共用透明遮擋：研究皮革文件封面、工具遮布、櫃格木遮板。生成各一張，目標512×512，透明alpha不含落地陰影；runtime長寬≤512，單檔≤100KiB，總新增≤300KiB。場景最大顯示約320×220CSS px，手機有區域放大，不為不同縮放重生。來源保留一份，記錄提示詞、參考圖、工具來源、原稿/runtime尺寸bytes及hash。現有兩背景、八目標物不重生。木板與文件封面移開後仍是同一素材，陰影由呈現層單獨控制。

產品另持有11件既有原生SVG的圖紋改善：`assets/puzzles/evac-{0..3}.svg`、`archive-{0..3}.svg`、`recorder-{0..2}.svg` 及該目錄 README。追加基線 `test-results/change-scopes/STORY-INTERACT-012-SVG-before.json` 保留原文；只改紙面地形/路線圖紋及接頭的金屬/接腳細節，保留原來 viewBox、外輪廓、答案及位置。每件≤6KiB、總量≤66KiB，不用點陣生成取代原生向量。地圖仍是局部示意，不宣稱連續實際世界地理。

產品實圖補正：四張地圖片原先因176單位的透明留白而分散，不能實際拼成一張圖。追加 `STORY-INTERACT-012-MAP-before.json`：puzzle_runtime 可調整 evac/archive 的呈現位置/比例及拖曳對應幾何，讓四片接合，保留外輪廓、ID與配對答案；產品把八份SVG圖紋改成同一局部示意的分區。這是組裝呈現補正，不加入方格連路的新玩法（另有013設計案）。修正後只重驗兩種地圖片的拖曳/接縫/三尺寸，不機械重跑未變的槍與接頭案例。

## 驗證責任

- search_runtime：新翻找定向測試，涵蓋遮擋不能穿透收取、重開已收物品、兩批目標、鍵盤、提示、缺圖及1440/390。
- puzzle_runtime：實際 pointer 拖曳、近邊吸附、錯放、取消、多指、重設、键盤、四拼圖；1440×900、1280×720、390×844操作區檢查。
- product：更新測試 helper 以實際翻找再收取；正式三節點尋物整合及既有四拼圖/010回饋回歸，實圖桌面與手機驗收。沿用未改動的戰鬥/Skin規則證據，不冒称重新完整驗證戰鬥。
- engineer：核對本次實測證據並獨立查最重要的取消/異步/拖曳風險；P0/P1/P2補正後複審。
- 凍結後 product 唯一執行 `scripts/version-assets.py`、`tests/asset-versions.py` 與新素材 strict 預算檢查。

## 實際診斷

獨立 origin 的實際工坊操作確認：1280×720 顯示時零件盤在底下，捲下後上方保險片槽被裁出視窗；拖曳可放入，但固定90px預覽與槽尺寸不符。搜尋資料則每件物品直接攤開，沒有遮擋或翻找狀態；四份文件以巨大ⅠⅡⅢⅣ區分。這些是本次要解決的體驗缺口，不把舊測試通過當成體驗足夠。

## 本輪進度與證據

- 拼圖14個定向案例通過：四類×1440×900／1280×720／390×844，加觸控多指與減少動態。地圖補正另6組通過，幾何接縫及實際凹口命中已測。證據：`test-results/story-interact-012-puzzles/{results,maps}.json`，兩份依賴hash檔。地圖改動後沒有冒称重跑槍/接頭。
- 工程師初審与MAP複審：獨立驗證失去pointer capture／關閉／鍵盤恢復、兩尺寸凹口與鄰片不錯吸附；無已確認P0/P1/P2。後續尋物／美術／舞台及最終整合複審亦通過，見 `test-results/story-interact-012-review.md`。
- 產品在MAP凍結後實跑 `tests/story-puzzles.cjs`、`tests/story-puzzle-feedback.cjs`，均退出0；四類配對/拖曳/錯配/重設/鍵盤/回呼、16件用途與五尺寸200%文字回歸通過。日誌存 `test-results/story-interact-012-puzzles/{legacy-regression,feedback-regression}.log`。
- 產品已看更新後archive1440完成圖、E2手機覆蓋/揭開/詳情、E3桌面覆布與手機揭開；C9櫃格透視及核心躺放補正後亦完成最終實圖與回歸。

2026-09-25 模組／美術凍結：C9櫃格與核心躺放已補正，搜尋10組定向案例通過；產品已看最終C9桌面遮板／手機取出與E3手機放大圖。工程師對尋物另獨立測遮擋不可穿透、偽造舊控制失效、重開、焦點／inert復原及動畫即時取消，無已確認阻擋。正式三節點流程與版本其後於014凍結時完成，詳見最後整合驗證。

| 新素材 | 實際runtime尺寸 | bytes |
|---|---:|---:|
| search-folio.webp | 512×267 | 54,700 |
| search-cloth.webp | 512×249 | 42,166 |
| search-panel.webp | 512×315 | 73,798 |

三張新增點陣圖共170,664 bytes（166.66KiB），保留原稿4,832,299 bytes（4.61MiB），恰3次內建生成。11件既有SVG改進後共22,359 bytes；新增點陣加替換後向量總載入體積193,023 bytes，不把替換檔全體稱為淨新增容量。Manifest：`assets/story/search-interact-manifest.json`；原稿：`source-art/STORY-INTERACT-012/`。產品實際解碼原稿＋runtime六檔，RGBA有透明／不透明像素，尺寸／bytes／hash／參考路徑全通過，證據 `test-results/story-interact-012-art-validation.json`。strict14件零超標，見 `test-results/story-interact-012-art-budget.txt`。

### 並行任務歸屬

主baseline後的範圍外差異須保持 `REVIEW_REQUIRED`，不擴白名單：013宮格連路是01a0c3f1產品的純設計三份MD與WORKBOARD新增區段；DIALOGUE-REF-001是01a0ce0f產品的研究交接文件。014閱讀分組由01a0c3f1指定單一角色改campaign.js/data/performance.css及自身tests，保持267原steps與搜尋／拼圖／戰鬥回呼硬邊界。本单不把這些作者與功能算入自己的修改。

014在012後半段得到明確協調可並行，正式三節點整合驗證將等雙方freeze後跑一次。HTML仍由本產品唯一最後整合；014產品另負責全部28節點閱讀回歸與自身獨立工程審查。不能拿012之前的267步證據代替014的新driver驗收。

### 舞台遮擋銜接補正

產品發現原searchScene在故事舞台直接畫出所有尋物目標，會先看到C9隱藏紀錄器。追加基線 `STORY-INTERACT-012-STAGE-before.json`，產品唯一修改 `story-stage-assets.js` 的search分支與 `story-search.css` 的舞台木板投影：共用closed covers、抑制被覆蓋目標；C9已收取且移上桌面時依原 `recorderOnTable` 保留紀錄器，不更改action/callback。正式search測試加三節點「舞台不提前露出」及C9上桌位置斷言。`tests/story-stage-assets.py`實跑28節點267步、93份實圖解碼通過；該腳本的舊素材容量722382只指001舊10件，新012容量以本文件與獨立art-validation為準。此產品修改也交工程師複審。

## 最後整合驗證

012及014來源凍結後，產品實跑 `tests/story-search.cjs` 六組完整情境，結果PASS：E2桌面／手機两批、收取/取消重開/已讀回看/儲存失敗恢復/重玩不重複獎勵；E3離開重置、五件收齊、拼圖取消與戰鬥勝敗返回；C9遮擋、收取後上桌、點燈、伊芙攜帶接線配件與留言播放；缺圖重試、慢載取消。證據 `test-results/story-search.json` 與 `test-results/story-interact-012-search/campaign-integration.log`。

首次整合在C9舊測試失敗：`innerText` 不含折疊操作說明裡的「隨身」。歸類為介面收合後的測試適配，補上真實點擊展開／收起，保留原文斷言，重跑六組全過；未藉刪除斷言換取通過。戰鬥返回仍使用明示的terminal fixture，只證明返回接線，不宣稱實測完整戰鬥規則。

版本整合：`scripts/version-assets.py` 只改故事入口版本引用，`tests/asset-versions.py` 83筆PASS。最終32個來源／測試／新素材指紋與證據索引保存在 `test-results/story-interact-012-final.json`。未修改其他兩個入口、原始角色卡／Skin或戰鬥規則。014閱讀分組由其產品另負責40案例、28節點267原步與158閱讀/互動單位及保存測試，不把其實作計為本單改動。

限制：桌面Chrome與手機尺寸/模擬觸控已驗證，未實測實體手機或Safari；音效與完整戰鬥規則不在本次改動，不重跑或聲稱全部狀態覆蓋。無新劇情／新分支／新獎勵。後續閱讀014和路線013各有獨立工單及授權邊界。

工程師最終核對32份指紋、六組正式尋物報告的八份來源指紋與83筆版本；故事HTML除版本query外與主baseline逐字相同，範圍外差異皆有獨立工單歸屬。最終結論PASS、無已確認未解P0/P1/P2，產品驗收通過。HTML及接續整合責任已交014產品；此交付不宣稱014獨立工單或013新玩法已完成。
