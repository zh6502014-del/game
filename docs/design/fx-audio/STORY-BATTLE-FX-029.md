# STORY-BATTLE-FX-029｜國王戰特效模組化

狀態：已完成（2026-10-01）。畫面、音效、時序與抽出前完全一致；只改檔案結構。

## 檔案

| 檔案 | 內容 | 要調整時 |
| --- | --- | --- |
| `src/js/story-battle-fx.js` | 特效演出邏輯：覺醒（purge → transform → summon）、吞鼠、抓取擲出、自爆、死亡碎裂消失、灼傷火焰跟隨、卡片狀態 class | 改流程、順序、元素數量 |
| `src/css/story-battle-fx.css` | 上述特效的樣式與動畫：火焰與邊框、覺醒（暗幕、尖刺、光點、白閃、橫幅、持續光暈）、爆炸、死亡、吞鼠與擲出 | 改顏色、大小、動畫曲線 |
| `src/js/story-battle-sfx.js` | 戰鬥合成音效配方（登錄進 `src/js/game.js` 的 `ND_SFX_FALLBACK.recipes`） | 改音色、音量 |
| `src/js/story-energy-ui.js` / `.css` | 戰鬥介面的版面、輸入、一般攻擊與受擊演出；透過 `NDStoryBattleFx.bind(host)` 把工具函式交給特效模組 | 只動版面與操作 |

## 載入順序

- `Nightfall-Duel-Story.html`：`src/css/story-battle-fx.css` 接在 `src/css/story-energy-ui.css` 之後；`src/js/story-battle-sfx.js` 接在 `src/js/game.js` 之後；`src/js/story-battle-fx.js` 在 `src/js/story-energy-ui.js` 之前。
- `index.html`、`Nightfall-Duel-V12.12.39-Test.html`：`src/js/story-battle-sfx.js` 接在 `src/js/game.js` 之後（主遊戲的勝敗、盾、反擊等音效也由它提供）。
- 新增或改動這三個檔後照常執行 `python3 scripts/version-assets.py`。

## 調整入口

- 時序與數量：`src/js/story-battle-fx.js` 開頭的 `TUNE`（覺醒聚能／爆發／登場毫秒、尖刺／光點／碎片數、吞鼠與擲出時長、死亡淡出時長與碎片數）。
- 模組提供的介面：`boss`、`devour`、`throwCard`、`trap`、`defeat`、`lethal`、`burnFlames`、`mirror`、`cardClasses`、`rosterVisible`、`markDying`、`deathFx`。
- 模組只播放引擎 frame 已決定的結果，不計算戰鬥、不使用戰鬥 RNG。

## 驗收

- 27 章整輪通關：0 個頁面錯誤。
- 覺醒、吞鼠、擲出、死亡、灼傷跟隨腳本：音效序列與 class 集合和抽出前一致，畫面逐段比對相同。
- 三個頁面皆登錄 29 組音效配方；`python3 tests/asset-versions.py` 通過。
