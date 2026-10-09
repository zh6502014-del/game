# STORY-SKIN-016｜故事外觀收藏去除占位

2026-09-25，產品驗收通過。使用者要求有明顯差別的 Skin 才保留收藏價值，沒有特別需要的移除。

## 範圍與主責

產品唯一寫 `story-campaign.js`／`story-mode.js` 的收藏與獎勵呈現、`tests/story-skin-collection.cjs`、本工單；美術 Agent 唯讀查看四職業基礎／正式 Skin 實圖，判斷差異。工程師凍結後唯讀審查，只寫 `test-results/story-skin-016-review.md`。

[修改前基線](../../../test-results/change-scopes/STORY-SKIN-016-before.json)。CARD-DROP-040 同期持有 `game.js`、HTML、WORKBOARD 及 workflow-map；本單不並寫。HTML 整合待對方釋出後另存基線，或交其唯一整合者共同同步。

## 判斷與保持

現況每條起源三個收藏：前兩個使用基礎角色圖且標「Skin 待製作」，第三個才有獨立圖及裝備功能。移除無獨立外觀的八個占位收藏與通關解鎖承諾；四套正式外觀已由美術逐張對照基礎圖，確認並非同圖裁切，保留。一般章節完成仍保存進度及線索，不能刪除章節或改 node／step／證據 ID。

| 保留外觀 | 實圖差異 |
| --- | --- |
| 凜・斷羽 | 染血繃帶右手、破羽肩飾、收刀垂手，與基礎姿態有別 |
| 朔・逆命之刃 | 白金破損衣袍、染血手／刀及護人動作，取代深綠披肩 |
| 格蘭・初壁 | 無頭盔、蹲身抵裂盾與撤離人群，呈現起源救援狀態 |
| 伊芙・餘燼 | 白研究袍、短槍及懷抱文件，與基礎紅衣長槍區別明確 |

不改解鎖條件、V1／V2／Skin 儲存鍵、既有裝備、規則、AI、RNG、劇情正文或素材原檔。新素材 0。正式及舊原型入口均不得再顯示不存在的 Skin 獎勵；只在實際外觀解鎖時提示收藏裝備。

## 必要驗收

獨立頁面／存檔驗未完成、部分完成、全解鎖與既有裝備；收藏只含真實外觀，一般／正式獎勵提示正確，重玩不新增收藏；desktop／mobile實圖、無橫向溢出、裝備／還原及刷新相容。原型 fallback 收藏同步移除占位，不改其進程規則。沿用測試 helper 的終局 fixture 不當完整戰鬥證據。

執行定向 UI 測試、既有 `tests/skin-store.cjs` 的儲存相容性；只對相關差異審查，不重跑全遊戲。整合者最後執行 `scripts/version-assets.py` 與 `tests/asset-versions.py`，記錄並行範圍歸屬、實測與未測項目，工程複審與產品驗收後結案。

## 實作與驗證

正式戰役與原型收藏均只呈現四套真實外觀，名稱改為「外觀收藏」；原型收藏計數改為實際 0–4，章節數保留 0–12。一般章節不顯示占位獎勵或引導到收藏；真正完成起源才顯示外觀解鎖。保留原始 `reward` 文稿資料，不修改 ID、解鎖、保存或裝備 API。

產品實跑 [定向 UI 報告](../../../test-results/story-skin-016-kRkM79/report.json)，五組情境通過：新／部分存檔、A1 正常完成、A3 解鎖／裝備／刷新／重玩、V1 四職業既有裝備及還原、舊原型 fallback。沒有用戰鬥 terminal 注入；只走 A1／A3，未宣稱完整故事或戰鬥規則回歸。1440×900／390×844 實際圖片無橫向溢出，產品已看 [桌面](../../../test-results/story-skin-016-kRkM79/collection-1440.png)與[手機](../../../test-results/story-skin-016-kRkM79/collection-390.png)。

既有 `tests/skin-store.cjs` 實跑 30 儲存案例＋128 個真實 campaign 前綴比較通過，覆蓋 V1／V2／session、損壞及阻擋儲存、裝備持續性。UI 測試使用獨立隨機 port／瀏覽器 context，不修改真實存檔。

失敗紀錄：第一次啟動遭沙箱禁止本機 listen，改用授權測試環境；一次自動權限審查逾時後依工具指示重試成功。首次 UI 跑到 A3 重玩時，因遊戲正確預選下一條故事線，測試未切回凜而找不到 A3；已修正定位器、保留 [失敗報告](../../../test-results/story-skin-016-hVi3ST/report.json)，未放寬收藏／進度斷言。修正後全份定向套件通過。

未驗證真機／Safari、所有節點或戰鬥平衡；沒有新增／替換素材，不跑新素材容量檢查。最終版本整合與工程結果另補。

### 工程補正及並行歸屬

初審 P2 已補正：舊原型普通通關 notice 及 challenge won 分支改為章節完成，只有第三節點顯示真實外觀解鎖。定向測試新增 fallback A1 真正完成後返回地圖，確認無占位獎勵／解鎖文字。補正後 kRkM79 五組 PASS，報告 before/after 完全相同；storage 30＋128 再跑 PASS。先前 Toi0lF 留作歷史證據，不作最終來源驗收。

STORY-ROUTE-013-IMPLEMENT 產品已確認同期寫入 T1 route 常數、地圖描述、stage/proceed 接線，基線見 `test-results/change-scopes/STORY-ROUTE-013-IMPLEMENT-before.json`；不歸入016，不覆蓋其改動。016已交出campaign寫權，story-mode收藏補正完成後亦凍結。主產品 CARD-DROP-040 持有 HTML、WORKBOARD、workflow-map；017劇情文件及route/data/helper等並行改動不屬本單。最終UI驗證已包含目前route接線版本，但不代表驗證T1迷宮功能。

工程師最小複審已通過（含 NAV 的 manual suite／依賴及索引登記），未留已確認 P0／P1／P2，見 [審查報告](../../../test-results/story-skin-016-review.md)。產品已查看最終 kRkM79 手機畫面；資源版本待共同整合。scope 仍為 REVIEW_REQUIRED，包含 route/data/helper、017／018文件、040測試及其他產品持有的 HTML/config/board；不將並行差異宣稱為本工單修改。

### 最終整合

013來源凍結後，主產品唯一執行資源版本同步；[版本檢查](../../../test-results/card-drop-040-asset-versions.log) PASS：85個本機JS/CSS引用符合內容雜湊；[整合記錄](../../../test-results/card-drop-040-evidence.json)保存HTML雜湊。產品再次核對kRkM79的七項來源，全部與目前一致，無需重跑UI。程式／NAV複審無未解問題，產品驗收通過。僅本工單範圍完成；不宣稱013、017、018功能驗收。
