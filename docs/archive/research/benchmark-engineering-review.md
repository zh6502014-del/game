# RESEARCH-008-ENG｜標竿研究的工程可行性審查

2026-09-24。主責：工程師 `engineer`。**參考已接收，未實作**。

審查結論：研究的事實／推論／自訂參數與規則界線整體清楚，沒有把競品動畫逆向成已知內部物理，也沒有授權新增規則、公開 API 或預抽 RNG。抓點公式的前提不足已由 FX 唯一作者補正並通過複審；可作後續工單參考。本文件不是新物理系統或全專案程式碼驗收。

## 唯讀範圍與證據

已讀根協作規範、工程師角色規範、`RESEARCH-008.md` 與互動、物理回饋、狀態可讀性、敘事進程四份分報告；另核對五角色文件新增研究入口及 `STORY-BATTLE-UI-001` 既有契約。

程式只查看提案所需的接點：`game.js` 抓點與 `damageDirect` 音效、`card-surface.css` 的 ghost transform、`story-energy-engine.js` 的合法動作入口、`story-energy-ui.js` 的合法目標／原因、350 ms 長按、frames／playToken／取消，以及 `story-campaign.js` 的 C7／C8 文字與紀錄。沒有全專案重審或重新執行瀏覽器測試。

本單唯一寫入 `docs/research/benchmark-engineering-review.md`。這是純文件研究，沒有建立程式碼開工前基線；不能靠研究者自述或本次局部閱讀宣稱歷史 agent 無越界，也不把其他並行工單的程式變更歸入本研究。

## 原始來源的支持範圍

工程師獨立開讀下列主要原始資料並對照文件中的相關段落。以下是支持範圍核對，非重述整篇文章；沒有實玩競品或觀看完整 GDC 演講。

