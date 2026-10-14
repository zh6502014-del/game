# PROJECT-SLIM-091｜工程獨立審查

日期：2026-10-14。審查者：slim_review，工程師角色。結論：**可交產品驗收**；本次已檢查範圍未發現需補正的 P0／P1／P2。最終項目數、交付狀態及外部驗收證據封裝由產品完成後重數，不能把這份審查當成全遊戲測試通過。

## 範圍與基線

唯讀審查專案、桌面存放區及 `/tmp/game-slim-091/`；唯一寫入為本報告。需求為縮減工作資料夾容量、檔案與資料夾合計不超過 1,000，並沿用使用者同意的外部原稿保存方式。依 AGENTS.md、工程師入口、工程流程及 [工單](PROJECT-SLIM-091.md) 核對。

全檔基線 `before.json` 記錄 1,538 檔／176 目錄／530,381,747 bytes；程式修改前另有 `code-scope-before.json`、`code-before/`，七份說明原文在 `guides-before/`。永久基線與清單位於桌面 `Game_claude_存放資料夾/batches/PROJECT-SLIM-091/`。七份說明原文與四份程式原文均與最初 SHA-256 對上。沒有 Git；快照不證明作者身分或中途曾發生的修改。

## 真實差異與範圍歸屬

- `src/js/preload-manifest.js`：僅生成資料更新。core 從 81 減至 73，刪除恰為已核准的八個舊素材：cards 下 attack、defense、dodge、gunner；characters/enemies 下 enemy-gunner、herman、ito；skins 下 gunner-origin。story 154 項及次序完全相同；coreBytes 7,656,402、storyBytes 33,927,588 與實檔相符。
- `index.html:13`、`duel.html:13`、`story.html:13`：逐字 diff 僅將 preload-manifest 查詢版本由 `e2d65f496037` 改成 `d97b7795d689`。
- 634 份原稿、圖集、工單、舊輸出、系統／Python 快取另存；61 份停用素材的路徑集合與修改前 `assets-audit.json` 的 `archive-external` 集合完全一致。現用 CSS、service worker、遊戲邏輯與素材內容未改。
- 說明文件七份更新均圍繞存放位置、還原程序、歷史工單查找與本次工作板紀錄，未把其他歷史工單改成完成。
- scope 工具仍為 **REVIEW_REQUIRED**。清單外的 16 個刪除都是預授權的 `assets/puzzles/{archive-0..3,evac-0..3,gun-0..4,recorder-0..2}.svg`；逐項比較原始基線、audit、retired-manifest 及實際還原 SHA-256 一致。這是人工完成歸屬，沒有改 before 白名單或把退出 1 宣稱為退出 0。

## 本次獨立實跑

1. 對最初 1,538 檔重新計算保存位置的 SHA-256：831 檔現存且未改，707 檔已外移或更新且原文可於封存還原、既有外部副本、guides-before、code-before 找回，缺失為 0。自行選定 `src/`、`tests/`、`scripts/`、`config/`、`assets/` 中排除核准外移、快取及生成 manifest 的 798 檔全部未改；此範圍與產品包含其他入口／依賴文件的 804 檔口徑不同。
2. 634＋61 份實際還原檔逐一比對原始基線的 bytes、SHA-256、mode、mtime_ns 全部一致；兩份外部 manifest 與固定外移清單一致。重跑原版 `source-art-archive.py verify`：634 檔／419,634,564 bytes 及 61 檔／11,193,057 bytes 皆通過，亦驗證了壓縮包 SHA-256。
3. 舊外部 `storage/project-history.tar.gz` 與原始專案副本 SHA-256 相同；使用現存 `storage/project-history-manifest.json` 獨立 verify：302 檔／42,531,929 邏輯 bytes 通過。還原指令中的 archive、manifest 及目的路徑規則與工具相符。
4. 讀取並重現 `art-vm-reproduce.cjs` 的動態解析，攔截其唯一 writeFileSync 以免覆寫實作者證據：20 個節點、497 個列表項、793 筆解析引用；errors、missingCurrentReferences、archivedCandidatesStillReferenced 全為空。497 包含 allSteps／steps 重疊，不能稱為 497 個獨立玩家操作。
5. 逐檔全文檢查當前入口 HTML、根 JS、src JS／CSS，61 條已外移完整路徑直接引用為 0。人工核對 card-art、skin-store、puzzles、story-stage-assets 的動態組合與 gallery 四職業迴圈。七份保留素材仍存在且 SHA-256 不變：gunner 畫廊圖、兩張 story fallback、控制室 registry 與三個 relay 道具。
6. 核對 audit 的 159 個來源檔雜湊，除核准的 manifest 與三入口版本外，155 個依賴未變；另以實檔重新核對預載 227 個路徑皆存在。`python3 tests/tooling/asset-versions.py` 實跑通過：63 個 JS/CSS 引用版本與 CSS bundles 正確。
7. 檢查測試文件依賴，現用 PLACEHOLDER-ART 與 STORY-READING 敘事文件保留。KING-FIRST、KING-RATS-COPY、STORY-BATTLE-UI 的舊 baseline 在本次 before 即已不存在，不是本次新刪除；須從歷史封存取回才能跑依賴它們的舊測試。
8. 寫入本報告前獨立重數：844 檔＋89 資料夾＝933 項，60,171,873 bytes，含隱藏項目。這是審查時刻數字；報告新增及產品最終證據外存後應以工單最終盤點為準。

## 沿用證據及依據

已讀產品 `browser-check.cjs`、`browser-check.json` 及初次連線失敗紀錄。腳本使用獨立 Chrome context、390×844、停用 service worker、隔離使用者存檔；六入口圖片解碼、決鬥開始、gunner 畫廊及全部 350 張現存 runtime 圖片解碼皆有行為斷言，記錄本機 HTTP 錯誤與 pageerror 均為 0。來源與其相依素材已由本次 SHA 核對，故沿用此有效執行，不宣稱工程師再次跑了瀏覽器。初次沙箱伺服器失敗是環境失敗，其後授權伺服器重跑通過；原失敗不能算通過。

證據目前於 `/tmp/game-slim-091/`，產品交付時應將測試腳本、輸出及此報告保存到外部批次的 `verification/`，與已存在的 manifest／before／audit 一同備份。暫存還原目錄不是永久備份。

## 限制與後續依賴

未驗完整劇情通關、所有 fallback 觸發、真機 Safari、外部音訊或整套舊測試。動態 resolver／registry 核對及瀏覽器抽樣不能代表全狀態覆蓋。舊 story-search 的故障注入仍指向目前不使用的 gun-4 舊路徑；該測試問題在整理前即存在，本次未修也未宣稱通過。

外移保留原稿，會縮減遊戲工作資料夾，並未消除外部存放區的磁碟用量。GitHub clone 不含這些本機封存；需另外備份桌面存放區。新增素材、測試產物或解壓回專案後仍須重數。本次沒有推送 GitHub。
