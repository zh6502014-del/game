# STORY-SEARCH-001｜模組化尋物

狀態：2026-09-24 完成。工程師補正複審通過，產品完成實際畫面與整合驗收。依使用者確認的 E2／E3／C9 第一批方案；不加入新分支、Skin 或戰鬥規則。

## 實作範圍

- E2 保留 E2-step-07/08，分批尋找研究副本、備用設計圖、讀值資料頁、導師筆記。同一工作臺、同一紙張素材；文字由演出資料管理。
- E3 新增 E3-search-parts，原 E3-step-03 仍為武器拼圖、step-07 仍為追兵戰。五件零件共用尋物、詳情與拼圖來源；裝配輪廓與成品使用同一 alpha 映射。
- C9 保留外門調查，在 C9-search-recorder 收取紀錄器；原 step-03 點燈、step-04 接線、step-05 開始錄音。接線配件仍由伊芙帶來，拼圖完成說明不提前引用父親留言。
- 共 28 節點、267 個演出步驟，原有步驟識別碼、存檔鍵、解鎖與前置關係不變。新增 search 類型有場景、當批目標及物件詳情；不增加全域背包或中途存檔。
- 場景按圖查看→收取→完成後繼續。取消／重開保留本節點已收物件；離開未完成節點重新開始。回看不重做互動，獎勵仍由完成步驟收錄。

## 素材與資源

新增兩張近景背景與八件透明物件，皆內建 imagegen 獨立生成。背景不畫入目標物，程式另外呈現陰影、桌燈光效及文件標記。原稿只保留一份，不覆寫既有圖片。

- 背景：assets/story/backgrounds/search-lab.webp、search-hideout.webp，目標1536×864、各≤450KiB。
- 道具：assets/story/props/paper.webp、gun-0..4.webp、recorder.webp、lamp.webp，各≤512×512／100KiB。
- 提示詞／參考／來源／hash／原稿與衍生尺寸容量：assets/story/search-backgrounds-manifest.json、search-props-manifest.json。
- 原稿：source-art/STORY-SEARCH-001-backgrounds/、source-art/STORY-SEARCH-001-props/。Runtime總目標≤1700KiB，原稿另計。
- 素材登錄與固定擺位由 story-search-assets.js 共用；搜尋只載入当前場景，無外部圖示或字型依賴。缺图不允許盲收，保留進度並可重試。

交付實測如下。背景為保留原始長寬比縮至高度864，寬1535，與1536目標差1px；畫面按16:9容器呈現。所有道具均為RGBA WebP。

| Runtime 檔案 | 尺寸 | bytes |
| --- | --- | ---: |
| search-lab.webp | 1535×864 | 175,806 |
| search-hideout.webp | 1535×864 | 197,994 |
| paper.webp | 512×512 | 44,776 |
| gun-0.webp 機匣 | 512×512 | 41,516 |
| gun-1.webp 銃管 | 512×512 | 35,970 |
| gun-2.webp 握柄 | 512×512 | 41,338 |
| gun-3.webp 暮晶核心 | 512×512 | 33,166 |
| gun-4.webp 保險片 | 512×512 | 43,520 |
| recorder.webp | 512×512 | 76,946 |
| lamp.webp | 512×512 | 31,350 |
| **合計** | **10檔** | **722,382（705.45KiB／0.689MiB）** |

原稿14,565,089 bytes另存，不供遊戲下載。背景生成時使用風格參考輸入；道具逐張獨立生成，先由美術檢視既有場景，並在manifest明記參考只供風格檢視、未作imagegen輸入。沒有把同圖裁切冒充新素材。

## 檔案主責與基線

- product：story-campaign.js、story-campaign-data.js、story-stage-assets.js、config/art-budgets.json、docs/art-asset-budget.md、Nightfall-Duel-Story.html 載入，以及根目錄 HTML 最後資源版本；tests/story-search.cjs、tests/story-test-helpers.cjs、tests/story-performance.cjs、本報告與 WORKBOARD 本工單。
- search_runtime：story-search.js/css、story-search-assets.js、story-puzzles.js/css。
- hidden_object_art：八件道具、props manifest／原稿。
- layer_backgrounds：兩個背景、backgrounds manifest／原稿。
- 範圍追加：tests/story-stage-assets.py，配合新增search場景、267步及道具解碼。

