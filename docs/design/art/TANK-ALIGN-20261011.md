# TANK-ALIGN-20261011｜格蘭情境圖依時間軸統一

- 需求：年輕時間軸使用 assets/story/actors/gran-young.webp；成年使用 assets/story/actors/gran.webp。保留既有場景、人物、動作、故事結果與有據的裝備損傷。
- 產品／素材唯一寫入者：主對話；美術 agent 唯讀清查所有情境圖及引用，產物僅 test-results/tank-align-20261011/audit/。
- 範圍：坦克出現且造型不符的現有情境 WebP 原路徑替換；不改兩張基準立繪，不改卡面／選角、故事文案、AI、RNG、規則、存檔。精確清单於 audit 完成後保存 manifest，逐張生成前保存舊圖與 SHA。
- 第一張允許素材：assets/story/illustrations/class-origin/tank-bell.webp，T1 年輕版；移除與基準不符的頭盔，匹配年輕臉／髮型與銀灰新兵甲。
- 原稿：storage/source-art/TANK-ALIGN-20261011；保留完整 prompt、參考圖、SHA、尺寸／bytes及runtime轉檔設定。舊封存維持原樣；restore 原路徑已有資料，改用工具還原至 /tmp/nightfall-tank-source-20261011 供查閱。
- 用途：既有故事寬景（16:9，舞台全寬），每張單一候選，生成目標1536×864；runtime不放大、1536×864以內且每張≤600KiB，總預算於清單確定後依張數×600KiB鎖定。
- 驗收：逐張比對年龄／臉／髮／甲／盾、保留人物及動作；strict容量檢查；引用存在；隔離瀏覽器圖片載入與裁切。若需程式整合先另留允許檔基線並工程審查。
- 狀態：清查與生成中；尚未完成。

## 核定清單

- `assets/story/illustrations/class-origin/tank-bell.webp`
- `assets/story/illustrations/class-origin/tank-return.webp`
- `assets/story/illustrations/class-origin/tank-shield.webp`
- `assets/story/minigames/shield-rhythm/hold-the-gate.webp`
- `assets/story/minigames/shield-rhythm/hold-the-gate-held.webp`
- `assets/story/illustrations/class-origin/tank-refusal.webp`
- `assets/story/illustrations/class-origin/swordsman-return.webp`
- `assets/story/illustrations/node-posters/t1.webp`
- `assets/story/illustrations/node-posters/t2.webp`
- `assets/story/illustrations/node-posters/t3.webp`

7個生成構圖、3個衍生縮圖；10檔runtime總上限6000KiB。成年兩圖經產品大圖覆核：原鎧甲已有雕花，主要差異是頭盔／髮型與臉部身份；修正時保留原動作與雕花甲結構。

- 追加允許：assets/story/illustrations/node-posters/manifest.json，僅T1/T2/T3來源與衍生尺寸/SHA/bytes紀錄。追加基線 test-results/change-scopes/TANK-ALIGN-20261011-metadata-before.json。

## 交付驗收

7張情境構圖（年輕5、成年2）與3張章節衍生已原路徑替換；全部1535×864、WebP q85 method6。runtime總量2,247,978 bytes（2.14 MiB），淨增加75,740 bytes。7份新原稿共18,086,169 bytes，完整prompt/生成記錄/舊圖SHA留storage/source-art/TANK-ALIGN-20261011。

strict 10檔0超標；完整解碼通過；獨立Chrome桌面1280×900與橫向844×390圖片載入10/10。產品比對comparison.jpg確認人物、場景構圖、盾牌位置與年代。工程審查test-results/tank-align-20261011/engineer-review.md為可交付、無相關P0/P1/P2。另允許生成preload-manifest及HTML版本（追加基線integrate-before/html-before已於修改前保存），63 JS/CSS引用PASS；沒有更改故事/規則/存檔/CSS。

未驗證完整故事逐步操作與所有裝置；Chrome為隔離素材驗收頁，非全劇情回歸。既有service worker先回快取再背景更新，舊頁可能暫時顯示舊圖；未重載使用者對局。

狀態：產品驗收完成，本地未發布。後續依賴：全角色設定與全圖一致性稽核CHARACTER-BIBLE-20261011。
