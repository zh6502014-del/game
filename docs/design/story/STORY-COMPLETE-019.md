# STORY-COMPLETE-019｜完整故事模式整合

2026-09-27，完成。使用者要求全力完成故事模式；依已確認起源、共同主線與中繼站救援篇實作。使用者已確認以「撤離居民後停用幕鐘」完成主線結局；未確認的身世與新人物設定不隨結局方向自動成立。

## 交付目標

- 既有28節點可完整走通；T1宮格正式接通、既有取消保護保留。
- C9後D1–D7成為可玩的尋父、查證、分工、隔離、救援清點、送醫與未來磷留下；不是文件或全程下一步。
- D7後F1–F4完成撤離準備、阻止提前啟動、接應清點與隔離、停用本地幕鐘及重建後日談；停用單座設施不等於世界夜域消失。全篇39節點。
- 採研究的證據對照、控制變因、有限程序與角色接力，並改善E1／C4／C8及T2／T3適當互動。固定生死不由失敗小題改寫，提示與輔助不扣資源。
- 說話者、命名、章節導航、線索與收錄清楚；舊存檔相容、取消不推進、回看不發獎、真實章節總數。
- 完成工程審查、必要補正、獨立資料測試與桌面／手機驗收、資源版本。

## 唯一寫入分工

產品：本工單、WORKBOARD本單、HTML入口與版本、workflow導航、tests/story-complete.cjs及現有campaign/storage/performance/reading/helper測試必要適配。
劇情story_completion_design：僅內容稿STORY-COMPLETE-019-content.md。
互動主責：story-tasks.js/css、tests/story-tasks.cjs，資料驅動獨立dialog、純呈現／驗證，不讀寫存檔。
章節主責：story-chapters.js、story-task-data.js、story-campaign.js/data、story-stage-assets.js及campaign/performance CSS必要章節呈現；禁止改戰鬥引擎／game.js。
工程師：凍結後唯讀實際diff，僅test-results/story-complete-019-review.md。

基線：test-results/change-scopes/STORY-COMPLETE-019-before.json。現有另一故事產品已idle，最後route來源freeze；本票接手故事source及HTML唯一整合，其他任務不得共寫。未生成新素材時不跑素材預算；若需新素材先另列追加基線／用途及尺寸。

## 驗收邊界

全節點前置與收錄、C7兩分支、新任務錯誤／提示／取消／重開／舊回呼、舊V1/V2與拒寫恢復、重玩不重複、桌面手機含200%字級、來源失敗備援。戰鬥全流程可以terminal fixture驗返回，另選真實故事戰鬥測試；不將fixture宣稱完整AI/平衡證明。研究為提案，不照搬新能力、修壞本來完好的紀錄器或擅定死亡形成條件。

## 審查補正與測試適配

- F3清查隊到達只回報本隊，全體平民完成宣告移至三份回報全部核實。
- 工作台取消保留本節點session草稿；再進入章節才清空，沒有新增存檔欄位。重開仍須確認，不保存完成確認狀態。
- T2-step05／T3-step06因前一task已實際執行，保留原文與ID改為單列後文；原28共267步、158單元，其中80閱讀、22獨立動作、56硬互動。
- 舊測試014字串快照早於013路線；改核對019可信原文基線。收藏遵循016已交付4套，非早期12占位。三個拼合、一路線、五處原章任務升級；不以舊計數誤判產品。
- 020美術另單未交齊，019不載入缺檔映射。A2傷勢圖及S3戰後圖先補合法揭露門檻，避免提前劇透。

## 實作與驗收紀錄

功能來源：`src/js/story-chapters.js`、`story-task-data.js`、`story-tasks.js`、`story-tasks.css`、`src/js/story-campaign.js`、`src/js/story-stage-assets.js`。新增11章140步；合計39章407步。18任務共23階段。HTML只接入本地新模組，未接入020未齊素材。`src/js/game.js`、故事戰鬥引擎、外觀存檔與原campaign-data和可信基線一致；戰鬥UI在019凍結後出現010並行更新，另核對其歸屬與整合。

產品修改入口 `Nightfall-Duel-Story.html`、導航 `config/workflow-map.json`，新增 `tests/story-complete.cjs` 並適配 campaign/storage/performance/reading/helper 測試；工單、內容稿與工作板保留交接。沒有新增對外服務或戰鬥判定。