動工前基線：test-results/change-scopes/STORY-SEARCH-001-before.json；追加基線：STORY-SEARCH-001-ASSET-TEST-before.json。工程師須檢查實際diff與語意，不能用檔案白名單或hash證明作者。

最終scope維持 REVIEW_REQUIRED／退出1，因共享目錄有以下已核對的並行差異；未擴大原白名單或還原別人的檔案。追加測試由其修改前獨立基線授權。

| 範圍外差異 | 已確認工單／主責 |
| --- | --- |
| docs/research/RESEARCH-008.md、benchmark-engineering-review.md、benchmark-interaction-ui.md、benchmark-narrative-progression.md、benchmark-physical-feedback.md、benchmark-state-legibility.md；五份專責角色文件參考段 | RESEARCH-008 研究產品／各專責角色 |
| docs/story-battle-ui-001.md、docs/story-battle-ui-001-review.md | STORY-BATTLE-UI-001 戰鬥UI產品 |
| docs/story-finale-draft.md、docs/story-gameplay-gap-audit.md、docs/story-rescue-interaction-spec.md | 另一產品的結局草稿、玩法落差及救援提案；僅文件 |
| prestige-ui.css、docs/ui-carousel-fade-review.md | UI-CAROUSEL-FADE-001 選角產品；僅7行側卡遮罩，本工單代為同步HTML版本 |
| docs/engineering-workflow.md、ENGINEER.md對應流程段、WORKBOARD頂端 | ENG-EFFICIENCY-002 戰鬥UI產品；對方明確確認授權、寫入與凍結 |
| docs/design/UI-CLARITY-009-art-review.md（結案時並行新增） | UI-CLARITY-009 主研究／UI產品已聲明的設計文件工單；不屬尋物程式改動，該工單仍另行進行 |
| tests/story-stage-assets.py | 本工單追加基線 STORY-SEARCH-001-ASSET-TEST-before.json |

戰鬥UI的四場真實勝負操作驗證基於尋物接入前來源，不冒稱已涵蓋本次新流程。基線與hash用於比較最終差異，不提供修改者鑑識或歷史全專案無越界保證。

## 驗收紀錄

| 檢查 | 結果與證據 |
| --- | --- |
| 正式尋物整合 | tests/story-search.cjs 六組PASS；[結構化結果](../../test-results/story-search.json)含來源hash。涵蓋E2兩批、取消重開、回看、重複點擊、儲存失敗重試、重玩無重複獎勵；E3五件→拼圖→戰鬥返回；C9收取→點燈→接線→錄音；缺圖重試、慢載取消。 |
| 完整演出 | ACTUAL_ART=1 tests/story-performance.cjs PASS：28節點267步逐步解碼正式圖片，四拼圖取消／成功、四戰取消／失敗／成功返回、唯讀回看、防連點、缺圖重試。[日誌](../../test-results/story-search-performance-final.log) |
| 連續進程 | tests/story-campaign.cjs PASS：28節點跨章銜接、前置關係、舊檔匯入、保存、圖鑑鍵盤、12收藏／4可裝備外觀、一般決鬥入口。[日誌](../../test-results/story-search-campaign-final.log) |
| Runtime UI | 13組正式美術檢查PASS，1440／390／320，三場景／放大／鍵盤／詳情／收取及槍組裝／reset。[結果](../../test-results/story-search-runtime/final-runtime-results.json) |
| 獨立工程複審 | [報告](../../test-results/story-search-review.md)：兩項P2已補正；原生觸控模擬、鍵盤、至少44px無重疊命中區、合槍重置、C9門檻及四拼圖真實拖曳回歸PASS。[來源hash](../../test-results/story-search-engineer-final-hashes.json) |
| 素材 | tests/story-stage-assets.py PASS：94個實檔、八道具真透明alpha、十份獨立原稿／runtime hash／尺寸／bytes。check-art-budget.py --strict 10檔零超標；tests/art-budget.py 9項PASS。 |
| Skin／一般決鬥 | skin-store 30定向＋128實際campaign前綴PASS；story-skins同職業AI外觀分離、舊檔、手牌／HUD／詳情／回退與實際回合PASS；ui-smoke 1440／900／700／390無溢出且正常推進回合。 |
| 版本 | 整合者執行version-assets.py；asset-versions.py PASS 83筆。實際更新index.html、art-gallery.html、Nightfall-Duel-Story.html、Nightfall-Duel-V12.12.39-Test.html。工程師獨立再核對PASS。 |

