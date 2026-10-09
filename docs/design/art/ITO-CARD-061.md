# ITO-CARD-061｜伊藤增援角色卡漏換

2026-10-04。使用者回報伊藤角色卡沒有更換成功，要求檢查。產品主責 root。

## 範圍及發現

S3 的 master 已引用 assets/characters/enemies/ito.webp；H1-king 的 louis-armored.transform.rescue.units[id=itou].portrait 仍引用 assets/characters/swordsman.webp，導致增援卡顯示朔。現有伊藤 WebP 可正常檢視。

唯一寫入者 product：story-campaign.js 僅上述 portrait 字串、Nightfall-Duel-Story.html 僅必要資源版本、本工單及WORKBOARD本列。不得改數值、增援條件、劇情、其他素材或現有存檔。沒有新增圖片。

修改前基線：test-results/change-scopes/ITO-CARD-061-before.json。當前檔案為基準，不回退前輪或其他AI改動。工程師唯讀執行碼，只寫 ITO-CARD-061-review.md 與 test-results/ITO-CARD-061/ 證據。

## 驗收

產品核對精確 JSON 差異只此 portrait，執行版本更新與版本測試。工程師獨立檢查實際差異；用隔離 fixture 與正式 engine/UI 檢查 S3 圖片，以及取自真實 H1-king config 的 rescue 在觸發後保留portrait且卡面成功載入。fixture 可縮短王室覺醒條件（只有一名英雄、目標1HP）以定向觸發，不冒充完整最終戰；不寫真實存檔。不需整套遊戲回歸。

## 狀態

已修正單一素材引用；公開引擎定向檢查通過，瀏覽器畫面尚未驗收，不標完整驗收完成。未驗證完整正式章節、真實既有對局與實體手機。


## 交付證據與限制

- 修改檔案：story-campaign.js 只有 H1-king 的 itou portrait 由朔改為 `assets/characters/enemies/ito.webp`；Nightfall-Duel-Story.html 只有 campaign 資源 query 版本。工單與工作板同步。
- `test-results/ITO-CARD-061/product-check.json`：相對可信基線，整份 campaign 內容精確只有一個字串替換；現有伊藤素材可解碼顯示，未新增/替換圖片檔。
- `engine-check.json`：公開 `Engine.create/act` 定向通過 S3 師父圖片映射、H1 覺醒後增援伊藤的圖片路徑。使用真實配置的副本，僅 fixture 移除其他同伴/衛兵、將王室敵人初始生命設1以定向觸發；並非完整最終戰驗證，沒有真實存檔操作。
- 產品執行版本腳本，`tests/asset-versions.py` 107筆通過；scope 檢查無清單外差異。未重載使用者對局。
- 瀏覽器 `verify.cjs` 初次本機監聽 EPERM，0案例；`results.json` 與 `environment-failure.json` 保留失敗。升權重跑未收到核准/拒絕/執行結果，工具最終回報 aborted by user after 239.1s，不能宣稱自動審核拒絕或瀏覽器已通過。停止追加瀏覽器嘗試，保留UI未驗證限制。
- 後續依賴：瀏覽器環境可用時核對最終卡面；既有已載入對局不強制刷新，下一次載入更新後的故事頁再進戰鬥才取得新配置。
