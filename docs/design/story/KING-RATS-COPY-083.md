# KING-RATS-COPY-083｜首次召鼠敘事

使用者確認：「路易斯額前的暮晶猛然亮起，感應沿地面擴散。成群變異鼠從四周湧出，撲向眾人。」接伊芙：「他在控制牠們！」。game_tree只寫src/js/story-energy-ui.js的首次異變召鼠播放提示/等待清理、tests/king-rats-copy-083.cjs、本工單。產品HTML版本，工程獨立review。基線KING-RATS-COPY-083-before.json位於082凍結之後，082引擎不再更改。

沿用既有modal與返回戰場確認：同一frame含louis-armored transform和crystal-rat summon時，在召鼠演出全部完畢後顯示短敘述與伊芙對白，等待讀完確認才繼續。後續補鼠無transform不重複；減少動態也呈現。退出/取消播放清除等待，不改引擎事件/數值/RNG/保存。測試真engine觸發條件、隔離DOM modal等候/恢復/取消、正常與減少動態路徑；不瀏覽器/server、不發布。

## 凍結驗證

文案於首次異變整段召鼠完畢後，以既有「返回戰場」modal呈現兩段文字並等待確認，不會被個別加入訊息覆蓋；保持既有鍵盤焦點/ESC關閉。一般與減少動態路徑皆適用，補鼠不重複。cancelPlayback清理待讀Promise及modal。

真H1引擎frame＋隔離DOM/播放函式驗證PASS，語法PASS；082引擎與本單基線逐bytes一致。證據test-results/KING-RATS-COPY-083/verification.json。未驗實際瀏覽器樣式/鍵盤及FX動畫，測試中的事件特效為stub，不能稱視覺驗收完成。待產品版本整合與工程審查。

## 產品驗收
工程獨立審查通過，見同ID-review.md。已本地整合，119筆資源版本PASS。未發布；瀏覽器操作與動畫尚未驗證。082舊frames缺基線及battle過時清單仍為未通過，沿用review完整限制，不宣稱全套通過。
