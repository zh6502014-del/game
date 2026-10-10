# RANK-091 排位模式（星數→段位）

- 範圍：只有星數與段位。**無經驗值、無點數、無商店**（造型卡商店暫緩）。
- 段位：守夜新兵 / 巡夜者 / 暮城衛士 / 鐘下守望 / 破曉者 / 夜幕決鬥者（暫定名），每階 3 顆星；最高階星數累計顯示 ×N。
- 勝 +1（連勝 3 場起 +2）、敗 −1（不跌出目前段位下限）、平手不變。
- 對手戰術依段位：0–1 保守、2–3 激進、4–5 策略；排位中不顯示戰術選單。故事戰鬥不計入。
- 存檔：localStorage `nightfallRankV1`（{stars,streak}）、`nightfallModeV1`（free/rank）。
- 程式：`src/js/game.js`（RANK-091 區塊、`setRankMode`、`applyRankResult`）；樣式 `src/css/screens/hot-mode.duel.css` 末段。
- 素材：`assets/ui/rank/badge-1..6.webp`、`star-on/off.webp`；造型框已入庫，傳說框與 4 張造型圖待補。
