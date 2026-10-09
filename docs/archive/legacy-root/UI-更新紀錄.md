# 午夜古金卡牌介面

新版主題：`card-theme.css`，於原樣式之後載入。移除該 stylesheet link 即可停用主題。

- 墨綠戰場、古金框線、桌墊紋理與襯線標題。
- 專屬 SVG 職業紋章、攻擊／防禦／閃躲圖示及封印牌背，素材全部在 assets/emblems/。
- 更新選角輪播、角色 HUD、卡面、放置區與按鈕。
- 縮短戰場高度；保留左右陣營、手牌與放置牌幾何比例。
- game.js 僅新增 data-art 視覺屬性；戰鬥計算、AI、拖曳與翻牌流程未修改。
- 備份：styles.css.pre-card-ui.backup.css、game.js.pre-card-ui.backup.js。

## 測試

`node --check game.js` 通過。

`tests/ui-smoke.cjs` 使用 Chrome，保持正常動畫。1440、900、700、390px 均完成：選角頁載入、SVG 圖示解碼、開始決鬥、拖曳出牌、自動進入第 2 回合。選角／战鬥頁無水平溢出，無未捕捉 JS 例外。本機硬幣音效 HTTP 200。

報告：test-results/ui-smoke.json；截圖：test-results/setup-ui-*.png、battle-ui-*.png。

外部音效仍有部分 ERR_ABORTED，未驗證全部音效輸出。未涵蓋所有職業的整場對戰或實體手機觸控。

先前的 selector-merge-plan.md 與 css-check/smoke 是 Pass 5 歷史基準。新版 UI 刻意改變外觀，不再以舊畫面 computed style 相同作為驗收。

## 開啟

專案目錄執行 `python3 -m http.server 8765 --bind 127.0.0.1`，開啟 http://127.0.0.1:8765/Nightfall-Duel-V12.12.39-Test.html 。

## 全介面遊戲化 Layout

- 備戰：全畫面雙英雄對峙、中央 VS、下方戰術選擇與主要開始按鈕；手機保留並列英雄。
- 戰鬥：橢圓牌桌填滿可用舞台，左右英雄 HUD、中央放置區、底部較大的左右手牌。手牌與放置牌共用尺寸。
- 導航：戰況改為獨立浮層，底部工具列提供戰況、規則及音效。
- 卡牌詳情、規則、音效選單與結算统一金屬框、墨綠底及遊戲字體。結算的完整紀錄改為可展開面板。
- JS 僅改動 UI 模板、文案及新增 showBattleJournal；戰鬥規則與動畫邏輯未修改。
- 備份：game.js.pre-game-layout.backup.js、card-theme.pre-game-layout.backup.css。

驗證：ui-smoke 在 1440、900、700、390px、1000px 高的 Chrome 視窗通過。正常動畫出牌进入第 2 回合；戰況、規則、音效、詳情可開關；注入結算狀態驗證勝／負／平手展示、再戰及返回大廳。結算畫面測試不是完整對局勝負驗證。所有寬度無水平溢出，無未捕捉例外。已檢視桌面／手機截圖。

遊戲樹全面驗證與新物理動態仍屬先前規劃，本輪僅完成介面 Layout，沒有將這些尚未實作項目列為完成。
