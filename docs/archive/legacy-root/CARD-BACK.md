# 共用古金墨綠牌背

目前版本：`assets/cards/back-gold-v2.png`，1060×1484、5:7、不透明 RGB PNG。CARD-BACK-004 將背景簡化為低對比深墨綠材質，移除藤蔓與密集放射線，保留中央菱形寶石、上下月牙與細金框。共用外層 PNG 框及翻牌結構保持原樣。原始 v1 圖檔和生成紀錄均保留。

本輪已驗證五寬度 × 四職業、失敗備援與操作；桌面／390px 各九個翻牌進度以及正面實際繪製通過。最新報告與限制見 [CARD-BACK-004](../card-back-004.md)。以下為 v1 的歷史交付紀錄。

2026-09-23：以 imagegen 生成 `assets/cards/back-gold-v1.png`，1060×1484、5:7、不透明 RGB PNG。原圖與提示記錄保存在 `assets/cards/back-gold-v1.json`。中央寶石封印、日月與古金雕刻共用既有暗黑奇幻風格。

所有職業、外觀、卡種的對手手牌與雙方未揭曉出牌均使用同一張原畫，不以牌背透露卡種。以 object-fit:cover 等比例呈現，無拉伸；圖片下方保留不透明牌身。原本 SVG 封印只作為載入失敗備援，載入成功後隱藏；預載牌背並更新 CSS／JS 內容版本。沒有更動判定或 AI。

素材展示頁已加入原畫預覽。`tests/card-back.cjs` 驗證五種寬度（1440／900／700／390／320）× 四職業，共20組；相同素材、尺寸邊界、重複紋章隱藏、載入失敗與失敗後點牌通過。`tests/flip-material.cjs` 於1440／390各九個翻牌進度驗證雙面不透明與朝向，均通過。

截圖：`test-results/card-back-1440.png`、`test-results/card-back-390.png`。機器可讀紀錄：`test-results/card-back.json`。未重整使用者原本對局；重新載入頁面後套用。
