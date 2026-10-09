# ART-STORAGE-063 工程審查

2026-10-07。結論：**工具與封存證據可交付；可進行散裝原稿退役**。產品仍須按工單在移除前重新核對現存原稿與 before.json 完全相等，並完成最終容量與 runtime 核對，再標記任務完成。未發現本次相關 P0／P1／P2。

## 範圍、基線與限制

唯讀審查 scripts/source-art-archive.py、tests/source-art-archive.py、README.md、storage/README.md、.gitignore、docs/art-asset-budget.md、本工單、manifest 及驗收證據；工程师僅寫本報告。兩支工具是本工單新增檔，已全文人工核查。原稿可信基線為 test-results/art-storage-063/before.json；manifest.files 與基線 files 完全相等，含524路徑、SHA256、bytes、mode、mtime_ns，總877519343 bytes。

本輪文件未保存專門 before 快照，不能從現存內容證明歷史差異／作者或宣稱文件歷史無越權；未用062基線冒充063基線。文件現有原稿封存說明與工單授權相符。工具副本在審查中補存 tool-freeze/，不是審查前快照；本次實讀工具SHA256：

- scripts/source-art-archive.py：41ef650bd75f942f78aaef9ab3cc4c141285c0963376d4e2a21e41dd9d067599
- tests/source-art-archive.py：05afc1beacc563adc6d77ba7e93776230ec5eeb1ed96864dc13c5da780a53d97

## 安全與行為審查

- scripts/source-art-archive.py:20 的路徑檢查拒絕絕對路徑、父層、反斜線、空節及磁碟機前綴；manifest拒絕重複及檔案／資料夾衝突。還原只建立自有暫存內的獨立檔，不直接extract archive。
- :88 先核對完整封存SHA256；逐檔核對宣告、大小、SHA256及完整集合，拒絕symlink、目錄及特殊節點。hardlink必須指向已驗證regular檔，還原以複製bytes建立獨立inode，沒有連動編輯風險。
- :125 保留逐檔mode及奈秒mtime。:153 拒絕既有目錄、檔案與懸空symlink；同檔案系統private staging成功後，以:133的macOS RENAME_EXCL／Linux RENAME_NOREPLACE原子安裝，競態建立空目錄也不覆寫。錯誤走finally清理staging；不支援平台明確失敗，不降級為可覆寫rename。
- 沒有runtime、AI、RNG、存檔或遊戲規則變更；.gitignore只新增允許小型manifest，封存包仍排除。原稿與生成紀錄保存bytes，無縮圖、轉碼或透明度變化。

## 驗收證據

本次獨立實跑 `python3 tests/source-art-archive.py`：15項通過（約3.9秒），涵蓋完整回存與metadata、獨立hardlink內容、hash/size錯誤、缺檔/額外/重複檔、路徑越界、不支援節點、既有目的地、安裝競態及失敗暫存清理。已核對測試斷言，未將退出成功冒充內容驗證。

沿用產品完整實測而未重跑大型封存IO：archive-independent-verify.json記錄480 regular＋44 hardlink，共524路徑、877519343驗證bytes；封存761829740 bytes。full-restore.log及roundtrip.json證明完整restore的hash、bytes、mode、mtime_ns皆相等且重複路徑inode獨立，測試還原已清除。runtime-verification.json記錄assets/src 569檔hash未變。

未驗證Linux實機／其他檔案系統、強制終止程序的暫存回收、整場遊戲與所有生成工具；這些不冒充已覆蓋。普通例外清理不等於kill/power-loss清理保證。封存包不隨GitHub clone回來，需另存備份。

## 非阻擋建議

P3已處理：README已補標準tar可能建立hard-link、編輯前須拆成獨立檔的限制，複審確認。預設Python restore沒有此問題。git-upload-check.json另記錄Git只收storage三個說明／索引／manifest檔，封存包排除。
