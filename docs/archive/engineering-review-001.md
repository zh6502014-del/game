# ENG-REVIEW-001｜工程師首次有界審查

日期：2026-09-24。主責：`engineer`；產品整合驗收。

初審發現 **2 項可重現的 P2 問題**：多指拖曳會遺留卡片複本，素材檢查器會接受截短的 WebP 尺寸欄位；追加的新範圍工具審查另發現 1 項目錄 symlink 漏報。**三項均由產品補正並通過工程師複審，本次有限範圍沒有未解的已確認阻擋。** 下方保留初次證據及限制；這些缺陷不是其他 agent 越權的證明。

## 範圍與證據限制

| 工單 | 實際閱讀範圍 |
| --- | --- |
| FX-JOBS-006 | `combat-fx.js`、`character-art.css` 的 `.fx-*` 區、`game.js` 的 `combatants` 與兩處 `NDCombatFX.play` 接線；參照交付文件及 `tests/job-attacks.cjs` |
| DRAG-UI-005 | `card-surface.css`、`game.js:1325–1536` 拖曳生命週期；參照交付文件及 `tests/drag-surface.cjs` |
| ART-BUDGET-007 | `scripts/check-art-budget.py`、`config/art-budgets.json`、`tests/art-budget.py` 及尺寸規範 |

已閱讀根協作規範、PRODUCT、分派入口與相關工作板。專案目前沒有 Git，也沒有這三張工單開工前的可信內容快照；本次無法完整還原歷史 diff、指認修改者，或證明各 agent 沒有動到範圍外的程式。既有交付文件是範圍參考，不代替獨立差異證據。

唯二新增文件：`docs/agents/ENGINEER.md`、本報告。未改遊戲、共用 CSS／HTML、規則、存檔或既有 test-results。後續由產品建立開工／交付快照以補足追溯能力。

## ENG-001-A｜P2：第二個指標覆寫拖曳，留下永久複本

