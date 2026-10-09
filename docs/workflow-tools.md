# 工作流工具｜按任務讀取與驗收

先讀根規範、自己的角色入口及本次工單；此頁是操作參考，不需每次全文重讀。工具僅使用 Python 標準庫，不安裝套件、不改遊戲、不自動略過測試。

## 定位程式

在專案根目錄執行：

```sh
python3 scripts/workflow.py map
python3 scripts/workflow.py map --area story-reading
```

第一個命令只列區域目錄；第二個展開該區檔案、公開介面、依賴與測試候選。另有 `story-search`、`story-puzzles`、`story-energy`、`duel-ui`、`fx-audio`、`art-assets`、`workflow-tools`。

地圖在 [config/workflow-map.json](../config/workflow-map.json)，是維護中的導航，非自動解析的完整依賴圖。新增／移動模組、公開介面或測試時同單更新；使用前核對實際程式與 HTML 載入順序，不從地圖推定整個函式實作。例：

```sh
rg -n --max-columns 240 --max-columns-preview 'compileReadingUnits|function stage' story-campaign.js
```

先找入口，再讀需要的函式與呼叫者；長行展開只針對命中部分。不要為找一個函式印出整個 data 檔、DOM 或工作板。一般搜尋排除 `storage/backups/`、`.backup.`、`test-results/`、`storage/source-art/`；任務涉及證據或素材時明確加入。

## 選測建議

```sh
python3 scripts/workflow.py plan --changed story-campaign.js --changed story-performance.css
```

`--changed` 可重複，接受專案相對路徑及已刪除的檔名。`DOCUMENT_ONLY` 表示此清單只需文件檢查；`SUGGESTED` 列候選；`REVIEW_REQUIRED` 表示含未知影響，保守擴大並要求人工判斷。這些都不是測試已通過。未列入參數的改動不會被發現，先用基線／diff 確認完整改動清單。

`priority_suites` 是與區域及明列依賴直接相關的起點，完整 `suites` 保留保守候選；不是只跑優先項就足夠。共用 CSS、HTML、全域介面與 helper 會使候選擴大。工單明定的驗收優先；工程師可補選，不能因工具漏列就省略必要驗證。瀏覽器套件為 `manual-only`：須依各測試設定準備獨立頁面、HTTP／Playwright 等環境及隔離輸出，工具不擅自啟動它們。

## 執行及保存證據

```sh
python3 scripts/workflow.py run --suite change-scope --output test-results/workflow/TASK-ID-scope-01
python3 scripts/workflow.py inspect --report test-results/workflow/TASK-ID-scope-01/report.json
```

`TASK-ID-scope-01` 換成當次唯一名稱。`run` 只執行登記且允許自動執行的套件，複製其明列依賴到新隔離目錄；既有目錄不覆寫。純 Node 套件需要 `node` 已在 PATH，不自動下載。可先用 `--suite workflow` 驗工具自身。

終端只印短摘要；`run.log` 留完整輸出，`report.json` 留命令、來源及依賴雜湊、環境指紋、退出碼與日誌雜湊。子程序只接收工具明列的執行環境，將實際傳入的環境做指紋比對；變數原值不寫進報告。無關的 Agent 啟動變數不傳入，所需自訂變數必須加入工具政策及審查，不能默默依賴。測試失敗保留非零退出；測試期間來源或依賴副本改變不能算 PASS。產物不是原稿或真實存檔。

`inspect` 比對本次來源／明列依賴、測試、設定、環境及日誌，回 `unchanged`／`changed`／`failed`。環境不同可能使舊證據失效；即使 `unchanged` 也僅供工程師評估沿用，無自動 cache 或省略審查。它不偵測未登記依賴、不證明作者身分，也不抵抗整份報告被人重新製作。失敗與被改動的日誌不會標為可沿用。

只執行本輪受影響驗收；長流程先確認載入、定位器及一次主要操作。失敗先分產品缺陷／測試程式／環境，再重現與修正相關案例。不要用清空日誌或放寬斷言取得通過。

## 交接、審查與整合

交接提供工單、基線、精確 diff、風險及證據路徑；工程師按風險獨立檢查。修正後複審新差異及原故障，不再轉述完整歷史。完整範圍 diff 落檔，先看摘要：

```sh
python3 scripts/check-change-scope.py check --baseline test-results/change-scopes/TASK-ID-before.json
```

需要逐段 diff 時加 `--diff --json` 並重導向本次獨立產物檔，保留退出碼；不要直接把整份 JSON 印進對話。範圍檢查不能替代語意審查。CSS／JS 修改仍由唯一整合者依[工程流程](engineering-workflow.md)同步版本，工具不代為寫 HTML。

五個後續任務的簡短觀察記在各自工單：有效修改／完成耗時、重讀量、輸出量、交接／補正次數、無變更重跑及缺陷。沒有可靠用量就不將字元數宣稱為 token 節省；五個樣本只作下一階段拆分的判斷依據，不增設常駐追蹤 Agent。
