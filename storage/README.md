# 本機存放區與封存查找

PROJECT-BUDGET-090（2026-10-12）依使用者同意，將原稿、生成紀錄、舊備份及暫存包移到桌面的 **`../Game_claude_存放資料夾/`**，共 204 檔、1,265,464,926 bytes。每個來源與目的檔案的 SHA-256 全部核對一致後，才移除專案內的副本。這是分開存放，並非把所有原稿壓縮到 1 GB 內；請另外備份該資料夾，它不會隨 GitHub clone 回來。

| 位置 | 內容 |
| --- | --- |
| `../Game_claude_存放資料夾/storage/source-art.tar.gz` | 早期 524 份原稿與紀錄，無損 tar.gz，重複內容以 hard-link 共用 |
| `source-art-manifest.json` | 上述 524 份原稿的 SHA-256、bytes、權限及修改時間，保留在專案供查找 |
| `../Game_claude_存放資料夾/storage/source-art-new.tar.gz` | 後續新增的 111 份原稿與紀錄，保留原封存 |
| `../Game_claude_存放資料夾/storage/source-art/` | 最近角色統一、角色設定集、坦克與檔案牆等 165 份原稿 |
| `../Game_claude_存放資料夾/storage/` 其他目錄 | 音訊原檔、替換素材、卡框原稿及備份工具，保留原結構 |
| `../Game_claude_存放資料夾/relocation-manifest.json` | 本次外移 204 檔的完整路徑與 SHA-256 |
| `../Game_claude_存放資料夾/organization-before/` | 本次修改前的協作與說明文件 |
| `project-history.tar.gz`、`project-history-manifest.json` | 302 份設計文件及舊驗收產物的無損封存與清單 |
| `moved-files.json` | 2026-10-07 整理時的歷史搬移索引；不是本次外移清單 |

## 原稿驗證與恢復

在專案根目錄執行，指定現在的外部封存位置；工具預設的舊封存路徑已無檔案，需保留這些參數：

```sh
python3 scripts/source-art-archive.py verify --archive '../Game_claude_存放資料夾/storage/source-art.tar.gz'
python3 scripts/source-art-archive.py restore --archive '../Game_claude_存放資料夾/storage/source-art.tar.gz' --output '../Game_claude_存放資料夾/restored-source-art'
```

工具拒絕覆寫既有目的目錄，驗證封存包及每個原檔的 SHA-256；相同內容會恢復成獨立檔案，編輯一份不會改到另一份。原稿封存與新增封存互相獨立，外移資料夾的 `storage/source-art/` 是較新的另一批原稿，勿用舊封存覆蓋。需查新增封存時，可先用 `tar -tzf '../Game_claude_存放資料夾/storage/source-art-new.tar.gz'` 查看路徑，再於獨立空目錄解開。

所有圖片均保留原始 bytes，未縮圖、轉檔或改遊戲畫質。需要改圖或生成工具依賴 `storage/source-art/...` 時，只將所需原稿複製回專案相應路徑；作業後核對新版本保存位置，再重新整理。不要拿舊封存當成新修改的備份。

## 設計工單與歷次驗收資料

`docs/design/`、`docs/archive/`、`test-results/` 共 302 份文件與產物保存在 `project-history.tar.gz`（39,494,823 bytes），逐檔清單為 `project-history-manifest.json`。現用角色美術規範及測試依賴文件另保留原位。封存未改變任何工單的完成、待驗或進行中狀態，內部使用原本相對路徑。

在專案根目錄執行下列指令，還原到尚不存在的專案外目錄（若已存在，請改用新名稱）：

```sh
python3 scripts/source-art-archive.py verify --archive storage/project-history.tar.gz --manifest storage/project-history-manifest.json
python3 scripts/source-art-archive.py restore --archive storage/project-history.tar.gz --manifest storage/project-history-manifest.json --output /tmp/nightfall-project-history
```

之後從 `/tmp/nightfall-project-history/docs/design/` 查工單、`docs/archive/` 查歷史文件、`test-results/` 查舊證據。例如原 `docs/design/ui/MOBILE-UI-066.md` 對應還原目錄中的同名檔案。`/tmp` 只適合暫時查閱，永久保存請備份封存包。

`.gitignore` 預設只收錄本說明、歷史搬移索引和早期原稿清單；大封存及新清單留在本機。GitHub 網頁拖曳不會套用 `.gitignore`。本次未上傳或同步 GitHub。

`test-results/` 保留空目錄供測試輸出；測試程式及 fixtures 未更動。重新測試、產生新素材或解壓到專案內會增加項目數，目前上限不是永久自動保證。需要舊基線的測試，請先從封存恢復其必要資料。

本次只驗證檔案保存、引用與容量，未重新執行全部遊戲功能。詳見 [PROJECT-BUDGET-090](../docs/PROJECT-BUDGET-090.md)。
