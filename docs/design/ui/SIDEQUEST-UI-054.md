# SIDEQUEST-UI-054｜支線小遊戲介面一致化

需求：2026-10-04 使用者「遊戲 UI 版面要有一致性，看得出來這個是支線遊戲」；另「伊芙 · 組裝暮晶銃要跟拼圖一樣有虛線暗示」。範圍選定：全部互動小遊戲（拼圖、路徑迷宮、路線、尋物）及拼圖工坊清單，方式＝統一彈窗框架。

狀態：實作完成，瀏覽器截圖檢查通過；未跑完整既有 Playwright 套件（本機無 Chrome），尚待工程審查。

## 改動

- 新增 `src/css/story-sidequest.css`（載入於 `src/css/story-frames.css` 之後）：金色「支線」徽章＋類型行、統一標題（Georgia 襯線＋金色分隔線）、目標行、控制列（次要在左、主要金色按鈕在右）、「操作說明」摺疊、工坊清單卡片。只寫呈現。
- 四種彈窗加 `sq-dialog`＋`data-sq`，眉標改為「支線 ＋ 類型 · 情境」：`src/js/story-puzzles.js`（拼圖）、`src/js/story-maze.js`（路徑）、`src/js/story-route.js`（路線）、`src/js/story-search.js`（尋物；關閉鈕文字由「✕」改為「關閉」，檔案調閱場景保留原版面）。
- 工坊清單在 `src/js/story-campaign.js`（實際渲染處，非 `src/js/story-mode.js`）：卡片含徽章、類型、標題與「獨立試玩／含後續劇情」。
- 暮晶銃虛線：`src/js/story-puzzles.js` 在每個零件加 `.puzzle-outline`，以 SVG 濾鏡 `#puzzle-gun-ring` 將剪影轉為細環，CSS 斜向遮罩切成虛線；提示或靠近時轉金色，放入後隱藏。所有 `.puzzle-alpha` 仍設有 `--piece-image`（`tests/story-map-art.cjs` 斷言）。
- `Nightfall-Duel-Story.html` 加入新 CSS 連結；已跑 `scripts/version-assets.py`。

## 證據

- 截圖：1280 與 390 寬，拼圖（暮晶銃含提示／放入）、迷宮、路線、尋物（含檔案調閱）、工坊清單；390 寬無橫向溢出。
- `node --check` 六支 JS 通過；`tests/asset-versions.py` 105 筆通過。
- 範圍報告：`test-results/change-scopes/SIDEQUEST-UI-054-*.json`（含 `-add-` 追加 `src/js/story-campaign.js`）。報告列出的範圍外檔案屬並行任務的既有改動，非本單。

## 未驗證

既有 Playwright 套件（`story-puzzles`、`story-search`、`story-interact-*`、`visual-system`、`ui-consistency` 等）未在本單跑過；迷宮／路線完整通關流程、手機 Safari、地圖拼圖（evac／archive）截圖（雲端缺 `map-art-v2` 素材）未驗。
