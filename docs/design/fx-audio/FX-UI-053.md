# FX-UI-053｜統一戰鬥特效 UI

**目前狀態：2026-10-04 依使用者選擇，撤下剩餘第 3～11 項特效覆寫。** 三個入口已移除 `storage/unused-code/combat-visuals.css` 引用，原檔及下方初版／R1 紀錄保留追溯；還原驗收進度見 [FX-UI-RESTORE-053](FX-UI-RESTORE-053.md)。ART-MANA-053 的两項晶石 icon 保留。

2026-10-03。使用者於側邊對話明確要求優化特效 UI 並保持一致。唯一寫入者：本對話 side_ui；不建立或呼叫子 agent。範圍是新增 `storage/unused-code/combat-visuals.css` 與三個既有入口 HTML 的單一樣式引用／內容版本，避免改寫主對話正在處理的 JS、音效和劇情。修改前基線為 `test-results/change-scopes/FX-UI-053-before.json`。

視覺方向：古金物理／技能、灰綠護盾、銅紅灼傷、煙紫暗影、灰青晶體；各事件保留文字與圖示區別。統一數值底牌、描邊與局部光暈；頭頂星星改晶片、降低白閃與抖動、覺醒以冷晶光表現；減少動態模式保留數值／狀態與覺醒文字。

只調呈現 CSS，不改命中、傷害、AI、RNG、演出清理時序、回合、存檔或原畫。無新增點陣圖或外部依賴。單次演出不延長既有清理時間；持續狀態的呼吸動畫減慢，不改點擊區或卡片版面。灼傷樣式避開死亡／變身中的角色，保留這些狀態的動畫優先順序。

驗收：最終載入順序與樣式；故事／自由決鬥實際頁面的呈現與操作；桌面、手機橫向、減少動態；裝飾不攔點擊，數值仍可見；版本腳本與 asset-versions。證據保存 `test-results/fx-ui-053/`，只使用隔離測試資料，不重載現有對局。

狀態：樣式已套用，本對話定向驗證通過；主線工單結案仍待獨立工程師審查。側邊對話依使用者限制不使用子 agent，沒有派工或傳訊，不將自行檢查冒稱獨立審查。未修改主線工作板，沒有重載使用者對局。

## 實際修改

- 新增 `storage/unused-code/combat-visuals.css`，統一兩種戰鬥畫面的數值提示、光暈與狀態色：古金、灰綠、銅紅、煙紫、灰青晶體。保留既有圖示與文字區分。
- 頭頂旋轉星星改為固定晶片；覺醒取消高亮紫光與大面積純白閃屏，降低縮放與抖動；死亡效果改為較克制的碎裂與淡出。
- 在 `index.html`、`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html` 的最後一個 stylesheet 位置加入新 CSS 與內容版本。手機橫向縮小飄字，保留點擊穿透。
- 本紀錄與 `test-results/fx-ui-053/` 為本工單文件／證據。沒有新增圖片、音效、字型或外部連線依賴；美術圖片容量檢查不適用於本次 CSS。

## 本次實跑與證據

- `test-results/fx-ui-053/verify.cjs`：5 組通過。故事戰鬥 1440×900、844×390 一般動態及 844×390 減少動態；自由決鬥 1440×900 一般動態及 844×390 減少動態；另檢查首頁最後載入新 stylesheet。
- 故事使用真實滑鼠拖曳攻擊、檢查結算與一般動態的提示文字／色彩，結束後確認測試 localStorage 不變。遊戲現有 JS 在減少動態模式直接更新結果、不建立演出節點；本次保留此行為，並非新增該模式的飄字或覺醒演出。
- 覺醒、灼傷、晶片及回復／護盾／爆擊樣式以實際 UI 中的 DOM fixture 檢查並截圖，不把 fixture 當完整首領流程測試。驗證新樣式優先級、手機控制項邊界、無橫向溢出、裝飾不攔點擊；減少動態下裝飾消失、fixture 文字保留。
- 自由決鬥透過公開 `NDCombatFX.play` 播放測試事件，檢查護盾／灼傷色彩、取消後節點清理及 `S` 狀態未被特效修改。所有案例 pageerror 為空。
- JSON：`test-results/fx-ui-053/verification.json`。5 張截圖同目錄，已逐張檢視。驗證使用全新 Chromium context 與本機臨時伺服器；未使用現有遊戲分頁、真實存檔或主線測試結果。
- `scripts/version-assets.py` 後執行 `tests/asset-versions.py`，107 筆本機 JS/CSS 內容版本通過；輸出為 `test-results/fx-ui-053/asset-versions.txt`。

