# STORY-READING-014｜完整閱讀單位與導覽架構

2026-09-25。美術／UI 方案已交接，**runtime 尚未實作，尚未驗收**。本輪唯一寫入為此文件；STORY-INTERACT-012 尚在整合，未收到 014 來源基線與 driver／HTML 寫入釋放。以下根據本輪唯讀的 campaign、stage 與測試提出，實作前須以 012 最終來源再次核對。

## 推薦方案

在原始 `NDStoryPerformances[node].steps` 之上增加人工審核的「閱讀單位」映射。同場景的一段問答、反應和必要旁白一次呈現；換說話者不要求翻頁。每句依原次序保留完整文字、署名、聲源和原始 step ID，不改寫劇本、不自動播放、不把整章塞進一頁。

第一版每組使用**經審核的首句安全畫面**，不因換說話者換左右、不依計時器或捲動自動換圖。多句對話自然增高，手機以一段完整交談閱讀和捲動，僅在交談或事件結束後按一次「繼續」。互動與重要轉折仍是停點。

這不是把 `forward()` 連續呼叫數次、隱藏中間幾個畫面；那會漏掉署名與紀錄，也可能越過需要操作的條件。

## 現行接點與需要保護的契約

| 接點 | 本輪讀到的行為 | 014 處理方向 |
| --- | --- | --- |
| `step()`、`cursor`、`frontier` | 原陣列 index；`cursor < frontier` 表示回看，互動通常要求兩者相等 | 保留 raw index，不把 steps 改成合併後的新劇本。兩者改為目前／最遠已到達**單位起點**，使既有相等與回看守衛仍成立 |
| `remember()` | 只記目前一筆 ID、speaker、`stepText()` | 改成參數化的單筆記錄，加 `rememberUnit()` 逐一記錄真正放進閱讀區的原筆數，依序且去重 |
| `forward()`／`act('previous')` | raw index 各加減 1 | 只跳到下一個單位的起點或前一單位起點；不可在迴圈內呼叫 `act()`／`proceed()` |
| `proceed()`、`openSearch()`、戰鬥回呼 | 以 session／position／cursor、busy、返回一次等條件防止重入 | 保留原守衛及回呼。互動單位皆為 singleton，成功回呼只前進一個單位 |
| `commit()` | 只在目前 complete 步驟收錄並保存 | complete 永遠 singleton；讀到長組尾、切鏡、捲動、回看均不能代替 commit |
| `composition()`、`paintImage()`、`requestImage()` | 目前 step 驅動畫面；decode 完成後才替換 safeImage | 明確以當組核定的 anchor step 取畫面，保留 token／原子 decode／安全舊場景／重試；不用組尾作初始圖 |
| `preloadReachable()` | narration／dialogue 可預載下一個不同素材；遇非閱讀步驟停止 | 改為從閱讀單位查下一個可達 anchor，仍不跨互動或轉折屏障；不預載實際不呈現的組內其餘鏡位 |
| `performanceState()` | 回傳 step 的拷貝，外部不可修改內部 step | 保留舊欄位與 raw step；以拷貝額外提供單位 kind、start/end、stepIds、anchorId，供測試及呈現定位 |

本輪 driver 的 `perform-action` 看似只呼叫 forward，**不構成全部 action 可吞併的授權**。仍需比對 action 的場景變化、callback、其他模組引用與敘事承諾；以後的具體互動也可能掛在同一 ID。012 本身的翻找／收取與拼圖回呼不得被「少點幾下」跳過。

## 資料與編譯層

建議另設只含呈現資料與純函式的 `story-reading-groups.js`，由產品在實作時正式列入白名單並安排 HTML 引入。名稱是候選，現在尚未新增此檔。

每組至少包含：穩定 group ID、連續且有序的 `stepIds`、`anchorStepId`、人工定義的節拍原因。旁白／對話原文仍只存在 campaign data，映射不複製全文。`anchorStepId` 第一版必須等於組內第一個原 ID；不能從較後句借一張「比較好看」的圖片。

編譯時建立 `units[]` 及 raw index → unit 的唯讀查表，每個單位含 start、end、kind、原 IDs、anchor。規則：

