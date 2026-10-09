# STORY-BATTLE-UI-001｜獨立工程審查

日期：2026-09-24。工程師唯讀檢查執行碼，唯一寫入本報告。本角色先提供特效顧問建議，但沒有參與本工單引擎、UI、CSS 或測試程式修改；先前 STORY-ENERGY-003 的 68 案規則測試由本角色撰寫，本輪沒有修改該檔案。

**最終有限範圍結論：可交付。原三個 UI P2 與原生觸控回歸已獨立複審通過；全域資源版本目前因並行 STORY-SEARCH-001 尚未整合而失敗，不宣稱整個工作目錄已驗收。詳見接手後複審及剩餘限制。**

## 首輪階段狀態（歷史紀錄，最終狀態見末段）

**引擎與新增 frames 測試：有限範圍未發現已確認問題。UI 第一輪有三項獨立重現的 P2，已交產品安排 UI 單一寫入者修正；整張工單目前需補正，尚未作最終可交付判定。**

| 項目 | 本階段狀態 |
| --- | --- |
| `story-energy-engine.js` 實際差異 | 已審查，未見未授權規則／AI／RNG 改動 |
| `tests/story-energy-frames.cjs` 實際差異與案例品質 | 已審查並獨立執行 |
| `story-energy-ui.js`、`story-energy-ui.css` | 尚在實作，待凍結 |
| `tests/story-energy-ui.cjs`、`tests/story-energy-flow.cjs` | 待凍結與整合結果 |
| HTML 資源版本、文件、WORKBOARD、最終範圍清單 | 待產品序列整合後核對 |

## 基線與真實差異

依據 `test-results/change-scopes/STORY-BATTLE-UI-001-before.json` 中保存的原文，直接產生 unified diff；不是根據修改時間或 agent 自述推斷。授權範圍見 [工單](story-battle-ui-001.md)。

| 檔案 | SHA-256 |
| --- | --- |
| 引擎基線 | `123b70bfb355cbf4f9d7507ed7234930ce48be64f235478a3b51881eb454a1be` |
| 本階段引擎 | `bfb2da180c9e1b2787caa62d065b28d39c6be0044554995f4af1e439a33ef044` |
| 本階段 frames 測試 | `2f57c2c811e252cd8a099726cd18f35e8c1bffdf49e1f1c45f51511825441332` |

引擎差異集中在以下位置：

- `story-energy-engine.js:77`：新增限定欄位的 JSON 深拷貝快照；不含 log、events 或任何 frame 歷史，避免遞迴增長。
- `story-energy-engine.js:82`：在一次完整操作前後記錄快照，並複製該操作新增的事件；現有事件欄位均為純量，逐事件淺拷貝足以避免與原事件別名共享。
- `story-energy-engine.js:288`：用 frames 包覆現有 `performAction`，不重新執行結算；`act` 只在原返回值增加 frames，無效操作為空陣列。
- `story-energy-engine.js:321`：AI 的判斷條件、排序、合法動作與選擇保持原文，只把三個執行點換成上述包覆。
- `story-energy-engine.js:362`：回合起迄及最後 round 增加被納入對應 frame。終局仍在原本階段發生，終局之後沒有額外 frame 或下一回合。

未改傷害、費用、職業狀態、合法性、勝負、機率常數或 RNG 呼叫位置。`state.events` 與原回傳 `events` 仍維持既有關係，frames 不掛進遊戲 state。

## 實際執行與測試品質

使用 `/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`，工程師獨立重跑：

| 命令 | 結果 | 有效證據 |
| --- | --- | --- |
| `node tests/story-energy-engine.cjs` | 68/68 通過；0 失敗、0 未執行；exit 0 | 原規則及明示 fixture 的有限分支回歸 |
| `node tests/story-energy-frames.cjs` | 22/22 通過；0 失敗、0 未執行；exit 0 | 新增快照與原版規則一致性 |

22 案中的種子測試涵蓋 320 場有限軌跡；整套測試逐操作比較 6,242 次操作，新舊戰鬥 RNG 呼叫一致，種子軌跡共 553 次 RNG。320 場不是額外 320 個單元案例，也不是勝率樣本或全狀態覆蓋。

