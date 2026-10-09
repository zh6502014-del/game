# GUN-UNIFY-084｜統一暮晶短銃

使用者確認概念稿槍管長度與雕花，授權更新所有出現槍的情境與遊戲，並修復伊芙持槍手腕。只本地未發布。

## 分工與範圍
- 美術A：10情境圖，見 scenes-a.json；美術B：14情境圖，見 scenes-b.json。各圖1536×864內、600KiB內，原圖保留。
- 產品：E3門口1情境、5肖像/卡圖、槍手icon/emblem/inline圖示及最後HTML版本；actor由遊戲樹代理另保留alpha交付。
- 遊戲樹：五片外觀拼圖＋9個JS素材引用及frame-gallery。獨立PUZZLE/INTEGRATION基線與工單，不改規則/存檔。
- 工程：獨立diff/引用/素材預算及行為不變審查。

## 固定造型與預算
深鋼單管、兩道古銅環、雕花本體、深木握柄、青綠菱形暮晶窗。主角/博士/士兵可見槍一致，博士保留外接實驗管線。無槍畫面不改。

25幅情境圖各≤600KiB；5肖像/卡各≤250KiB，1透明actor≤450KiB；5透明prop各≤100KiB；3向量表示各≤20KiB。總runtime上限17260KiB。每張單候選，必要修正才重生。原稿一份保存storage/source-art/GUN-UNIFY-084，提示詞與metadata同步保存。

## 證據及限制
視覺盤點237圖+43候選+13卡，詳test-results/GUN-UNIFY-084/visual-inventory.md；使用端盤點consumer-inventory.md。內建imagegen生成，無CLI。

既有瀏覽器政策限制，未實測遊戲內裁切/觸控；素材檢視、隔離VM/幾何合成不等同整頁驗收。既有15步stage resolver缺圖錯誤需差異核對，不宣稱全劇情通過。
