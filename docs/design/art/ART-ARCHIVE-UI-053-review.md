# ART-ARCHIVE-UI-053 工程審查

2026-10-04，工程師 archive_engineer。程式唯讀；本輪只新增本報告與 `test-results/ART-ARCHIVE-UI-053/review-*` 證據。

## 判定

**本次文件庫 UI 程式審查通過，未確認相關 P0／P1／P2，無需程式補正。** 整體交付仍須產品完成四個範圍外檔案歸屬、最終版本檢查及產品驗收；不能把目前 scope 的 `REVIEW_REQUIRED` 宣稱為全專案無越界或已完成。

## 基線與差異範圍

使用 `test-results/change-scopes/ART-ARCHIVE-UI-053-before.json`（2026-10-03T16:39:01Z）。執行範圍工具，退出 1；完整結果為 `review-scope.json`，三份執行碼真實差異另存 `review-story-search.js.diff`、`review-story-search.css.diff`、`review-story-search-assets.js.diff`。

- `src/js/story-search.js`：僅新增 `archive-vault` 分支的索引、清單、閱讀桌與焦點配合（28、92–106、164–178、230–310、451–485 行）。其他場景保留原 DOM 結構及呈現；回呼、收取 guard、取消與載入 token 流程沒有改寫。
- `src/css/story-search.css`：文件庫新增規則均使用 `#story-search-dialog[data-scene=archive-vault]`；唯一非此 selector 的新 `.search-archive-index` class 只在 archive 分支產生。移除的推近動畫原本也限定 archive。沒有修改共用場景規則。
- `src/js/story-search-assets.js`：差異只在 `archive-vault` 區段；改座標／旋轉／抽出姿態、縮短 helpText、新增呈現用 indexTag。target IDs、targets 對應、note 與實際線索未改；未新增 runtime 圖片。
- `tests/archive-search-ui.cjs`：新測試，詳見下列證據品質核對。
- 觀察時 `Nightfall-Duel-Story.html` 已有七個版本引用變更：三個 search、三個 FX／energy，以及 stage-assets。其 diff 只有 `?v=`，沒有變更載入次序。工單／工作板由產品維護。
- **範圍外待產品歸屬：** `src/css/story-battle-fx.css`、`src/js/story-battle-fx.js`、`src/js/story-energy-ui.js`、`src/js/story-stage-assets.js`。未反向擴大白名單、未還原、未推測作者，也未把這四檔內容當作本 UI 工單的工程核准範圍。

## 行為與可見成果核對

`canInspect`、`showDetail`、`collectSelected`、`finish` 和 click dispatch 仍要求已露出／已查看、尚未收取的合法 target；先通知 onCollect，只有明確「繼續」才 onComplete，Escape／關閉為 onCancel。`found` 狀態預先更新避免重複收取，回呼同步拋錯仍撤回並可重試。沒有 RNG、AI、傷害、解鎖或存檔寫入的新增或修改。

閱讀桌在桌面為側欄、手機為垂直流式排版；閱讀不再設定其他區域 inert，與保留場景可操作的設計一致。查看移焦到收取；返回移回文件或已收取重讀；小螢幕使用獨立 44px 以上件號 controls。載入、重試、取消與動畫清理由原流程處理，新增索引在未 ready 時 disabled，事件處理也有 ready guard。動態文案使用 textContent；未新增外部文字執行或 URL 來源。

實際檢視：`after-1440x900-reading.png`、`after-390x844-initial.png`、`after-390x844-reading.png`、`after-844x390-reading.png`、`after-390x844-text-200.png` 及工程師自己的 `review-rotation-collected.png`。已確認桌面不遮場景、摘錄可讀、小螢幕重要按鈕可透過垂直捲動使用。低高度／手機查看時會向下捲至收取，標題與關閉可能在上方，需要捲回；這是明列的流式排版，非截斷或不可達。

## 本次獨立實跑

`review-key-actions.cjs` 使用獨立 Playwright context、正式 HTML 的 CSS 順序、route.fulfill 讀取本機來源，不操作使用者頁面、不載 campaign、不寫真實存檔。Chrome 154.0.8037.97／Node v24.19.0，四項通過（`review-key-results.json`）：

1. 1001px 桌面斷點七個真實件號標籤中心均命中自身 reveal control。
2. 從預設關閉焦點以純 Tab／Enter 完成正確件號→查看→收取→繼續；核對 collect 與 complete 的次序及分離。
3. 320px 窄畫面帶 foundIds 回訪、重讀、返回、繼續；沒有再次收取。
4. 320px 閱讀中切換 844×390；onCollect 拋錯後維持未完成並可重試，成功收取後繼續可用。

首次 Chrome 啟動因 sandbox 失敗，留 `review-key-environment-failure.txt`；核准 escalation 後使用隔離瀏覽器。初次 callback retry 測試連續立即 tap 受到**原有** `event.detail > 1` 防雙擊 guard 忽略，留下 `review-key-doubletap-harness-failure.txt`；改用使用者可操作的 focus／Enter 重試，沒有修改產品或放寬收取結果斷言。`review-key-failure.txt` 仍保留該舊失敗，最終有效結果為 `review-key-results.json`。

## 沿用證據及界線

- 定向六組：`test-results/ART-ARCHIVE-UI-053/results.json`。核對測試使用公開 controls、收取回呼與完成回呼分離、四尺寸、七件號實際命中、觸控、錯件號、提示、重讀、Esc、reduced-motion、缺圖重試及介面文字 200%。非只檢查 DOM class。四尺寸不是四尺寸都測 200%；200% 案例只在 390×844，而且是介面文字放大，非瀏覽器全頁縮放。
- 列出來源雜湊除並行 `src/css/story-battle-fx.css` 外均仍相符。變動後的 battle-fx CSS 未出現 search／全域 body／button selector；工程師本次四項使用**當前**全部正式 CSS，補足受影響串接檢查。此處沒有宣稱六組在新版 CSS 下重新全部執行。
- 共用十組：`test-results/story-interact-012-search/results.json`，所有列出來源及圖片雜湊仍相符。核對測試涵蓋 research-files／gun-parts／hideout-recorder、cover guards、收取／繼續、焦點／回訪、缺圖及退出後舊載入不能污染新 session。此套件只載 `src/css/story-search.css`、`src/css/png-frames.css`，不能宣稱正式全部 CSS 的非文件庫端到端回歸；本次新 CSS 及 JS 的 archive 隔離已另人工核對。

未驗證：真實章節／真實存檔端到端、Safari／Firefox、實體手機、螢幕閱讀器語音、任意字串與所有尺寸；未審核四個並行檔案的功能正確性。scope 快照不認證作者，也不追溯基線前歷史。最終資源版本由產品序列整合，本報告不代替其結果與產品驗收。
