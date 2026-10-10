# C4-SEARCH-RESTORE-085｜還原文件庫尋物（archive-vault）

使用者回報文件庫翻卷宗小遊戲消失，要求在「一起找」段落提供按鈕進入小遊戲。

原因：10/7（GitHub 43b4932）→10/9（737aba9）之間，C4 的 `search` 步驟被改成旁白「伊芙在卷宗裡翻出一份運送紀錄…」，`story-campaign.js` 的尋物支援（openSearch、`search` 按鈕與快捷鍵、searchFound、回看列表、地圖節點說明）與 `story-stage-assets.js` 的尋物舞台一併刪除；無對應工單。E3-PARTS-075 只授權刪 E3 尋物。

修改：
- `src/js/story-campaign.js`：按 43b4932 逐段還原尋物程式，其他新功能（撐盾、A3 結尾、LAB-SHOCK）保留。
- `src/js/story-chapters.js`：C4-r12 由旁白改回 `search` 步驟（sceneId archive-vault，目標 sealed-order「運送紀錄」），位置在伊芙「找物資運送的紀錄」之後；step ID 不變。
- `src/js/story-stage-assets.js`：還原 `search` 提示標籤與尋物舞台（抽屜近景＋卷宗）。
- E3 尋物不加回。

驗證：三個 JS 語法；version-assets／asset-versions PASS；Chromium 1440 與 390 寬：C4 走到 r12 顯示「進入場景尋找」→ 開啟文件庫 → 錯誤卷宗顯示說明 → 0426 收取 → 接 r13 → 兩場戰鬥（fixture）→ 收錄，無 pageerror。
