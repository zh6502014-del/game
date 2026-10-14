# 本機存放區與封存查找

原稿、設定圖集、工單與歷次驗收輸出完整保存在桌面 **`../Game_claude_存放資料夾/`**。PROJECT-SLIM-091（2026-10-14）沿用使用者同意的外部存放方式，現用遊戲素材仍在專案 `assets/`；所有圖片保留原始 bytes，未降低畫質。

| 外部存放區相對位置 | 內容 |
| --- | --- |
| `batches/PROJECT-SLIM-091/project-files.tar.gz` ＋ `manifest.json` | 新增原稿、設定圖集、工單、測試輸出與暫存共 634 檔；全部實際還原並核對 SHA-256、權限及時間 |
| `batches/PROJECT-SLIM-091/retired-assets.tar.gz` ＋ `retired-manifest.json` | 61 張已確認無目前使用處的舊 runtime 素材，無損保存；不應覆蓋現用素材 |
| `batches/PROJECT-SLIM-091/` 其他 JSON、程式與說明原文 | 逐檔盤點、外移清單、依賴檢查、操作與驗收證據、修改前原文 |
| `storage/project-history.tar.gz` ＋ `project-history-manifest.json` | 090 的 302 份設計與歷史驗收文件；新舊同名檔以 091 為準 |
| `storage/source-art.tar.gz` ＋ `source-art-manifest.json` | 早期 524 份原稿與紀錄 |
| `storage/source-art-new.tar.gz` | 後續 111 份原稿與紀錄 |
| `storage/source-art/` | 090 搬出的 165 份原稿；091 新原稿另在上列新批次中 |

本專案保留的 `source-art-manifest.json`、`project-history-manifest.json` 與 `moved-files.json` 都是早期索引，並非目前所有原稿或本次外移的完整清單。

## 設計工單與歷次驗收資料

從專案根目錄還原新批次至尚不存在的暫存目錄：

```sh
python3 scripts/source-art-archive.py restore --archive '../Game_claude_存放資料夾/batches/PROJECT-SLIM-091/project-files.tar.gz' --manifest '../Game_claude_存放資料夾/batches/PROJECT-SLIM-091/manifest.json' --output /tmp/nightfall-091
```

然後讀 `/tmp/nightfall-091/docs/design/`、`storage/source-art/` 或 `test-results/` 下的同名路徑。需要較早資料時：

```sh
python3 scripts/source-art-archive.py restore --archive '../Game_claude_存放資料夾/storage/project-history.tar.gz' --manifest storage/project-history-manifest.json --output /tmp/nightfall-history
```

命令會先完整驗證，拒絕覆寫既有目的目錄；把 `restore` 改成 `verify` 並省略 `--output` 可只驗證。新舊同名設計文件以 091 為準；封存不改變工單狀態。圖集若引用現用 `assets/`，可將目前專案的該目錄複製到暫存目錄相應位置再預覽。`/tmp` 只用於暫時查閱，永久備份請保存外部封存包。

## 原稿驗證與恢復

較新原稿先查 091 的 manifest；早期 524 份可用：

```sh
python3 scripts/source-art-archive.py verify --archive '../Game_claude_存放資料夾/storage/source-art.tar.gz'
python3 scripts/source-art-archive.py restore --archive '../Game_claude_存放資料夾/storage/source-art.tar.gz' --output /tmp/nightfall-source-art
```

新增封存、散檔、早期封存是不同批次，勿互相覆蓋。需要生成工具的 `storage/source-art/...` 時，僅將必要原稿放回工作位置，修改後另存新版本並驗證，不把舊備份當新成果。

Git 預設不收錄原稿與大封存，GitHub clone 無法還原這些本機資料；外部存放區需另行備份。本次未推送 GitHub。`test-results/` 供測試再產生輸出，測試程式與 fixtures 保留。解壓、測試或新增素材會再次增加容量與項目數。

完整交付與限制：[PROJECT-SLIM-091](../docs/PROJECT-SLIM-091.md)。
