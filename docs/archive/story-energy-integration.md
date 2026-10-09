# STORY-ENERGY-003｜故事接線交付

2026-09-23。本任務只整合故事入口、四場配置及回歸；引擎、UI、核心規則由主產品任務負責，依 `story-energy-v1-contract.md`。

## 接線與正式配置

`story-campaign.js` 四個 battle 步驟改呼叫 `NDStoryEnergyBattle.start(config, onReturn)`。不再使用 `startNDStoryBattle` 或舊 `S`；缺模組／啟動例外保留原步驟並提示重試。回呼有 session、步驟與一次性保護；成功才前進，取消、落敗、平手不前進，不在回呼發獎。

| 節點 | 我方 | 敵方 | 目標 |
| --- | --- | --- | --- |
| A2 | 凜 | 赫爾曼，坦克規則／博士肖像 | 戰勝取得對抗優勢，反噬另在劇情發生 |
| S3 | 年輕朔 | 師父，劍客規則 | 6 個完整回合、雙方全員存活、保守策略 |
| E3 | 伊芙 | 研究區追兵，劍客 | 戰勝後才撤離 |
| C3 | 凜＋伊芙 | 劍客追兵＋刺客追兵 | 擊退後門敵人；朔守前門、格蘭護磷，不加入此戰 |

正式全員 10 HP／攻擊 1，坦克初盾由引擎規則給予。S3 從舊 70 HP／50 回合改為新制 10 HP／6 回合，是主產品授權的試玩適配：讓 3 費技能有使用機會，同時保留不能擊倒师父與爭取撤離時間的目的。不是一般擊殺關卡，未宣稱平衡定案。

`Nightfall-Duel-Story.html` 在 `game.js` 後載入 engine/UI；CSS 最後載入 energy-ui，card-surface 位於之前。V1/V2、Skin 與本節點既有拼圖不變；自由決鬥仍由 game.js 掌管。版本由主產品序列同步，已確認 80 筆引用通過。

## 本任務實際驗證

- `ACTUAL_ART=1 tests/story-performance.cjs`：28 節點、265 步真實圖層解碼，四拼圖取消／完成、四新 UI 取消／敗／平／勝返回、已讀回看、重複点击、缺圖重試、1440/390，exit 0。
- `tests/story-campaign.cjs`：28 節點全圖前置、收藏、舊檔、保存、C7、圖鑑鍵盤、新引擎 6 完整回合目標與自由決鬥入口，exit 0。
- 上述完整故事遍歷使用明示的新 Engine 終局 fixture 測「故事/UI 回呼」，不作戰鬥可通關性證據，已移除故事分支中的舊 S 注入。
- `tests/story-storage.cjs`：損坏 V2 回退 V1、非法依賴、儲存拒寫／重試、重玩／兩分支，以及實際新 UI 普攻＋結束回合＋退出，exit 0。
- `tests/story-skins.cjs`：66 個可用圖鑑插畫解碼、四職同職業敵我外觀分離、HUD/手牌/詳情/拖曳/揭牌/結算、桌面手機，exit 0。
- `tests/story-battle.cjs`：以真實配置、新引擎合法操作跑四關各 30 種子，共 120 場；A2 16 勝14敗，其餘各30勝。另檢查6完整回合與任一方倒下失敗、全員10HP/1攻、C3名單、舊 S/DOM/storage 存取隔離。輸出 `test-results/story-energy-story-simulation.json`。A2 的有限策略抽樣53.3%不代表一般玩家勝率，未改血量掩蓋難度。
- 主產品另有 `tests/story-energy-flow.cjs`：固定 RNG、正常 UI 動作、四個真實節點打完到收錄，結果在 `test-results/story-energy-flow.json`；由主產品獨立執行通過，與本任務的終局 fixture 區分。

本任務已凍結戰鬥接線／入口與既有測試。未窮盡所有策略與裝置，未調整核心能力、AI或數值；完整引擎68規則與UI五寬度證據由主產品交付。分層圖片的後續視覺修正另列 STORY-LAYERS。