- 每個原 step 必須出現一次、依原順序；分組不得重疊、跳 ID、調換台詞或跨節點。
- `inspect/search/puzzle/battle/choice/complete` 永遠 singleton，禁止配置跨過；未核定 action 同樣 singleton。
- 純敘事 action 必須逐 ID 白名單，附劇情與工程核對理由。source type 保持 action，不把原資料偷改成 narration；閱讀組只展示該 action 的原 label／原文，不呼叫它的操作路徑。
- 轉場、時間跳躍、死亡／事故揭示、道具狀態改變及明確停頓由作者列為屏障。frame 數字相同不代表可合併，frame 不同也不必然是換場。
- 新增但尚未分組的 ID 預設 singleton。資料不合法時回退該節點的原 singleton 順序並提出可見於開發檢查的錯誤，不能靜默跳過文字或改用整章自動合併。
- 正式交付檢查全部節點映射，不拿 fallback 當全部已達成使用者閱讀需求。以實際閱讀單位數、交談完整性和操作次數呈現改善。

人工分組依劇情 agent 的逐 action／轉折審核定案；這份文件不自行批准任何 action 白名單。劇情本輪初審只提出 `P3-step-04`（察覺盯梢）與 `C2-step-03`（看見顫抖）兩筆純敘事候選，其餘 27 個 action 保留獨立；C9 點燈也不合併。正式接入前仍需核對最終 driver／場景副作用，不能只因原處理函式目前是 forward 就放行。

## 導覽與狀態不變量

推薦 `cursor` 與 `frontier` 都保存閱讀單位的**起始 raw index**，而非把 frontier 改成當組 end。例：首次顯示 S1 原步驟 04–10，cursor = frontier = 04 的 index；全部七筆文字都在此閱讀單位內，但這不是回看。

| 操作 | 更新 | 不可發生 |
| --- | --- | --- |
| 進入新節點 | 第一單位起點；清理原 session 暫存，與現行 begin 一致 | 保留上一節點安全圖、跳過初始互動 |
| 閱讀組「繼續」 | `next.start = current.end + 1`，首次到達時 frontier 同步到該起點；一次 draw | 對組內各 step 逐次 act／執行 action、設定選擇、保存 |
| 互動成功 | 原 callback 驗證通過後，以同一前進函式到下一單位 | 取消／失敗也前進；重複 callback 前進兩組 |
| 「上一段」 | 查前一單位的 start，frontier 不變 | 只減 1 而落在群組中間，導致台詞缺頭或讓回看互動恢復可用 |
| 回看中「下一段」 | 查下一單位 start；不超過 frontier | 原互動的 button／drag／choice handlers 再次執行 |
| 返回目前進度 | 導覽回 frontier 所屬單位；前置互動仍依原暫存狀態 | 重做尋物、拼圖、戰鬥或改 C7 選擇 |
| 圖層、焦點或捲動更新 | 僅呈現，不改 cursor／frontier／store | 當成故事完成、領獎或保存依據 |
| complete 的收錄 | 維持現有 commit／save／Skin 流程 | 群組尾自動收錄，回看收錄第二次 |

「本組已呈現」指文字已加入可閱讀 DOM，不代表系統量測玩家逐字讀完。不要加入讀秒、讀完強制捲到底、追蹤視線或逐字顯示。繼續按鈕在內容後方；長組需自然捲到下方操作，不另外攔截正常閱讀。

重複點擊仍以真實 DOM 根節點包含性、busy、session／position 等防重入；必要時採單位 render token。單次輸入最多跨一個單位，不能把一組七句誤解成允許連續七次自動前進。資料欄位以拷貝提供，外部不能變更分組或當前原 step。

## 紀錄、全文與存檔

