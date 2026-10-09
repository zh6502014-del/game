# ROUND-BUTTON-067｜本地圓形按鈕修正

2026-10-08。需求：截圖中圓形按鈕應為正圓，先改本地。產品root單一實作者；不發布、不推送。

範圍：src/css/duel-stage.css 桌面landscape的 battle-dock 三顆按鈕幾何與對應右側間距；Nightfall-Duel-V12.12.39-Test.html 僅該CSS版本；本文件及WORKBOARD本列。工程師唯讀，只寫本單review及test-results/ROUND-BUTTON-067/。禁止改JS、操作、存檔、規則、手機矩形導覽樣式或其他素材。

原因：按鈕width/height最低40px，但共用nd-control min-height44px使實際40×44。修正寬高最低都44px，明確清除繼承min-height；右側相邻按鈕間距使用同一新最小尺寸。保留圖示/顏色/圓角與點擊行為。

基線：test-results/change-scopes/ROUND-BUTTON-067-before.json；沒有Git。另存正式CSS完整順序的隔離fixture before.html，不載JS或存檔。原預定產品驗證實際瀏覽器幾何與畫面，因下述安全政策未完成；本輪工程僅核對精確diff、CSS層疊及作用範圍，並完成資源版本檢查。新素材0張。

狀態：本地修正與[靜態工程審查](ROUND-BUTTON-067-review.md)通過；畫面及點擊待驗，未標完整視覺驗收完成。原規劃的小桌面/大桌面實測沒有執行；手機樣式保留僅經media隔離與diff核對。未測真實既有對局，不重載使用者頁面。


## 實作與驗收

- 本地修改僅兩處：桌面battle-dock圓形button寬高下限同為44px，明確min-height:0、border-box、aspect-ratio:1；右側第二顆按鈕偏移中的相鄰直徑同步44px。作用仍限min-width900px/min-height521px/landscape，手機矩形操作列不變。
- `scripts/version-assets.py` 只更新自由決鬥HTML的duel-stage.css query；`tests/asset-versions.py` **117筆PASS**。新圖片0，JS/規則/存檔未改，未push、未發布。
- 真實差異保存在 `test-results/ROUND-BUTTON-067/implementation.diff`。工程師唯讀審查通過，無本輪相關P0/P1/P2；產品接受精確本地修正與版本結果，保留畫面驗收限制。
- 實機畫面未驗證：CUA嘗試開啟隔離before.html的file:// URL時被瀏覽器安全政策拒絕（只允許http/https），並明示不得經替代瀏覽器、raw CDP或其他方式繞過。沒有改用替代手段，沒有重新載入使用者正在進行的對局。before.html只是驗收fixture，不代表已取得瀏覽器截圖或測試通過。
- 後續依賴：可用的本地網頁驗收環境下確認桌面實際寬高與操作。純靜態修正/版本驗證不冒充畫面驗收。