測試有以下獨立比較能力，而非只驗證新程式能產生自洽結果：

- 從產品修改前原文載入另一份引擎，核對固定 SHA-256，沒有從新程式回填 baseline。
- 相同配置、相同明示 fixture、兩個各自獨立且同種子的 RNG；每一步比較完整遊戲 state、舊回傳值、舊事件內容及順序、合法動作與 RNG 次數。
- 玩家決策另用獨立 RNG，且動作從基線合法清單選取，避免把戰鬥 RNG 與測試策略混用。
- 每一步都核對首個 before、相鄰 before/after 連續、最後 after 等於當前 state；串接 frame.events 必須精確等於既有 events。
- 明確測試 frame 內巢狀狀態、隊伍資源及事件被修改時，不改遊戲 state、舊 events 或鄰接快照；後續引擎操作也不反改既有 frames。
- 涵蓋共振同階段多目標傷害／死亡、反擊致死、敵方多角色行動、無事件的額度重置、50%／10% 邊界、牽制與 draw、無效操作及瀏覽器全域輸出。

測試依賴可信的基線證據 JSON；日後移動或清除 `test-results/change-scopes` 時必須保留該檔或同步調整證據保存方式，不能改成以最新引擎重建預期結果。

## 範圍清單與並行工作

本階段執行 `python3 scripts/check-change-scope.py check --baseline test-results/change-scopes/STORY-BATTLE-UI-001-before.json --json`，結果為 `REVIEW_REQUIRED`。這不是最終 scope 通過：UI、產品測試與文件仍在寫入中。

工具列出两個白名單外的文件差異：

- `docs/story-future-lin-draft.md`：產品已提前說明為並行 STORY-LIN-002。
- `docs/archive/story-future-lin-v0.1.md`：新增備份；產品已核對 WORKBOARD 的 STORY-LIN-002 第 265、286–290 行，確認為該工單原樣封存，另有 hash 驗證。

沒有把並行文件差異歸責於 UI／引擎 agent，沒有修改白名單、還原文件或以 scope 檔名通過取代內容審查。最终驗收仍需依工作板核對歸屬。

## 未驗證與後續

本階段未執行瀏覽器演出、動畫取消、拖曳／鍵盤／多指、轉向、圖像失敗、真實故事回呼與存檔整合；沒有實機觸控、音效聽測或跨瀏覽器效能結果。UI 凍結後需繼續審查互動生命週期、安全 DOM、快照唯讀及最終畫面對齊，並核對產品與故事 agent 的實際測試差異，不能以引擎 22 案替代這些項目。

## UI 第一輪審查與已確認問題

本段是引擎階段之後的新增檢查，保留前述階段限制。已閱讀 UI／CSS 重製的完整現行內容及與原文基線的差異，也讀取產品 `tests/story-energy-ui.cjs`；尚未把產品正在執行的整套結果當成通過。

獨立瀏覽器檢查使用 headless Chrome、獨立頁面與臨時 localhost 伺服器，讀取實際故事入口；攔截外部 HTTPS 請求，不寫真實存檔。畫面證據為 `/private/tmp/story-battle-review-landscape.png`。呈現時序觀察器只記錄 `Element.animate` 的參數及 FX DOM 新增時刻，原 animate 仍以原參數呼叫；沒有改角色、傷害、能量或引擎結算。

### P2-UI-01：命中與閃避在攻擊者回位後才呈現

- 位置：第一輪 `story-energy-ui.js:268` 的 `playEvent`，尤其 attack／skill／counter 分支的 360 ms 等待與後續 damage／evade 分支。
- 重現：1440×900、正常動態，劍客主角普攻 HP 10 的劍客敵人。t=0 主角執行 360 ms 的「原位→前進→原位」動畫；t=364 才啟動目標受擊，t=365 出現生命 −1，t=367 出現斬線，此時主角 computed transform 已為 `none`。
- 影響：攻擊者先完成回位，再發生命中；evade 也被排到同一等待之後，看起來像攻擊已結束才閃避，不符合接觸節拍。
- 建議：以完整直接攻擊事件群組安排預備／前進，於接觸點處理盾、生命或閃避，再回位；保留事件順序與已結算數字，不重新呼叫規則。
- 狀態：已交產品，產品已派 UI 修正；未複審。

