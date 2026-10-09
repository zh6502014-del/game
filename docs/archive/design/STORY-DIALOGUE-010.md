# STORY-DIALOGUE-010｜說話者辨識、緊湊對話與小任務回饋

2026-09-24 建單，2026-09-25 完成；工程審查與產品驗收通過。

需求：故事中看得出誰在說話，縮小對話欄，參考《底特律：變人》的情境式互動，改善小任務精細度。使用者未進一步指定小任務面向時，先處理現有四拼圖的目標、操作與結果回饋，不新增劇情分支或救援規則。

## 設計與範圍

- 美術/UI 唯一寫入 `story-campaign.js` 的 stage/paintImage 呈現及安全身份 helper、`story-stage-assets.js` 的身份呈現、`story-stage.css`、`story-performance.css`、`tests/story-dialogue.cjs`。保留 step ID、人物死亡/錄音的場景保護、decode/preload、回看、取消及保存規則。
- 產品唯一寫入 `story-puzzles.js`、`story-puzzles.css`、`tests/story-puzzle-feedback.cjs`：情境目標、零件用途、逐件結果與進度呈現。保留任意順序形狀配對、鍵盤/拖曳、取消/重設及既有完成回呼。
- 劇情 agent 僅寫 `STORY-DIALOGUE-010-narrative.md`，核對人物稱謂、聲源與任務回饋，不修改正史或資料步驟。
- 產品在所有來源凍結後唯一執行 HTML 版本整合（index、故事、決鬥入口）。不修改戰鬥引擎、AI、RNG、存檔鍵、解鎖、獎勵及正式劇本文字。
- 本單不生成圖片，不新增 runtime 美術 bytes；延用已在場景中的素材。T2/T3 的完整救援玩法另列候選，不能聲稱本次已完成。

一般對話採內容自適應的薄字幕區；姓名與聲源分開呈現，無立繪者使用明確文字而非錯配人物。任務與選擇有各自操作區，不偽裝成旁白。按鈕至少44px；長文與200%文字允許頁面增高，不裁切或縮字。