- `rememberStep(t)` 以原 ID 去重；`rememberUnit(unit)` 逐原順序呼叫。`stepText(t)` 的 C8 分支前綴等動態文字必須對每筆實際求值，不能用純資料 text 代替。
- 群組內每句都帶原 `data-reading-step-id`，測試可對比原陣列：署名、聲源、完整文字及次序全部吻合。原操作步的 `data-step-id`／`data-action` 與任務事件落點保持；容器另有 group ID，不能拿 group ID 冒充原 step ID。
- 紀錄中納入全部已展示原 ID；不先把下一組或屏障後的內容加進 transcript。調查細目、尋物收取、C7 choice 等既有子紀錄仍在實際操作成功時才加入。
- 回看不重複 push，不重新領取／寫選擇；開始新節點或取消離開仍採原規則重置未收錄暫存。
- 不新增每組保存、localStorage key、存檔版本、已讀清單永久化或原進度遷移。持久保存仍只有現有收錄流程；儲存拒寫／重試的提示與行為保留。

## 畫面與說話者

第一版每組固定安全 anchor。這可保留初圖與因果順序，避免 scroll observer 在一開始看到數段文字時直接選到組尾、提前切到死亡或後續人物畫面。

- 單筆閱讀保留 010 薄字幕及現場「正在發言」標記。
- 多筆閱讀採單一墨綠閱讀面板，不為每句加框。每段前綴明確列姓名＋聲源，旁白也獨立成段；原句分開，不合成一大段而只留第一人署名。
- 混合說話者組不在場景上保留一名角色的「正在發言」來代表整組。人物維持中性可讀狀態，必要時只標姓名；句首署名是這種靜態完整交談的主辨識。
- 錄音、殘響與畫外音沿用 010 身分解析；父親的錄音不加現場父親，未知女孩不配磷。不能因群組第一筆旁白就把後面每句都標旁白。
- 18px 左右正文與至少 12px 輔助標記維持；少量短句可用「鳴者・對話　是你刻的？」的同列前綴自然換行，長句獨立段落。文字放大時整體增高，不固定兩行、不截斷、不縮字。
- 手機採整頁單軸自然捲動，避免「字幕窗內一個捲軸、頁面又有一個捲軸」；44px 主要操作放段落末。200% 文字不保證同屏，保證全文與操作可達。
- 已讀回看標記只在閱讀單位頂部顯示一次；原步驟數降為次要或放紀錄，對玩家顯示閱讀單位進度，不能仍用 04/11 讓七句組看似只讀了一句。
- 新圖片預算為 0；共用薄框、SVG、角色與背景。012 翻找／拼圖維持自己的互動版面。

若某組不切中段鏡位會造成敘事錯誤，先由劇情調整分組或 anchor 安全性。日後若加「查看這一段場景」，需獨立 `visualStepIndex`，由明確使用者操作觸發，保持原子 decode、不能改導覽／frontier／存檔；不是首版必要項，也不能追加另一套逐句必點流程。

## 兩個先驗收樣本

依本輪劇情 agent 初步指派，最終以其全量審核表為準：

| 節點 | 閱讀／互動單位 | 必要含義 |
| --- | --- | --- |
| S1 | 閱讀 01–02 → action 03 → 閱讀 04–10 → complete 11 | 「去過嗎／沒有／以後一起去」同組，讀完整問答只需一次繼續；交書籤維持獨立行動，收錄仍獨立 |
| A2 | 閱讀 01 → battle 02 → 閱讀 03 → 閱讀 04–05 → 閱讀 06–08 → action 09 → complete 10 | 戰前不得取得事故素材；戰後仍按原順序保留事故、死亡、記憶與逃離的停點。失敗／取消仍停 battle 02 |

S1 的 9 個原閱讀停點合成 2 組；交書籤與收錄仍各自保留。劇情初審估後組約一百多字，以原文精確計數驗收，不把 150 字當成強制截斷問答的演算法。S1 的首圖需按兩組各自第一筆決定，04–10 可留書籤近景，不先取後句雙人場景；同場景多 frame 不是強制拆成多次點擊的理由。A2 的分組首圖及人物狀態逐組人工核對，不因圖片已在快取便提前放到畫面。

## 測試適配：改單位假設，保留行為保護

