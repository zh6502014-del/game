# RIN-WANTED-072 工程審查

2026-10-08。結論：可交付產品；未發現本次相關 P0／P1／P2。原圖視覺與映射已核對，頁面實際裁切仍待驗。

基線 `test-results/change-scopes/RIN-WANTED-072-before.json`；精確差異 `test-results/RIN-WANTED-072/engineer-scope.json`。工具保留 **REVIEW_REQUIRED**，唯一清單外差異為 `Nightfall-Duel-V12.12.39-Test.html`，不將結果改稱scope全通過、不擴白名單。

例外人工核對：產品明確指派共享story-art版本同步。獨立计算 `test-results/RIN-WANTED-072/test-entry-reconstructed-before.html` SHA-256，與基線hashes內Test HTML完全一致；再比較其與目前入口，唯一差異為story-art.js query由99cd5a6713e9改f85beea84911。因此該例外屬必要且已授權的版本整合，可接受；請產品在工單最終交付列出Test HTML與此歸屬。

Runtime核對：解析基線與目前story-art JSON，僅替換a3-treason-notice.path後兩份資料完全一致。stage-assets僅新增A3-step-06／07對應該插畫，移除06的chiwuOutside STAGE_FIX，避免高優先門外覆寫。沒有改台詞、節點ID、分支、規則或存檔；Story HTML僅兩支JS版本，工作板僅本單。

素材：獨立打開新WebP檢視，可見凜躲在牆角、繃帶與自己的通緝畫像，主要兩張臉在上半部；符合通緝情境。新runtime一張1535×864、239856 bytes（約234.2 KiB），總新增同值；strict WITHIN_BUDGET。原稿、prompt.txt、generation.json存在，紀錄包含來源工具、參考圖、原稿雜湊／尺寸／bytes與轉檔設定；舊素材未替換覆寫。文字scope工具排除二進位，素材以這次定向檢查補足，不宣稱全部素材歷史無變更。

本次實跑：已讀verify.cjs並以bundled Node v24.19.0執行通過，確認兩目標步驟為新illustration、無疊加actor、A3-step-01仍layered及07-b不採此圖；strict素材檢查；117筆版本通過。日誌為本單engineer-mapping.log、engineer-budget.log、engineer-versions.log。

未驗證：瀏覽器中的閱讀面板遮擋、多裝置裁切、實際載入與互動。未啟動瀏覽器或伺服器繞過既有政策，未推送。產品最後驗收並記錄入口整合例外。快照不證明作者身份或基線之前歷史。
