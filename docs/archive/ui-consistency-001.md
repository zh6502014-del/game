# UI-CONSISTENCY-001｜圖示一致性與隱性日夜環境

需求：檢查 UI／Icon 一致性；決鬥台中央不顯示白天或黑夜，透過背景圖片與光影表達。產品負責整合，美術／UI 負責圖示審查，遊戲樹 agent 負責指定 UI 流程回歸。

## 實際調整

- 移除 `environment.js` 中央日夜標籤的建立及對應 CSS。日夜仍由雙方實際 `night` 狀態決定，背景保持約 700ms 淡入；角色本身的夜襲標記及投幣結果保留。
- 職業技能卡角標統一為斬擊／護盾／閃擊／爆擊；原始與解鎖外觀的手牌、放置牌、詳情使用相同招式圖示。選角與 HUD 保持職業紋章。
- 日誌的 Emoji 語意只比對緊鄰文字，避免後文提到另一角色而改錯圖示；補上完成勾記 `✓` 的 SVG 轉換。安全文字節點及純文字匯出保持可用。
- 劇情對手紋章共用 HUD 頭像尺寸及 grid 區域，修正手機寬度變成零的問題。
- 拼圖插槽排除通用矩形按鈕邊框及高度規則，保持原有形狀和座標。
- 素材展示頁使用現有 PNG 共用框；圖示展示頁補上職業／技能對照、語意分組、14／16／20／24／32／64px、選取／停用與原 SVG 檔對照。

44 個功能 SVG 與 registry 幾何一致，24×24、1.75 線寬、圓形端點及斜角接合一致；未重畫圖示或重新生成圖片。六個場地／框體裝飾 SVG 保留自身畫布。

## 修改檔案

`environment.js`、`arena-finish.css`、`unified-art.css`、`hud.css`、`card-art.js`、`game-art.js`、`png-frames.css`、`art-gallery.html`、`icon-gallery.html`、`tests/ui-consistency.cjs`。資源摘要更新涉及六個根目錄 HTML 入口；`game.js`、AI、傷害、機率與回合規則未修改。

## 驗證證據

- [圖示審查](../../test-results/icon-consistency.json)：44 圖示，1440／900／700／390／320px；320px 放大文字 200%、鍵盤焦點，無水平溢出與 JS 錯誤。
- [定向整合驗證](../../test-results/ui-consistency.json)：五寬度 × 五次日夜狀態轉換、背景載入與跨回合保持、個別夜襲標記；四技能 × 兩外觀 × 四卡片位置；安全日誌／文字匯出；五寬度 NPC 頭像與素材展示；技能不重設夜景、減少動態、再戰及大廳清理；拼圖單次實際點選配對。
- [HUD 驗證](../../test-results/hud-polish.json)：五寬度 × 正常／200% 文字 × 七種 HP 值，共 70 數值案例；八種角色外觀 × 五寬度、兩個其他入口及素材失敗備援。無數值裁切與重疊。
- [UI 流程回歸](../../test-results/ui-smoke.json)：四寬度固定種子，拖牌到第 2 回合、戰況、規則、音效設定、詳情、三種結算、再戰與返回，無未捕捉 JS 錯誤。
- `python3 tests/asset-versions.py`：70 筆本機 JS／CSS 引用符合內容摘要。

截圖：[桌面白天](../../test-results/consistency-day-1440.png)、[桌面夜襲](../../test-results/consistency-night-1440.png)、[手機夜襲](../../test-results/consistency-night-390.png)、[手機 NPC](../../test-results/consistency-npc-390.png)、[圖示手機版](../../test-results/icon-consistency-320.png)。

## 驗證限制與過程

測試使用獨立 Chrome 視窗尺寸模擬，沒有重載使用者頁面、改真實存檔或覆蓋另行進行的 STORY-084 檔案。未做實體手機驗證或完整遊戲樹窮舉。

UI smoke 的 900px 案例記錄四次既有外部音效請求 `ERR_ABORTED`，未阻止操作；本輪沒有做音質或音訊生命週期驗收，仍屬特效／音效工單範圍。

首次定向測試因既有 8765 服務停止而失敗，恢復服務後重跑。展示頁曾在視窗重排尚未完成時量到前一尺寸的圖片寬度；測試加入兩個繪製影格等待後重驗，未以隱藏溢出修改產品。

本輪不代表先前規劃的完整設計系統模組化、資源數值徽章或音效升級已完成；上述屬獨立需求，保留後續整合依賴。
