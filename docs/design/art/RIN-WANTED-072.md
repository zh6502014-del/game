# RIN-WANTED-072｜凜遭通緝情境圖

產品唯一實作者；僅本地。截圖 A3-step-06/07 分組因首句優先拿門外站姿，且現有 a3-treason-notice 沒有畫像。本單以現有圖為角色/風格參考，製作一張更貼合被通緝的情境圖：凜隱身牆角注視帶自己畫像的王國告示、右手繃帶、衣服標誌割去，無額外劇透。單張16:9目標1536×864、不透明，顯示區為滿視窗背景（截圖約2048×1152），主要人物臉/告示位於上半部避免閱讀面板遮擋。runtime WebP最多1920×1080/600KiB、總新增最多600KiB。原稿單份 storage/source-art/RIN-WANTED-072/，完整生成紀錄保留，舊素材不覆寫。

只允許 story-art.js 的 a3-treason-notice 路徑、story-stage-assets.js 的 A3-step-06/07映射（移除06優先門外層覆寫、讓分組一致），Story HTML版本，工單與工作板；review由工程師唯讀審查後寫入。不得改文案、節點、規則、存檔。基線 test-results/change-scopes/RIN-WANTED-072-before.json。

驗收：圖像實際檢視、strict素材預算、映射定向VM、版本及工程審查。瀏覽器政策限制延續，不冒稱頁面視覺實測。

實際交付：內建 image_gen 一張，原稿1672×941／2,783,059 bytes；原稿與完整prompt、SHA、轉檔紀錄在 storage/source-art/RIN-WANTED-072/。runtime 1535×864／239,856 bytes（234.2KiB），總新增runtime同值；WebP quality85/method6，strict background PASS。產品已檢視縮小圖，臉與告示畫像清楚，未做瀏覽器裁切驗收。

驗收證據：test-results/RIN-WANTED-072/verify.cjs 使用真實映射VM，06/07同圖、開場與07-b保留原圖，PASS。117資源版本PASS。

範圍例外：版本工具也更新 Nightfall-Duel-V12.12.39-Test.html 的共享 story-art.js query，原allow漏列。保留原baseline與REVIEW_REQUIRED，不擴白名單。產品以baseline JS hash重建舊query之HTML，保存 test-results/RIN-WANTED-072/test-entry-reconstructed-before.html，SHA與baseline該HTML完全相同，證明只必要版本同步。核定此項為產品整合差異，交工程師獨立確認。

產品驗收：接受新圖內容、衍生圖品質及工程審查；Test HTML版本例外已独立核對，無未解相關P0/P1/P2。頁面裁切與面板遮擋未實測，尚未發布。審查見 RIN-WANTED-072-review.md。
