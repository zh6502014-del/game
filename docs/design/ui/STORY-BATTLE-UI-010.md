# STORY-BATTLE-UI-010｜戰旗衝撞與低干擾操作介面

## 工單

- **可見成果／完成條件：** 故事模式戰鬥中，近戰戰旗以抬升、受距離限制的衝撞、命中回饋和回位呈現；槍手保留彈道並以抬升後座呈現。角色資訊不遮擋肖像或固定數值，操作提示只在需要操作時顯示，並保留觸控、鍵盤及減少動態支援。
- **唯一主責：** art_ui；**整合者：** 產品。本工單唯一可寫 runtime 檔案為 `src/js/story-energy-ui.js`、`src/css/story-energy-ui.css`、`tests/story-energy-ui.cjs`；產品只寫本工單與工作板紀錄。
- **必要限制：** 不修改 `src/js/story-energy-engine.js`、AI、RNG、傷害、回合、勝負條件、存檔、劇情或素材。演出只讀既有 frames 與 DOM 幾何；取消、重試、關閉與減少動態必清除演出。
- **修改前基線：** `test-results/change-scopes/STORY-BATTLE-UI-010-before.json`；允許檔案含上述 runtime／測試及本工單、工作板。
- **工程審查：** 獨立工程師先發現資訊座遮擋、短距離衝撞與測試缺口，修正後需複審；範圍外 `docs/design/story/STORY-COMPLETE-019.md` 屬並行 STORY-COMPLETE-019，不納入本工單。

## 驗收

- `story-energy-ui` 覆蓋 1440×900、1280×720、844×390、667×375 的點選、拖曳、長按、鍵盤、取消、缺圖、減少動態與棋子動畫；詳情按鈕不得與生命／護盾／攻擊資訊座重疊。
- 驗證雙方近戰衝撞距離安全、槍手後座和彈道、命中回饋，以及播放取消時不遺留動畫。
- 重跑 `story-energy-engine`、`story-energy-frames`、`story-battle`，並由整合者完成版本同步與 `asset-versions` 檢查。

## 狀態

完成：工程複審的三項 P2 已補正並複審通過。`tests/story-energy-ui.cjs` 以 1440×900、1280×720、844×390、667×375 通過；`story-energy-engine` 68/68、`story-energy-frames` 22/22（6,242 次比較）與 `story-battle` 已通過；`tests/asset-versions.py` 確認 89 筆本機 JS／CSS 版本引用有效。範圍工具列出的 HTML、019 文件與 020 素材 manifest 為並行工單，HTML 雜湊同步由 STORY-COMPLETE-019 的唯一整合者完成。