- **位置**：[game.js:1333](../../src/js/game.js#L1333) 的 `pointerDown`，尤其直接建立 `dragState` 的第 1346 行；第 1404 行 fail-safe 只清理目前 `dragState`，第 1505 行清空全域狀態。
- **觸發**：手指 1 拿起卡 A，尚未結束時手指 2 在卡 B 觸發 `pointerdown` 並移動。第二次 down 未拒絕或清理前一筆拖曳，直接覆寫 `dragState`。
- **影響**：第二次拖曳取消後，第一張複本、`.nd-drag-placeholder` 和 `.nd-drag-source` 留在頁面；第一指 cancel、blur、原來 15 秒 fail-safe 都找不到該狀態。原卡保持淡化，遊戲看似有一張卡浮在桌面。未發現此重現修改傷害／AI 的證據。
- **實際驗證**：把原始檔 `let dragState=null` 到委派事件註冊之前的函式載入 Node VM，以最小 DOM、兩張卡與可控制 timer 注入兩指事件。依序 A down/move → B down/move → B cancel → A cancel → blur → 到期 timer，結果如下。沒有改寫專案檔、啟動真實對局或使用存檔。

```json
{"ghostsCreated":2,"remainingGhosts":1,"firstCardClasses":["nd-drag-placeholder","nd-drag-source"],"secondCardClasses":[],"dragState":null}
```

- **修正建議**：已有 `dragState` 時不接受新的 pointerdown，保持一個手勢唯一擁有者；若要允許接管則先完整清理舊狀態。補上第二根手指及相同指標重入、取消後無 ghost／placeholder／timer 的案例。是否限制滑鼠非主按鍵可另依產品預期處理，不是本問題必要擴充。
- **驗證限制**：這是實際函式的狀態／清理重現，未用實體觸控裝置或瀏覽器的可信雙指輸入重測。現有拖曳測試覆蓋單指與失焦，沒有雙指交錯案例。
- **處置**：建議產品建立小型拖曳補正工單；修正後工程師複審，不以此前單指測試全過將本問題視為解除。

## ENG-001-B｜P2：截短的 WebP header 被 strict 判為通過

- **位置**：[scripts/check-art-budget.py:31](../../scripts/check-art-budget.py#L31) 至第 37 行。`VP8X` 不檢查尺寸欄位是否完整；`VP8L` 只檢查首 byte。`int.from_bytes` 會接受空或不足長度的輸入。
- **觸發**：WebP `VP8X` chunk 宣告 10 bytes、實際只有前 4 bytes；或 `VP8L` 宣告 5 bytes、實際只有 `0x2f`。
- **影響**：不存在的尺寸被推成 1×1，`--strict --kind coin` 輸出 `WITHIN_BUDGET` 且 exit 0。這不是要求檢查器解碼像素，而是它宣稱讀取的尺寸 metadata 根本不完整；自動交付門檻因此可能錯放損壞檔案。
- **實際驗證**：Python `tempfile.TemporaryDirectory` 中建立兩個截短 header fixture，對原始檢查腳本執行 strict JSON 模式；測試完成即刪除暫存檔。

| Fixture | 宣告／實際 payload | 檢查結果 |
| --- | --- | --- |
| VP8X | 10／4 bytes | `1×1`、`WITHIN_BUDGET`、exit 0 |
| VP8L | 5／1 bytes | `1×1`、`WITHIN_BUDGET`、exit 0 |

- **修正建議**：解析之前檢查相關 chunk 宣告長度及實際最少讀取長度；尺寸欄位不足時拋 `ValueError`，使主流程回傳 `ERROR`／exit 2。補兩種截短與正確邊界案例，維持「只讀 header，不驗證像素解碼」的工具界線。
- **處置**：建議 ART-BUDGET 的小型補正工單；在修正前不能單靠 strict 的通過結果判斷該類檔案尺寸已成功讀取。素材可正常解碼與視覺品質仍是原交付流程的另外兩項檢查。

## 其他審查結果與實際執行

- `python3 -B tests/art-budget.py`：8／8 通過。兩個截短案例是本次新增的暫存重現，不在既有 8 項內。
- `node --check game.js`、`node --check combat-fx.js`：通過。
- 已讀取的 FX 呈現函式使用確定性粒子參數；文字用 `textContent`、SVG 用節點 API；兩處 `combatants` 是職業字串快照。這些被查區段未發現新增 RNG／傷害結算／存檔操作的當前問題，但沒有任務前 diff，不能從而宣稱整張歷史工單無越權。
- `combat-fx.js` 現有 cancel 會清 timer、動畫、layer 並 resolve 等待；`card-surface.css` 限定舊決鬥手牌和拖曳複本。此次沒有另一項具體可重現的 FX／CSS 缺陷；壓縮式寫法本身未被當作缺陷。
- 既有 `job-attacks`、`drag-surface` 報告及測試已閱讀，**本次未重新執行瀏覽器全套**；歷史 PASS 不當成本次新執行證據。未測實機、完整遊戲樹、新故事暮晶戰鬥、音效播放品質或全專案安全性。
- 沒有 CSS／JS 修改，因此本角色未執行版本寫入腳本；若產品後續修正，應由整合者序列更新版本並跑對應回歸。

## 交付建議

初審交付時，角色文件可交產品整合，兩項缺陷派回補正；修正及複審見下方追加紀錄。本次工程師角色的建立不等於遊戲全碼通過審查。

## 追加：STORY-SYNC-004 凍結後的窄範圍審查

依產品後續工單指派，唯讀檢查 `story-campaign.js` 的 `nextNode`、進場同步 `route`、`stepText`／`choiceText`、C7／C8 紀錄與回看、儲存失敗文案；`story-campaign-data.js` 的 E1-step04 與 C9-step12 補句；以及 `skin-store.js` 的 V1／V2／本頁連續起源前綴合併。未擴大至故事戰鬥規則或全敘事重寫。

**本次有限範圍未發現已確認的交付阻礙。** 直接後繼優先與未完成起源備援符合交付說明；`begin` 同步路線；動態故事文字與紀錄經 `esc`；回看不再呼叫選擇互動。Skin 的 V1／V2 各自容錯，只有連續前置完成才計入解鎖；讀取與解鎖不自動寫入故事存檔或自動裝備。

實際證據：

- 讀取 [story-completion-audit.md](story-completion-audit.md) 及 `test-results/story-sync-004-reviewed-files.json`；8 份當前檔案 SHA-256 均符合該快照。它是**改後快照**，不證明任務前後只有所述區段改動，也不提供修改者歸屬。
- 實跑 `node tests/skin-store.cjs`：30 個定向儲存案例及 128 個對照真實 campaign 遷移的起源前綴案例通過；使用 VM 假存檔，未寫使用者存檔或共用測試輸出。
- `node --check` 檢查 `story-campaign.js`、`story-campaign-data.js`、`skin-store.js`，均通過。
- 未重跑 28 節點瀏覽器遍歷、視覺、真實出招、實機或跨瀏覽器；故事主責交付中的歷史測試結果不冒稱本次工程師執行。

初審曾回報一項交付清單缺漏：故事報告的「本次修改檔案」未列出 `story-campaign-data.js`、`skin-store.js` 及相關測試。故事主責已補正，工程師再次核對第 47 行已列齊 8 個程式／測試檔與版本引用更新；此文件追溯缺口已解除。

## ENG-REVIEW-001-FIX｜原兩項缺陷複審通過

產品是本補正唯一執行碼寫入者。已讀取 `test-results/change-scopes/ENG-REVIEW-001-FIX-before.json` 與 `ENG-REVIEW-001-FIX-after.json` 的授權及實際差異；這次有修正前原文，可比對補正內容，與前述歷史工單無基線的情況不同。

- **ENG-001-A 通過**：`game.js` 相對 FIX 原文精確只有 `pointerDown` 開頭註解與 `if(dragState)return;` 兩行新增，沒有其他規則修改。工程師以初審相同 Node VM 雙指步驟重現，結果改為只建立 1 個 ghost，取消後剩餘 0、兩張卡無 placeholder／source、`dragState=null`。另已閱讀產品新增的 `tests/drag-multitouch.cjs` 及結果：獨立 Chrome 1440／390px × pointercancel／blur 共 4 案例，所有權、取消清理、下一次手勢及狀態不變均通過。該瀏覽器測試由產品執行，工程師未再跑同一套，也不把注入 PointerEvent 當成實體雙指測試。
- **ENG-001-B 通過**：讀取器先核對 RIFF 邊界、chunk 長度及尺寸欄位需要的 bytes；原兩種缺陷及尺寸 chunk 自身宣告過短共 4 個 fixture 均回 `ERROR`／exit 2。工程師實跑 `python3 -B tests/art-budget.py`，9／9 通過；工具仍只驗證 metadata，不宣稱驗證像素解碼。
- 產品另重跑單指 `tests/drag-surface.cjs`。工程師已核對更新後 `test-results/drag-surface.json`：五寬度 × 九卡共 45 組、四外觀、失焦清理、減少動態及一次真實回合推進通過，errors 為空；這是產品的瀏覽器回歸證據，沒有冒稱工程師重新執行。
- FIX 的 scope 報告仍是 `REVIEW_REQUIRED`：另外偵測到三 HTML、工作板、故事報告與產品在建立的 scope 工具／測試。產品已告知對應同時工單與版本整合；沒有修改 baseline 白名單來消除差異。外部差異的逐項歸屬由產品交付紀錄承接，工具無法指認寫入者。

## ENG-001-C｜P2：新增範圍工具忽略目錄 symlink

追加唯讀審查 `scripts/check-change-scope.py` 與 `tests/change-scope.py` 時，發現 `inventory` 對檔案 symlink 會要求人工審查，但 `os.walk` 不跟隨的目錄 symlink 直接略過。暫存專案建立基線後新增 `new-scripts` 目錄連結，指向內含 `unauthorized.js` 的另一暫存目錄，`check` 卻回 exit 0／`WITHIN_FILE_SCOPE`／`changes=[]`。沒有修改真實專案，也沒有刻意更改 baseline。

建議對未排除的 symlink 目錄回 `ValueError`／exit 2，禁止把無法遍歷的來源默認當乾淨；不需要跟隨連結或擴張成權限／安全監控。初審實跑既有 scope 7／7 測試通過，尚無此案例；已回產品補正。這是本次新工具的具體掃描缺口，不代表任何既有 agent 使用連結越界。

**ENG-001-C 複審通過**：產品在 `scripts/check-change-scope.py:29–32` 對未排除的目錄逐一檢查 symlink，遇到即要求人工審查，不跟隨。工程師使用原先相同的暫存重現，現在回 exit 2 及 `Symlink directory requires manual review: new-scripts`；再實跑 `python3 -B tests/change-scope.py`，8／8 通過，新增案例同時覆蓋 snapshot 前已有連結與 snapshot 後新增連結。此點已解除，不再擴張掃描範圍。

## 最終結論

角色規範與上述三項補正可交產品整合；工程師只修改 `ENGINEER.md` 及本報告。產品仍需保留 scope 的外部差異並逐項對照同時工單，不能把它改成假綠燈。這次有界審查與補正通過，不代表全專案、歷史所有 agent 或完整遊戲樹已通過程式碼審查。
