# ITO-CARD-061｜伊藤增援角色卡工程審查

2026-10-04。工程師 archive_material_review；執行碼唯讀。

**精確引用修正的靜態工程審查通過，未發現本次相關 P0／P1／P2。瀏覽器 UI 驗證未完成，不列 PASS。** 產品提供公開引擎的兩案例 PASS 證據，與目前來源 SHA 一致；產品依本輪縮小驗收範圍作最終交付決定。

## 變更與範圍

- 基線為 `test-results/change-scopes/ITO-CARD-061-before.json`。獨立核對 `story-campaign.js:19` 的完整 encounters JSON，唯一差異是 `H1-king.enemies[id=louis-armored].transform.rescue.units[id=itou].portrait`，由 `assets/characters/swordsman.webp` 改為 `assets/characters/enemies/ito.webp`。
- 另核對整份 campaign 文字，恰等於舊檔中該單位 JSON 做一次 portrait 替換；encounters 以外文字完全不變。S3 的 `master` 原先即使用伊藤圖。職業仍為 swordsman，名字、數值、條件、其他增援、劇情與存檔邏輯未改。
- `Nightfall-Duel-Story.html:52` 只有 campaign 資源 query，由 `21fea9f6b5d1` 改為 `6ae6beb7fadb`。新版本符合 campaign SHA 前 12 位；沒有新增或替換美術檔。
- 獨立範圍工具退出 0、WITHIN_FILE_SCOPE、無清單外差異；語意另經上述人工及 JSON 核對，並非只以工具綠燈判定。此結論限本次可信 before 以後，不宣稱歷史修改均合法或可辨識作者。

## 驗證與限制

本次獨立完成：真實文字差異、JSON 差異、HTML 版本差異、scope，及產品引擎證據的 campaign／engine／伊藤 WebP 三個 SHA 全數相符。證據存於 `review-static-check.json`、`review-engine-hashes.json`。

程式閱讀確認 `story-energy-engine.js:65` 保留單位 portrait；`:114` 增援以原 rescue spec 建立單位。`story-energy-ui.js:63` 的 localArt 優先使用同源 portrait，`:71` 建立實際 img，只有載入錯誤才退回職業圖。本次修正正好解除 itou 的錯誤朔圖引用，不需要改引擎或 UI。

沿用產品證據：`product-check.json` 記錄完整檔案單一替換、素材存在及 107 個資源引用版本 PASS；`engine-check.json` 記錄 S3 master 圖片映射及 H1 覺醒／增援 portrait 保留兩案例 PASS。H1 使用真實 config 的副本，僅縮短为一名英雄和 1 HP louis-armored，以公開 Engine.create／act 觸發，不修改正式設定或保存狀態。產品提供實跑核心程式，保存於 `review-engine-method.txt`；工程師核對斷言會檢查 S3 建立後 portrait、攻擊前無 itou、公開 attack 成功、rescue.used 為 true 及增援後 portrait 正確。測試注入固定 RNG `()=>.9`，沒有 create 後直接改 authoritative state，因此確實檢查資料透過變身／增援路徑傳遞；未重跑這份產品測試。引擎驗證不等於瀏覽器顯示或完整最終戰回歸。

瀏覽器部分只建立了隔離驗證腳本 `verify.cjs`，原定兩案例為 S3 卡面，以及 H1 公開鍵盤攻擊後的 itou state／img currentSrc／decode／localStorage。首次执行因本機 HTTP listen EPERM 失敗，**0 案例執行**；`results.json` 與 `environment-failure.json` 保留該失敗。依工具規範請求 require_escalated 後，未收到明確批准、拒絕或執行結果，最後工具回傳 `aborted by user after 239.1s`。沒有證據稱為 automatic approval review 拒絕；不推測原因。產品隨後明確指示停止瀏覽器／升權，工程師未再啟動。

未驗證：瀏覽器的實際伊藤卡面與圖片完整解碼、UI img currentSrc、瀏覽器 localStorage 前後狀態、手機、完整章節、真實既有對局。沒有援軍卡截圖；不宣稱已跑 UI、全戰鬥或完整存檔相容性。未修改執行碼、未碰使用者對局，亦未新增持久測試至 tests。

審查與測試證據均在 `test-results/ITO-CARD-061/`。最終由產品整合回報修正及上述 UI 未驗證限制。
