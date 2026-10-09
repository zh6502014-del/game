# ART-MANA-053｜戰棋暮晶圖示

日期：2026-10-03。使用者在側對話指定精緻化戰棋累計暮晶與技能卡暮晶圖示。

本側對話唯一寫入：兩份新SVG、story-energy-ui.css末尾三條暮晶圖示selector、Nightfall-Duel-Story.html的該CSS版本值、本文件與本工單證據。事前基線：test-results/change-scopes/ART-MANA-053-before.json。尊重側對話禁止子agent的限制，沒有派工、傳訊或干涉主線；獨立工程師審查不在本側對話執行，不宣稱已通過。

沿用原生SVG圖示系統，以相同刻面形狀、古金鑲座與墨綠光影統一兩處；技能卡版本中央壓暗，數字仍為原有DOM文字。既有尺寸、數值、ARIA、操作與遊戲邏輯維持，原mana.svg保留。無影像生成或外部素材依賴。原創SVG本身為單份可編輯原稿與runtime，來源記錄另存source-art/ART-MANA-053/。

2個SVG，viewBox96×96，实际显示11–32CSSpx，透明底；每檔≤20KiB，总预算≤40KiB。未以重繪或裁切大圖產生圖示。

狀態：兩處素材／樣式已套用，靜態檢查通過；遊戲內視覺與獨立工程審查待主線後續驗收。

## 本次交付與驗證

- 新素材 `assets/emblems/mana-faceted-053.svg`（累計暮晶）與 `assets/emblems/mana-cost-053.svg`（技能成本），各2,869 bytes，共5,738 bytes；viewBox皆96×96。`python3 scripts/check-art-budget.py --strict` 兩檔通過。舊素材仍在原路徑。
- `src/css/story-energy-ui.css` 僅在尾端新增三條指定圖示 selector；與事前基線相比前文完全相同。技能成本仍保留既有32／22px大小及20／14px字級。JS、引擎、事件、數值、存檔均未修改。
- 本機SVG已用Sharp完整解碼並檢視，靜態放大預覽見 `test-results/art-mana-053/comparison.png`；這是素材示意，不是遊戲截圖。獨立靜態HTML預覽保留同目錄preview.html。
- 版本脚本在只包含本CSS與故事入口的隔離副本執行，資源版本測試通過1筆，將唯一CSS版本值套回故事入口。沒有同步其他主線檔案的版本。原全專案版本檢查因另一份 `storage/unused-code/combat-visuals.css` 尚未同步而失敗，未宣稱全專案檢查通過，後續由主線處理。
- 瀏覽器拒絕開啟本機file URL，沒有繞過限制；未驗證實際戰棋狀態、手機和文字放大、實機渲染。侧對話明確禁止子agent，因此未進行獨立工程師審查；不將其標成完成的主線工程工單。
- 完整來源、SHA與容量：`source-art/ART-MANA-053/design.json`。定向結果：`test-results/art-mana-053/validation.json`。本次不修改主線工作板、不重載使用者遊戲，也未延續邊界前音效或修圖任務。
