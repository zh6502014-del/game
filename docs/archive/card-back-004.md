# CARD-BACK-004｜共用卡背簡化

2026-09-23。美術／UI agent 完成新素材，產品完成整合及驗收。

## 可見成果

保留古金菱形寶石封印、上下月牙與細金框，移除藤蔓、密集放射線與繁瑣雕花；深墨綠背景有更多留白，縮小後仍以中央封印為焦點。外層沿用既有共用 PNG 框，牌背保持不透明。四職業、所有卡種及外觀共用同一牌背，不透露卡種。

對手手牌、雙方未揭曉出牌及展示頁已更新。三入口同步預載新版；沒有更改戰鬥規則、AI、存檔或翻牌時序，也未重新載入使用者正在進行的對局。

## 修改檔案與來源

- [新版原畫](../../assets/cards/back-gold-v2.png)：1060×1484、5:7、8-bit RGB PNG，沒有透明通道；保留 v1 原稿。
- [完整生成紀錄](../../assets/cards/back-gold-v2.json)：內建 imagegen，兩次精修的完整提示詞、參考圖、工具輸出路徑及 SHA256。最終來源複製入專案，未另行編修圖片。
- `game-art.js`：共用背面圖片和呈現版本改為 v2。
- `index.html`、`Nightfall-Duel-V12.12.39-Test.html`、`Nightfall-Duel-Story.html`：預載新版牌背；`art-gallery.html` 更新預覽、原圖連結與說明。
- `tests/card-back.cjs`：預期與故障注入路徑改為 v2，本輪輸出另存 `card-back-v2-*`，保留舊牌背報告。
- `assets/generation-log.json`、`CARD-BACK.md`、本文件及工作板：版本與驗收紀錄。版本腳本同步入口的本機 JS／CSS hash，包含 `icon-gallery.html` 的共用腳本引用。

## 實際驗收

使用獨立無頭 Chrome 與測試狀態，不操作使用者頁面。

| 檢查 | 結果 |
| --- | --- |
| `tests/card-back.cjs` | PASS，1440／900／700／390／320px × 四職業，共20組；共用素材、等比例填滿、雙重SVG封印隱藏；載入失敗備援及失敗後點牌通過 |
| `tests/flip-material.cjs` | PASS，1440／390px各九個翻牌進度；正反面不透明、牌面完整覆蓋、朝向與側緣通過；減少動態的正面不透明檢查通過 |
| `tests/flip-readback.cjs` | PASS，翻牌完成後正面實際繪製及命中測試通過 |
| 展示頁 | 新版原圖解碼成功、尺寸符合1060px寬，已保存預覽截圖 |
| 版本檢查 | 執行 `scripts/version-assets.py` 後，`tests/asset-versions.py` 的74筆引用通過 |
| 人工檢視 | 原圖、1440及320px實際對局截圖、390px翻牌側緣；背景簡化、封印清楚，沒有拉伸或新增透明切面 |

證據：[卡背報告](../../test-results/card-back-v2.json)、[翻牌材質報告](../../test-results/flip-material.json)、[桌面](../../test-results/card-back-v2-1440.png)、[320px](../../test-results/card-back-v2-320.png)、[新版預覽](../../test-results/card-back-v2-gallery.png)。

## 限制、風險與後續依賴

上述為桌面 Chrome 的視窗模擬，未驗證實體手機效能與跨瀏覽器渲染，也不代表完整遊戲樹覆蓋。原圖有細金框，遊戲最外側仍有既有共用框；已檢視兩者疊合後的小尺寸效果。無阻擋本次交付的已知問題。既有頁面須待下次自行載入才取得新版，未強制中斷對局。
