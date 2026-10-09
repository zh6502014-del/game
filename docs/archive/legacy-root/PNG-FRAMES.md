# 共用 PNG 雕刻邊框 · 2026-09-23

三張原創透明 PNG 已實際接入遊戲。原稿與生成紀錄保留在 `assets/frames/v1/originals/`；不更動角色、卡面及判定邏輯。

| 系列 | 使用位置 | 原圖切線 | 顯示角尺寸 |
| --- | --- | --- | --- |
| hero | 選角、頭像、手牌、牌背、翻牌、首頁入口、決鬥台、結算 | 224px | 10–32px |
| panel | HUD、放置區、操作列、玩法說明、規則、戰況、音效、卡片詳情、故事對話與收藏 | 208px | 14–22px |
| thin | 按鈕、狀態、生命值裝飾、職業角標、外觀選擇 | 176px | 8–10px |

中央透明，文字與圖片獨立。CSS `border-image` 不使用 fill，四角保持相同寬高，邊線使用 repeat。窄畫面降低顯示角尺寸，沒有拉伸整張圖片。圓形音效鈕、VS 紋章、輪播指示點、細分隔線與資源進度條保留各自形狀。

`scripts/slice-frames.py` 只做透明邊界裁切與九宮格提取，不重繪素材；用含 Pillow 的 Python 執行可重現。24 張獨立邊角切片在 `slices/`；瀏覽器使用三張裁切後 atlas，切線及尺寸見 `manifest.json`。

統一呈現入口為 `png-frames.css`，由首頁、對戰、故事入口最後載入。卡框位於面板或牌面的裝飾層，pointer-events 為 none；沒有修改 card3d 的透明度、旋轉或紙張側緣。PNG 失敗時保留純色 CSS 邊框。

展示：`frame-gallery.html`（長寬可調）。截圖：`test-results/png-frames-1440.png`、`png-frames-390.png`、`png-frame-gallery.png`。

驗證：
- `tests/png-frames.cjs`：1440／900／700／390／320px、透明中心、圖源與重複模式、各彈窗／首頁、PNG 失敗後仍可查看卡片。
- `tests/hud-polish.cjs`：70 組數值與文字尺寸、四職業及解鎖外觀，共 8 種外觀 × 5 寬度，無裁切、重疊或水平溢出。
- `tests/flip-material.cjs`：桌機與手機各 9 個翻轉角度，卡面不透明且覆蓋完整。
- `tests/ui-smoke.cjs`：四寬度拖曳出牌至第二回合、規則／戰況／音效／卡片詳情、三種結算、再戰、返回選角。
- `tests/asset-versions.py`：本機 CSS／JS 內容版本一致，避免新舊樣式混用。

測試回報保存在 `test-results/`。既有遠端音效請求在頁面切換時有 ERR_ABORTED；此次無新增外部素材依賴。