### P2-UI-02：窄橫向護盾遮住生命徽章

- 位置：第一輪 `story-energy-ui.css:45–50` 與窄橫向覆寫 `.seb-stat-badges`、`.seb-shield`。
- 重現：667×375，主角生命框 `(296.98,213,40.52,26)`，盾框 `(309.11,209.95,28.39,20)`，交疊 `28.39×16.95 px`；844×390 仍交疊 `28.39×12.69 px`。盾與生命相同層級且盾後插入，覆蓋生命數字。
- 影響：指定支援尺寸的核心戰鬥數值不能同時辨識；單純角色卡 bounding box 在畫面內的 fit 測試抓不到此問題。
- 建議：手機橫向重新分配盾位置，並加入生命／護盾徽章不重疊及可讀性驗證。
- 狀態：已交產品，產品另以實圖確認並派 UI 修正；未複審。

### P2-UI-03：切換減少動態不會停止現行 WAAPI

- 位置：第一輪 `story-energy-ui.js:309` 的 playback 起始判斷、`start` 的 `reduced` MediaQueryList、`finish` 清理。
- 重現：開始正常普攻動畫後，Chrome `emulateMedia({reducedMotion:'reduce'})`；`matchMedia(...).matches === true`，但主角仍有 1 個 running WAAPI、UI `busy === true`。
- 影響：偏好已要求減少動態，既有位移仍繼續。CSS `animation:none` 不會取消 `Element.animate()`。
- 建議：監聽 MediaQueryList change；切入 reduce 時取消等待／動畫並同步已結算 final state，保留 modal／inert，離開時移除 listener，避免影響新場次。
- 狀態：已交產品與 UI；產品已安排對應回歸，未複審。

### 其他已查與待查

- 文案／角色名／事件用 `textContent`，SVG 箭頭只有數值座標；肖像檢查同源及 http(s)/file 協定，沒有新增 `innerHTML` 或文字執行路徑。
- 權威 `state` 由引擎一次結算，呈現 `view` 來自快照複製，UI 只按事件 amount 改顯示數值；未發現新增戰鬥 RNG。
- 取消播放的 token、等待 Promise resolve、WAAPI 與 FX 清理有集中入口；最終需要修正後用實際互動核對，不能只讀程式宣稱通過。
- `unit-info` 是 opacity 0 但仍可命中的 44 px 按鈕，曾在窄橫向 `elementFromPoint` 命中角色底部；獨立實際 touch tap 未穩定重現誤開，因此保留為待查，不列已確認缺陷，也不聲稱該區域已驗收。
- 產品首輪測試另回報 844×390 native touch drag 未提交，疑似 implicit pointer capture 從子節點轉 root 時冒泡 lostpointercapture 導致取消。此為產品測試回報，工程師尚待修正後獨立核對。
- UI 現在透過既有 `window.playSfx` 播放；既有音源為遠端、播放中 clone 靜音限制仍在，沒有新增音檔／URL，但不宣稱離線音效或即時靜音已修復。本輪沒有聽測。


## 接手後獨立複審（2026-09-24）

由 `final_engineer` 接手。此角色未參與本工單執行碼或測試實作，只修改本報告。前任工程師最後一輪因工具核准逾時及額度中斷，不將該次未完成執行計入通過；下列結果均另有本角色實際執行或明確標註為讀取既有證據。

### 讀取範圍與凍結版本

已讀根 AGENTS、ENGINEER、分派規則、工程審查流程、WORKBOARD、本工單與本報告；以 before 保存原文產生當前 UI／CSS／測試／介面文件 diff，並讀完整當前 UI、產品互動測試及四故事流程測試。舊 UI 全面替換為橫向模式符合本单授權；呈現副本、合法目標、引擎一次提交、回呼及結束清理沒有發現已確認的規則／存檔越界。沒有重新執行前任已獨立審過的 68＋22 案規則測試。

