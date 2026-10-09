# STORY-ENERGY-003｜故事暮晶戰鬥試玩版契約

2026-09-23。使用者已授權開始製作並要求故事觸發戰鬥改用本系統。原案见 story-energy-rules-review.md。產品负责协调；本檔案指定不同寫入者，禁止自行扩大共享檔案寫入。

## 規則與明示試玩預設

- 故事模式獨立引擎；自由決鬥 game.js 不修改。固定主角，夥伴由關卡加入，沒有召喚、格子或舊技能自動繼承。
- 角色預設 HP／上限 10、攻擊 1；坦克初始護盾 2（一次性，先盾後血，不自動回復）。引擎支援關卡配置敵方數值，但本輪正式四場所有角色一律 10 HP／1 攻，不先降低敵人生命；測試 fixture 可使用額外數值隔離案例。
- 產品暫定：雙方各有一個全隊共享暮晶池，初始 0；第一次己方回合不補，第二次起每次己方回合開始 +1，上限 3；不補滿、不累積溢額、不因夥伴數量改變產量。
- 每名存活且未暈的角色，每己方回合普攻最多一次，暮晶技能最多一次，可任意先後；不施招或不普攻也可結束回合。技能以常駐招式卡呈現，這版不引入新抽牌 RNG／牌庫。此為試玩預設，不宣稱使用者已確認。
- 產品暫定：只有明寫技能才會反擊，一般近戰沒有自動回擊。攻擊與技能指定單一存活敵人；自身增益不用敵方目標。主角死亡立即失敗；其他夥伴倒下停止行動；敵方全倒下勝利。
- 坦克「地遁」3 費，直接傷害 1，命中後目標下一次己方回合無法主動行動。即使傷害由盾吸收也算命中；被閃則無傷無暈。暈眩不堆疊、仍補能和承受持續傷害，被動殘影反擊不因此停用。
- 刺客「殘影」2 費，無直接傷害，取得下一次直接攻擊必閃；閃後消失，若攻擊非遠距則獨立 50% 機率直接扣攻擊者 HP 1（依原案「生命1」暫按穿盾處理）。持續傷害／反擊不觸發或消耗殘影；反擊不再觸發反擊。已有殘影不可重複施放。
- 劍客「武士魂」在自己的回合開始時 HP 為 1 或 2，取得下一次普攻 +1，攻擊後消耗，未出手不消耗；持續低血可在之後回合重新取得，但同名不堆疊（試玩預設，非每場限一次）。「人劍合一」3 費，自己的下一個回合起下一次普攻 +1，攻擊後消耗，被暈未出手保留；已有待生效／可用增益不可重複施放。兩種增益可疊加至 3 傷；被閃仍消耗增益。
- 槍客普攻／共振彈為遠距，不遭反擊，但仍可被殘影閃避。普攻出手計數（被閃也算），第 4 次獨立 10% 機率 +1，無論成功與否歸零循環。技能、持續傷害、反擊不計數（試玩預設）。
- 共振彈暫定 3 費：命中立即傷害 1，目標接下來兩個自身回合開始各傷害 1，总計 3；被閃不附加後續。持續傷害依然先盾後血、不被殘影躲掉。再次命中重新刷新剩餘兩次，不疊層。施放者倒下後已附加效果繼續。
- 回合開始：側方回合數 +1 → 持續傷害（同一階段全部結算）→ 勝負 → 存活時補能 → 重置行動額度、讓到期增益可用、判斷低血；暈眩於被跳過的側方回合結束解除。每次完整主動攻擊／反擊事件後判勝負，結束後不接受行動。
- 預設敵方 AI 只讀公開狀態，合法技能依生存／擊殺／控制決定，普通攻擊挑可擊倒目標或低 HP 目標；不讀不存在的玩家隱藏選擇。牽制關卡的 AI 可用配置保守行動。
- 一般戰鬥上限 50 個完整回合仍未勝負則 draw，回故事視為未完成，可重試。牽制 objective 用指定完整回合數；requireBothAlive:true 代表雙方所有參戰角色皆必須存活，任一角色倒下即失敗，不誤判為普通擊殺勝利。若該參數省略／false，主角死亡仍失敗、其他夥伴可倒下，敵方全倒下可提早勝利。故事 agent 決定 S3 合理短回合目標並交付理由。

## 引擎接口（engine 單一寫入者）

新增 story-energy-engine.js，IIFE 同時支援 window.NDStoryEnergyEngine 與 module.exports（Node 測試），不存取 DOM、localStorage 或舊 S。不消耗呈現 RNG。rng 由各動作參數注入，預設 Math.random。

公開 API：

```js
Engine.create(config) // returns mutable state，已在我方第一次回合，能量0
Engine.legalActions(state, actorId) // [{type:'attack'|'skill', actorId, targetId?}]
Engine.act(state, action, rng = Math.random) // {ok:boolean,error?:string,events:[],frames:[]}; 改 state
Engine.endTurn(state, rng = Math.random) // 執行敵方合法回合並回到我方，或終局；同樣回傳結果
Engine.skill(job) // {name,cost,description,target:'self'|'enemy'}
Engine.RULES // 明示本版預設與費用
```