| 檔案／層 | 必要適配 | 不可刪除的斷言 |
| --- | --- | --- |
| 新閱讀映射純測試（候選 `tests/story-reading.cjs`） | 全量 ID 覆蓋、連續性、重複／跳過／跨硬邊界拒絕、未知 ID singleton、白名單逐 ID、轉折屏障；統計閱讀點擊數 | 原全文／署名／順序保留；所有正式互動仍存在；不能用單純「按鈕更少」取代正確性 |
| `tests/story-performance.cjs` | `after.cursor===before.cursor+1` 改為核定 `before.unit.end+1`；初次 log 行數改成已呈現原 IDs 數；28 節點迴圈識別 unit.kind | 4 puzzle 取消／成功、4 battle lost/draw/won、barrier 前素材未請求、回看不產生互動、commit 之前未收錄、stale button 只前進一單位、state 拷貝不能被外部改壞 |
| `tests/story-test-helpers.cjs` | 先看 unit.kind；reading 即按 advance，再按單筆 interaction 的原 type 操作。不能看到 source action 就一律找 perform-action | 翻找真實 controls → 露出 → 詳情 → 收取；拼圖仍放入所有實際零件；保留原 battle adapter 的測試界線 |
| `tests/story-layers.cjs` | 原不在正式映射內的 synthetic IDs 可維持 singleton，原用例不必重寫；另加同組不同 frame 的安全首圖／下組 slow/missing 案例 | same DOM 保留、no replay animation、atomic decode、safe scene retained、retry、首圖失敗不顯示舊節點、preload barrier、readonly、鍵盤／觸控及減少動態 |
| `tests/story-dialogue.cjs` | 010 單句 fixture 可明確維持 singleton 以保留 80 項比較；新增 S1/C7/C9 多句署名測試。每筆 line 定位，不能把 `.story-speaker` 第一個值當整組 | 267 原步聲源、91 對話、錄音不添父親、未知聲音不亮錯人、E2死亡/C6/C9特例、escape 安全、44px與五尺寸／200% 無水平溢出 |
| storage／search／012整合 | 核對哪些用例假定一次 advance 等於一原 step；只改定位與單位期望 | C7 help/direct 收錄與C8前綴一致、拒寫／重試、節點重入／退出、相同收錄冪等、search/puzzle取消不前進、012遮擋不可穿透收取 |

新測試需比較可見全文串接與各原 ID 的 `stepText()`，而不是只比較同一編譯函式回傳的群組數。一次完整節點後，每個原 ID 應出現在已展示／紀錄對照表且不重複，額外操作細目另列，避免原子步被吞掉卻因總數變少而通過。

同組首圖固定後，實圖驗收的分母須說清楚：每個閱讀單位 anchor 都需 decode／截圖核對；原 267 步仍需文字／聲源／相容性盤點，但不能宣稱 267 個舊鏡位仍逐一展示。素材失敗沿用 safeImage，只能保留已可達的舊安全圖，不拿後文圖備援。

## 實作順序與交付門檻

1. 等 012 凍結／整合，產品保存 014 精確白名單與新基線並釋放唯一寫入者；重新讀最終 driver、helpers、HTML 引入順序。
2. 收斂逐節點閱讀映射、轉折停頓及 action 白名單；先用 S1 和 A2 查方向，再擴所有節點。未核定不把 action 當純敘事。
3. 先寫純分組驗證與導覽小測，再接 `stage/remember/forward/previous/composition/preload`；不改引擎、RNG、原 step ID、章節前置或存檔格式。
4. 短 smoke：S1 完整交談、A2 戰鬥取消→成功、一次群組回看、長文手機；環境與定位器確認後再跑正式矩陣。
5. 五尺寸 1440／900／700／390／320、200% 字體、錄音與多人物、長組自然增高；實際看桌面／手機對照圖並報告點擊減量，不只查 DOM 尺寸。
6. 由指定唯一執行者完成相關全流程、版本／資源整合及工程審查。分列本輪實測、可沿用證據與未驗證，不因舊 010／012 PASS 就宣稱 014 通過。

本文件交付只含架構、呈現方案和驗收接點。未寫任何 runtime、HTML 或測試，未開瀏覽器、未生成圖片；仍待基線、寫入 release、全量劇情分組核定與工程審查。