| 凍結檔案 | 本次 SHA-256 |
| --- | --- |
| story-energy-engine.js | `bfb2da180c9e1b2787caa62d065b28d39c6be0044554995f4af1e439a33ef044` |
| story-energy-ui.js | `e3de8840da57b37089d5b31d67b8e0625a0562886cfbd37ab4818659df2575fa` |
| story-energy-ui.css | `83d5662001e5bfa5778933e8572566e5009c9f6e93ee69bfe9cdd068a23a3593` |
| tests/story-energy-ui.cjs | `a0295aef9b5b211f94116be3195ae3c405474752a5278ed5f7fe4173af45dc93` |
| tests/story-energy-flow.cjs | `4d6dd6c6c549c645ee782f970c7abcd99ac6148ca029416bbbf5345a86145f04` |

### 本角色實際執行

定向腳本：`/private/tmp/story-battle-final-review.cjs`；結果：`/private/tmp/story-battle-final-review.json`。使用 bundled Node、Playwright 的 Chrome channel、臨時 localhost 與獨立 context，攔截外部 HTTPS，未重載使用者頁面。只以合法 UI 行動及固定注入 RNG 建立測試情境，不覆寫戰鬥 state、HP、能量或勝負；`Element.animate` 觀察器以原參數呼叫原方法，DOM 觀察器只記錄時序與 computed transform。測試前後 localStorage 相等、pageerror 為空。

第一次試跑在殘影前置不足時停下；第二次已通過全部動畫／幾何檢查與實際觸控扣盾，但觀察器錯誤假設 implicit capture 的 target 必為角色 button，而不是內層節點。兩者只修臨時驗證腳本，未改遊戲程式或放寬核心行為斷言。產品明確確認主指控制／忽略次指後，再補上次指接觸下主指合法放置的 act 次數與扣盾斷言。最終完整執行 exit 0，12 筆檢查均通過；不將次指加入誤寫成取消觸發。

最終腳本 SHA-256：`5ca294a79f1bdc3bdef83c0a4431aa970de21b155c32c322778df39f29f923a9`；結果 SHA-256：`590fbbb96e4040dbdd674334eb1efa59a014ab4d7e320ebbf9cce85e8ffb14bb`。暫存路徑並非長期保存承諾，本段同時保存關鍵數據。

| 項目 | 修正位置及獨立證據 | 複審結果 |
| --- | --- | --- |
| P2-UI-01 命中節拍 | UI JS:258–271 以 `poses` 保持前進，346–347 事件群結束後回位。1440×900 普攻的生命／盾／閃避浮字分別於開始後 243.4／242.5／242.7 ms 出現，攻擊者 transform 分別為 translateY −61.44／−61.47／−61.43 px；三案均非回家後命中，演出結束才回到 `none`。殘影由敵方合法技能建立。 | 通過，原 P2 結案 |
| P2-UI-02 HP 與盾交疊 | 窄橫向 `.seb-shield` 改到卡片上方。4 尺寸、3 我方＋2 敵方，共 20 張角色 HP／盾矩形皆不相交。667×375 主角 HP y=213..239、盾 y=169.5..186.5；844×390 HP y=228..254、盾 y=177..194。另看產品 667×375 實圖，數字可辨。 | 通過，原 P2 結案 |
| P2-UI-03 中途 reduce | UI JS:508–509 監聽偏好 change，246–249 同時取消 waiters、一般動畫與 poses；finish:482 解除監聽。實際於普攻 WAAPI running、勝利已結算、離開 modal 開啟時切 reduce：busy=false、running=0、FX=0；權威 state 相等，modal 及 shell inert 保留，取消離開後繼續只回呼成功一次。 | 通過，原 P2 結案 |
| 原生 touch capture 轉移 | UI JS:503 只處理 root 自身遺失捕捉。844×390 真實 CDP touch 記錄：子節點 `seb-art-fallback` got→lost capture，接著 root got capture、move/up；此次攻擊只扣一次護盾。子節點 lost 沒有誤取消。 | 通過 |
| 多指後取消／長按 | 兩指接觸、移動主指，再送原生 touchCancel：state 不變。原生長按 450 ms 後放開只開詳情、state 不變。 | 只驗證明示取消事件；不等於第二指自動取消 |
| 拱形框 | 四尺寸全部角色 computed `borderImageSource=none`；對照 CSS:7 的限域覆寫，不污染自由決鬥。 | 通過 |

