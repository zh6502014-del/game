# STORY-FOCUS-DIALOGUE-023 對話一次一句、發言者前景聚焦

## 目標
故事對話不再把整段來回交談一次攤開；一次只呈現一個聲音，誰說話誰往前景靠近。

## 改動
- `src/js/story-campaign.js`
  - `compileReadingUnits`：每則 `dialogue` 自成一個閱讀單位；連續旁白／觀察仍合成一段。`NDStoryReadingGroups` 資料不變。測試可設 `window.NDStoryStaging.groupDialogue=true` 還原整段群組（僅供 `story-reading.cjs` 驗證原編輯表）。
  - `paintImage`：進入前先強制計算樣式，使重新掛回的舞台層能播放過渡；新增 `host.dataset.speaking`。
  - `speakerSide` 與 `data-speaker-side`：對話框名牌依發言者位置（左／右／中）掛靠。
  - `typewrite`／`stopTyping`：逐字顯示。完整文字始終在 DOM（尾段 `visibility:hidden`），點場景或對話框先補完再推進；「繼續」按鈕仍直接進下一句。`prefers-reduced-motion` 時停用。
- `src/css/story-performance.css`（檔尾 STORY-FOCUS-DIALOGUE 區塊）
  - 發言者：`scale 1.07`、向中央位移、光暈、置前；其餘：縮小、變暗、微模糊、向外退。
  - 名牌懸掛於對話框上緣；原「正在發言」浮標保留於 DOM 但隱藏。
  - 逐字尾段隱藏、行尾 ▾ 提示。
- `tests/story-reading.cjs`：以 init script 啟用舊群組模式，維持原 267 步／80 單位的編輯表驗證。
- `tests/story-focus-dialogue.cjs`（新）：單句單位、發言者切換、名牌側、逐字與點擊補完、過渡進行中、減少動態。

## 驗證
- `story-focus-dialogue.cjs` 在 Chromium 通過（C4；使用替代圖片素材，非正式美術）。
- `tests/asset-versions.py`：94 項通過。
- 桌面 1280×760、手機 390×800 截圖已檢視。

## 未驗證／風險
- 未以正式美術與其他章節節點實測視覺比例（放大 7%、位移 2–3vw 可能需依立繪調整）。
- `story-reading.cjs`、`story-dialogue.cjs` 等既有測試因缺 Playwright 環境，未在本機重跑。
- 兩位以上同側角色、畫面外發言者（無立繪）時無人聚焦，名牌預設靠左。

## 備份
`backups/dialogue-focus-*`

## 同批次追加（2026-09-28）
- 故事戰鬥失敗條件改為「我方全數倒下」（`src/js/story-energy-engine.js` `checkOutcome`）；主角倒下後由存活夥伴接續，UI 自動改選存活角色；目標文字改為「我方全數倒下即失敗」。`tests/story-energy-engine.cjs` 的兩個舊主角失敗案例已改寫並新增 4 例（72 例全數通過）。
- C4-outer 我方加入朔（凜＋伊芙＋朔）；C4-inner 內庫盾衛改 HP10、護盾1（引擎新增單位層級 `shield` 設定，預設仍為 2）。
- 人劍合一（與武士魂）生效的回合起，劍客卡片「攻」數字顯示實際攻擊值 2 並轉琥珀色，出手後恢復 1（`engine.attackValue`、`seb-buffed`）。
- `Nightfall-Duel-Story.html` 補載入 `src/js/story-chapter-art.js`：先前未載入，導致未來磷立繪（及中繼站背景）從未出現，D2 以年少磷取代。

