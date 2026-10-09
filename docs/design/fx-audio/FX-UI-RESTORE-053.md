# FX-UI-RESTORE-053｜還原第 3～11 項戰鬥特效 UI

2026-10-04。使用者在主對話明確選擇還原清單第 3、4、5、6、7、8、9、10、11 項：攻擊特效、技能特效、暈眩標記、燃燒、覺醒／變身、覺醒文字橫幅、震動與登場、死亡／爆裂、減少動態模式的額外呈現調整。保留第 1、2 項晶石 icon 與第 12～26 項較早 UI。

## 範圍與完成條件

- 唯一實作／版本整合者：product。本次為小型入口整合，工程師凍結後唯讀審查。
- 可寫執行檔：`index.html`、`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html`，各只移除 `storage/unused-code/combat-visuals.css` 的 stylesheet 引用；既有資源版本必要時由產品同步。
- 可寫文件：本工單、`docs/design/fx-audio/FX-UI-053.md` 的最新狀態／還原紀錄、`docs/agents/WORKBOARD.md` 的本工單列。驗收產物限定 `test-results/fx-ui-restore-053/` 及本工單 change-scopes。
- `storage/unused-code/combat-visuals.css` 保留為歷史原始檔，不再載入。所有其他 CSS、JS、SVG、原畫與音訊不改。禁止變更規則、AI、RNG、存檔與劇情。
- 可信基線：`test-results/change-scopes/FX-UI-RESTORE-053-before.json`；原特效工單：`docs/design/fx-audio/FX-UI-053.md`。現行該 CSS 僅包含所選第 3～11 項，數值 UI 已於 R1 還原。
- 驗收：入口差異只刪除上述引用；確認原 CSS 與晶石 icon 檔案／引用不變；獨立瀏覽器 context 檢查桌面、手機橫向、減少動態的原特效樣式恢復、晶石圖示保留、故事攻擊及自由決鬥特效播放／清理；版本同步與 `tests/asset-versions.py`。不重新載入使用者頁面或寫入真實存檔。
- 唯一驗收執行者：product；工程師檢查真實 diff、證據品質與必要的關鍵風險，不機械重跑全套。

狀態：完成。獨立工程師結論可交付，無未解相關 P0／P1／P2 或範圍異常；產品已核對需求、真實差異及五張截圖，驗收通過。審查報告：`test-results/fx-ui-restore-053/engineering-review.md`。

## 實際交付與驗收

- 三個 HTML 入口各刪除一行樣式引用，逐字比對無其他 HTML 差異。`storage/unused-code/combat-visuals.css` 原稿保留，無 runtime 載入引用；直接回到原有特效 CSS，不新增替代覆寫。
- 基線內 141 份 CSS／JS／SVG 全數 SHA-256 不變，包括 `src/css/story-energy-ui.css`、兩個晶石 SVG、原始特效、規則、存檔與音效程式。無新增 runtime 素材容量。
- `python3 scripts/version-assets.py`：無需額外版本變更。`python3 tests/asset-versions.py`：104 筆本機 JS／CSS 引用通過；由 107 降為 104 是本次移除三條引用。
- 本次隔離 Chrome 驗收共 5 組及首頁載入：故事模式桌面 1440×900、手機橫向 844×390、手機橫向減少動態；自由決鬥桌面一般動態及手機橫向減少動態。故事真實拖曳攻擊正常結算、退出後清理，測試 localStorage 不變；自由決鬥公開 FX 播放／取消正常，S 狀態不變。各案例 pageerror 為空。
- 原白紫覺醒／橫幅、星形暈眩、燃燒呼吸與既有數值顏色恢復，兩處晶石背景仍指向 053 新圖。故事入口的 combat-visuals.css 請求為零，三入口均無引用。手機故事主要控制項在畫面內，無橫向溢出。5 張截圖由產品檢視。
- 覺醒／燃燒／暈眩為 DOM fixture 樣式驗證，沒有宣稱完整首領時序。減少動態模式的真實攻擊不產生演出節點，截圖另行注入靜態 fixture，不能把截圖白光當作真實戰鬥的持續效果。
- 首次本機伺服器受 sandbox EPERM 限制，經核准的獨立本機瀏覽器驗證完成。前兩次執行的失敗均為減少動態測試預期錯誤：原 CSS 的 `animation:none!important` 同時重設動畫及 play-state。修正為星形本體與偽元素的 animationName 均為 none；一般動態仍要求 seb-stun-orbit，未更動 runtime 或放寬主要操作断言。兩份失敗報告與說明保留。

證據位於 `test-results/fx-ui-restore-053/`：`source-verification.json`、`verification.json`、`verification-first-attempt.json`、`verification-second-attempt.json`、`verification-notes.txt`、`evidence-manifest.json`、版本日誌與截圖；差異為 `test-results/change-scopes/FX-UI-RESTORE-053-after.json`。執行環境 Node v24.19.0／Playwright 1.62.1／Chrome 154.0.8037.97，來源與測試雜湊已記錄。

未驗證與風險：未測 Safari／實機、所有職業或完整首領演出組合；本次只恢復所選既有 CSS，沒有全套規則重測。既有開啟分頁仍可能使用已載入樣式，使用者離開對局後重新開啟／重新整理才載入還原版；本次未操作既有分頁或真實存檔。本工單無未解阻塞依賴。
