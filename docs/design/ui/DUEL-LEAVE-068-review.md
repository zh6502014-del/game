# DUEL-LEAVE-068 工程審查

2026-10-08。工程師唯讀執行碼，僅寫本報告與本單證據。

結論：靜態程式審查可交付產品，未發現相關 P0／P1／P2。畫面與真實操作待驗，產品不可標為瀏覽器完整驗收完成。

基線 `test-results/change-scopes/DUEL-LEAVE-068-before.json`；独立精確diff保存於 `test-results/DUEL-LEAVE-068/engineer-scope.json`，WITHIN_FILE_SCOPE，無清單外差異。三個HTML僅必要的game.js／duel-stage.css／mobile-layout.css版本更新，工作板及工單僅本任務；JS限renderGame新增按鈕及leaveDuel，兩份CSS限本dock布局。未改引擎、RNG、存檔。快照不證明作者或基線前歷史。

- `src/js/game.js:596`：第四顆button追加於音效後，保留既有戰況／規則／音效的nth-of-type(1–3)。button有type、onclick、可理解的aria-label/title；故事對戰不渲染離開鈕，既有返回場景未改。
- `src/js/game.js:599`：無S或storyBattle直接返回；confirm false不導覽且不寫S；true只assign同目錄index.html，該入口data-mode=home。正常導覽卸載目前文件，避免僅切畫面後原遊戲callback繼續作用於首頁。未新增timer/listener或存檔写入。瀏覽器返回快取／真實卸載時序未實測。
- `src/css/duel-stage.css:275`：新鈕在戰況右方，間距10px，沿用44px最低等寬高及50%圓角；不匹配既有nth-of-type(1–3)，未找到適用此dock的last-child定位衝突。桌面規則仍僅寬≥900、高≥521且landscape；預設五欄規則只匹配含離開鈕dock。
- `src/css/mobile-layout.css:262`、`:265`：小直向四欄按鈕，battle-state繼續第一行跨全欄；小橫向五欄含中間提示，新增選擇器含:has，specificity勝過原欄數。上述media與桌面條件互斥；不匹配故事dock。未驗證最窄尺寸視覺及文字換行。
- 核對正式HTML載入順序與game-art glyph／nd-control處理；←可沿用既有圖示替換，label不被破壞。未新增外部資源。

本次實跑：scope check；`python3 tests/asset-versions.py` 通過117筆，保存 `test-results/DUEL-LEAVE-068/engineer-asset-versions.log`。本次人工核對精確diff、CSS層疊及JS分支。

最終複審：已核對補存的 `verify-flow.cjs` exact-source切片、confirm/location stubs及斷言，工程師以 bundled Node v24.19.0獨立執行五項案例通過，日誌 `test-results/DUEL-LEAVE-068/engineer-flow.log`。`flow-check.json`保存環境與目前game.js雜湊。測試涵蓋自由對戰render、取消、確認、故事render排除及故事／null guard；不驗證瀏覽器原生對話框、真正導覽或卸載時序。

最終CSS補充複審：`src/css/mobile-layout.css:263` 僅含離開鈕的小直向dock直接button新增min-width:0、gap:4px與padding:8px 4px，容許四欄縮入窄畫面，仍保留既有44px min-height；不影響桌面、橫向及故事。原橫向新增規則目前為`:266`。最終scope保存 `test-results/DUEL-LEAVE-068/engineer-final-scope.json`，無清單外差異；117資源版本重新通過。畫面／文字换行仍待驗。

未驗證：本輪遵守既有file URL政策拒絕，沒有啟動瀏覽器、HTTP伺服器或替代工具繞過。沒有真實confirm、導覽、滑鼠／觸控及多尺寸畫面實測，沒有重載使用者對局。未推送或發布。產品最後驗收與回報需保留這些限制。
