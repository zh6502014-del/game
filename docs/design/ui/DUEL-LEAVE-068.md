# DUEL-LEAVE-068｜本地對戰離開按鈕

2026-10-08。使用者回報同一自由決鬥頁少了離開按鈕。產品root實作；僅本地，不推送。

範圍：src/js/game.js 的 renderGame nav新增自由決鬥專用離開按鈕，緊接renderGame新增leaveDuel確認導覽helper；src/css/duel-stage.css 的新增按鈕位置及對應桌面/預設dock；src/css/mobile-layout.css 的含離開按鈕自由決鬥dock排列。三入口HTML只由版本工具同步變動資源query。工作板本列及本工單由product。工程師唯讀，僅可寫本單review及test-results/DUEL-LEAVE-068/。

行為：桌面左下戰況旁新增返回箭頭圓按鈕，aria-label/title標示離開對戰返回首頁；手機操作列顯示離開文字。點擊先原生確認未保存對局，取消保留原局，確認導覽本地index.html。頁面卸載結束此遊戲執行環境，不人工重寫AI/戰鬥/存檔。舊故事對戰保留其返回場景，不新增自由對戰離開鈕。

禁止改戰鬥判定、RNG、存檔及其他操作。保留ROUND-BUTTON-067圓形尺寸修正。基線test-results/change-scopes/DUEL-LEAVE-068-before.json。

驗收：真實diff/函式VM定向測試確認與取消、無S/故事場景guard；靜態布局及桌面/手機media核對；版本檢查。瀏覽器file URL前輪已遭政策拒絕，不能換工具或方式繞過，因此本輪不宣稱畫面/觸控實測。工程審查後產品交付本地變更、畫面待驗狀態。

交付證據：`test-results/DUEL-LEAVE-068/verify-flow.cjs` 保存原始 VM 測試，`flow-check.json` 記錄五項流程案例 PASS 與 Node 環境；`node --check src/js/game.js` 通過，資源版本檢查 117 筆 PASS。手機直向四欄同步縮小內距與間隔並允許按鈕縮窄；仍須實機確認最窄尺寸文字與畫面。實際修改為上述三份 JS/CSS、三入口 HTML 版本及本單文件。未新增素材、未發布；後續依賴為獨立頁面的畫面與真實導覽驗收。

產品驗收：工程師最終複審無相關 P0/P1/P2，獨立執行五項 VM 案例、117 筆版本及範圍檢查通過。產品接受本地功能與靜態交付，畫面及真實操作維持待驗。審查見 `DUEL-LEAVE-068-review.md`。