次指契約已由產品明示確認：單一主指控制、忽略次指，收到主指 pointercancel 才取消；不要求次指加入即取消。獨立測試中兩指接觸、主指移到敵方後先放開、再放開次指，`act` 增量精確為 1、敵方護盾精確減 1。此為合法的單次提交，非 P2；產品負責將交付文字收斂為「忽略次指＋取消事件不提交」，避免誤讀成第二指自動取消。

### 產品測試證據與其適用範圍

讀取 `test-results/story-energy-ui.json`：4 尺寸 passed；讀取 `test-results/story-energy-flow.json`：A2/S3/E3/C3 共 4/4 passed，A2 自然第 8 回合敗、重試第 10 回合勝，其餘勝利回合為 6／7／9。讀過測試實作，沒有發現以改 HP／能量／終局或解除核心斷言換取通過；流程有實際故事 barrier、離開取消、離開重入、勝利繼續後尚未保存、收錄才保存及回呼一次檢查。這些是產品執行的證據，本角色沒有重新跑該兩支完整套件。

flow 記錄的引擎、UI JS、UI CSS 及 flow 測試 hash 與本輪凍結檔一致；但 `story-campaign.js` 已由後續 STORY-SEARCH-001 改動，因此舊 4/4 不證明當前未凍結尋物接線也通過。新故事入口及新步驟回歸由該工單原產品接管，不在本次 UI 複審中替它驗收。

### 最新 scope、版本與並行限制

重新執行 scope 到 `/private/tmp/story-battle-final-scope.json`，仍為 REVIEW_REQUIRED。除本單白名單外，新增的外部差異均逐項對照 WORKBOARD，產品亦以訊息确认：

| 外部檔案 | 已記錄的工單／主責 |
| --- | --- |
| docs/story-future-lin-draft.md、docs/archive/story-future-lin-v0.1.md | STORY-LIN-002 文稿／歷史封存 |
| docs/story-finale-draft.md | STORY-FINALE-001 劇情草稿 |
| story-campaign.js、story-campaign-data.js、story-stage-assets.js、config/art-budgets.json、docs/art-asset-budget.md | WORKBOARD:320–329 的 STORY-SEARCH-001，原故事產品正在寫入 |

沒有擴大原白名單、還原外部檔案或將 scope 的 REVIEW_REQUIRED 改寫成通過。本次人工來源核對不是修改者鑑識；新的尋物模組或文件之後可能繼續加入，不能把此時快照當成並行任務的最終清單。

HTML 與 before 直接比對：本工單目前只改 Nightfall-Duel-Story.html 的三筆戰鬥 JS／CSS query version；index.html 與測試 HTML 在該比對時相同。本角色逐一重算上述三筆引用，均吻合表列凍結 hash。

本角色確實執行 `python3 tests/asset-versions.py`，當前 exit 1：`Nightfall-Duel-Story.html: stale or unversioned story-campaign-data.js`。這是正在並行寫入的 STORY-SEARCH-001 尚未版本整合；先前 80 筆通過是該新接線前的歷史證據，不能表示目前全域檢查通過。依產品指派，本輪僅驗三筆戰鬥引用，之後全域版本整合與重驗由原故事產品排定單一寫入者。

### 剩餘限制與建議狀態

建議狀態：**可交付（限定本單凍結的戰鬥引擎／UI／CSS 及三筆引用）**。本次有限範圍未發現新的已確認 UI P0／P1／P2；原三個 P2 與 capture 回歸均已獨立複審通過，次指行為符合產品已明示的契約。全域版本檢查的失敗保留為後續 STORY-SEARCH-001 整合依賴，不能將目前整個故事入口標為全域版本通過。產品已收到原故事任務確認：該任務承擔新尋物→拼圖→戰鬥返回回歸及全域版本整合；本工程師不審或修改對方未凍結程式。

未驗證實體觸控裝置、Safari／Firefox、跨瀏覽器效能、全部狀態或所有動畫組合。音效仍使用既有遠端 playSfx 音源，本輪阻擋外網、未聽測；既有播放中聲音池即時靜音與離線音效限制沒有被修復或宣稱通過。最終產品交付狀態由產品維護。
