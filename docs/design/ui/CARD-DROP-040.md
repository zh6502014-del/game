# CARD-DROP-040｜卡片40%重疊放置

狀態：進行中。使用者要求卡片拖曳進放置區域40%以上即成功；以**重疊面積／拖曳卡片面積 ≥ 0.4**為契約，含恰好40%。

範圍：自由決鬥實體拖曳卡片。合法戰鬥卡放己方slot；self卡放己方HUD。敵方區域仍非法，不改AI、傷害、牌型合法性或回合。故事戰鬥為箭頭指定目標，沒有搬動卡片，本單不將它誤改成矩形卡片放置。拼圖／尋物亦不包含。

單一實作者art_ui只寫game.js拖曳區段及新tests/card-drop-area.cjs。共用同一面積判定供移動高亮和鬆手，鬆手重新計算當下位置，避免快移動或舊target誤放。使用可見卡面尺寸／位置，不把指標位置或放置區面積当分母。不加入padding隱藏擴張。

產品寫本單、WORKBOARD索引、config/workflow-map.json新增測試導航及最後HTML資源版本；工程師只寫test-results/card-drop-040-review.md。基線test-results/change-scopes/CARD-DROP-040-before.json；若版本腳本需改額外入口，先確認並留追加基線。

驗收：39.9%拒絕、40%與40.1%接受；四邊／角落、指標在外但卡面達標、指標在內但卡面未達標、鬆手重新計算、錯側／self、取消與多指清理；桌面與手機尺寸。沿用並執行受影響drag-surface、drag-multitouch；獨立測試頁不碰真實對局。工程審查後產品同步資源版本，記錄未驗證範圍。

## 實作與本體驗收

2026-09-25 18:37:16 +08來源與測試凍結。`src/js/game.js`僅改拖曳段：新增`hasCardDropOverlap`及`updateDragTarget`，移動／釋放共同量測ghost可見外框矩形，交集面積達卡面40%即接受。卡片的提升／縮放由瀏覽器實際矩形反映，陰影不算面積；取消舊cursor padding。`pointerUp`先依當次座標更新位置，不沿用最後一次move的target。其餘規則與清理不變。

唯一實作新增`tests/card-drop-area.cjs`。產品在`config/workflow-map.json`登記manual測試；同檔另受STORY-SKIN-016產品委託追加`story-skin-collection`導航，其獨立前基線為STORY-SKIN-016-NAV-before.json，016工程師已核該增量，不冒稱為拖曳需求。

| 檢查 | 結果／證據 |
| --- | --- |
| 幾何契約 | 27項PASS：39.9／40／40.1%、四邊與四角、小目標分母、零尺寸 |
| 瀏覽器卡面 | 240項PASS：1440／900／700／390／320 × 一般／減少動態；實際CSS的39.9／40.1%兩側量測、self及錯側、游標與卡面不同位置 |
| 釋放與指標 | 20次無最後move的釋放重算、10次多指與取消PASS |
| 真正出牌 | 復原playCard後，護盾及一般攻擊回合PASS；不是以提交spy冒稱規則測試 |
| 舊拖曳回歸 | drag-surface：45牌面＋4skin、失焦／減少動態／實際回合PASS；drag-multitouch：4項PASS |
| 工程獨立 | 390px一般／減少動態共6例trusted原生mouse release與實際pointer capture，最新釋放位置、次指拒絕／主指提交及清理PASS；本體未見未解P0／P1／P2 |

[正式報告](../../test-results/card-drop-area/report.json)、[命令與18項入口依賴](../../test-results/card-drop-040-evidence.json)、[工程報告](../../test-results/card-drop-040-review.md)。新測試16項依賴前後一致；入口18項CSS/JS比修改前基線，僅game.js改動。Node24.19.0、Playwright1.62.1、Chrome154.0.8037.58。產品已看[桌面](../../test-results/card-drop-area/drop-40-1440.png)與[手機](../../test-results/card-drop-area/drop-40-390.png)拖曳實圖，卡面保留原風格且目標提示對齊。

短測兩次失敗均為測試前提：卡片因1.04縮放略大於slot，改用實際正交交集反算位置；測護盾的手牌全為護盾，既有規則因無合法普通牌自動換回合，改為護盾＋兩張攻擊的正確fixture。沒有改runtime閾值或回合規則迎合測試。精確40%由矩形contract驗證，實圖矩陣用39.9／40.1%避開CSS子像素量化，不宣稱每一實圖恰好40.000%。

## 並行與限制

STORY-SKIN-016另產品持有campaign／mode收藏與測試；STORY-ROUTE-013-IMPLEMENT由原故事玩法產品持有T1 data、campaign route接線、route模組／CSS／helper／test，已確認基線。017中繼站與018姓名文件及future/finale文稿屬其他故事產品，本單不修改或驗收。WORKBOARD各自索引，scope清單外差異保留人工歸屬，不擴白名單。

本票不改故事箭頭指定目標、拼圖或尋物；未驗證Safari／實體手機，亦不宣稱全戰鬥平衡覆蓋。所有測試採獨立頁面與存檔，未刷新使用者對局。其他故事功能不因本票拖曳通過而自動算驗收。

013及016明示來源凍結後，產品唯一執行`scripts/version-assets.py`與`tests/asset-versions.py`，三入口index／Story／決鬥同步，**85筆引用PASS**。整合前追加`STORY-ROUTE-013-HTML-before.json`，其中兩個route引用已存在，產品僅同步hash，未重複新增。此兩引用屬013功能，016的campaign／mode版本亦按其工程通過來源同步。證據：[版本日誌](../../test-results/card-drop-040-version.log)、[引用驗證](../../test-results/card-drop-040-asset-versions.log)及evidence最終HTML雜湊。沒有重載使用者頁面。

第一次同步後，013工程發現其close後舊confirm回呼問題並補guard，造成route.js版本再次變動；040工程攔下過期引用，沒有將前次PASS冒稱仍有效。013已確認兩個初次HTML引用為其新增，並重新凍結`c70b21e0d68fba902675983b3903446bb3ae0d148c1b158c42a5ec0d7f682e9e`，產品補同步僅StoryHTML，當前**85引用再次PASS**：[最終版本](../../test-results/card-drop-040-version-final.log)／[最終驗證](../../test-results/card-drop-040-asset-versions-final.log)。game及18入口相依未再改，不重跑拖曳矩陣；013功能複審另票，後續若再修改由其持有人重新同步。
