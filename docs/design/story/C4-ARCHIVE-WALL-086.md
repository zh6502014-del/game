# C4-ARCHIVE-WALL-086｜檔案櫃 6×6 牆面尋物

取代 085 還原的單一卷宗尋物。C4 面對一整面檔案櫃（36 個抽屜；2026-10-10 由 8×8 縮減），伊芙、朔、磷合作一個一個找。

## 規則
- 6×6 抽屜；點開抽屜讀「標題：摘要」，只有第一次打開才計數。
- 每新打開 6 個抽屜，查勤士兵出現，與伊芙＋朔對戰（固定 2 敵、劍／槍職業隨機，但不會兩個都是槍手；磷不戰鬥）。戰敗可重打，不扣進度。
- 重要文件（運送紀錄）固定在最下排靠右（第 6 排第 5 欄），共需 35 個抽屜、5 場查勤。
- 第 3 場查勤後，伊芙說「越不想被人找到的東西，越會放在低處。」（文字提示，進狀態列與已讀紀錄）。
- 世界內只稱「檔案櫃」，不使用編號或座標；抽屜文字見 ARCHIVE-WALL-COPY-DRAFT.md（已確認）。
- 縮放／拖曳：放大／縮小／全景按鈕、滾輪、雙指與拖曳；手機預設顯示牆面中央。
- 查勤戰取代原 C4-outer 外廊戰；凜現身（C4-inner）保留為結尾戰。

## 改動
- 新增 `src/js/story-archive-wall.js`、`src/css/story-archive-wall.css`（`window.NDArchiveWall`）。
- `story-campaign.js`：`openArchiveWall`、`patrolEncounter`（基於 C4-outer 複製、隨機職業）、`wallState`（begin 重置）、舞台文字、`performanceState().wall`。
- `story-chapters.js`：C4-r12 改 `archive-wall`；移除 C4-outer 戰鬥步驟（`C4-r18`）；`story-search-assets.js` 登記 `archive-wall`（只有背景板）。
- 美術：`assets/story/props/archive-wall/*`（抽屜 3 款＋拉出）、`backgrounds/locations/archive-wall-plate.webp`、`illustrations/chapters/archive-patrol-prebattle.webp`；原稿在 `storage/source-art/archive-wall/`。
- 測試：`tests/story/story-c4-archive.cjs` 重寫；`tests/helpers/rewrite050-helpers.cjs` 新增 `solveArchiveWall`，`battleTerminalFixture` 可指定開戰按鈕。
- `C4-outer` 的說明文字改為「士兵封住檔案櫃區的出口。」。

## 驗證
version-assets／asset-versions PASS、preload manifest 重建、新美術 check-art-budget --strict 0 超標；Chromium 1440／390：第 8 個新抽屜出現查勤、重開舊抽屜不計數、63 抽屜 7 戰後取得運送紀錄、提示出現、C4 走到收錄、無 pageerror。