參考：[官方操作手冊](https://playstation-doc.net/j/detroit/action1.html) 的情境操作提示與對話選項、[官方試玩紀錄](https://blog.playstation.com/archive/2018/04/23/7-things-youll-notice-in-your-first-30-minutes-of-detroit-become-human/) 的調查與後續行動因果。本作的薄字幕、姓名標記及古金墨綠樣式是本單設計選擇；未量測或宣稱重製原作介面，沒有移植限時選擇。

## 基線及驗收計畫

修改前基線：`test-results/change-scopes/STORY-DIALOGUE-010-before.json`，含允許檔案原文及全專案文字檔雜湊。

| 唯一執行者 | 驗證 | 證據 |
| --- | --- | --- |
| 美術/UI | 新 dialogue 測試：說話者、聲源、長文、回看；1440/900/700/390/320、200%文字、實圖截圖 | tests/story-dialogue.cjs；test-results/story-dialogue-* |
| 產品 | 新 puzzle-feedback 測試：四種任務、16件回饋、錯配/重設/取消、鍵盤/拖曳與響應式截圖 | tests/story-puzzle-feedback.cjs；test-results/story-puzzle-feedback-* |
| 產品 | 既有 story-performance.cjs 實圖完整267步（含拼圖/尋物/戰鬥返回 fixture），來源凍結後一次執行 | test-results/story-dialogue-010-performance.log |
| 工程師 | 真實 diff、範圍/語意、測試品質與高風險路徑獨立檢查；不機械式重跑所有測試 | test-results/story-dialogue-010-review.md |
| 產品 | 視覺驗收、version-assets.py、asset-versions.py | 最終截圖與版本紀錄 |

測試使用獨立頁面/暫時存檔，不重載使用者對局。規則引擎未改，本單不宣稱重测戰鬥平衡或所有遊戲樹。真實裝置、所有瀏覽器及音效不在本單驗證內。


## 已完成的第一部分驗收

四拼圖：16件零件各自顯示用途及局部結果；一個進度/詳情區彙整當下回饋，冗長說明改成可展開區。未改配對答案、任意放置順序、拖曳判定或完成回呼；所有新文案避免在零件尚未全部裝好時宣稱武器已蓄能、錄音已播放或刪除資料已恢復。

- `tests/story-puzzle-feedback.cjs` 通過：四拼圖錯配、實際滑鼠拖曳、重設、鍵盤完成；各16件用途/結果不同；五寬度無水平溢出，390px全部文字放大200%；取消不完成、重複繼續只回呼一次、隔離storage不變。
- 證據：[結果](../../../test-results/story-puzzle-feedback-results.json)、[命令/版本/SHA](../../../test-results/story-puzzle-feedback-evidence.json)。
- 工程師獨立檢查：部分完成後關閉重開、完成後重設與異序重做、completionText HTML作純文字、回呼一次與storage不變均通過。整單最終工程審查已通過，無未解阻擋。
- 產品已看1440/390截圖。200%畫面可垂直捲動；未把「一屏裝下全部」作為放大驗收條件。


## 最終交付與證據

- 實際修改：`story-campaign.js`、`story-stage-assets.js`、`story-stage.css`、`story-performance.css`、`story-puzzles.js`、`story-puzzles.css`；新增 `tests/story-dialogue.cjs`、`tests/story-puzzle-feedback.cjs`、本文件與劇情核對文件；工作板記錄本單。`Nightfall-Duel-Story.html`僅六筆快取版本更新；其他入口內容不變。
- 短句同內容與基線比較：1440px 對話框高度244.8→92.6px，占用面積減57.6%；390px 高度238.9→142.6px，占用面積減40.3%。這是短句測例，長文自然增高，不能推論每段都縮同樣比例。
- 說話者有姓名＋對話／畫外音／錄音／殘響；旁白與行動提示分開。現場角色增加同名發言標記，圖片延遲載入時不將新台詞誤標給舊人物。沒有新增人物立繪或美術檔案。
- UI測試：80組＝五尺寸×100/200%×八種文字/聲源情境，使用明示文字fixture和正式圖片；另逐步解析正式267步及91段對話。[矩陣結果與來源hash](../../../test-results/story-dialogue/report.json)。最初一個C9測試引用舊場景預期，已依現有search優先規則修正斷言，未更改遊戲配合測試。
- 產品實跑：`ACTUAL_ART=1 tests/story-performance.cjs` PASS，28節點267步的實圖載入、四拼圖取消/完成、尋物流程、已讀回看、圖片失敗重試與重複點擊。[執行紀錄](../../../test-results/story-dialogue-010-performance.log)。戰鬥以terminal adapter驗證勝敗/平手返回，沒有把它當成重測戰鬥引擎。
- 來源凍結後序列執行版本腳本，83筆本機引用PASS。[環境、命令、164檔來源/相依/素材SHA](../../../test-results/story-dialogue-010-evidence.json)。工程師獨立核對164/164匹配，另實跑拼圖生命週期與延遲圖片下的說話者安全路徑；[最終審查](../../../test-results/story-dialogue-010-review.md) 可交付、無未解阻擋。
- 產品看過1440/390對話、錄音、320文字放大及拼圖截圖；另從正式A1實際操作到赫爾曼第一句擷取 [桌面](../../../test-results/story-dialogue-010-actual-1440.png)、[手機](../../../test-results/story-dialogue-010-actual-390.png)。沒有重載使用者分頁或修改真實存檔。

範圍工具仍為 `REVIEW_REQUIRED`：唯一清單外的 `docs/design/STORY-DIALOGUE-011-research.md`，由故事產品任務 `01a0c9a7-3f07-7b52-b3d5-ef3756f0754a` 同期授權唯讀競品研究並唯一新增，已透過交接確認凍結；不是010的runtime變更，不回填白名單或偽稱exit0。詳見 [after](../../../test-results/change-scopes/STORY-DIALOGUE-010-after.json)。

限制與後續：真機、Safari、螢幕閱讀器聽測未驗；四拼圖仍是形狀配對，本次精修目標/用途/回饋，未新增深層推理或救援機制。多人cast仍按原邏輯選兩人，面對面視線與固定受話者屬011後續；尋物構圖/操作與拼圖機制的進一步重設由另工單協調，不將本單說成已完成這些內容。新runtime美術容量為0。
