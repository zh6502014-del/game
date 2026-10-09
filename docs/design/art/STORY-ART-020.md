# STORY-ART-020｜35章完整故事美術

2026-09-27，進行中。使用者批准每章專屬插畫計畫：28既有＋D1–D7共35章；保留合格原畫，補七章、三人物狀態、三背景、三道具。禁止新增Skin、終章設定、改存檔或規則。

## 唯一寫入與基線

產品：本工單、story-chapter-art.js、tests/story-chapter-art.cjs。美術：assets/story/complete-020/、source-art/STORY-ART-020/（含manifest）。劇情核對：docs/design/art/STORY-ART-020-content-review.md。工程：test-results/story-art-020-review.md。基線test-results/change-scopes/STORY-ART-020-before.json。019持有campaign/stage/HTML，共享檔交其整合，不並寫。

新映射NDStoryChapterArt.chapters[nodeId]={path,title,objectPosition}，以及actors/backgrounds/props供019整合，不新增閱讀步數。先核對未來磷normal及中繼站exterior樣稿，再繼續其餘。35章逐一建立映射與視覺核對；原稿不刪不覆寫，保留prompt/ref/hash/尺寸/bytes/衍生設定。

## 交付預算與驗收

7新插畫＋3背景，各≤600KiB約1536×864；3透明人物常用768×1152各≤450KiB；3道具≤512各≤100KiB。新圖16張上限7650KiB，28原插畫若需衍生另計，合計上限24450KiB（約23.9MiB）；原稿單份另列。不得為壓縮重生成。沿用原畫與古金暗綠寫實風格，UI文字不畫入圖。

35/35章映射、內容時序/人物/道具核對；新runtime strict容量PASS；1440×900、390×844、844×390畫面裁切與fallback；獨立資料測試進入/閱讀/回顧及受影響互動；工程審查、019唯一整合者version與asset-versions後產品驗收。未完成不得標完成。

## 既有圖與內容核對

劇情35章核對見[內容審查](STORY-ART-020-content-review.md)。產品看過28圖接觸表，原候選與逐章內容一致；新增assets/story/chapters-020/為產品唯一寫入的28圖runtime衍生及manifest，追加基線STORY-ART-020-LEGACY-before.json。原PNG 71,116,085 bytes保留不動；WebP共7,028,398 bytes，strict background通過。不是刪除原稿或整個專案減量。

019產品確認最新故事已擴F1–F4；本單仍只35章，不擅增終章插畫。019唯一接入stage/campaign/HTML；章節圖按原揭露事件顯示，不用cover提前洩露A2反噬、D3重逢、D5傷勢。byArtId供同一原專屬illustration替換path，不以frame>=門檻粗暴覆蓋後段狀態。

## 使用者修訂：未來磷為法師

2026-09-27，019產品轉交使用者明確要求「未來的磷是法師，服裝太陽春」，依[法師修訂brief](STORY-ART-020-MAGE-REVISION.md)執行。已停止再發舊旅人裝新圖；正在服務端的結果保留紀錄，不盲目取消/重試。美術仍唯一寫入，不另開第二人共寫。

先做normal-v2：保留臉髮/成人同人/裂損腕裝置，以墨綠分層長袍、精細領袖、局部古金刺繡與扣具建立法師辨識，不添法杖/神器/力量設定。產品核對後再同步tired及D2/D4/D5/D6/D7可見成年磷衣裝。D1、三背景、道具、傷父不因修訂全套重生；D3如成年者可辨也局修。保留被替換原稿版本及prompt紀錄，runtime只接選定版本，仍16件交付（不是增加Skin）。旧圖身份/alpha PASS不等於法師服裝PASS；最終測試與容量在服裝定稿後執行。

## 現行共享檔交接

019產品完成後，因使用者另批「第二次鐘響」F1–F4修訂與G1，已將故事章節、task-data、campaign/stage與HTML/version唯一寫權交給新主線產品任務`01a0c9c7-d02a-7d00-a3cd-e83588d51421`。020仍只批准35章圖及既定16件新素材，不擅增F/G；後續runtime接入/版本freeze改交該整合者，不自行改共享檔，也不沿用019交付作020整合證據。

## 法師樣稿與驗收準備

產品已檢視 `source-art/STORY-ART-020/previews/phosphor-future-mage-v2.webp`：成年臉髮、旅行配色、墨綠分層袍與古金領袖、裂損腕裝置通過視覺核對；授權美術同步疲憊與 D2/D3/D4/D7 局部衣裝、補 D5/D6。D7 同次去除前景箱上易誤讀為新組織的徽記。先前 D5/D6 呼叫沒有返回圖片，不能列作已完成。

產品另持有 `tests/story-chapter-art-ui.cjs`，基線 `STORY-ART-020-UI-TEST-before.json`；測試預備涵蓋 44 張解碼、A2/S3 揭露邊界、D1–D4 傷勢時序、D2 成人實際閱讀 DOM、A1/D2/D5/D6 操作回顧與三尺寸截圖、缺圖備援和獨立存檔不變。尚未執行，不能視為通過。最終整合者收到 READY 後才接入及凍結，再執行受影響測試與工程複核。
