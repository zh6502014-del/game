# 全角色美術設定集工單

任務ID：CHARACTER-BIBLE-20261011。使用者授權全部具名角色與一般敵人，詳細定義正側背三視圖、衣著配件、年齡及劇情狀態。沿用現有原畫與現行劇情；未畫過背面與配件結構標為本次補足設計，不改故事設定。

產品主責整合；劇情agent唯一寫canon.md及canon.json；美術agent唯一寫art-spec.md與art-roster.json。圖稿另按角色清單分派互斥目錄，不共寫檔。

輸出為專案內可瀏覽設定集與原始可編輯文字、單角色三視圖設定圖。用途為設計文件，非runtime；不直接替換角色立繪。每張約1536×1024寬幅（3個完整等比視圖與配件小圖），單張候選；原PNG留一份storage/source-art/CHARACTER-BIBLE-20261011，文件用WebP長邊≤1600/短邊≤1080、≤600KiB。待角色清單鎖定列總張數預算。

三視图要求：正面、真正90度側面、背面，等身高與地面基線，全身含鞋，不拿三張3/4姿勢當三視圖。細節須含衣著層序、接縫/開合/綁帶/護甲固定、配件佩戴位置與左右手、材質/色票、武器比例。既有不對稱傷勢需標 anatomical right/left。

驗收：角色清單對照現行資料，逐張人工檢視三視角與身份，文件圖strict尺寸容量、可讀性、可瀏覽連結與圖片載入。新增設定圖不觸及遊戲規則/程式/存檔。

狀態：2026-10-12 設定集及本次映射範圍修圖驗收完成。

完整設定集：[38張設定圖與中文規格](character-bible-20261011/index.html)。尺烏首領以 A1 的 assets/story/actors/boss.webp 為參考；未因參考來源改寫出場設定。

本次檢視142張映射素材，修正24個runtime檔（含新增前傳伊藤與同步章節海報），故事肖像10處年代映射及伊藤舞台路徑已調整。尺寸容量strict通過，63項資源版本引用通過，獨立瀏覽器檢查完成，工程複審無未解P0/P1/P2。

交付證據：test-results/character-bible-20261011/final-delivery.json、engineer-review.md、runtime-browser-loads.json、bible-browser-loads.json。原稿及提示詞：storage/source-art/CHARACTER-BIBLE-20261011 與 CHARACTER-ALIGN-20261012（使用內建imagegen）。

限制：涵蓋現行映射盤點，未認證未引用歷史素材；瀏覽器為獨立素材頁和肖像映射驗收，非所有實戰狀態回歸。未重載使用者對局或改真實存檔。
