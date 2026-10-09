# COPY-ALIGN-20261004｜文案調整

日期：2026-10-04。狀態：完成，工程審查與產品驗收通過。

## 需求與完成條件

依使用者「請執行文案調整」與前輪 COPY-AUDIT-20261004 盤點，修正現行玩家可見的舊主線結尾、製作備註、操作術語及版本指引。以 STORY-REWRITE-050 定稿與現行生效內容為依據；不重寫人物口吻、不增加劇情或改變規則。

## 唯一寫入者與精確範圍

產品為唯一實作／整合者，凍結後由工程師唯讀審查。

- `src/js/story-campaign.js`：A1／A2 引言文字、stage 的完成提示（G1 回復一般章末、H1 顯示待續）、離開確認及工坊的「Skin」中文化、故事總覽簡介對齊新版主線。僅呈現字串及結尾呈現條件。
- `src/js/story-chapters.js`：050 覆寫區的 H1 戰後旁白，改為玩家可見的「本篇待續。」。
- `src/js/game.js`：規則說明第 5～7 節的領域效果、攻擊用語、拖放說明；`maybeGrantTankDomain` 的卡片描述及 `ND_STATUS_TIPS.domain`（以實際所在表為準）的提示字串，與既有 damage 規則對齊。
- `docs/design/story/WORLD-CORE-001.md`：頁首追加後續版本指引，保留當時討論原文。
- `docs/agents/STORY.md`：按任務讀取的版本優先順序。
- 本工單與 `docs/agents/WORKBOARD.md`：僅本單索引／交付，以及 WORLD-CORE-001 歷史狀態的版本註記。
- 六個根 HTML（index、Story、V12.12.39-Test、art-gallery、icon-gallery、frame-gallery）：僅由 `scripts/version-assets.py` 更新本機 JS/CSS 雜湊。

禁止改動戰鬥 AI、數值、機率、RNG、回合、節點／步驟 ID、存檔、解鎖、素材、樣式及互動。不對被後段覆寫或已裁撤的舊稿做全面替換。

## 基線、依賴與驗收

無 Git。修改前基線：`test-results/change-scopes/COPY-ALIGN-20261004-before.json`，保存 370 個文字檔雜湊及 13 個允許路徑，其中 12 個既有檔原文；本工單記錄為新增。本單開始前已有其他工單異動，基線只證明本輪差異。

驗收由產品執行：JS 語法；按 HTML 載入順序核對生效故事資料；隔離瀏覽器以測試存檔檢查 G1 完成→H1、H1 戰後與章末、保存失敗提示、離開確認、規則視窗及領域卡文案；桌面與手機抽樣顯示；版本腳本與 `tests/asset-versions.py`；全體文字差異範圍。戰鬥終局可使用既有 fixture，僅驗證文案與返回流程，不視為戰鬥平衡測試。證據保存 `test-results/COPY-ALIGN-20261004/`，審查報告也在該處。

本次不重跑全劇情／全戰鬥回歸。未變的規則由差異審查確認，不將舊結果宣稱為本次實跑。


## 實作交付與證據

- G1「真相」完成後顯示一般收錄提示，刪除第二次鐘響／未來磷的舊結尾段落，可接續 H1。
- H1 戰後旁白與章末顯示「本篇待續」，保存失敗保留「待保存」及僅於本頁保留的明示。
- A1 引言改為研究室對峙，總覽簡介對齊暮城、博士線索與暮晶真相；工坊與離開提示將 Skin 統一為外觀。
- 拖放規則改為卡牌與可放置位置的說明；領域規則、卡片與狀態提示依現行 damage 實作說明閃躲、防禦減傷、回復上限與一次性效果。沒有修改規則程式。
- WORLD-CORE-001 加上歷史版本註記，STORY 角色入口與工作板指向 050 後續定稿；保留歷史討論原文。

實際修改 10 檔：`src/js/game.js`、`src/js/story-campaign.js`、`src/js/story-chapters.js`；`index.html`、`Nightfall-Duel-Story.html`、`Nightfall-Duel-V12.12.39-Test.html`（僅版本）；`docs/agents/STORY.md`、`docs/agents/WORKBOARD.md`、`docs/design/story/WORLD-CORE-001.md`、本工單。其他三個獲准版本入口不需更新，未修改。

驗收：

1. 三個 JS 均通過 Node `--check`。
2. [隔離瀏覽器報告](../../test-results/COPY-ALIGN-20261004/report.json)與 [本次驗證程式](../../test-results/COPY-ALIGN-20261004/verify.cjs)：14 組定向檢查 PASS、無頁面 JS 例外。依 HTML 實際載入順序比較基線與現行資料，章節結構、步驟 ID／順序、遭遇配置不變；最終正文只有 H1 旁白變更，節點資料只有 A1 引言變更。瀏覽器 log 為 [browser-04.log](../../test-results/COPY-ALIGN-20261004/browser-04.log)。
3. 產品檢視 [G1 桌面](../../test-results/COPY-ALIGN-20261004/G1-reward-desktop.png)、[H1 手機](../../test-results/COPY-ALIGN-20261004/H1-reward-mobile.png)、[保存失敗](../../test-results/COPY-ALIGN-20261004/H1-save-failure.png)、[領域卡手機](../../test-results/COPY-ALIGN-20261004/domain-card-mobile.png)、[規則手機](../../test-results/COPY-ALIGN-20261004/rules-mobile.png)：本次修改文字可讀，章末與規則抽樣無頁面水平溢出。1440×900 與 390×844 為抽樣，並非全尺寸覆蓋。
4. `python3 scripts/version-assets.py` 完成，`python3 tests/asset-versions.py`：107 筆引用 PASS。文件中的本機相對連結存在。
5. [差異報告](../../test-results/change-scopes/COPY-ALIGN-20261004-after.json)：10 檔變更、0 檔超出清單；逐段合法性另由工程師核對。

驗證過程保留：第一次因沙箱拒絕本機 listen，第二次 Playwright 未附瀏覽器；獲准後使用已安裝 Chrome 的獨立 context。第三次驗證程式在 reduced-motion 下額外點擊旁白，提前前進後等待不到 advance；移除測試多餘點擊後第四次 PASS。執行碼未為通過測試而修改，舊 log、第三次程式及失敗報告保留於證據目錄。

## 未驗證、風險及依賴

- 本單只涵蓋本次盤點的文字與直接相關提示，不宣稱全劇情逐字潤稿或所有分支通過。
- H1 戰鬥採終局 adapter fixture，未實打驗證平衡、AI 或國王各戰鬥階段。戰鬥、存檔與解鎖實作未改；真實使用者存檔及正在進行的對局未觸碰。
- 被後段覆寫／刪除的舊稿仍留在來源檔，不當作現行文案，不在本單重構。圖鑑、美術及其他歷史工單不在本輪驗收範圍。
- 沒有新增外部依賴或素材；後續全文潤稿應以 050 定稿及最終生效內容對照。工程審查結論記於 [engineering-review.md](../../test-results/COPY-ALIGN-20261004/engineering-review.md)。


## 結案

工程師已核對 10 檔真實差異、呈現條件、規則文案與同輪證據，結論可交付，無未解本次相關 P0／P1／P2 或越界。產品接受審查，完成上述文案與抽樣畫面驗收；本單結案。工程審查後僅更新本單／工作板狀態，不再修改執行碼。
