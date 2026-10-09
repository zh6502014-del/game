# BASIC-ART-003｜基本卡輪廓與背景簡化

2026-09-23，產品驗收完成。需求：攻擊、防禦、閃躲的主要內容輪廓更清楚，卡面背景細節簡化。

## 實際改動

- 使用內建 imagegen，以原卡面為參考產生三張新版原畫，保留半寫實暗黑奇幻、古金與墨綠色調。
- 攻擊改為單一斜向長劍與握劍手；防禦突出完整盾牌；閃躲以側身人物與分離的來襲刀刃表達動作。
- 背景改為低細節墨綠霧色，移除建築與密集粒子，讓主體邊緣容易辨識。
- 基本卡使用完整構圖縮放，避免手機較方正的插畫區裁去劍尖、盾尖及閃避動作。手牌、放置牌、翻牌正面、詳情與展示頁共用同一素材映射。
- 原始三張卡圖保留；未更換職業／特殊卡，未改動遊戲判定。

## 檔案

- 新圖：[攻擊](../../assets/cards/basic-v2/attack.png)、[防禦](../../assets/cards/basic-v2/defense.png)、[閃躲](../../assets/cards/basic-v2/dodge.png)。
- [生成清單](../../assets/cards/basic-v2/generation.json)：每張圖的完整提示詞、參考圖、內建 imagegen 輸出來源、尺寸與 SHA256。
- `card-art.js`：三張基本卡的版本路徑、置中與完整構圖設定。
- `game-art.js`：套用素材指定的縮放方式。
- `assets/generation-log.json`、`UNIFIED-ART.md`：追加版本紀錄與映射。
- `tests/basic-art.cjs`：基本卡素材、縮放、詳情、展示頁與截圖檢查；`tests/unified-art.cjs`：更新基本卡預期路徑與載入失敗案例。
- HTML 入口的本機 JS／CSS 版本摘要由 `scripts/version-assets.py` 更新。

## 驗收證據

- `tests/basic-art.cjs`：1440／900／700／390／320px 通過；三張圖正確解碼、置中、完整構圖且不透明，沒有水平溢出；詳情與展示頁映射正確，瀏覽器錯誤清單為空。[結果](../../test-results/basic-art.json)。
- `tests/unified-art.cjs`：五寬度、九卡種在四種呈現位置、1／4／7 張手牌邊界、環境／硬幣／六技能呈現、減少動態與素材失敗備援案例通過。[結果](../../test-results/unified-art.json)。
- `tests/asset-versions.py`：73 筆本機 JS／CSS 版本引用通過。
- 人工檢視桌面及 390／320px 手牌截圖：主體輪廓清楚、背景簡化、既有卡框與卡名保留。
- 前後對照：[390px 舊版](../../test-results/basic-art-before-390.png)、[390px 新版](../../test-results/basic-art-after-390.png)、[桌面新版](../../test-results/basic-art-after-1440.png)、[320px 新版](../../test-results/basic-art-after-320.png)。

## 限制與後續依賴

本次使用獨立瀏覽器頁面與測試資料，沒有重新載入使用者正在進行的對局。驗收為指定視窗寬度及呈現案例，未包含真實手機裝置或完整遊戲規則矩陣。完整構圖模式會在部分插畫區兩側保留深色留白，這是避免裁切主體的預期結果。無阻擋交付的已知問題；後續若調整卡片比例，仍需檢查小手牌輪廓。
