# LAB-SHOCK-070｜研究室反衝震動與音效

使用者要截圖 A1 合併章研究室能量爆開段有抖動與震盪音效，僅本地。唯一 runtime 寫入者 fx_audio；產品整合版本與文件。

允許 src/js/story-campaign.js：新增此段專屬 cue／背景抖動及必要生命週期清理；先核實最終 step ID 與分組。只震背景，文字穩定；短促衰減、不循環；減少動態停抖動但保留聲音；尊重現有音量／靜音。重用現有本地音效經既有播放流程，無新素材。處理離頁、快速翻頁、重繪／回看不重複播放及取消，不改既有戰鬥、存檔、RNG、劇情文字。允許 tests/lab-shock-070.cjs 做定向生命週期測試。三入口 HTML 僅產品執行版本工具。工單、review、工作板僅本單。

基線 test-results/change-scopes/LAB-SHOCK-070-before.json。驗收：定向測試、語法、117 資源版本、獨立工程審查。先前 file URL 瀏覽器政策限制不可繞行，本輪不宣稱畫面或真人聽測完成。未上傳。前一則文案刪減仍討論中，不實作。

核定呈現：A1 合併章仍保留 A2-step-04/05 的分組 ID。進入該組後 700ms 同步背景衰減震動與既有 fxResImpact，低頻衝擊帶震盪餘音。既有 playSfx 無單音取消介面，採約0.72秒短聲；翻頁／退出／失焦可取消待觸發效果與動畫，已開始的音效可能自然播完短尾，不擴大修改共用音訊系統。

實作交付：src/js/story-campaign.js 新增專屬 labShockCue/cancelLabShock，700ms後同回呼音畫觸發，背景810ms由強至弱；測試 tests/lab-shock-070.cjs，真實章節資料＋隔離timer/animation/audio stubs共15案例PASS。語法檢查PASS。證據 test-results/LAB-SHOCK-070/verification.json 含來源SHA與Node環境。產品同步 Nightfall-Duel-Story.html 版本，117筆通過；無新素材容量。範圍、分組、取消、音訊失敗與減少動態均由工程師核對。畫面、真實DOM事件及真人聽測未驗證；已開始聲尾限制同上，後續依賴為實際觀感／聽感驗收。

產品接受本地實作及工程審查，無未解相關P0/P1/P2；不宣稱視聽完整驗收。審查見 LAB-SHOCK-070-review.md，未發布。
