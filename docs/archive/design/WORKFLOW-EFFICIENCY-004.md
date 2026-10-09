# WORKFLOW-EFFICIENCY-004｜工作流精簡實作

2026-09-25，完成；獨立工程複審與產品驗收通過。使用者授權執行 WORKFLOW-EFFICIENCY-003 建議；本輪落地其先行 A／B 階段，程式責任拆分待五個後續任務觀察後逐項安排。本輪不修改遊戲 runtime、不初始化 Git、不增加常駐 Agent。

## 唯一寫入者與基線

- 產品：`AGENTS.md` 的讀取入口、`docs/agents/` 八份目前入口及 `history/2026-09-25-*.md` 八份歷史封存；`docs/engineering-workflow.md` 的工具接入；`docs/workflow-tools.md`；本工單。
- 工具實作者：僅 `scripts/workflow.py`、`tests/workflow.py`、`config/workflow-map.json`。
- 工程師：凍結後唯讀核對全部 diff；只寫 `test-results/workflow-004-review.md`。
- 基線：[before](../../../test-results/change-scopes/WORKFLOW-EFFICIENCY-004-before.json)。完整精確允許清單已存入，任何追加先另存基線。

## 必須保持

使用者最新需求優先、唯一檔案寫入者、獨立工程審查、必要回歸、真實存檔保護、規則／AI／RNG 邊界、美術容量與素材來源、資源版本整合規範均保留。歷史全文封存並修正相對連結，不抹除未決事項；歷史不得變成每次必讀。

工具只作導航、選測建議、執行指定測試及證據新鮮度提示，不自動略過測試或宣稱全專案通過。未知變更擴大候選並提示人工審查，必須保留失敗退出碼、完整日誌及未驗證項目。

## 驗收

1. 角色入口可定位各自任務、程式與條件式參考；工作板只保留當前狀態、近期完成及未決事項索引。
2. 歷史八份內容除相對連結轉換外完整保留，對照 before 核驗；原有必要限制在短入口或明確條件式連結中可找到。
3. 導航及選測以實際本地路徑為準，含全域介面、共用 CSS、HTML 載入及測試邊界；不把 terminal fixture 當作規則覆蓋。
4. 工具自測涵蓋已知／未知／文件變更、依賴變化、失敗、來源在測試中改變、路徑及輸出保護。測試只用暫存資料；另對本專案低成本工具測試作一次真實執行驗證。
5. 工程師審查及必要補正後，產品核對最終範圍、連結、導航與摘要。未改 JS／CSS，不觸發遊戲資源版本寫入或全套瀏覽器回歸。

## 交付

已實作八份短入口、八份完整歷史封存、根規範讀取入口、導航／選測／隔離執行／證據檢查 CLI、手冊及工程流程接入。八份常用入口原 133,951 bytes，現 20,505 bytes，減少約 84.7% 的入口文件量；不是 token 節省實測，完整歷史仍保存。

文件證據：[原文封存及連結檢查](../../../test-results/workflow-004-docs.json)。八份 archive 對照 before，僅調整相對連結後全文等價；active 本機連結／fragment 及 archive 本機連結無缺失。根原權限與交付條款保留。初版 map 全量輸出過長已改為 712 bytes 區域目錄，指定區域再展開。

產品驗收中發現跨 Agent 啟動環境造成舊證據保守失效，已補正受控子程序環境並驗證無關變數排除／相關變動失效；保守選測另加優先候選，仍不自動省略套件。

最終 d 版：[工具自測 16 項](../../../test-results/workflow/workflow-004-selftest-20260925d/report.json)、[範圍工具 8 項](../../../test-results/workflow/workflow-004-change-scope-20260925d/report.json)均通過，完整日誌在各目錄 `run.log`，before／after 相同。工程師另實跑 11 個風險案例及 4 個環境案例，跨 Agent inspect 最終證據均 unchanged；未機械式重跑上述 16＋8。舊 a／b／c 是歷史結果，不冒稱最後版本新鮮證據。

[工程審查](../../../test-results/workflow-004-review.md)結論可交付，無本次相關未解 P0／P1／P2。工程凍結時 23 檔、0 範圍外差異，證據留在工程師的 `test-results/workflow/review004-independent/scope-final.json`；產品核對導航、已知／未知選測、跨 Agent 證據及根權限後驗收通過。具體檔案與唯一主責見本單開頭及 before 的精確清單；後續可直接從[工具手冊](../../workflow-tools.md)使用。

結案時另一產品工單 WORLD-CORE-001 開始，因此[後續 after](../../../test-results/change-scopes/WORKFLOW-EFFICIENCY-004-after.json)保留 `REVIEW_REQUIRED`，不擴白名單求退出 0。2026-09-25 已由任務 `01a0c3f1-3e13-7950-91ee-b52434ba4169` 回覆確認：使用者授權討論新提供的 15 節世界觀，該產品唯一寫 `docs/design/story/WORLD-CORE-001.md`／WORKBOARD 的 WORLD 索引，劇情子 Agent 唯一寫 `docs/design/WORLD-CORE-001-story-discussion.md`。本輪已停止寫入並釋出 WORKBOARD／角色入口；其後 STORY 入口追加 WORLD 參考亦由該產品另單列範圍。本輪不修改、還原或把 WORLD 內容算成自己的程式驗收；並行文件不影響凍結工具與測試依賴。

限制：導航及依賴清單手動維護，Node 需在 PATH；瀏覽器套件僅列候選，未重跑遊戲或真機測試。證據不具作者鑑識／防竄改保證。後續五個實作任務才觀察實際耗時、讀取與返工；尚未量測 token 前後差異，不承諾節省比例。程式責任拆分及本機 Git 評估尚未執行。
