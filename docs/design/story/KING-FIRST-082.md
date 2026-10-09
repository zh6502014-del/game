# KING-FIRST-082｜H1異變國王先行

使用者要求國王异變後敵方攻擊先國王再老鼠。game_tree唯一寫src/js/story-energy-engine.js的runEnemy暫存行動序列、tests/king-first-082.cjs、本工單；產品整合HTML版本/工作板，工程獨立審查。限定存活louis-armored具ratRules且同場存活crystal-rat trap；畫面state.units順序不變，王中央、鼠兩側。不得改選招/傷害/召喚/補鼠/其他戰役/文案，排序不取亂數。既有行動先後造成狀態與後續可用行動差異屬此需求效果，不新增或重排單一行動內RNG呼叫。

基線test-results/change-scopes/KING-FIRST-082-before.json，原引擎同存test-results/KING-FIRST-082/engine.before.js。定向驗正常王、真異變、吞鼠/投鼠先於餘鼠、自爆補鼠後下一輪、王死亡、其他敵隊與原引擎一致，畫面序列穩定。執行相關純引擎/frames/戰鬥契約套件；禁止瀏覽器/server，未驗實際動畫，不發布。

## 凍結驗證

僅runEnemy先取副本，將符合H1異變條件的王移至暫存行動首位。state.units未排序，frames before/after敵列順序驗證保持。tests/king-first-082.cjs通過8組定向案例與其他10場各8固定seed全程對比，共80場、1974操作，state/events/frames及RNG計數均與修改前引擎相同。72/72引擎契約與語法PASS。

既有frames套件缺歷史baseline而無法啟動；story-battle套件因舊固定9戰役清單與現11戰役不同在模擬前失敗，不標通過、不修改历史測試。證據test-results/KING-FIRST-082/{targeted.json,engine-suite.json,suite-status.json}。瀏覽器動畫未驗。待產品版本整合與工程審查。

## 產品驗收
工程獨立審查通過，見同ID-review.md。已本地整合，119筆資源版本PASS。未發布；瀏覽器操作與動畫尚未驗證。082舊frames缺基線及battle過時清單仍為未通過，沿用review完整限制，不宣稱全套通過。
