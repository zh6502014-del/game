# STORY-SECOND-BELL-021｜第二次鐘響

2026-09-27。狀態：完成，工程審查及產品驗收通過。使用者已批准完整計畫：原39章修訂、新增G1至40章，以假停鐘揭穿收尾；不揭露大腦、事故幕後或未來磷最終目的。

## 單一寫入與基線

劇情 story_future_lin：僅 `docs/design/story/STORY-SECOND-BELL-021-content.md`，含作者真相與玩家知情分離。章節實作者：`src/js/story-chapters.js`、`story-task-data.js`、`src/js/story-campaign.js`、`src/js/story-stage-assets.js`、`src/js/story-campaign-data.js`，必要時適配 `tests/story-complete.cjs`、`tests/story-campaign.cjs`、`tests/story-storage.cjs`、`tests/story-reading.cjs`。產品：本工單、WORKBOARD索引、三份舊草稿只加已取代註記、`tests/story-second-bell.cjs`、`config/workflow-map.json`、根HTML版本。工程師唯讀程式，仅寫 `test-results/story-second-bell-021/review.md`。

可信基線：`test-results/change-scopes/STORY-SECOND-BELL-021-before.json`。已向019整合產品確認寫入交接，確認前不改共享runtime。不改自由決鬥/戰鬥引擎/010 UI/020美術映射，也不重設真存檔或重載使用者頁面。

## 鎖定內容與介面

- 作者真相：未來磷抵達博士遇害前、篡改系統、三十分鐘內取腦，用暮晶儀器拼湊設計；借王室工坊/材料/測試品親自製造交付成品換設備及接入權。上述只進作者文件。
- 玩家：納爾瓦以停研警告與王室指令說明路易斯委託。F1新增真實證據比對；F2/F3只確認本地、已知備援及當前負載。F4拆本地控制耦合，保留引域機構/獨立供能，眾人以為成功。G1路易斯戴完成品重啟，三證據比對後未來磷承認早知獨立接入，以本篇待續收錄。
- 舊39章ID、原有步驟ID相對順序、C7、存檔schema及Skin保留；G1 requires F4，舊39章直接續玩。G1回顧新版停鐘經過並提示前章結尾修訂，不虛構額外分支。
- G1共享證據、圖鑑/地圖/章節總數/結尾提示同步；不顯示永久停用、主線完結或兩磷生活終局。既有救援成功仍有效。
- 路易斯採姓名文字演出，不用錯誤人物圖片替代。無新增美術資產；未來儀器不透明，大腦/死因不得出現在載入的劇情、題板、線索、圖鑑或圖片說明。

## 驗收

產品新測試覆蓋: runtime不洩露作者秘密、F1證據前置、G1三證據與承認次序、新40章流程/舊28及39章續玩、越序拒絕、重玩/取消/過期回呼/拒寫重試、390/320/1440與200%字級及鍵盤。沿用未變互動引擎既有錯誤/輔助與30組版面證據時明示相依hash。戰鬥terminal fixture僅測返回，不宣稱完整AI重測。

實作者凍結後工程師核對實際diff、外部變更歸屬及關鍵風險。必要補正後產品檢視截圖，最後執行 `scripts/version-assets.py`、`tests/asset-versions.py`。任何失敗/未驗項如實記錄；全部必要驗收完成才標完成。

## 最終交付與驗收（2026-09-27）

已完成40章：D2/D7刪除全知善意保證、F1警告與王室委託比對、F2/F3限制隔離範圍、F4真實本地停機、G1第二次鐘響與三來源查證後承認。A2/E2事故來源留下開槍前異常的未解線索，未揭露原因。王室鏡頭獨立分組與空人物舞台，路易斯僅具名文字；G1先回顧前章修訂。原39章及舊步驟相對順序保留。

實際修改：五個runtime（story-chapters.js、story-task-data.js、story-campaign.js、story-stage-assets.js、story-campaign-data.js）；四個既有測試（story-complete/campaign/storage/reading），新增tests/story-second-bell.cjs；workflow-map新增選測入口；Nightfall-Duel-Story.html僅內容版本引用；本工單/內容稿/工作板及三份舊草稿的版本註記。沒有修改遊戲戰鬥判定、存檔schema、020素材/映射或010 UI。

驗收證據：
- `test-results/story-second-bell-021/report.json`：新玩家40章、舊28章可達性/C7保留、舊39章直續G1、越序拒絕、三個獨立正解斷言、錯誤/不完整/取消/過期回呼、拒寫重試、證據共享及重玩冪等通過。全流程戰鬥採terminal fixture，只證明返回接線。
- `complete/report.json`：舊28實際續玩D1–G1，20個真實任務320px普通/200%字級、D6續作、撤離回報門檻通過。
- `reading-smoke/`與`reading.log`：原267步ID/80閱讀組/22動作/56互動門檻及16版面樣本通過；`storage.log`：legacy、破損/拒寫、分支重玩與實際戰鬥一回合取消通過。
- 產品檢視王室切景、390px證據工作台及待續畫面；新suite另保存1440/390/320放大截图。王室組不顯示其他角色當國王，結尾不再顯示全劇完结。
- 工程師 `review.md` 核對真實diff，獨立VM檢查舊39步序、G1前置、切景不跨互動、禁揭字串；未發現相關P0/P1/P2。
- `scripts/version-assets.py`完成，`tests/asset-versions.py`89筆引用通過。

首次sandbox Chrome啟動受環境限制，改以獲准的隔離Chrome執行；首輪新測試因只匹配「完成品」而未接受實際「完成的暮晶頭戴裝置」停止，修正測試語意匹配後全程通過，原失敗log保留。沒有放寬互動/保存斷言。

範圍報告仍保留REVIEW_REQUIRED，不擴白名單：020 manifest/工單屬獨立美術產品；019工單尾端交接文字由019產品確認撰寫並凍結。與本次runtime差異分離，未還原他人工作。工程報告中的交付條件（019文件歸屬、版本同步）已由產品核實完成。

限制與依賴：尚未實體手機/Safari全測；本輪不新增國王或頭戴裝置插畫，使用文字與現有中性場景。020新美術未READY，另排接入，不列本單成果。完整AI/平衡未重測。後續止於本篇待續，未揭露大腦/死因/最終目的、不延伸決戰。
