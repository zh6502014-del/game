# AUDIO-RESTORE-051｜還原原版音效

2026-10-03。使用者明確要求：「音效沒有比舊版好，請還原」。

產品唯一寫入：game.js 本次 AUDIO-DARK-051 的音訊區、story-battle-sfx.js、三份HTML的JS/CSS版本值、本工單及工作板、原工單狀態。還原來源是改動前可信 `test-results/change-scopes/AUDIO-DARK-051-before.json`；動工前另保存 AUDIO-RESTORE-051-before.json。不得還原其他故事、美術、UI或存檔檔案。

先比對去除四段音訊授權區塊後的 game.js，必須與原版逐字相同，才能以原版原文恢復；story-battle-sfx.js 必須仍匹配本輪凍結hash。原素材始終保留，還原引用即可；新版素材與生成紀錄保留為未使用歷史，不載入新聲音。音樂、主要與故事音效、合成備援一起還原。

必要驗收：兩份JS與原版SHA256完全一致、非音訊程式未變、原本機素材存在、瀏覽器映射與新檔零請求、語法與資源版本檢查、工程師獨立diff審查。測試使用獨立頁與資料；不重载使用者對局、改真實存檔或回滾其他檔案。狀態：已完成，工程審查與產品驗收通過。

## 交付與驗收

- `src/js/game.js`、`src/js/story-battle-sfx.js` 已精確還原至 AUDIO-DARK-051 動工前原文，SHA256 分別為 `e1301a5260a2a467852eac2573b84793b9d76df62ce21334aaad1f27d1a68ef2`、`0d346d8ce5a98d51a9f9724118c7d0c2aa435bf3c11f1ccfa9772a33dfe3ae94`。恢復原外部音樂／音效映射、本機硬幣和4個故事音檔，以及所有原合成備援。未保留本次新音訊行為。
- 原版、還原前、還原後去除授權音訊区塊的非音訊程式三者逐字相同；其他美術、故事、UI檔案未回滾。使用者偏好與真實存檔沒有被改寫。
- index.html、Nightfall-Duel-Story.html、Nightfall-Duel-V12.12.39-Test.html 僅同步本機JS/CSS版本值。`python3 scripts/version-assets.py` 執行後，`python3 tests/asset-versions.py` 通過107筆引用；兩份JS語法檢查通過。
- `test-results/audio-restore-051/browser-report.json`：隔離Chrome的自由決鬥／故事兩個入口，實際 AUDIO_URLS 和全部 fallback recipe 與可信原版一致；dark-051新音檔請求數為0；5個原本機音檔完整解碼；保存的音量偏好不變、無pageerror。這是解碼與映射檢查，不宣稱人耳聽測或HTMLAudio播放時間驗證。
- `test-results/audio-restore-051/source-verification.json` 保存還原前／後指紋；`engineering-review.md` 獨立核對原版identity、反向diff、非音訊程式、HTML版本、原素材與browser證據，無相關P0/P1/P2。產品依該限定範圍驗收通過。

新版 assets/audio/dark-051/、生成腳本與source紀錄作未使用歷史保留，production沒有其引用，不刪除原稿。舊遠端來源的外站可用性與主觀聽感未重新驗證，恢復的是使用者要求的修改前版本，不另更換聲音。没有重新載入使用者進行中的對局。
