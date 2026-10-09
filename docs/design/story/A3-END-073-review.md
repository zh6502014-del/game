# A3-END-073 工程審查

2026-10-08。結論：可交付產品；未發現相關 P0／P1／P2。工程師只写本報告與本單證據，未改runtime、測試或工作板。

主基線為 `test-results/change-scopes/A3-END-073-before.json`，追加helper基線為 `A3-END-073-helper-before.json`。最終主scope記錄 `test-results/A3-END-073/engineer-final-scope.json` 保留REVIEW_REQUIRED，唯一清單外檔案為tests/story-test-helpers.cjs。已核對追加基線原文hash與主基線該檔hash相同；獨立diff僅playNode新增collectsMemory時點擊commit，符合事前追加授权，接受此例外、不擴主allow。追加scope記錄為 `engineer-helper-scope.json`，其他檔案差異依主工單歸屬。

Runtime差異限 `src/js/story-campaign.js`：

- `:97` 只有A3、最後單一complete、前一reading以A3-step-07-b結束時折疊末尾reading unit，標記最後敘事collectsMemory；source steps、ID、文字、frame及complete step未刪除。其他章不進此分支；異常分組維持既有singleton fallback。
- `:186` 阻擋最後敘事繼續forward進被折疊頁；`:320` 當頁改收錄按鈕。review分支優先，前頁回看仍為advance，不提供收錄。
- `:198` 保留busy及cursor===frontier guard，僅新增最後敘事作為A3合法提交入口，且A3必須play/performance。提交後reward防止連點重寫；退出到map的舊提交被拒絕。完成列表去重、save、evidence重建與skin同步沿用原流程，不增加重玩獎勵項。
- 保存失敗仍沿用記憶體完成與warning／重試保存語意；沒有偷偷重寫存檔交易或格式。舊V2載入、V1兼容及合併章記錄程式未改。完整故事資料未改。

Story HTML只同步story-campaign版本；工單與工作板僅本單。helper只新增導航判斷，未放寬既有互動正確性斷言。

本次實跑：bundled Node v24.19.0執行tests/a3-end-073.cjs十案例PASS（`engineer-test.log`）；runtime語法退出0；117資源版本PASS（`engineer-versions.log`）。已讀測試與stubs，測試使用實際章節資料／campaign函式與隔離Map存檔；核對前置不可提交、最後頁文字／按鈕／frame、forward封鎖、回看、連點、重新載入／重玩、離頁、保存失敗重試、未解鎖及A1仍独立complete。DOM繪圖及NDSkins noteProgress為stub，獎勵去重另以實際save／rebuildEvidence源碼核對；不聲稱實測完整外觀系統。

產品交接既有LAB-SHOCK十五案例回歸PASS；本次未機械重跑該套。未執行瀏覽器、真實滑鼠／鍵盤、圖像裁切、真實保存或所有章節全流程，未碰使用者存檔。未發布。產品最後驗收需保留畫面待驗與helper合法例外；scope快照不能證明作者或基線前歷史。
