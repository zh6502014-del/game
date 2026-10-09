# GUN-UNIFY-084-PUZZLE｜統一虛構暮晶銃拼圖

產品授權art_ui主責src/js/story-puzzles.js gun資料/展示文案、src/js/story-search-assets.js五props label/path；不改其他場景、配對規則或E3已刪尋物。保留gun-0～4穩定ID、五件同ID配對、5/5後確認才完成、practice/取消不提交。

新增五張透明512×512 runtime assets/story/props/gun-unify-084/gun0.webp～gun4.webp，每張≤100KiB，合計≤500KiB。原稿/prompt/metadata單份保存storage/source-art/GUN-UNIFY-084/puzzle/；證據test-results/GUN-UNIFY-084/puzzle/。builtin imagegen依批准設計逐件生成，保留深鋼/古銅/木柄/青綠菱晶識別，不描述真實武器機構。提示512輸出，工具若更大只縮圖衍生不重生。

基線test-results/change-scopes/GUN-UNIFY-084-PUZZLE-before.json。五件為本體、槍管外殼、木握柄、菱形暮晶、古銅菱形框側蓋；基於alpha bounds調crop/擺位/assembled資料，完成時真合成預覽核對，不能僅散件排列。依strict prop budget與隔離資料規則比對驗證；浏览器限制不绕行。產品HTML版本、工程審查後交付。未授權第六張runtime圖，若必要另存scope/budget。

## 凍結交付

內建imagegen共5次、5張選定原稿（各1280×1280，總4,210,260 bytes），按提示要求透明；工具未採512目標，未為尺寸重生。五張512×512 RGBA WebP共181,160 bytes（176.91KiB），依序42,696／20,796／48,156／35,716／33,796 bytes。原稿與runtime strict均PASS。

本體無木柄/長管、菱形孔留空；木柄與雙古銅環槍管各為獨立外觀；青綠菱晶和鏤空側蓋在5/5後依assembled資料落在中央。完成預覽由實際runtime五圖和story-puzzles parts資料離線合成，非另張完整槍圖，未遮掩不同片不吻合。第一次合成晶片曾突出，已僅調視覺擺位與尺寸使尖端隱於側蓋之下；保留每片長寬比。已看過最終test-results/GUN-UNIFY-084/puzzle/assembly-preview.png。

精簡gun場景/五片說明，移除保險片與輸出路徑的解釋，採本體／槍管外殼／木握柄／菱形暮晶／側蓋labels。只更換gun資料及五個props path/label；所有函式實作從let active起逐bytes與本單baseline相同，其他puzzle/search資料相同，E3搜尋仍為0。資料VM、crop/位置/長寬比及兩檔syntax PASS。證據verification.json與render-runtime-preview.py；完整prompts及SHA/容量於storage/source-art/GUN-UNIFY-084/puzzle/generation.json。

未驗瀏覽器實際圖層/裁切/拖放，沒有把離線合成稱實機驗收；圖片為參考設計的匹配衍生，非逐像素截取。待產品版本整合及工程審查，不發布。
