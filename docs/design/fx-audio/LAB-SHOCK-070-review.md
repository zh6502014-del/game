# LAB-SHOCK-070 工程審查

2026-10-08。結論：可交付產品作本地交付；未發現本次相關 P0／P1／P2。真人視覺、聲音與真實DOM操作仍待驗證。工程師未修改runtime或工作板。

基線 `test-results/change-scopes/LAB-SHOCK-070-before.json`；初審與最終精確diff分別保存 `test-results/LAB-SHOCK-070/engineer-scope-initial.json`、`engineer-scope-final.json`。最終 WITHIN_FILE_SCOPE，無清單外差異。實際執行碼僅story-campaign的專屬cue、draw／forward取消與mount一次性清理監聽；測試僅本工單；Story HTML僅資源版本。未改戰鬥規則、RNG、存檔及劇情文字。基線工具不證明作者身份及基線前歷史。

- `src/js/story-campaign.js:138`：依目前readingUnit範圍查A2-step-05，能在合併A1的A2-step-04/05組觸發；組首延700ms，單行05立即。專用去重key不與其他cue衝突，review與hidden不排程。實際資料的分組由VM驗證。
- `:142`：捕捉session／cursor，回呼再核對目前cue、view、phase、document.hidden，避免已失效場景觸發。`:132`取消timer與動畫；`:179`、`:344`、`:423`覆蓋翻頁、重繪、退出／新章節draw及blur、pagehide、旋轉、隱藏。mount既有root guard避免重複加監聽。
- `:145`：沿用playSfx('fxResImpact')，既有game.js播放流程檢查audioEnabled、取得音量並處理play promise拒絕；缺API或同步音訊失敗也能繼續背景動畫。無新增音訊素材。既有API無單聲取消，已開始的約0.72秒聲尾自然結束為產品明確核定限制。
- `:146`：reduced-motion跳過動畫但保留聲音；只對performance-image-host施作810ms衰減translate／scale，對話文字所在DOM不移動，末幀歸零。無隨機數呼叫。

額外核對提前去重與draw取消：requestImage的decode成功／失敗及retry只呼叫paintImage，不呼叫draw；typewriter只更新文字DOM。未找到A2-step-04/05正常閱讀700ms內會因圖片載入自動draw而吞掉cue的具體路徑。若使用者在延遲內翻頁、失焦或退出，取消且同次閱讀不重播符合本次去重設計；新begin重設seen。沒有將潛在未知重繪路徑宣稱完整覆蓋。

本次實跑：bundled Node v24.19.0執行 `tests/lab-shock-070.cjs` PASS（報告15項；實際cue與campaign資料、隔離timer／audio／animation stubs）；`node --check src/js/story-campaign.js`退出0；`python3 tests/asset-versions.py`117筆PASS。日誌為本單 `engineer-test.log`、`engineer-versions.log`。測試程式已人工核對，含分組、去重、review、取消、舊session／cursor／view／phase／hidden、reduced-motion及音訊失敗。DOM事件接線僅靜態斷言，不假稱已派發真實瀏覽器事件。

未驗證：瀏覽器實際背景幅度、載入延遲下的視聽同步、真人聽感、不同裝置及真實音量／靜音操作。遵守前輪file URL政策限制，沒有啟動browser／server或其他繞行；未推送發布。後續由產品驗收並保留畫面／聽測待驗標示。
