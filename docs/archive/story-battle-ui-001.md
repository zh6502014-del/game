# STORY-BATTLE-UI-001｜故事戰鬥介面重製

2026-09-24。使用者已批准橫向戰場、角色拖曳普攻、全隊常駐技能卡與依序戰鬥演出；實作、產品回歸與工程師獨立複審完成，產品驗收本單戰鬥 UI 可交付。後續並行尋物整合的界線見末節。

## 工單與保護範圍

基線：`test-results/change-scopes/STORY-BATTLE-UI-001-before.json`，保存 219 個文字程式檔雜湊與 13 個允許檔案原文。沒有 Git，不宣稱 worktree 隔離。

| 唯一寫入者 | 允許檔案／區段 | 工作 |
| --- | --- | --- |
| combat_design_audit／遊戲樹 | story-energy-engine.js、tests/story-energy-frames.cjs | 純呈現 frames 與舊版結果/RNG一致性驗證 |
| story_energy_ui／美術 UI | story-energy-ui.js、story-energy-ui.css | 橫向棋盤、手牌、Pointer Events、動畫、可及性 |
| 既有故事任務先改測試；停寫後移交 combat_design_audit／故事整合驗證 | tests/story-energy-flow.cjs | 四個真實節點的公開 UI 戰鬥與故事回呼回歸 |
| story_balance_review／FX、後續獨立工程審查 | 程式唯讀；凍結後 docs/story-battle-ui-001-review.md | 動作／音效建議、實際 diff 審查與複審 |
| 產品 | tests/story-energy-ui.cjs、本文件、docs/story-energy-v1-contract.md、本工單 WORKBOARD 區段；凍結後三個 HTML 的資源版本 | 互動與視覺驗收、整合及證據 |

不得改自由決鬥、傷害、技能費用／時序、AI、RNG、存檔、角色配置及故事進程。保留現行四職業與暮晶試玩規則；沒有新增牌庫、抽牌或召喚。原畫與框體沿用本地資源，不新增圖片或外部依賴。

## 交付契約

- 場上敵上我下，主角置中；HP、攻擊、護盾、普攻／技能額度與狀態可辨。底部一人一張 7:10 常駐技能牌，右側固定我方暮晶與結束回合，敵方資源與回合目標在上方。
- Pointer Events 單指拖曳、8 px 閾值：角色到敵人為普攻、招式牌到合法目標為技能、自身技能只接受所屬角色。拖曳有箭頭及目標標記；取消不提交引擎。點選／鍵盤同等操作，350 ms 長按只查看。
- 直向小螢幕提示轉橫向且可返回；轉向保留戰況，清掉未提交拖曳。正常字級 1440×900／1280×720／844×390／667×375 皆可同屏操作，1–3 人測試陣容。
- `act/endTurn` 原呼叫不變，結果新增 `frames:[{kind,side,before,after,events}]`。kind 為 action／turn-start／turn-end，快照只含 round/side/status/reason/teams/units 的深拷貝，連續且最後對齊最終狀態；無效操作空 frames。state/events/亂數次數不變。
- UI 一次結算、依序呈現，依事件數字播放護盾／傷害，frame 尾對齊 after，不反推規則或重擲 RNG。演出鎖操作；退出／重試／旋轉／減少動態安全清理。終局在相關演出後顯示。
- 保留 start/snapshot/close、回呼一次、勝利按繼續才返回、重試不返回、存檔不由戰鬥 UI 寫入。

## 驗收與結果

引擎階段：原 68/68、新增 frames 22/22 通過；320 場固定種子、6,242 次操作逐步對照舊版完整狀態／事件，553 次戰鬥 RNG 呼叫一致。產品及獨立工程師均已重跑，工程師未發現已確認的規則／AI／RNG 變更。這是列舉案例與種子抽樣，不是全狀態覆蓋或勝率估計。

產品瀏覽器驗收：1440×900、1280×720、844×390、667×375 四尺寸通過，三名我方角色與兩名敵人的測試陣容同屏，生命／盾徽章無交疊。滑鼠拖曳／點選／鍵盤、對敵及自身技能、無效放置、Escape、已用行動拒絕、播放期間重複輸入、播放中離開後新局隔離、途中切入減少動態、素材失敗備援及存檔不變通過。844×390 使用 Chrome CDP 原生觸控事件驗證雙指取消、350 ms 長按預覽及單指拖曳；390×844 方向提示、取消離開後恢復操作、旋轉保留狀態均通過。證據：`test-results/story-energy-ui.json` 與 `story-battle-ui-{1440x900,1280x720,844x390,667x375,portrait}.png`。

