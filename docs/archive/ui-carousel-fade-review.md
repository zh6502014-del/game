# UI-CAROUSEL-FADE-001 工程審查

2026-09-24。唯讀審查程式；本工程師只新增本報告。

## 結論

本次有限範圍未發現已確認的程式缺陷。CSS 實作可交付；產品仍須完成資源版本同步。範圍外並行差異已由產品確認歸屬。

## 基線與實際差異

依 `test-results/change-scopes/UI-CAROUSEL-FADE-001-before.json` 內保存的全文比對，`prestige-ui.css:10` 僅新增 7 行註解及 `.setup-stage .carousel` 遮罩規則；不是新增在捲動 track 上。原有職業、事件、存檔、規則均未在此差異中改動。

`check-change-scope.py check` 本次回報 REVIEW_REQUIRED：範圍外為 `docs/story-search-001.md`、`story-puzzles.css`、`story-puzzles.js`，產品已確認三者均屬並行 STORY-SEARCH-001 手機拼圖補正，並非本工單修改；本工程師未自行還原。快照本身不能辨認作者，此歸屬依產品協調紀錄。

## 針對性檢查

- 檢查 `styles.css:1019` 容器裁切、`game.js:327` 附近的兩組 carousel 結構，以及後續樣式層疊：沒有其他 carousel mask 覆寫。導航是容器內置中元素，其範圍位於實色帶中。
- 遮罩固定於容器，不跟著橫向捲動；兩側透明漸層透出實際背景，沒有新增覆蓋層或改 pointer-events，原卡片及箭頭事件不變。
- 淡化寬度為 `clamp(0px, (容器寬 - hero寬)/2 - 10px, 96px)`，中心卡身及邊框有至少約 10px 的完整區域；空間不足則縮至零。原有陰影外緣可以柔化，符合用途。
- 同時有標準及 WebKit 宣告；不支援 mask 的環境會回復原有裁切，沒有功能依賴。

## 沿用的實作者證據

已閱讀 `test-results/carousel-fade-001/verify.cjs` 與 `results.json`，檢查 1440、900、700、390、320px 五個 viewport、兩側四次輪換，共 40 次箭頭點選。紀錄顯示職業確實切換，中心誤差皆 0，mask 有生效，沒有水平頁面溢出。最終證據已分列 `viewportWidth` 與 `trackWidth`，與腳本列舉及 screenshot 檔名相符。

人工檢視 `width-1440.png`、`width-320.png`：桌面側卡切口有透明羽化，兩張中央卡片及導航清楚；窄版中央金框、文字、兩側箭頭仍完整。

## 本次實跑與限制

本工程師實跑基線全文 diff、scope check、層疊與 DOM/事件唯讀核對；未重跑作者瀏覽器測試，未跑全戰鬥。尚未實機驗證 Safari、觸控慣性捲動或所有縮放比例；標準/WebKit 雙宣告及未改事件降低相容風險。沒有新增素材，不需素材預算檢查。版本同步與最終驗收由產品負責。

## 最終證據確認與凍結

產品與實作者確認上述五張截圖及 40 筆操作結果均為固定外層 `.carousel` mask 的最後版本；本工程師此前讀取的 diff、viewport 截圖與 DOM 即為此外層版本，未沿用首輪 track mask／fullPage 繪製偏移證據。最終 CSS SHA256：`c6e216b6f6e019696b047dddc9f2c245e1e64998222ae8716d0cec2952dd991a`。本次只核對 hash、結果欄位並補正報告，未重跑測試或修改程式。報告凍結。