- `tests/story-campaign.cjs`：39章从零順次完成、四起源解鎖、舊V1導入、持久化、圖鑑鍵盤、4套收藏、一般決鬥入口通過。戰鬥terminal fixture只驗返回。
- `tests/story-complete.cjs`：舊28章V2續玩D1→F4、越序F4拒絕、取消／過期回呼、D6階段中途續作、只到一隊不宣告全撤離、第二工人不提前揭露、最終存成39通過。23個章節尺寸檢查＋18真實題板×320px普通／200%字級共59組；sourceHashes驗證跑中來源不變。
- `tests/story-tasks.cjs`：三型正常／錯誤／提示／輔助／取消／焦點／舊DOM／草稿驗證通過；1440、900、700、390、320px ×100/200%×3型共30組。
- `tests/story-reading.cjs`：原267 ID與次序、80閱讀／22動作／56硬停點、已讀紀錄、未知ID備援、實際圖片失敗重試與40組版面通過。
- `tests/story-performance.cjs`：原28章158單元、3拼合／1路線／5題、4戰鬥失敗與返回、回看／圖片失敗／重複點擊通過。此套圖片使用明示fixture，不當真實圖畫驗收。
- `tests/story-storage.cjs`：破損存檔、V1遷移、非法前置、拒寫重試、重玩與C7另一分支通過；另實際故事攻擊＋一完整回合＋離開通過。
- 故事戰鬥引擎68契約樣本、workflow16案例通過。不是完整遊戲樹或平衡證明。
- 版本同步：`scripts/version-assets.py`、`tests/asset-versions.py`，89本地JS/CSS引用通過。

證據集中：`test-results/story-complete-019/`（含桌機／手機截圖、來源hash與初次過時測試失敗紀錄）、`test-results/story-tasks-019/`、`test-results/story-reading/`。工程報告 `test-results/story-complete-019-review.md`。

範圍檢查仍為 REVIEW_REQUIRED：020兩份素材manifest、020工單／內容檢核、`src/js/story-chapter-art.js`及020兩套測試由另一已授權美術產品負責；逐項交接核對，沒有擴019白名單或還原別人的檔案。

限制：Safari、實體手機觸控與完整AI／戰鬥樹未全驗。019使用既有場景與正確人物備援，未來磷先以具名文字表示；020專屬插畫、成人磷及傷勢素材待該單完整交付後接入，不宣稱本輪已完成新美術。章節未收錄前離開或重新載入仍從該章開始；工作台草稿只在當次節點中保留，不是跨重載存檔。

晚到並行變更：最終版本再檢查發現 `story-energy-ui.js/css`、`tests/story-energy-ui.cjs` 更新；新增可信基線 `STORY-BATTLE-UI-010-before.json`。019不還原、不歸為自己的實作。先前 protected-sources.json 僅記當時快照，UI=true不再代表最終來源；待010主責freeze後重整入口版本與受影響回歸。

最終晚到整合：010的現有來源與UI四尺寸測試已由本專案唯讀核對；019追加 `storage-late-ui.json/log`，以最終energy UI JS/CSS跑舊存檔、拒寫、分支與實際戰鬥返回，source前後一致。跨任務回報工具受信任關係限制，本任務不要求傳檔，而以共用專案的工單、可信基線、實際差異及獨立驗證為依據。019只同步HTML兩筆query，不修改010來源，不替010其他範圍簽核。最終89引用重新通過；HTML SHA d3794fb9bc6c2d53775b6bdc420cd8c9d242c18a7abafaeb21e02f5f959082e3。

## 最終驗收

019工程補正複審與產品驗收通過。工程獨立再驗D6續作／F3接收門檻／F4拒寫重試，並核對晚到010：16組衝撞距離邊界、1440×900與667×375角色詳情操作區及徽章不重疊通過。最終12個整合來源hash、019報告9檔、晚到UI回歸5檔仍吻合，89引用通過。11份清單外差異分別屬020七檔及010工單＋三檔，不反向擴白名單；詳見工程報告。此結論簽019主線与入口整合，不代簽020新美術或010其他未列範圍。

## 後續主責交接（2026-09-27）

新主線產品任務 `01a0c9c7-d02a-7d00-a3cd-e83588d51421` 回報使用者已批准「第二次鐘響」計畫，接手F1–F4修訂與G1。019維持已驗收版本的歷史紀錄，不以舊結局約束後續已批准修改。story-chapters／task-data／campaign／必要campaign-data與stage、相關測試及HTML版本統一由新工單持有，另建基線；本對話停止runtime寫入。020仍持有素材與獨立映射，待ready後向新主線整合者交接，不並寫共享程式。010戰鬥UI不在本次轉交擴改範圍。
