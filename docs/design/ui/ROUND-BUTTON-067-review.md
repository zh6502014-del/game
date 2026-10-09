# ROUND-BUTTON-067 工程審查

2026-10-08，工程师唯讀執行碼；僅寫本報告與本單測試證據。

結論：本地程式修改可交付產品，靜態審查未發現相關 P0／P1／P2；實際畫面驗收尚未完成，不能將本報告當作瀏覽器正圓／全尺寸驗收通過。產品應更新工單原定的畫面驗證承諾與狀態，明列限制。

基線：`test-results/change-scopes/ROUND-BUTTON-067-before.json`。獨立 scope 與精確 diff：`test-results/ROUND-BUTTON-067/engineer-scope.json`，結果 WITHIN_FILE_SCOPE，無清單外差異。核對實際語意：CSS 僅三行變更；HTML 僅 duel-stage.css 版本；工作板僅本單新增列；工單僅本單說明。快照不證明作者身份或基線以前的歷史。

- `src/css/duel-stage.css:263`：同式 width／height `max(44px,calc(46 * var(--u)))`；`:264` 明確 border-box、min-height:0 與 aspect-ratio:1，保留 50% 圓角及零 padding。高 specificity + important 勝過 `src/css/ui-controls.css:13` 的 44px min-height 以及早載入的按鈕樣式。雙軸相等為主要保證；aspect-ratio 是輔助。
- `src/css/duel-stage.css:272`：第二顆 right 使用同一44px下限，第三顆右側固定，兩者外框間距仍10px。絕對定位不受 flex shrink 壓縮。
- 桌面規則位於 `:8` 的 min-width:900px、min-height:521px、landscape 條件內。`src/css/mobile-layout.css:3` 的 max-width:899px 或 max-height:520px 與其互斥；窄直向及矮橫向矩形導覽未被本次修改。
- `Nightfall-Duel-V12.12.39-Test.html:22` 僅更新CSS雜湊，載入順序未變。JS、RNG、規則、存檔及事件未修改。無新增素材。

本次實跑：scope check（上述JSON完整保存diff）；`python3 tests/asset-versions.py` 通過117項，原始日誌在 `test-results/ROUND-BUTTON-067/engineer-asset-versions.log`。已讀共用control、visual-system、arena-finish、landscape、mobile樣式與正式HTML順序做人工層疊核對。未沿用舊瀏覽器測試結果。

未驗證：本輪CUA對file://本地fixture有URL協定安全政策拒絕；依交接限制未啟動替代瀏覽器、raw CDP或HTTP伺服器繞過。未測瀏覽器 computed style、實際像素／圖示視覺、點擊、各尺寸溢出及真實既有對局。未推送或發布；沒有將靜態推導冒充畫面實測。後續依賴為產品對驗收限制的如實記錄與最終驗收。