產品已檢視八道具與兩背景、桌面尋物、手機放大、點燈前後及手機合槍畫面。尋物agent先前mock素材結果只驗證互動結構；以上正式結果使用實際交付圖片。

限制與後續依賴：戰鬥整合套件採明示terminal fixture，只驗證故事返回，不代表重測戰鬥規則／難度。一般決鬥與Skin回歸早於另一工單7行側卡遮罩，其後的遮罩由對方五尺寸40切換與獨立審查覆蓋；本單不宣稱所有來源全量重跑。一般決鬥曾有一項既有外部音效請求中止，未新增音效依賴。未驗證實體手機、跨瀏覽器或音效聽測；Chrome觸控注入仍屬模擬。所有測試使用獨立頁面與存檔，未重整使用者遊戲。後續新增尋物節點須另外定義場景擺位與劇情目標，無需重畫已共用道具。


## 28 節點實際互動表

每節點皆保留逐句劇情；下表分開列出額外操作。行動按鈕是一次確認後推進，不等於獨立救援或護送遊戲。

| 節點 | 實際機制 |
| --- | --- |
| A1 | 點選查閱、單次行動按鈕 |
| A2 | 暮晶戰鬥、單次行動按鈕 |
| A3 | 單次行動按鈕 ×2、點選查閱 |
| S1 | 單次行動按鈕 |
| S2 | 點選查閱 ×2 |
| S3 | 暮晶戰鬥、單次行動按鈕 |
| T1 | 形狀拼圖、單次行動按鈕 |
| T2 | 單次行動按鈕 ×3 |
| T3 | 單次行動按鈕 ×3 |
| E1 | 單次行動按鈕、點選查閱 |
| E2 | 單次行動按鈕、場景尋物 ×2 |
| E3 | 場景尋物、形狀拼圖、單次行動按鈕、暮晶戰鬥 |
| P1 | 逐句閱讀 |
| P2 | 逐句閱讀 |
| P3 | 單次行動按鈕 ×2、點選查閱 |
| P4 | 單次行動按鈕 |
| B1 | 單次行動按鈕 ×2、點選查閱 |
| B2 | 單次行動按鈕 |
| B3 | 點選查閱、單次行動按鈕 |
| C1 | 單次行動按鈕、點選查閱 |
| C2 | 單次行動按鈕 ×2 |
| C3 | 單次行動按鈕、暮晶戰鬥 |
| C4 | 點選查閱、單次行動按鈕 |
| C5 | 逐句閱讀 |
| C6 | 逐句閱讀 |
| C7 | 路線選擇 |
| C8 | 形狀拼圖、點選查閱 |
| C9 | 點選查閱、場景尋物、單次行動按鈕、形狀拼圖 |

T2／T3仍是依序按行動鈕，操作深度落差並未由本批三節點尋物解決。P1／P2／C5／C6依已批准配置為逐句對話。另見其他產品的 [混合玩法落差核對](story-gameplay-gap-audit.md) 與 [救援互動補強提案](story-rescue-interaction-spec.md)；後者僅文件提案，未在本工單實作或當成精確玩法已獲批准。實際用戶舊頁的版本未取得，不推定問題一定是快取。
