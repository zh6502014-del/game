# AUDIO-DEFAULT-065｜所有預設音量10%

使用者要求所有遊戲預設音量10%。產品定義：新玩家、缺少個別設定、恢復預設時各音樂/音效/衍生群組均以0.1為使用者音量；保留既有玩家有效已存音量与靜音行為。保留混音校正ND_MIX及音效recipe，不將音量百分比誤作人耳相同響度。

唯一實作主責fx_audio：src/js/game.js的AUDIO_DEFAULTS/getAudioVolume及必要reset/setAudioVolume相關音量處理；src/js/story-battle-sfx.js和src/js/story-skill-sfx.js的註冊預設/初始音量/standalone預設；新增tests/audio-defaults.cjs。不得改AI/RNG/戰鬥/故事規則。產品為HTML版本整合者，只執行version-assets.py更新六HTML對應版本。

基線：test-results/audio-default-065/before/保存三JS及六HTML；工程师獨立審查僅寫docs/design/AUDIO-DEFAULT-065-review.md。產品維護本單與工作板。

驗收：新存檔所有key、延後註冊的故事音效、衍生duel群組、未宣告synth key、恢復預設、已存0及自選音量、靜音、HTML版本。必要隔離瀏覽器檢查三遊戲入口面板均10%，不重載使用者頁或清真實存檔。工程審查通過後同步已授權GitHub遊玩版並push，不推開發測試與文件。

追加授權：game.js的ND_BGM_FALLBACK.ensure/start/tick僅音量gain同步與set/reset必要接線，原合成基準0.055乘對應user volume；不得變更節拍/音符/既有不重啟生命週期。核對原先固定gain的音量缺口，本需求包含網路失敗備援不可維持原固定响度。

瀏覽器驗收追加：首頁音量modal的mute原本呼叫renderSetup而因未載NDSkins失敗，story也會誤重繪決鬥設定。授權game.js原toggleAudio最後的mode guard（home/story僅音訊及按鈕，不進duel render），保持決鬥原行為，新增相應定向測試；不改全域render或故事狀態。失敗證據browser.log保留，修後另寫browser-r2.log。

驗收：三JS語法、定向VM（defaults/saved/group/late/reset/mute/BGM各mode、home/story/duel×有無S六toggle案例）通過。Chrome三入口各fresh/saved共6case，每頁15音量slider、home/duel59keys/story74keys預設或saved保留/resetWhileMuted皆PASS、pageerror零；browser.json/browser-r2.log為修後證據，初敗browser.log保留。資源版本114筆通過；只改三JS與三HTML版本，另新增開發測試。未實際聽測/未跑全故事分支；ND_MIX校正未改。

狀態：工程師複審與產品驗收完成，無未解P0/P1/P2。已同步GitHub main ed4897658024e7d6536303f4a744eb3599d12d34，Desktop push complete與獨立ls-remote核對一致。來源專案三JS＋開發測試＋三HTML版本，GitHub僅同步六runtime檔；ND_MIX/規則/RNG未改。既有玩家設定不強制覆盖，需選恢復預設即可套用10%。完整審查見AUDIO-DEFAULT-065-review.md；修改檔案見changed-runtime.json及implementation.diff，驗證限制見上述記錄。
