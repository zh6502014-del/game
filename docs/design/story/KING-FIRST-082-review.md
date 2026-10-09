# KING-FIRST-082 工程審查

2026-10-08。最終可交付產品，未發現相關P0／P1／P2；082／083整合版本已確認。工程師未改runtime。

已核對主工單、可信before及完整diff。runEnemy僅取enemy副本，限定存活louis-armored帶ratRules且存在存活crystal-rat trap時將王移到暫存首位；state.units不重排。單一行動內選招、傷害、召補鼠、RNG及其他程式不變。被王吞／投掉的鼠之後仍經既有legalActions存活檢查，不額外行動；死王不優先，暈眩不因排序解除。

engineer-scope-initial.json保留REVIEW_REQUIRED：083文件／UI／測試為產品已另派工範圍，須由083基線逐項核對，不擴082白名單。engine.before.js與082主before原文完全一致。

已讀定向測試並獨立執行八組PASS，其他十場各八seed共80場1974操作之state/events/frames/RNG計數與舊引擎一致（engineer-targeted.log）。異變王高／低HP、吞／投鼠、補鼠後下一輪、死王、暈王與非本王ID均有定向檢查；場景frame敵列順序保持。72項引擎契約也獨立通過（engineer-contract.log）。此為固定策略樣本，不是全狀態或平衡全覆蓋；H1改順序造成後續合法行動差異本身屬需求，不保證改前改後整場RNG數完全一致。

原兩套驗證**未通過**：frames因缺歷史STORY-BATTLE-UI-001-before.json無法啟動；story-battle因固定舊九戰役清單與現十一戰役不同，在模擬前失敗。原輸出檔零bytes，工程師重跑並完整保存stderr於engineer-frames.log及engineer-battle.log，確認上述既有原因。沒有捏造舊基線或修改測試求綠燈，定向差分也不冒充這兩套已通過。

未執行瀏覽器與動畫／實際操作驗收，未碰真實存檔或發布。產品最後需保留既有測試限制與083並行歸屬。

最終整合：engineer-final-scope.json保留083檔案例外，已依083工單與before核對為首次召鼠modal呈現、測試及文件；非082引擎越界。Story HTML只更新engine／UI兩個query，119資源版本獨立PASS，日誌位於test-results/KING-RATS-COPY-083/engineer-versions.log。產品後續工作板僅各自列記錄交付狀態，不改runtime。

最終scope另有Story HTML與本review例外：HTML由產品明確授權整合，工程師用主基線兩JS原hash還原query，所得完整HTML SHA-256與主基線HTML hash完全相同，證據engineer-reconstructed-entry-before.html；因此確證只有必要query更動。本review為產品明確授權工程交付。保留REVIEW_REQUIRED，不擴白名單。
