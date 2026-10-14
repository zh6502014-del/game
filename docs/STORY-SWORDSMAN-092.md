# STORY-SWORDSMAN-092｜劍客戰棋卡恢復場景背景

需求：使用者確認將劍客戰棋卡片恢復為帶背景圖片。沿用現有素材，不新增圖片，不改劇情對話的去背立繪。

唯一寫入者與整合者：product。工程師於凍結後唯讀審查。

允許修改：
- `src/js/story-energy-ui.js` 的 `localArt()`：只將劍客且使用成年朔 `assets/story/actors/shuo.webp` 的戰棋圖，改選原有職業場景圖；角色牌為 `assets/characters/swordsman.webp`，招式牌／手機招式選單為 `assets/cards/swordsman.webp`。
- `story.html`：只由版本工具更新上述 JS 的內容版本。
- 本工單及 `docs/agents/WORKBOARD.md`：範圍、狀態及交付證據。

限制：不改敵方同職業的專屬肖像、其他角色／年齡立繪、素材本身、CSS、劇情映射、引擎、AI、RNG、存檔與戰鬥規則。只在獨立瀏覽器 context 驗證，不重載使用者頁面。

基線：修改前保存 `test-results/change-scopes/STORY-SWORDSMAN-092-before.json`，使用 `scripts/check-change-scope.py snapshot`；交付證據完成後封存到專案外桌面存放區，保留專案容量與項目餘裕。

必要驗收（product 執行）：版本同步及 `tests/tooling/asset-versions.py`；隔離 Chrome 桌面、手機直向及橫向，核對朔主角／夥伴角色牌、招式圖與敵人專屬肖像，檢查載入與頁面錯誤；實際查看截圖；核對劇情素材與映射雜湊不變；工程師獨立 diff 與關鍵風險審查。證據在 `/tmp/story-swordsman-092/`。

狀態：完成／工程複審與產品驗收通過（2026-10-14）。初次手機視覺證據的 P2 已補正並關閉。

基線建立紀錄：首次指定 `/tmp` 被工具拒絕。已僅反向還原本次兩行 JS、HTML 版本與新工單／工作板變更，核對原 JS 的內容版本 `3f8fe4f38068`，於工具要求的目錄成功 snapshot 後才重新套用相同修改；沒有以修改後內容冒充原始基線。

## 實際改動與驗收

執行碼只新增成年朔的戰棋選圖條件與註解；`story.html` 同步該 JS 內容版本。沒有新增、重製或修改圖片。修改檔案為上述兩檔、本工單與工作板，共四檔（含一份新工單）。

- `python3 scripts/version-assets.py`、`python3 tests/tooling/asset-versions.py`：63 筆本機 JS／CSS 引用符合內容版本，CSS 產物保持相同。
- `node --check src/js/story-energy-ui.js`：語法檢查通過。
- 隔離 Chrome：B1-wolves、C4-outer、C4-inner、C9-abyss、H1-king、C9-griffin 六場初始戰場 × 1440×900、390×844、844×390，共 18 組；角色與技能圖路徑／解碼、其他角色專屬圖、戰鬥 state 不變、六次手機選單圖通過。頁面錯誤及本機 HTTP 錯誤均為 0。
- 手機初輪截圖曾拍到預載遮罩或全黑；工程初審列 P2。修正驗證等待時序：等待載入遮罩移除，檢查角色卡中心命中與祖先透明度、手機招式圖中心命中，再重跑 18 組通過。初次腳本、輸出、截圖及初審保留在 `first-run/`，不能拿初次 PASS 當作手機視覺通過。
- 產品實際查看重跑後的桌面、手機直向、橫向及招式選單截圖，確認朔帶有場景背景。敵方晶狼及其他夥伴保留自己的圖。
- 三張劍客／朔圖片、劇情映射、舞台映射、戰鬥引擎共六檔 SHA-256 與整理前相同；程式差異限於允許的四個檔案。
- 工程師獨立核對真實 diff、576 組原／新版選圖矩陣、六組載入錯誤 fallback 及原始基線，並檢視新版手機截圖完成複審；沒有未解的本次 P0／P1／P2。產品已完成畫面與需求驗收。

本次瀏覽器使用全新 context，禁止 service worker 以免舊快取掩蓋結果，封鎖外部請求，未接觸使用者現有頁面或真實存檔。補驗曾遇自動權限審查逾時，依工具允許重試一次成功；不是遊戲測試失敗。

未驗證：完整故事／戰鬥流程、實機 Safari、外部音效。這次沒有修改相關規則或音訊；本次結果不宣稱全狀態覆蓋。交付為本機修改，沒有在本次推送 GitHub。

驗收證據交付位置：`/Users/songer/Desktop/Game_claude_存放資料夾/batches/STORY-SWORDSMAN-092/evidence.tar.gz`。內含 before／after、瀏覽器腳本與輸出、截圖、首次問題、工程審查及保護檔案雜湊；如需重跑差異工具，將 `before.json` 複製回 `test-results/change-scopes/STORY-SWORDSMAN-092-before.json`。
