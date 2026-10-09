# H1-VALVE-ACTION-081｜格蘭與朔合力轉主閥

H1 第 4/19 幕要求兩人實際合力轉主閥，原站立人物不符。ART-UI 單一主責生成一張寬幅動作情境圖，參照現行格蘭／朔造型及 H1-VALVE-080 主閥背景，無 UI／文字；原稿、prompt、metadata 置 storage/source-art/H1-VALVE-ACTION-081，runtime assets/story/h1-valve-action-081/turn-valve.webp，約1536×864且≤600KiB。

程式只允許 src/js/story-stage-assets.js 的 H1-r04 專用 illustration 映射，必要時 src/js/story-art.js 登錄；不改其他場景、文案、規則或閱讀順序。先檢查現行閱讀 group，確保只影響動作一幕。三 HTML 版本與工作板由產品唯一寫入；工程師只寫 review。

動工前基線 test-results/change-scopes/H1-VALVE-ACTION-081-before.json。檢查：新圖視覺／容量 strict、VM 載入現行資料並驗 H1-r04 與相鄰場景不變；證據 test-results/H1-VALVE-ACTION-081。不開 server 或替代瀏覽器，實際遊戲裁切與手機顯示未測。本地修改不發布。

## 凍結交付

使用內建 imagegen，參考現行 actors/gran.webp、actors/shuo.webp 及080主閥背景；prompt原文已保存。格蘭重甲／青綠圍巾、朔深袍／髮髻身份延續，兩人雙手握主閥，未加入伊芙或納爾瓦；縮圖檢視雙手與銅管紋章清楚。

Runtime 1535×864、356,890 bytes（348.53 KiB），總新增runtime同值；原稿1672×941、3,197,026 bytes，單份存放。metadata保存工具、參考圖、SHA-256與比例縮圖/WebP quality85設定。strict素材預算PASS。

僅stage resolver新增H1-r04專用illustration回傳，actors=[]，不需改story-art.js。實跑VM使用現行故事資料及實際compileReadingUnits，確認H1-r04為第4個獨立閱讀單位；新圖回傳正確，H1/H2其餘99步解析與基線一致。測試程式與報告：test-results/H1-VALVE-ACTION-081/verify.cjs、mapping.json。非全故事覆蓋；探索全節點時既有缺圖解析拋錯，改以受影響H1/H2驗證，未修改其他場景。

工程審查與HTML版本整合待產品接手；本地檔案已凍結。遊戲內裁切與手機顯示未實測。

## 產品驗收
工程審查通過，見 H1-VALVE-ACTION-081-review.md；產品已檢視runtime，兩人動作和場景符合。本地整合完成，Nightfall-Duel-Story.html版本已更新，119筆引用PASS。未發布，遊戲內裁切和手機顯示未驗證。