## 差異範圍與限制

原基線保持不變；after 保存在 `test-results/change-scopes/FX-UI-053-after.json`。三個 HTML 的人工差異核對只有新 CSS 引用，以及故事入口同步現有 `src/css/story-energy-ui.css` 內容版本。JS、引擎與音效沒有本工單改動。

範圍工具回報 `REVIEW_REQUIRED`，因並行 ART-MANA-053 新增 `assets/emblems/mana-cost-053.svg`、`assets/emblems/mana-faceted-053.svg`、`docs/design/art/ART-MANA-053.md` 並修改 `src/css/story-energy-ui.css`；已讀取該工單，變更清單與其記載相符。本工單沒有寫入或還原這四個檔案，未擴大原允許清單，也未把範圍工具退出 1 改報為通過。快照不能鑑識作者。

未驗證：Safari／實機、所有職業與完整首領演出序列、多單位同時狀態的全組合。既有遊戲規則未修改，沒有重跑整套規則套件。獨立工程師審查尚未進行；後續整合需核對本 CSS 與並行工單的最終差異，才能將主線工程工單標為完成。


## FX-UI-053-R1｜恢復原本數值 UI

使用者最新回饋：「數值設計原本的ＵＩ比較好」。本次唯一寫入者仍為 side_ui；允許範圍是 `storage/unused-code/combat-visuals.css` 中初版新增的數值樣式、三個 HTML 的此 CSS 內容版本，以及本紀錄。可信基線：`test-results/change-scopes/FX-UI-053-R1-before.json`。

移除傷害、護盾、爆擊、閃避、灼傷、回復／吞噬等浮動數值的共用底牌、字型、配色、邊框、桌面／手機字級與浮字動畫覆寫，直接沿用既有 `src/css/character-art.css`、`src/css/story-energy-ui.css`、`src/css/story-battle-fx.css` 的原始設計，不另外仿製。其他晶片、光暈、灼傷火焰、覺醒及震動修改保留。戰鬥邏輯與真實存檔未修改。

狀態：修改已套用，定向驗證通過；本側對話仍不使用子 agent，獨立工程審查限制同前。

驗收：`test-results/fx-ui-053-r1/verify.cjs` 在隔離 Chromium DOM fixture 比對桌面 1440×900、手機橫向 844×390、手機減少動態共 3 組。每組 28 個浮字／子元素的字型、色彩、尺寸、底色、邊框、陰影、換行、指標事件與動畫名稱，全部與停用共用特效樣式時的原設計相同；同時確認其他覺醒特效仍套用。結果：`test-results/fx-ui-053-r1/verification.json`。這是樣式比對，未宣稱重跑完整戰鬥流程或實機。

版本腳本已同步，107 筆引用通過：`test-results/fx-ui-053-r1/asset-versions.txt`。範圍核對 `WITHIN_FILE_SCOPE`，無清單外差異；三個 HTML 僅變更新 CSS 的版本值。after：`test-results/change-scopes/FX-UI-053-R1-after.json`。沒有覆寫初版驗收證據；初版數值配色斷言不適用於 R1。尚未進行獨立工程審查，主線結案限制維持。
