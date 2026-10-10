# ARCHIVE-COPY-20261004｜依文件內容查找研究物資

日期：2026-10-04。狀態：進行中，產品唯一實作／整合，凍結後工程師唯讀審查。

## 需求與範圍

使用者否定「檔案櫃 0426」作為已知線索，接受以博士信中「研究物資送往礦區」的內容查找運送紀錄。同步 P3 送別、C4 文件庫、線索紀錄與尋物提示，找到後由伊芙辨認物資與地點、磷想到父親、朔讀出王室命令。

允許區段：

- `src/js/story-chapters.js`：050 最終覆寫區 P3 信件／inspect 文案、C4 尋物前後對話／敘述及 search 文案、P3 evidence。沿用所有既有 step／item ID、戰鬥、解鎖；僅可新增一段伊芙尋找指示，獨立 ID `C4-r11-a`，不重新編排舊 ID。
- `src/js/story-search-assets.js`：僅 archive-vault 的線索欄位（indexTag 改為 clueText）、help／hint、docs 文本與 covers.note。卷宗數字保留為行政標籤與導航，不提供正確目標編號；內部 ID、target、座標和素材全不變。
- `src/js/story-search.js`：僅 archive 的來信線索卡欄位／標題與空白閱讀區提示。不改命中、收取、取消、閱讀、保存等行為。
- `docs/design/story/STORY-REWRITE-050-script-2.md`：P3 信件與 C4 對應段落，同步本次定稿。
- 本工單、`docs/agents/WORKBOARD.md` 本單列；六個 root HTML 僅由版本腳本更新 JS/CSS 雜湊。

不修改規則、AI、RNG、存檔、戰鬥、故事解鎖、美術或 CSS；不重寫被 050 覆蓋的舊稿。基線位於 `test-results/change-scopes/ARCHIVE-COPY-20261004-before.json`。

## 驗收與證據

產品執行：三個 JS 語法；隔離瀏覽器按 HTML 載入順序比對 P3/C4 生效文字與 ID，逐份閱讀／錯誤文件不可收取／正確文件收取／重讀／取消再進入；C4 尋物後對話銜接到原戰鬥入口；桌面與手機抽樣檢查線索卡、提示、文件正文。測試使用新 context 與合成進度，不接觸使用者對局或存檔。

凍結後執行版本腳本、資源版本與差異檢查；工程師檢查真實 diff 和同輪證據。證據與審查保存 `test-results/ARCHIVE-COPY-20261004/`。不將終局 fixture 視為實戰、不宣稱全故事／全尺寸覆蓋。