| 證據組 | 核對結果與界線 |
| --- | --- |
| Hearthstone 動作與聲音 | [Peter Whalen 棋盤文章](https://hearthstone.blizzard.com/en-us/news/20271423) 確實描述撞擊容易讓人預期反傷、改用短位移與投射物；[音效團隊訪談](https://hearthstone.blizzard.com/en-us/news/23964694) 談卡牌節奏、施放／命中與聲音取捨。可支持因果和節拍研究，不能推出原作毫秒值、碰撞或彈簧係數。 |
| 操作與提交邊界 | [Hearthstone 觀戰說明](https://hearthstone.blizzard.com/en-gb/news/16421344) 的箭頭／歷史限定觀戰；[Mercenaries 說明](https://hearthstone.blizzard.com/en-us/news/23707670) 是該模式的命令／戰鬥階段；[Arena 行動版文章](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-january-2021-01-21) 與 [SNAP 更新](https://marvelsnap.com/patch-notes-mar-12-2024/) 分別支持所述手勢與有條件撤回。文件已區分版本及模式，沒有把它們搬成 Nightfall 的已提交撤回。 |
| 可讀性與資訊 | [Arena 支付設計](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-the-brothers-war)、[Smart Priority](https://magic.wizards.com/en/news/mtg-arena/announcements-october-27-2025)、[Battles 製作文章](https://magic.wizards.com/en/news/mtg-arena/we-put-battles-on-mtg-arena-what-was-that-like) 均有對應設計敘述。[Oracle’s Eye](https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/oracle-s-eye) 只支持其可預測時的結果查看，不能推論所有隨機例外；研究已保留限制。 |
| 圖示、測試與卡牌優先 | [Nintendo／Mega Crit 訪談](https://www.nintendo.com/jp/topics/article/1f6d2f1e-b7ea-11e9-b641-063b7ac45a6d) 支持意圖由逐敵詳文走向同時可見圖示／數字；[GDC 原始投影片](https://media.gdcvault.com/gdc2019/presentations/Giovannetti_Anthony_SlayTheSpire.pdf) 第 10、13、21 頁支持測試者、數據與迭代的有限主張。[Tiffany Smart 本人作品說明](https://www.tiffanysmart.com/work/marvel-snap) 支持卡牌優先和方向光，作品中的概念動畫沒有被當成實機測量。 |
| 通用物理與減少動態 | [Daniel Holden 原文](https://theorangeduck.com/page/spring-roll-call) 支持帶時間步長的阻尼／彈簧方法；[W3C 2.3.3 解說](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) 是 AAA 準則說明，不是遊戲已通過無障礙認證。[GDC 2015 場次](https://www.gdcvault.com/play/1022036/) 確認 Derek Sakamoto 及主題，沒有提供研究所需的抓點／慣性常數。 |
| 敘事與保存 | [David Cage 訪談](https://blog.ja.playstation.com/2018/04/24/20180424-detroit/)、[流程圖官方說明](https://blog.ja.playstation.com/2018/04/26/20180426-detroit/)、[官方試玩](https://blog.playstation.com/archive/2018/04/23/7-things-youll-notice-in-your-first-30-minutes-of-detroit-become-human/) 支持所述分支查看、調查與重玩入口；[敘事團隊訪談](https://blog.playstation.com/archive/2018/05/23/how-detroit-become-humans-narrative-team-brought-a-world-of-androids-to-life/) 支持角色知識／情緒追蹤。[Quantic Dream 遊戲頁](https://www.quanticdream.com/en/detroit-become-human) 與 [Chloe 製作回顧](https://blog.dev.quanticdream.com/how-chloe-became-human/) 支持死亡後續及選單回應的有限敘述；[ink 官方文件](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md) 明列為一般分支／匯合參考，不是 Detroit 引擎或保存實作。 |

未發現需撤回的核心來源主張。心理效益、Nightfall 的優先順序、圖示語意與候選參數仍是本團隊推論，不能把官方功能介紹當成「我們的 UI 已更易用」的證明。

## 初審發現與補正：抓點公式的適用前提

初審位置：`benchmark-physical-feedback.md`「抓點先保持準確」段，原第 34 行。原文把逆變換與 `transform-origin=localGrab` 寫成可替代方案，再直接使用 `topLeft=pointer−localGrab`。若 `localGrab` 本來就是旋轉後 bounding box 的比例近似，改原點不會恢復原本抓到的印刷位置；而 `card-surface.css` 現有 `translateY(-14px)` 也會繼續移開抓點。

此為 **P2 文件模型補正**：可能讓後續作者照文實作後仍達不到同份文件的 2 CSS px 抓點誤差要求，不是本輪已修改出來的遊戲 bug。已提供唯一作者下列前提：

- 在拿起時，先以完整的 local→viewport 映射取得本地抓點 `g=M⁻¹(pointerDown)`；包含布局、祖先及原有 transform-origin，不能只反轉一個未含布局的 CSS matrix。
- 限 2D 仿射情形，定義 `p=L+o+A(g−o)+t`：`p` 為指標 viewport 座標，`L` 為 ghost 的未變換原點，`o` 為變換原點，`A` 為旋轉／縮放，`t` 為該合成變換的平移。故 `L=p−o−A(g−o)−t`。
- 只有 `o=g` 且 `t=0` 時，才簡化為 `L=p−g`。抬升若用額外螢幕平移需納入補償，或改以不改抓點的姿態／陰影表達。
- 有 3D 透視時需平面逆投影，不能把 4D／投影後座標直接套進上述 2D 式；後續原型可先明定只測 2D。

這是工程推導，不是引用某款遊戲原碼。**2026-09-24 複審通過**：唯讀核對作者凍結版 [物理研究](benchmark-physical-feedback.md) 第 34／36／38 行，已正確加入完整逆映射、2D 定位式、定位容器座標轉換、現行 `translateY` 的補償及 3D 透視限制；第 68 行也明列初速與桌面非穿透約束。原問題已補正，沒有剩餘模型文件阻擋項；尚未做抓點原型或實機量測，不能把公式複審當作誤差門檻已達成。

## 模型與現有能力核對

`q″+2ζωq′+ω²(q−goal)=0` 的質量正規化形式可用於單一平移或角度分量。`q` 用 CSS px 或 rad、時間用秒、`ω` 用 rad/s、`ζ` 無單位，量綱相容；需確保實作不把 ms 直接代入。`ζ=1`、`ω=24`、6–14 px、±5°及誤差門檻全部是自訂候選，沒有原作量測依據。

臨界阻尼不保證任意初速度都完全不越過目標。固定 goal 時，`y=q−goal` 的解為 `y(t)=[y₀+(v₀+ωy₀)t]e^(−ωt)`；較大的朝向目標初速仍可能穿越零點。因此「桌面不可穿透」需額外高度約束／初速界線，而不是只指定 ζ。這是實作前應定的模型邊界，沒有要求本輪建立物理引擎。

現有 `story-energy-ui.js` 的 350 ms 長按、`legalTargets`、frames 逐事件顯示副本、playToken 與取消清理均有實際程式接點；研究正確把它們當保護契約。自由決鬥在 `damageDirect` 結算時呼叫 hit 聲、故事閃避含 `.4` opacity 也有靜態證據，但本輪未聽測或重現整段視覺，不能逕列成已驗證的時間／物理故障。

另核對產品交回 UI 作者的文件補正：[互動研究](benchmark-interaction-ui.md) 第 82 行已明定次指忽略、主指可正常合法提交一次、主指 `pointercancel` 才取消該手勢；不把多指事件一律當成必須取消。第 122–129 行已用第一／第二順位表示候選排期，與工程缺陷分級分開。這些是既有契約的文字校準，沒有新增或驗證遊戲功能。

資料提案沒有要求預覽呼叫 `act/endTurn` 後還原、試跑 AI 或複製 RNG 偷看；也沒有把已結算 frame 當成未來預測。敘事建議保留 C7→C8、review／commit 和四場戰鬥條件；未定新旗標、倒數或失敗延續都必須另建工單。

## 三項工程參考建議

1. **先定座標與時間，再做姿態原型。** 以完整映射保留抓點，單位統一秒／CSS px／rad；規則命中範圍仍由既有合法目標決定。先測九宮格抓點、左右扇形、不同更新頻率及非穿透邊界，數學一致不等於真機低延遲。
2. **共用呈現語意，保留兩模式的接口。** 沿用故事 frames 與自由決鬥事件，各自處理 DOM 幾何；呈現識別至少區分場次、frame／action 與事件序號，以免音效去重誤合併。取消只清呈現／等待，不重新 act、不回滾已提交結果；音訊請求時間與實際出聲分開驗收。
3. **先查已有契約，再對確認缺口建立案例。** 優先沿用既有 350 ms／多指所有權／frames／保存測試；預覽需比較相同公開資訊但不同暗牌的輸出，並比較 0／1／100 次預覽後的完整狀態及 RNG 序列。劇情旗標只為已核定寫入／讀取用途增加，回看不能變成重玩；scope 基線、唯一寫入者及工程複審仍是下一張程式工單的前置。

## 五角色交接與交付邊界

主報告六遊戲對照與五角色研究入口均已核對：美術 UI 負責操作辨識，FX 負責姿態／接觸，遊戲樹負責合法性與可見資料，劇情負責意圖／知識／保存語意，工程師檢查模型、接口與變更證據。研究入口都明示不授權新規則、素材或程式變更；角色接收與產品排期不等於功能上線。主報告的劇情相容性回覆與最終接收狀態由產品統一維護。

實際完成：文件及相關來源核對、限定程式接點閱讀、模型量綱／幾何推導、交接界線審查。本單沒有生成圖片／音檔、執行遊戲回歸、量測原作時間或重寫執行碼；沒有需要更新的 JS／CSS 版本。本報告可作研究交接證據，不能當成候選原型、音效品質、實機效能或完整狀態覆蓋的 PASS。

**交付建議：可交付研究與參考交接。** 本次有限範圍的模型文件問題已補正，沒有未解的工程阻擋項；三項工程建議留待產品指派後續工單。劇情角色的相容性回覆若尚未取得，應照實列待回覆，不能改寫成已採用。最終完成由產品驗收，本報告凍結於本次複審結果。