config 接受舊簡寫 player:'assassin', enemy:'tank', name, description，及新 allies:[{id,job,name,hp?,attack?,portrait?}]（不包含主角）、enemies:[{id,job,name,hp?,attack?,portrait?}]（若提供取代 enemy）。主角必須固定 id:'hero'；其餘 ID 唯一。可選 heroName、heroPortrait、objective:{type:'defeat'|'survive',rounds?,requireBothAlive?:true}、enemyPolicy:'standard'|'restrained'、maxRounds。舊 mode:'surviveBoth50' 在沒有明訂 objective 時不得默默轉成普通擊殺；至少對應 survive/50。

state 至少提供：

```js
{version:1, round:1, side:'player', status:'playing'|'won'|'lost'|'draw',
 teams:{player:{energy:0,turn:1},enemy:{energy:0,turn:0}},
 units:[{id,job,name,side:'player'|'enemy',isHero,hp,maxHp,attack,shield,
   attacked:false,skillUsed:false,shots:0,
   statuses:{shadow:false,stun:0,spirit:false,unityReadyTurn:null,resonance:null}}],
 objective:{type:'defeat'|'survive',rounds?,requireBothAlive?},log:[],events:[]}
```

事件為純資料：{type,actorId?,targetId?,amount?,text}；log 為文字陣列（時間順序）；state.units 含 portrait 如有指定。resonance:{ticks,sourceId}。合法性由 engine 控制，包括回合、存活、暈眩、能量、重複行動與目标。無效操作不消耗能量、不改狀態、不擲 RNG。

2026-09-24 STORY-BATTLE-UI-001：act/endTurn 的結果增加 frames，預設產生，不新增呼叫參數、不將 frames 存入 state。每筆 `{kind,side,before,after,events}` 代表完整 action、turn-start 或 turn-end；before/after 深拷貝 round、side、status、reason（如有）、teams、units。事件順序及既有 state.events 不變，frames 串接連續且最末 after 對齊最終狀態。無效操作回 frames:[]。UI 根據已結算事件播放，不可為動畫重新執行引擎或抽亂數。

## 介面接口（UI 單一寫入者）

新增 story-energy-ui.js / story-energy-ui.css；命名空間 seb- 與 .story-energy-overlay，独立 fixed overlay、不覆寫 #app；退出清掉自己的事件與節點，恢復焦點與滾動。保留背後故事及現有存檔。

```js
window.NDStoryEnergyBattle.start(config, onReturn)
// onReturn(success:boolean, {status,round,reason})，僅在使用者按繼續故事／退出後一次
window.NDStoryEnergyBattle.snapshot() // 深拷貝state或null，供驗證
window.NDStoryEnergyBattle.close() // 主動取消，回呼false一次
```

UI（STORY-BATTLE-UI-001 取代初版長列表）：橫向戰场敵上我下，拱形角色 HP／攻擊／盾／狀態、雙方暮晶、目前回合與目標。直接拖角色到敵人普攻，底部全隊常駐技能牌拖到合法目標；自身技能指向所屬角色。保留點選／鍵盤操作、結束回合、可收合日誌、離開確認；能量不足仍可看技能原因／詳情。主角置中，行動與技能額度分別提示；文字與本機古金墨綠原畫分離，圖片失敗仍可操作。小螢幕直向顯示轉向提示及返回，保留戰況；手機戰鬥使用橫向。完整當輪工單與驗收見 story-battle-ui-001.md。

結束回合同步跑 engine，UI以獨立呈現副本逐 frames 播放，期间 data-busy=true 鎖戰鬥輸入。每段結束對齊 after，支援減少動態及取消清理，不使用舊戰鬥 RNG／FX。snapshot() 仍回引擎權威 state。終局演出完成後，成功按「繼續故事」才回呼 true；失敗可重試同配置或返回場景，返回為 false；重試不回呼、不發獎。

## 寫入分工及驗收

- engine：combat_design_audit，仅 story-energy-engine.js。
- UI：story_energy_ui，僅 story-energy-ui.js、story-energy-ui.css。
- 規則測試：story_balance_review，僅 tests/story/story-energy-engine.cjs，等待引擎落地可先寫測試。
- 故事接線：既有「開發故事模式玩法」任務；story-campaign.js／必要資料／Nightfall-Duel-Story.html／故事相關測試、docs/story-energy-integration.md。不能修改新 engine/UI。
- 主產品：本契約、WORKBOARD、新 UI／整合驗收腳本與報告；待各方寫入停穩後序列執行版本腳本及資源驗證。產品整合修正需先收回該檔案寫入權。
- 不重載使用者現行對局、不寫真實存檔；用獨立瀏覽器與樣本存檔。證據分為規則分支、種子抽樣、UI與故事回呼，不把抽樣宣稱全覆蓋。