## 同批次追加二（2026-09-28）
- 移除任務工作台模式：15 個任務步驟（C4 命令正本、C8、D2–D7、F1、F4、G1）改為旁白／對話，事實不變（`src/js/story-chapters.js` 的 `told` 表）；C4 命令正本改為凜、伊芙、朔的對話。`story-tasks.js`、`story-task-data.js`、`story-tasks.css`、`tests/story-tasks.cjs` 移至 `backups/task-removal-0928/removed/`，`Nightfall-Duel-Story.html` 不再載入。仍以任務工作台為前提的測試待改：`story-c4-archive.cjs`、`story-complete.cjs`、`story-second-bell.cjs`、`story-test-helpers.cjs`。
- A1 與 A2 合併為一章：`A1` 含原 A2 的對抗、戰鬥（encounter 仍為 `A2`）與事故，共 19 步、6 幀；節點 `A2` 移除，`A3` 改為接在 `A1` 後（仍發放外觀）。舊存檔：只完成 A1 者需重玩合併後的 A1；A1、A2、A3 皆完成者保留 A1、A3。節點總數 36 → 35。相關舊測試（`story-campaign.cjs`、`story-reading.cjs` 的 A2 案例等）待改。
- 戰鬥：C4 內庫與外廊我方皆為凜＋伊芙＋朔。
- 迷宮：`src/js/story-maze.js` 殘留視窗防護與 `proceed` 開啟失敗防護；未能重現「按了沒反應」。

## 追加三：共享主線合併、去除點擊門檻、大陣容戰場

- 合併：P1+P2、P3+P4、B3+C1、C5+C6、C8+C9 各併成一章（35→30 節點）。第二章的步驟接在第一章後，步驟 ID 保留原前綴，場景以 `NDStoryMergedNodes` 對回原版面（story-stage-assets.js）。舊存檔：只完成前半章者，該章視為未完成。備份：backups/merge-shared-1。
- 調查（inspect）與單鈕行動（action）改為單擊閱讀；換場景以淡入淡出取代多餘按鈕（story-campaign.js、story-performance.css）。
- 戰鬥角色卡：普攻／招式改為圖示（亮＝可用）；4 人以上一列時改為等寬欄（story-energy-ui.js/.css）。
- 待改：依賴舊按鈕流程與舊節點編號的舊測試尚未更新。

## 追加四：迷宮點擊死角、旁白呈現更自然

- 修正：迷宮／路線步驟原本只有精準點在按鈕上才有反應，點在對話框其他地方（VN 點擊繼續的既有習慣）完全沒反應。現在跟其他步驟一樣，點對話框任一處都會觸發（story-campaign.js）。
- 旁白呈現：參考一般文字冒險／視覺小說的慣例重做——
  - 純旁白（無名敘述）不再顯示「旁白／敘述」標籤，直接以正文呈現，不使用斜體（中文斜體字型效果不佳）。
  - 旁白文字現在跟對話一樣有打字機效果，之前是瞬間整段跳出，跟對話的節奏不一致。
  - 角色對話與畫外音改用「」包住文字，符合中文文字冒險的慣例，讓對話和旁白一眼可辨。
  - 查證線索等「有標籤但非人物」的內容（如「通行安排」）維持原本顯示，不受影響。
- 備份：backups/maze-tap-fix、backups/natural-narration。

## 追加五：戰棋場景沿用金屬邊框、幕晶／技能卡視覺優化、攻擊輔助線反饋（2026-09-29）

