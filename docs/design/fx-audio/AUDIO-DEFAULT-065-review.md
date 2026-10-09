# AUDIO-DEFAULT-065 工程審查

2026-10-07，獨立工程師。最終結論：可交付，未發現未解的本次相關 P0/P1/P2。音量變更及追加 toggleAudio 補正已審查，產品仍負責最後驗收及上傳。

## 範圍與基線

唯讀核對三份 JS（game.js、story-battle-sfx.js、story-skill-sfx.js）、新增 tests/audio-defaults.cjs 與六份 HTML。基線 test-results/audio-default-065/before/；九份原文 SHA-256 均與 before.json 相符。已逐段比較真實 diff；三個遊戲入口僅修改對應 JS 版本，三個 gallery 入口未改。

音量變更限於 AUDIO_DEFAULTS/getAudioVolume、set/reset 音量與 pool 同步、ND_BGM_FALLBACK gain 更新、故事音效註冊及 standalone 初始值。ND_MIX、音色 recipe、音符、節拍、AI、戰鬥 RNG、故事規則不在本次 diff。

before.json 是九檔雜湊清單，非全專案範圍工具格式；check-change-scope.py 對它回報 version/root mismatch，不算通過。僅能證明已存九檔的差異，不能據此宣稱全專案歷史無越權或辨認作者。

## 行為核對

- 所有宣告與未宣告音效預設均為 0.1；duel 子音效直接跟隨群組使用者音量，避免原先依預設比率放大到 0.8。
- 有效既存 0、自選數值與數字字串保留；缺少、null、空字串、布林、非數字回到 0.1。群組音效保留群組滑桿語意。
- 提早與延後故事註冊均採 getAudioVolume，避免覆蓋既存個人設定；standalone 合成器初始值 0.1。
- reset 收集現存設定、defaults、音庫及播放池後回到預設，包含 recipe-only 設定；群組滑桿更新既有衍生播放池。
- 音樂備援 gain = 0.055 × 對應使用者音量；ensure/start 及設定/reset 接線正確。未改同模式不重啟 guard、timer/stop、resume 與 tick 原始生命週期。

## 驗證

本次實跑：使用 /Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node 執行 tests/audio-defaults.cjs，六組行為檢查通過；python3 tests/asset-versions.py：114 筆引用通過；九份原文雜湊一致。測試會抽取正式程式片段到 VM 並模擬 Audio/localStorage，確實檢查行為，未存取真實玩家資料。

已讀產品 targeted-tests.log 與測試原始碼。產品 browser.log 曾因 home 靜音觸發既有 renderSetup/NDSkins.controls 錯誤而失敗，不能標成瀏覽器通過；產品正追加精準修正與回歸。VM 不等於真瀏覽器完整載入或實際聽感，未宣稱全狀態覆蓋。

未驗證：實機音效聽感、所有聲音逐一播放、行動裝置及真實網路失敗。GitHub 同步由產品處理，未納入本次本機工程結論。

## 追加修正複審

產品精準授權的 game.js:139 mode guard 已核對：home/story 在原 toggleAudio 完成音訊與按鈕更新後返回，避免錯誤進入 duel render；外層 wrapper 仍會停止播放池與合成背景音樂。duel 原重繪分支未改，故事/首頁 mounted DOM 保留，不變更故事狀態。初次 browser.log 的 controls 錯誤留存；此已確認 P2 經補正與回歸後解除。

本次獨立重跑最終 tests/audio-defaults.cjs，新增 home/story/duel × 有無 session 六組 actual toggle + wrapper 測試通過，涵蓋 mute/reset/unmute、池暫停、fallback 停止、DOM sentinel 與 duel render 次數。最終 114 筆版本檢查通過。

沿用產品 Chrome 證據：已讀 /private/tmp/nightfall-audio-065.cjs、browser.json 及 browser-r2.log。程式以獨立 headless Chrome context、localhost 靜態伺服器及隔離 localStorage 執行，不觸及玩家現有頁面；三入口各 fresh/saved 共六案例通過，每面板 15 個滑桿、home/duel 59 個音量 key、story 74 個 key，初始預設/已存偏好及靜音中恢復預設皆過，pageerror 均為空。saved fixture 的 fxQuakeImpact 於未載入故事音效入口仍直接納入查核，不把缺少 key 誤判為產品錯誤；測試未放寬預期音量。

上述 Chrome 為產品執行後核對證據，不列作工程師重新執行；不是所有場景、真實解碼與聽感的全覆蓋。沒有剩餘阻擋交付的本次問題。
