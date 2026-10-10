# HOT-MODE-090｜自由決鬥「一般／熱血」風格切換

需求（2026-10-10）：自由決鬥備戰大廳加切換鈕，切到熱血後換更熱血的音樂與介面顏色。Rank 模式（段位＝排位星數換算）日後可把此切換當入口，目前與 Rank 無關。

## 已完成
- 備戰大廳「進入決鬥」下方新增「🌙 一般／🔥 熱血」切換，選擇存 `localStorage: nightfallHeatV1`。
- 熱血＝`body.theme-hot`：紅橙配色（暮紅 #8f1f1a、焦褐 #2a100d、餘燼橙 #e8651a，古金換成橙），只換色，不改版面與字型。故事戰鬥一律不啟用。
- 熱血戰鬥音樂 key `heatBgm` → `assets/audio/duel/battle-march.mp3`（Battle March by PlayOnLoop.com，CC BY 3.0）；備戰與結算音樂沿用。檔案缺少或載入失敗時自動退回一般戰鬥曲。音效設定頁新增該音量條與授權標示。

## 美術（已接入）
使用者生成的 6 張原圖已轉成 runtime 並接入：`assets/ui/hot-badge.webp`（切換鈕圖示）、`assets/frames/hot/{hero,panel,thin}.webp`（熱血模式覆蓋 `--frame-*` 與切線，數值見該資料夾 manifest）、`assets/cards/back-flame-v1.webp`（熱血卡背，game-art.js 依 heatActive 選圖）、`assets/fx/hot-embers.webp`（`#nd-hot-embers` 疊層）。原稿存 `storage/source-art-hot-mode-090/`。`check-art-budget --strict` 全數在預算內（徽章以 coin、餘燼層以 background 計）。

## 待辦
- 音樂是 PlayOnLoop 的 short 版（11.3 秒、原檔 22kHz 8-bit），循環感較短；若想更完整，可到 playonloop.com 取較長版本後覆蓋同名檔。

## 音樂檔（已完成）
`assets/audio/duel/battle-march.mp3`：由使用者提供的 `POL-battle-march-short.wav` 轉成（loudnorm -16 LUFS、peak -4.2 dBFS、44.1kHz 立體聲 192k、272KB）。授權 CC BY 3.0，標示文字在音效設定頁。

## 修改檔案
`src/js/game.js`、`src/css/screens/hot-mode.duel.css`（新）、`config/css-manifest.json`（duel 頁末尾加一行）。備份在 `storage/backups-hot-mode/`。

## 驗證
Playwright（雲端，缺素材圖）：切換、class、localStorage、重新整理保留、音樂 key 選擇（一般→bgm／熱血→heatBgm／故事戰鬥→bgm）、檔案缺少回退、音效設定標示；`version-assets.py`、`asset-versions.py` 通過。
未驗證：真實音樂播放、帶完整素材圖的實際畫面、手機寬度、Safari、`tests/duel` 既有測試、工程師審查。