- 金屬邊框重用：戰鬥整體外框、頂部資訊列、底部招式列、規則／結果彈窗、懸浮預覽卡改用 `src/css/png-frames.css` 既有的 `--frame-hero`／`--frame-panel`／`--frame-thin` 九宮格邊框（與主戰鬥畫面 `.duel-screen`、`.rules-modal`、`.result-screen` 同一素材），不再是純手繪 CSS 邊框。技能卡也比照主戰鬥手牌卡片（`.duel-hand .card::before`）疊加同款金屬外框。角色卡本體維持原有手繪邊框與狀態發光（選中／可選目標／拖放中），因為那些顏色變化是功能性的操作回饋，疊加靜態金屬框會蓋掉狀態辨識度，故不套用。
- 幕晶顯示優化：`.seb-gem` 改為雕刻感凹槽（未點亮）與發光结晶（已點亮）雙重視覺，並修正一個既有問題——回合列（`seb-action-rail`）原本用 CSS 把幕晶圖示直接隱藏（只留文字「0 / 3」），現在改回顯示，讓玩家自己的共用資源也看得到結晶顆數，不是只有敵方迷你顯示才有圖示。
- 技能卡視覺優化：金屬外框（見上）＋消耗徽章改為浮雕質感的圓形寶石造型；鎖定（能量不足／已使用／已倒下）改為更清楚的深色橫幅樣式；招式名稱上方加一條細金線分隔。
- 攻擊／招式拖曳輔助線加入即時反饋：拖曳中若目前指向合法目標，輔助線與箭頭由紅轉綠（`src/js/story-energy-ui.js` 的 `targetAt()` 判斷，`.seb-drag-arrow[data-can-hit]` 控制顏色）。
- 攻擊觸發面積放寬：`targetAt()` 除了原本的精準像素判斷，額外用「合法目標外擴 34px」的最近距離判斡作為備援，放開手指/滑鼠時只要落在目標卡片附近就算命中，不必剛好點在卡片上；同一函式也用於顯示輔助線顏色與 hover 高亮，行為一致。
- 驗證：雲端沙盒 Playwright（C9-abyss 5 人陣容 + C3 小陣容 + 900×430 短版橫向）截圖與行為測試——金屬框、幕晶、技能卡外觀正確；拖曳到空白處輔助線變紅、拖到敵人變綠；放開位置刻意偏移卡片 25px 仍成功命中攻擊；無 console 錯誤。
- 備份：`backups/battle-scene-visuals`。

## 追加六：戰棋美術陽春感——沿用既有勳章素材、角色改用專屬立繪（2026-09-29）

使用者反饋戰棋畫面「很陽春」，追查後是兩個各自獨立的問題：

1. **普攻／招式圖示、幕晶圖示過於陽春**：先前是我手繪的簡單線條 SVG，且邊框素材只借了 `src/css/png-frames.css` 的外框，沒有借用卡片對戰模式真正拿來畫「職業／攻擊／招式」圖示的那套勳章美術（`assets/emblems/*.svg`——深色圓底＋金色浮雕圖形＋虛線外環，`src/css/card-theme.css` 已在用）。現在普攻圖示改用 `assets/emblems/attack.svg`、招式圖示改用 `assets/emblems/seal.svg`，未點亮時整體變暗（不透明度改回 100% 避免整塊消失在深色底圖裡，只用灰階＋降低亮度表示不可用），點亮時恢復原色並發光。
   幕晶沒有現成素材，新畫了一顆風格一致的水晶勳章 `assets/emblems/mana.svg`（同一套深色圓底＋虛線環＋刻面寶石造型，配色改為故事戰棋既有的綠金漸層），取代原本純 CSS 畫的菱形色塊；點亮時維持原本的發光效果。
2. **同職業角色共用同一張招式卡／小圖，缺�ectors角色辨識度**：`localArt()` 原本只有「角色頭像」會採用 `portrait` 欄位指定的專屬圖，招式卡圖（`card=true`）強制一律套用同職業通用圖（如所有劍客的招式卡都長一樣）。現在拿掉這個限制，只要單位有指定 `portrait` 就頭像／招式卡都用同一張，兩邊視覺一致也彼此獨特。
   另外發現 `src/js/story-campaign.js` 的 `encounters` 資料裡，主角與長期夥伴（凜、朔、伊芙、格蘭）的戰鬥頭像其實指到「職業起源動態圖」（`assets/skins/{job}-origin.webp`，遊戲一開始選職業時的通用場景圖），不是角色本人在故事其他畫面用的專屬立繪（`assets/story/actors/*.webp`）。已改為對應到各自的專屬立繪（伊芙用持槍版 `eve-armed.webp`），敵方與雜兵維持原本各自的敵人專屬圖，不受影響。

沒有新增外部美術，全部沿用專案裡已存在、對戰模式本來就在用的素材，只是故事戰棋這邊之前沒接上。

