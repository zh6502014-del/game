# PROJECT-BUDGET-090｜獨立工程檢查

審查角色：engineer；日期：2026-10-12。除本報告外全程唯讀，不重跑會產生遊戲測試輸出的套件。

## 結論

可交付，待產品加入證據包後完成最終容量驗收。保存性、改動範圍及當前容量門檻通過；初審 1 項 P2 說明依賴已補正並複審通過，沒有未解的本次 P0／P1／P2。此結論不代表遊戲全狀態驗證。

### 初審 P2（已補正）：現用美術規範仍提供已失效的原稿恢復指令

- 位置：`docs/art-asset-budget.md:7`。
- 觸發：依 AGENTS 的新美術必讀入口，執行其中 `python3 scripts/source-art-archive.py restore`。
- 影響：本次移走 `storage/source-art.tar.gz` 後，工具預設來源已不存在，恢復指令會失敗。`storage/README.md` 已有正確新路徑，但現用規範未同步。
- 建議：只修正該段指令／連結至新存放區恢復說明；保留修改前文件並納入本次允許文件範圍，無須更動工具或 runtime。

### 補正複審

`docs/art-asset-budget.md` 僅原稿存放段落變更，已改為指定桌面外部封存並連結現行恢復指引，明確避免舊預設路徑；其餘規範未變。外部 archive 及指引目標存在。修改前原文在 `/tmp/game-folder-090/text-before/docs/art-asset-budget.md` 與桌面外部 `organization-before/docs/art-asset-budget.md` 的 SHA-256 均與任務前 inventory 相同；工單記錄了精確追加範圍。此 P2 已解決。

## 本次獨立實跑

- 以 `/tmp/game-folder-090/inventory-before.json` 的 1,399 檔基線逐檔 SHA-256 核對現存原檔、外移目的、完整還原資料及修改前文件。全部可找回：894 檔原位相同、204 檔外移、297 檔取自歷史還原、4 檔取自修改前說明。此分組優先選原位；封存本身包含 302 檔。
- 獨立讀取 `storage/project-history.tar.gz` 全部 members，核對封存 SHA-256、逐檔 SHA-256、完整路徑集合及 member 類型；302 檔、42,531,929 原始 bytes 全部符合 manifest。沒有絕對路徑、父路徑越界或重複 archive path。
- 對產品實際完整還原的 `/tmp/game-folder-090/history-restored` 逐檔核對內容、權限與修改時間，302 檔通過。
- 核對桌面 `Game_claude_存放資料夾/relocation-manifest.json` 的全部 204 檔：SHA-256、bytes、權限及修改時間都符合基線，合計 1,265,464,926 bytes。
- 遊戲入口、JS/CSS、runtime 素材、設定、工具、測試與 fixtures 的 870 個受保護檔案 SHA-256 全數未變。系统 `.DS_Store` 另按外移範圍保存。
- 比對實際新增、修改與移除檔案：初審新增工單、歷史索引、封存及 manifest 共 4 檔；文字修改為 README、AGENTS、工作板、storage 說明、design 索引共 5 檔。其餘消失散檔均有已驗證保存位置，未發現超出整理範圍的程式改動。
- 盤點全目錄（含隱藏檔、不含最外層根目錄）：初審為 903 檔＋89 資料夾＝992 項，107,908,469 bytes，無 symlink。報告、補正及證據包加入後，產品必須再次盤點；本數字不是交付最終數字。
- 搜尋 runtime、工具、設定與測試對 `storage/`、`docs/design/`、`docs/archive/`、`test-results/` 的引用。直接讀取的 narrative 與 PLACEHOLDER 文件仍在原位。已存在的六份 scope 基線未被現有測試以固定路徑讀取；查到的舊比較基線在本次 before 已不存在，不歸因本次整理。原稿生成工具按說明恢復必要原稿後才可使用。

## 沿用證據

- `/tmp/game-folder-090/asset-versions.log`：63 個本機 JS/CSS 版本引用與 CSS bundles 通過。相關工具、入口與遞迴 CSS/JS 原文已由本次 SHA-256 核對未變；未另產生版本或 bundle。
- 產品建立封存與完整還原的操作腳本，以及原稿封存驗證 524 檔的結果。獨立審查另核對所有外移 archive 檔案 bytes 與原始基線一致，未重新展開 524 檔原稿。

## 未驗證與限制

沒有重新遊玩、手機真機驗證、執行全部遊戲測試或推送 GitHub。目錄數量只代表盤點時點；測試產物、解壓、新增檔案均會增加項目。外部原稿約 1.3 GB 已明確另列，未計入使用者同意分開存放後的專案門檻。Git 預設不收錄封存，GitHub clone 無法單獨還原本機原稿與工單，需要另外備份；README 及 storage 說明已揭露此限制。
