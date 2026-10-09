# E3-PARTS-075｜移除重複尋找槍零件

產品唯一實作，僅本地。使用者要求E3既已從箱中拿到設計圖和零件，不再尋物。只改src/js/story-chapters.js E3最終修訂區，刪除E3-search-parts步驟（使用既有drop），讓讀信後直接組裝；保留保險箱、信、零件與組裝、戰鬥、complete/獎勵ID。不刪整個E3章或其他尋物。Story HTML只同步版本；文件本單/workboard，工程師只寫review。基線test-results/change-scopes/E3-PARTS-075-before.json。驗收真實最終章節VM：无search，讀信→組裝→戰鬥→收錄可達、其他章不變，語法/版本/工程審查。隔離資料，不碰真實存檔，未瀏覽器實測。

追加相鄰文案：組裝彈窗仍稱工作間找到零件，改為博士留下的零件；只src/js/story-puzzles.js該字串。修改前另存E3-PARTS-075-copy-before.json，產品唯一實作，原scope保持例外供工程歸屬。真實章節old/new VM確認只刪尋物、其他內容與章節一致，PASS；工程另驗reading units與puzzle無search gate。

產品交付：初審及相鄰文案複審通過、117版本PASS，無未解相關P0/P1/P2。實際修改story-chapters.js、story-puzzles.js、Story HTML及本單/審查/工作板。保留追加範圍之REVIEW_REQUIRED及兩基線歸屬，不冒稱原白名單全通過。VM證據test-results/E3-PARTS-075/；畫面與真實操作未測，未上傳。