- 驗證：雲端沙盒 Playwright，換上真實的 emblem／actor 圖片（未 stub）截圖確認——凜／朔／伊芙／格蘭在戰鬥中各自顯示專屬立繪（頭像與招式卡一致）；普攻／招式勳章未點亮時仍清楚可辨、點亮時發光；幕晶勳章未點亮／點亮兩態皆清楚；無 console 錯誤，`tests/asset-versions.py` 92 項通過。
- 新增檔案：`assets/emblems/mana.svg`（沿用既有勳章畫法自製，非外部委託美術）。

## 追加七：普攻/招式獎章「有時候會消失」修復 + 幕晶對角配置

**問題根因**：`.seb-allowance.seb-ready` / `.seb-allowance-skill.seb-ready` 這兩個較舊、雙 class 的規則（分別在
ALLOWANCE-ICONS 與更早的文字版規則區塊）設定了純色 `background`。因為雙 class 選擇器的優先度比
VISUAL-003 新增的單 class `.seb-allowance{background:url(emblem)...}` 高，圖示在「可使用（seb-ready）」
狀態下會被純色背景蓋掉——也就是圖示恰好在能點擊使用的那一刻消失，不能用時反而正常顯示。三處舊規則
的 `background` 已移除（其餘 border-color/box-shadow/opacity 效果保留），現在圖示在任何狀態下都持續
顯示 assets/emblems 的金屬徽章，不會消失。

**幕晶對角配置**：玩家自己的暮晶（幕晶）統計原本塞在畫面下方的操作列（seb-action-rail）裡；現在改成
獨立的右下角徽章（`.seb-player-energy`），視覺上與敵方左上角的暮晶徽章（`.seb-enemy-energy`）互為對角，
在所有斷點（含窄螢幕橫向模式）都同步套用一致的樣式與尺寸。操作列的 grid 欄位也同步移除原本保留給
暮晶的第一欄。

無新增美術檔案；僅為既有 CSS/JS 邏輯修正與版位調整。

## 追加八：故事情境動畫 — 先訂正一個誤判，再補一個真正缺的效果

原本以為「情境」閱讀畫面是 story-mode.js 那套（routes/beats/drawStage），改了一版動畫要交付時才發現：
story-mode.js 定義的 `window.NDStory` 會被後載入的 story-campaign.js 整個覆蓋掉，game.js 實際呼叫到
的一路是 story-campaign.js 版本 —— story-mode.js 早就是沒人執行的死碼。已把誤植到 story-mode.js /
story-stage.css 的改動整個回退，避免留下誤導性的死碼。

重新確認「真正在跑」的 story-campaign.js + story-performance.css 之後發現，情境閱讀畫面其實已經有相
當完整的演出系統，不是憑空要補：
- 打字機逐字顯示（`typewrite()`），標點停頓感（句末較慢、逗號中等、一般字快），已處理無障礙與
  reduced-motion。
- 說話者聚焦演出：發言角色放大/提亮/上前，其餘角色變暗/模糊/後退，換場有具名牌淡入。
- 場景切換過場黑幕（`story-scene-veil`）。
- 場景與角色圖片首次出現時的淡入。

唯一真正缺的是：背景場景圖淡入完成後就完全靜止，沒有任何持續的動態。已在 story-performance.css
的 `.story-stage-image` 加上一個 9 秒、極輕微（1.035 → 1.0）的安頓式慢速縮放（新增
`@keyframes performance-kenburns`），同樣處理 reduced-motion。用 Playwright 實際跑過 campaign 流程
確認：同一張背景圖在同一場景內連續按「繼續」好幾次都是同一個 DOM 節點（不會每次都重新觸發淡入或
動畫重置），所以縮放是每個場景只安穩播放一次，不會因為玩家點擊閱讀而卡頓重置。

沒有新增美術素材，純 CSS 調整（1 個屬性 + 1 組 keyframes + reduced-motion 例外）。
