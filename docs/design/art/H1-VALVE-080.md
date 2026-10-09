# H1-VALVE-080｜王室操控室主閥情境圖

需求：H1 第 2/19 幕的背景應符合文字描述，呈現粗大銅管沿牆向上通往鐘樓、中央帶王室紋章的主閥，替換現有圓桌窗景。無人物背景，沿用暗黑奇幻古金／墨綠材質。僅本地，不發布。

## 唯一寫入者與範圍

- ART-UI：本工單文件；`src/js/story-stage-assets.js` 只更換 `backgrounds.royalControlH1.path`。不修改 `royalControl`／H2、配置、文案、角色、流程或存檔。
- 產品：imagegen 生成與 prompt；生成後指派 ART-UI 複製單份原稿、轉檔、記錄 metadata，原稿／prompt 放 `storage/source-art/H1-VALVE-080/`；runtime 路徑 `assets/story/h1-valve-080/royal-control-h1.webp`。產品後續負責 HTML 資源版本與工作板；本次實際僅更新 Nightfall-Duel-Story.html。
- 工程師：唯讀程式審查，僅寫本工單 review 文件。

## 動工前基線

`test-results/change-scopes/H1-VALVE-080-before.json`。保存程式原文及相關允許文件；工單範圍不因其他並行差異自動擴大。

## 驗收

1. 新背景預算約 1536 × 864、單檔不超過 600 KiB，依素材預算規範跑 `scripts/check-art-budget.py --strict`。
2. 隔離 VM 使用現行故事資料，定位 H1-r02，確認舞台輸出採新圖；H2／王室切景仍採原圖。
3. 真實 diff 只替換單一背景路徑；不改原素材，保留生成紀錄。
4. 產品整合後執行 `scripts/version-assets.py` 及 `tests/asset-versions.py`，工程師獨立審查。

證據保存 `test-results/H1-VALVE-080/`。不開 server、不使用替代瀏覽器繞行限制；遊戲內畫面裁切與手機版面未實測，不宣稱通過。

## 實作凍結／交審

已替換 `backgrounds.royalControlH1.path`，唯一 runtime 程式差異是一行路徑。新圖 1535 × 864、232,702 bytes（227.25 KiB），總新增 runtime 同此值；原稿 1672 × 941、2,629,561 bytes，metadata 保存 hash 與 Pillow WebP quality85／method6 轉檔參數。舊圖保留。

本次素材直接檢視：中央王室紋章主閥、向上延伸的粗銅管、右上走廊及無人物空間符合工單。`python3 scripts/check-art-budget.py --strict assets/story/h1-valve-080/royal-control-h1.webp` 通過。

Node VM 定向檢查：`test-results/H1-VALVE-080/verify.cjs`，使用 bundled Node v24，讀取現行六份故事資料／映射檔；H1-r02 實際输出新背景，H2 與王室切景保持原機制／路徑，PASS。完整結果及相依檔案 hash：`test-results/H1-VALVE-080/mapping.json`。

工程審查與 HTML 版本整合待產品接手。遊戲內裁切與手機版面未實測；本地素材檢視不代表整頁實測。

## 產品驗收
工程師獨立審查通過，見 H1-VALVE-080-review.md。產品素材內容驗收通過；版本整合119筆引用PASS。本地修改完成，未發布；實機裁切／手機版面仍待驗證。內建imagegen生成一張，完整提示詞保存在 storage/source-art/H1-VALVE-080/prompt.txt。
