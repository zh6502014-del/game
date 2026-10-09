# KING-RATS-COPY-083 工程審查

2026-10-08。最終可交付產品，無本次相關P0／P1／P2。

已核對工單、083-before與精確diff；engineer-scope.json初審為WITHIN_FILE_SCOPE，最終engineer-final-scope.json保存整合狀態。UI僅新增首次王異變且同frame召crystal-rat時的閱讀modal、close等待與取消清理；082引擎與083基線hash一致，不改事件／傷害／RNG／保存。Story HTML僅engine與UI版本同步，119引用独立PASS（engineer-versions.log）。

一般播放先完成frame全部事件與returnActors，再套frame.after、顯示既有modal；減少動態路徑也套首次召鼠after並等待閱讀。觸發同時要求louis-armored transform與crystal-rat summon，後续補鼠沒有transform所以不重复。兩段文案完整符合工單，textContent建節點不引入HTML插值。

閱讀時busy維持，戰場與旋轉替代層inert，既有modal焦點／ESC／返回戰場機制沿用；closeModal清除resolver後回傳true，cancelPlayback先取出resolver回傳false再關modal並增加token，不會誤當閱讀完成繼續舊播放。resolver再次核對current與playToken，正常／取消／舊token不殘留Promise。

已讀測試並獨立執行六組PASS（engineer-test.log）：真H1引擎transform／summon frame、文案與live region、返回前保持等待、normal／reduced、補鼠排除、取消與舊token，以及082引擎凍結。測試的DOM和特效playEvent是stub，並非真人FX／鍵盤測試。

最終兩單交叉scope：082引擎與測試在083前已凍結，083 diff僅其UI／測試／文件及產品版本；082主baseline看到083檔案為另一已授權工單，維持原白名單與歸屬。未啟動瀏覽器／server，未驗modal實際排版、ESC焦點圈、召鼠動畫或手機顯示，未發布。產品最後驗收保留視覺／操作待驗。

083最終scope為REVIEW_REQUIRED：Story HTML與082審查報告未在此baseline allow，兩者分別歸屬產品授權版本整合與工程審查。083基線時082引擎已改、HTML尚未整合，因此用082基線原engine/UI hash還原共同的舊HTML query；完整重建SHA同時與082和083的HTML基線hash一致，證據engineer-reconstructed-entry-before.html，確證無其他入口改動。接受例外歸屬而不擴白名單。
