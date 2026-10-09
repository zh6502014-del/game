# S2-COPY-076｜警告到出逃的因果文案

使用者已確認主對話建議整章改寫。story唯一實作src/js/story-chapters.js的S2生效文案、必要對話新增ID/reading groups（保留既有ID/類型/互動），以及src/js/story-maze.js僅escape-tiles intro文案對齊。產品整合Story HTML版本/本單/workboard，工程師只寫review。不得改其他章、玩法、保存、解鎖、RNG。

順序：赫爾曼秘密信警告儀式把夜域引向仍有人住的莫爾威爾→調封存紀錄→座標居民/死者/採掘紀錄矛盾→納爾瓦拒唱申請延後→回令照常/加守衛→他握書籤感到受騙→朔問打算→納爾瓦決定出去警告→朔我帶你走→旋轉路段接通出口→走近出口看到熟悉身影→收錄。詳細逐句以主對話已提出且使用者確認稿為準；新增對話用穩定後綴ID和正確speaker，別把旁白塞成角色說話。收錄刪『保存本節點進度』描述，保留complete按鈕/流程，不擴大合併終頁。

基線test-results/change-scopes/S2-COPY-076-before.json。隔離VM比對原/新S2線性順序、reading groups有效、route/complete保留/其他章不變；語法、117版本、工程審查。無瀏覽器實測，不發布。

交付：最終S2生效覆寫，既有11ID/type/順序/frame/互動保留，新增3句具speaker之對話，groups連續且無重複。迷宮僅escape-tiles intro簡化。真實old/new runtime比對其他章節/分組/規格/合併不變，VM PASS；兩JS語法PASS，Story HTML資源同步117筆PASS。證據test-results/S2-COPY-076/verify.cjs、verification.json、effective-s2.json（完整生效稿）。未做瀏覽器換行及真實互動驗收；未上傳。

產品已核對有效稿與確認方向一致，工程審查通過，無未解相關P0/P1/P2。修改檔案為story-chapters.js、story-maze.js、Story HTML及本單/審查/工作板。瀏覽器限制如上，未發布。
