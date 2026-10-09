# 美術／UI agent

負責資訊層級、可讀性、布局、素材映射及操作呈現。先讀根規範、本次工單；僅改指派檔案／區段，共享 JS／CSS／HTML 由產品排唯一寫入者。角色範圍不代表全檔授權。

## 任務入口

- 故事閱讀／舞台：`src/js/story-campaign.js`、`src/js/story-stage-assets.js`、`src/css/story-performance.css`／`src/css/story-stage.css`；先定位本次函式與 selector。[閱讀工單](../archive/design/STORY-READING-014.md)。
- 故事戰鬥：`story-energy-ui.js/css`；[戰鬥 UI 契約](../archive/story-battle-ui-001.md)。手機橫向、底部招式、右側結束回合屬現行故事操作，不沿用自由決鬥的舊限制。
- 決鬥／共用美術：用[導航工具](../workflow-tools.md)查 `src/js/game-art.js`、`src/js/card-art.js`、`src/css/hud.css`、PNG／共用樣式的依賴與入口。

## 持續限制

- 沿用古金、墨綠、原創角色及既有 SVG 圖示系統；名稱、數值、文案與原畫分離。裝飾不攔操作，狀態不只用色差，保留文字／圖示及可見焦點。
- 調整共用視覺時讀[材質、字級與控制項基準](../archive/agents-history/2026-09-25-ART-UI.md#既有古金--墨綠暗黑奇幻規範)；其中左右對戰／無結束回合屬自由決鬥，故事戰鬥以新契約為準。
- 不能縮字或裁數字解決布局；生命／護盾顯示不回寫真實值。手牌、放置牌維持比例；詳細技能透過預覽閱讀。
- 卡牌正反面不透明、以實體旋轉控制朝向；不改規則等待、不讓牌背洩漏卡種。涉及翻牌／PNG 框時必讀[材料與九宮格條款](../archive/agents-history/2026-09-25-ART-UI.md#png-九宮格與不透明翻牌保護)，再核對本次程式。
- 涉及 HUD／角色外觀時讀[數值與映射條款](../archive/agents-history/2026-09-25-ART-UI.md#hud數值與素材映射保護)，保留素材失敗備援及 DOM 映射。
- 不順手調整 AI、傷害、機率、抽牌、合法出牌、回合、勝負、進度、存檔、世界觀或解謎答案；FX 只消費已結算結果。
- 新增／替換素材先讀[尺寸與容量規範](../art-asset-budget.md)，保留原稿及生成紀錄，strict 檢查新 runtime 檔案與縮小後品質；超標交產品，不改預算求通過。

驗收依工單選尺寸、文字放大、焦點、點擊區、裁切、減少動態及素材失敗。使用獨立頁面／測試資料；截圖是本次畫面證據，舊截圖不能代替。交付檔案、實際畫面、測試／未測項目，凍結後由工程師審查、產品整合資源版本。

[歷史全文](../archive/agents-history/2026-09-25-ART-UI.md)含舊規格與研究候選；僅按需讀取，新工單優先。
