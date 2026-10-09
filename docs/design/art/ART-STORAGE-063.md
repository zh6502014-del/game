# ART-STORAGE-063｜美術原稿無損封存

2026-10-07。使用者要求整體資料夾降低容量，並明確選擇「無損封存原稿，遊戲畫質不變」。

## 範圍與唯一寫入者

- 產品：將 storage/source-art/ 的524個原檔建立標準 tar.gz；完全相同內容只保存一份，其他路徑採tar hard-link紀錄；建立 storage/source-art-manifest.json 逐檔 SHA256/bytes/mtime/mode，原稿及生成紀錄完整保存。
- 封存檔完成逐檔驗證及完整解壓還原測試後，產品才移除被封存的散裝副本；任何文件雜湊或清單不同皆停止。解壓工具將hard-link還原為獨立檔，避免後續編輯互相影響。
- 工程實作唯一寫入者：scripts/source-art-archive.py、tests/source-art-archive.py。只提供 verify/restore，不做刪除或執行任意archive內容。拒絕路徑越界、symlink、未宣告檔、hash/size不符及覆寫現存目的地；失敗清除本次暫存，不碰既有原稿。先驗證再atomic安裝，restore保留原始metadata。生成工具既有source-art路徑不變，改图前須還原。
- 工程師另唯讀審查，僅寫 docs/design/art/ART-STORAGE-063-review.md。
- 產品文件：本工單、README.md、storage/README.md、.gitignore（允許manifest但不允許大封存包）、docs/agents/WORKBOARD.md、docs/art-asset-budget.md原稿現況與恢復指引。不改runtime/美術像素/素材URL/故事/AI/RNG/存檔，不觸動其他storage資料。

## 基線與驗收

基線 test-results/art-storage-063/before.json：524個原稿檔、836.87MiB；42組重複內容可省102.31MiB。runtime基線 runtime-baseline.json。新增工具在本工單前不存在，保留第一次review前版本及最終diff。

必要驗收：工具定向測試、獨立審查、tar全體524路徑與bytes/hash核對、完整restore後逐檔及metadata核對、重複原稿恢復為独立檔、runtime所有hash不變、整體實際bytes與磁碟用量前後比較。未新增/替換runtime圖片，不需美術strict重跑；未改JS/CSS，不更新版本。

狀態：工程審查及產品驗收通過。全體封存／還原驗證成功並再次核對現存原稿後，已移除對應散裝副本。


## 實際交付

- `storage/source-art.tar.gz`：761,829,740 bytes（726.54 MiB），標準gzip tar；480份不同內容＋44條重複路徑紀錄，合計524個原檔。`storage/source-art-manifest.json` 保存全部原始SHA-256、bytes、mode與mtime_ns及封存包SHA-256。
- 原稿原先877,519,343 bytes（836.87 MiB），無損封存省115,689,603 bytes（110.33 MiB）；未降低解析度、畫質、透明度或丟棄生成記錄。
- 全專案檔案總量由1,074,187,468 bytes（約1.074 GB）降至約958,662,000 bytes（約0.959 GB；最後驗收文件增加少量bytes）。磁碟du量約928 MiB，亦低於十進位1 GB；檔案bytes與檔案系統配置量不同，沒有混用兩者計算節省值。
- 新增 scripts/source-art-archive.py 與 tests/source-art-archive.py；README.md、storage/README.md、美術規範加入恢復方式；.gitignore允許小型manifest且繼續排除大封存包；工作板僅更新本單。

## 驗收

- 獨立工程師實跑15項工具測試全數通過，[審查報告](ART-STORAGE-063-review.md)無本次P0/P1/P2。
- 標準tar串流逐檔驗證524路徑、hash及bytes相符；產品完整restore至/private/tmp獨立目錄，524檔hash、bytes、mode、ns mtime全相等，所有重複內容恢復成獨立inode；驗證後刪除測試用還原目錄。
- 退役散裝前，再次比對manifest與before基線、封存SHA及全部現存原稿清單/hash/bytes/mode/mtime，確認無新增或變更後才移除storage/source-art/。
- runtime assets/src共569檔hash零變更，沒有新增runtime素材；無需重跑畫質、資源版本或整場遊戲測試。
- Git預計收錄約49.2 MiB；storage僅納入README、搬移索引及source-art manifest，沒有把762MB封存包加入Git。
- 證據：test-results/art-storage-063/ 的 before.json、archive-independent-verify.json、full-restore.log、roundtrip.json、runtime-verification.json、git-upload-check.json、final.json。所有驗收均不使用真實存檔。

## 限制與後續依賴

封存保留在本機，不隨Git clone返回。未來編輯／生成原稿先執行 `python3 scripts/source-art-archive.py restore`；還原需約837MiB空間且拒絕覆寫既有目錄。舊生成工具的storage/source-art路徑維持有效，但需先restore。restore支援macOS及Linux原子不覆寫安装；本次實測macOS，未實測Linux。一般tar解壓可能保留hardlink，編輯前應拆獨立檔。

本工具只verify／restore，不提供把新修改重新封存的命令。未來原稿改動後須建立新封存、完整驗證再替換，舊封存不會自動同步。文件沒有本輪專用before快照，工具freeze於審查中補存；限制在審查報告明列，不宣稱能追溯文件歷史差異。
