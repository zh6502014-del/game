# 本機存放區

此處保存遊戲執行不需要的原稿封存與音訊原檔。2026-10-09 整理時已刪除舊備份、預覽、暫存與未採用素材。
Git 預設只收錄本說明、[搬移索引](moved-files.json)與[原稿雜湊清單](source-art-manifest.json)，其餘內容由 `.gitignore` 排除。這些資料不會隨 GitHub clone 回來，請另外備份本機原稿。

| 目錄 | 內容 |
| --- | --- |
| `source-art.tar.gz` | 無損封存的原始美術、生成紀錄、舊 PNG 與原始卡框；重複內容於 tar 內共用 |
| `source-art-manifest.json` | 524 個原檔的路徑、SHA-256、bytes、mode 與修改時間 |
| `source-art-new.tar.gz` | 封存後新增工單的原稿（GUN-UNIFY-084、H1-VALVE-080/081、H2-EVE-HAND-FIX、RIN-WANTED-072、SHIELD-RHYTHM-077），需先執行下方 `restore`，再以 `tar -xzf storage/source-art-new.tar.gz -C storage` 解入同一目錄 |
| `source-audio/` | 音效原檔 |

`test-results/` 為測試工具輸出位置，執行測試時自動產生，不加入 Git；舊輸出已清除，依賴舊基線的歷史工單測試需重建基線。
`docs/archive/` 保留可版本管理的歷史文件與決策；有助理解專案，不屬執行素材。

搬移日：2026-10-07；工單：[PROJECT-CLEANUP-062](../docs/design/PROJECT-CLEANUP-062.md)。歷史證據、備份內的舊路徑與雜湊維持原貌，追溯時依搬移索引換算位置；若舊證據工具判為失效，應重跑受影響驗證。


## 原稿驗證與恢復

在專案根目錄執行：

```sh
python3 scripts/source-art-archive.py verify
python3 scripts/source-art-archive.py restore
```

工具先驗證封存包及每個原檔的 SHA-256，再還原至 `storage/source-art/`；相同內容會恢復為各自獨立檔案，編輯一份不會連動另一份。目的目錄已存在時會停止，不覆寫原稿；失敗不留下部分還原結果。預設來源封存包留在本機，不隨 GitHub clone 提供。

原稿來源 metadata 和歷史工單中的 `storage/source-art/...` 仍是還原後的有效路徑，平時可先查 manifest 確認封存內容。封存不縮圖、不轉換圖片、不丟棄透明度，也不變更 runtime 素材。還原會增加約 837 MiB 空間，完成編輯後請重新建立並驗證新的封存再整理，勿把舊封存誤認為新修改的備份。

工單：[ART-STORAGE-063](../docs/design/ART-STORAGE-063.md)。