正式故事流程 4/4 通過：A2/S3/E3/C3 使用 seed 1、實際 UI 出招，分別於 10/6/7/9 回合通關。A2 先只結束回合，自然於第 8 回合落敗，再重試打贏；四場均驗證取消退出、確認退出、重入、勝利按繼續才前進及收錄才保存，E3 拼圖只做一次。全部 pageerror=[]。前置存檔與 RNG 為測試資料，沒有覆寫 HP／能量／勝負；單種子策略不代表勝率。證據：`test-results/story-energy-flow.json`（附來源 hashes）及正式 C3 截圖 `test-results/story-energy-c3.png`。

首輪發現並補正：手機護盾覆蓋生命、攻擊復位後才命中、切入減少動態仍有 WAAPI、原生 touch implicit capture 轉移被誤取消、全域 PNG 按鈕框覆蓋故事拱形框。工程師獨立複審結果另見 [審查報告](story-battle-ui-001-review.md)。測試初期的 aria-disabled actionability 與隱藏 leave 重複選擇器問題則修在測試，不移除正確可及性語意。

資源整合：三個執行檔凍結後執行 `scripts/version-assets.py`，實際只更新 `Nightfall-Duel-Story.html` 三筆引用；當時 `tests/asset-versions.py` 驗證 80 筆本機 JS／CSS 引用通過。之後 STORY-SEARCH-001 開始寫入故事入口與新模組，最新全域版本檢查因此未通過，不能沿用早先 80 筆結果宣稱當前全入口已完成。產品與工程師另外核對本單三筆凍結引用均一致，證據為 `test-results/story-battle-ui-asset-versions.json`。未新增圖片、音檔、外部網址或其他執行期依賴。

所有瀏覽器使用獨立 context 與測試存檔，不重整使用者頁面。自動權限審核一次逾時，系統允許的重試成功後才執行驗收，沒有把逾時當成測試通過。

## 實際修改與範圍核對

- 執行碼：story-energy-engine.js、story-energy-ui.js、story-energy-ui.css。
- 測試：tests/story-energy-frames.cjs（新）、tests/story-energy-ui.cjs、tests/story-energy-flow.cjs。
- 整合／文件：Nightfall-Duel-Story.html（只資源版本）、docs/story-energy-v1-contract.md、docs/story-battle-ui-001.md、docs/story-battle-ui-001-review.md、docs/agents/WORKBOARD.md 本工單區段。
- `check-change-scope.py` 仍回 REVIEW_REQUIRED：外部 `docs/story-future-lin-draft.md` 與 `docs/archive/story-future-lin-v0.1.md` 屬 STORY-LIN-002；`docs/story-finale-draft.md` 屬 STORY-FINALE-001。後續故事 runtime、search 模組／素材、資源預算與入口新增載入屬正在實作的 STORY-SEARCH-001。工作板／research 後續區段依相應工單歸屬。已按來源任務訊息與工作板核對，不擴大本單白名單或還原其他任務，完整當時清單見 after 與工程報告。

## 複審與後續整合界線

前任工程師完成引擎審查及 UI 初審；最終獨立複跑由 final_engineer 接手（未参与執行碼修改）。三項初審 P2 均已獨立重現修復，接觸時攻擊者仍位移約 −61 px，回位發生於命中／閃避後；減少動態清理、數值幾何、原生觸控亦有獨立證據。定向腳本與結果保存至 `test-results/story-battle-final-review.cjs`、`test-results/story-battle-final-review.json`，12 筆紀錄，pageerrors=[]。

多指契約：只追蹤第一根主指，次指不更換來源、不提前提交；主指正常拖到合法目標仍可提交一次。收到主指 pointercancel 才取消，不代表第二指一加入就必須取消。產品及工程師分別驗證取消事件不提交，以及忽略次指後主指合法提交一次。

四場流程通過的來源 SHA-256 保留在 flow 報告；它們涵蓋本單已凍結的戰鬥 UI 與當時的故事版本。後續 STORY-SEARCH-001 新增的 E3 尋物步驟未納入該次通過證據。原故事任務已明確接手 Story HTML 新載入與最終版本整合，並負責新增尋物→拼圖→戰鬥返回驗證。本單交付戰鬥 UI，不將其他尚在整合的功能標為完成。

實體觸控裝置及跨瀏覽器效能需另行驗證；Chrome viewport／CDP 觸控測試不能代替實機。既有 playSfx 的命中音源需要網路，播放中聲音池的即時靜音限制未在本輪改動；測試阻擋外部請求，沒有聲音品質或離線音效通過的結論。
