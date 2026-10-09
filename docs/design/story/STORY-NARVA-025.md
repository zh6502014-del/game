# STORY-NARVA-025｜納爾瓦祭司造型

## 2026-10-01 補正工單 STORY-NARVA-025-FIX

使用者指出P1抱起嬰兒情境照仍是舊造型。產品唯一實作者，重新處理phosphor-found，並同步同段落仍未完成的p1-stage-3。允許story-art.js兩個scene path、story-chapter-art.js的P1 path、narva-025/manifest.json交付狀態與新增record、此工單/工作板本列；HTML只限版本脚本同步。原稿保留在source-art/STORY-NARVA-025-FIX，新runtime assets/story/narva-025/{phosphor-found,p1-stage-3}.webp；兩張生成目標1536×864，各≤600KiB，總≤1,228,800 bytes。章節封面共用phosphor-found，不多生成。動工基線STORY-NARVA-025-FIX-before.json已保存；不改任何遊戲或台詞/時序規則。驗收為當前P1第4段真UI、local存檔不變、素材strict/映射版本及工程唯讀審查；未有成功素材時不切換path。狀態：**本次兩張補正完成，工程及產品驗收通過**。

本次採內建imagegen重繪：直接編輯原災區圖仍遭output moderation阻擋，改以已確認角色稿繪製平靜月夜石巷的抱嬰與携離場景成功。身份、祭司服飾和核心動作一致；背景/嬰兒/構圖為新繪，不宣稱原災區火光或原圖像素不變。完整提示詞、拒絕紀錄及衍生設定見 [補正來源紀錄](../../storage/source-art/STORY-NARVA-025-FIX/metadata.json)、同目錄的requests/repaint-request/walking-request JSON。

| 新runtime | 尺寸 | bytes |
| --- | --- | --- |
| phosphor-found.webp | 1535×864 | 241,878 |
| p1-stage-3.webp | 1535×864 | 289,344 |

新增runtime共531,222 bytes；兩份1672×941 PNG原稿共5,404,994 bytes。runtime/source strict均通過；主manifest累計24張runtime 5,583,698 bytes，全部舊素材和上次生成失敗紀錄保留。

本次實際修改story-art.js兩處path、story-chapter-art.js一處P1 path、主manifest、上述兩WebP、兩個HTML入口的版本值、此工單與工作板。驗收：[442-step比較](../../test-results/narva-art-025-fix/mapping-report.json)僅P1-step04～08五段換圖；[獨立Chrome報告](../../test-results/narva-art-025-fix/browser-report.json)真按鈕進入P1第4段，2048×995/390×844截圖、新圖完整解碼、save不變、前後依賴hash相等；圖鑑驗證為兩個scene映射及decode，未操作完整圖鑑介面。98個資源版本引用通過。[工程審查](../../test-results/narva-art-025-fix/engineer-review.md)無本次相關P0/P1/P2，產品接受此補正。

本次新基線之後另外出現game.js、story-energy-ui.js/css差異，未由本工單寫入且來源未確認；保留不動，不納入本次通過結論。此限制與既有橫向裁切、實體裝置/Safari、完整遊戲回歸仍未驗證；不因兩張改稿完成宣稱全專案整合通過。下方2026-09-30交付為歷史記錄，兩張受阻狀態已由本節補正解決。

使用者要求：納爾瓦與朔太像；納爾瓦是祭司，不採亞洲人外貌。產品主責實作與整合；美術支援唯讀盤點，凍結後工程師獨立審查。

## 範圍與基線

- 三版立繪（青年、成年、受傷）統一為歐洲外貌、短捲赤褐髮、象牙白直襟祭袍、墨綠古金鐘紋披肩。成年增鬍鬚與鬢白；受傷保留清醒扶肋狀態。朔及其他角色不變。
- 授權呈現映射：`src/js/story-stage-assets.js` 的 father/father-young 路徑及已確認插畫路徑，`src/js/story-chapter-art.js` 的相關章節/受傷立繪 path，`src/js/story-art.js` 的相關 scene path；不改 IDs、台詞、揭露時間、故事/戰鬥/存檔邏輯。
- `source-art/STORY-NARVA-025/` 保存單份原稿與完整提示詞；`assets/story/actors/narva-025/` 保存三張透明 runtime；插畫範圍待唯讀盤點後定案，不為縮圖重生。
- 角色生成目標 1024×1536；runtime 768×1152、每張 ≤450 KiB，3 張上限 1,382,400 bytes。舞台人物最高約850 CSS px，保持既有直式比例與 alpha。
- 如需同步插畫，生成約1536×864，runtime 長邊≤1536、短邊≤864、每張≤600KiB；追加數量與總量在動工前記錄。
- 程式動工前基線：`test-results/change-scopes/STORY-NARVA-025-before.json`。HTML 僅資源版本整合，實際入口依版本腳本檢查；若基線未列實際入口則補保存基線。
- 工作板本列、此工單、`assets/story/illustrations/swordsman-stills/manifest.json` 為產品單一寫入。原素材保留。

## 驗收

產品：逐張人物身份、服裝、alpha與縮放品質；strict 素材預算；主舞台青年/成年/受傷三種獨立測試畫面與映射可達性；版本同步及檢查。工程师：真實 diff、角色/章節映射、範圍核對，唯讀獨立驗證。不重載使用者對局、不寫入真實存檔。

## 盤點後插畫範圍（生成前核定）

`test-results/narva-art-025/inventory.json` 的 replacements 是精確清單：3 立繪、21 獨立敘事構圖，7 章節封面別名共用新版插畫，不額外生成。18 張敘事圖目前可由圖鑑/舞台使用，另3張 D3/D6/D7 為現有 catalog 保留圖，一併同步外觀。21張×600KiB 上限12,902,400 bytes，含立繪總 runtime上限14,284,800 bytes。全部新插畫存 `assets/story/narva-025/<id>.webp`；不改舊圖。

範圍已排除僅含朔/行政長老的 s2-stage-1、s2-stage-3、swordsman-return；F4白衣者為操作員，無須替换。

追加唯一一筆直接引用：`src/js/story-campaign.js` 的 `encounters.S3.enemies[0].portrait` 共用 swordsman-master 插畫，切至同一新版。產品單一寫入，只換此 path，不改遭遇規則；基線 `STORY-NARVA-025-campaign-before.json` 已另存。

## 本輪交付（2026-09-30）

狀態：22張新版已接入；本工單素材與產品寫入已凍結，外部程序仍持續修改共享故事檔，不能宣稱目前整體工作目錄凍結。2張插畫受生成服務阻擋，整套一致性仍為部分完成。工程最終審查見下列證據。

工程最終結論：22张素材與納爾瓦path替換可交付，無本次相關P0/P1/P2；最新程式86個換圖step及5個保留舊圖step對可信基線相等（只容許核定path替換）。產品接受此22張範圍，保留以下未完成項目；工單不標全完成。

- 三版立繪：`assets/story/actors/narva-025/{father-young,father,father-wounded}.webp`，每張768×1152，共783,926 bytes。青年短赤褐捲髮、成年鬢白短鬍鬚，象牙白直襟祭袍、墨綠古金鐘紋服飾保持同一身份。
- 十九張插畫：`assets/story/narva-025/` 下19張WebP，每張1535×864，共4,268,550 bytes；6個章節封面別名直接重用，不複製圖。完整逐檔尺寸/bytes/雜湊/提示詞/參考圖/轉檔參數收於 [manifest](../../assets/story/illustrations/swordsman-stills/manifest.json)。採內建 imagegen，沒有CLI/API回退。
- runtime總量：22檔 **5,052,476 bytes（4.82MiB）**，均未超單檔與總預算。23份保留來源PNG共59,061,113 bytes（56.33MiB）；包含成年首稿作其他圖身份參考、以及補齊手部邊界的正式立繪稿，各只保存單份。
- 原稿、舊runtime與歷史生成manifest全保留；生成式修改只承諾視覺保留敘事/其他角色，不宣稱未改區逐像素相同。D7首次產出遭服務阻擋，後以乾淨包紮、無血跡康復呈現完成，未改受傷與照護情節。
- 實際程式：`src/js/story-art.js` 14個scene path、`src/js/story-chapter-art.js` 10個path、`src/js/story-stage-assets.js` 青年/成年與D2/F1路徑、`src/js/story-campaign.js` 1個S3 portrait。兩個HTML入口只同步內容版本。無戰鬥規則、數值、RNG、台詞、揭露時點或存檔修改。

### 驗收證據

- `python3 scripts/check-art-budget.py --strict assets/story/actors/narva-025/ assets/story/narva-025/`：22檔通過。來源source strict：23檔通過。完整解碼、真實alpha與SHA核對亦通過；立繪透明像素29.6%～35.9%、實體像素62.6%～68.5%。
- [映射驗證](../../test-results/narva-art-025/mapping-report.json)：可信動工前程式對目前486個step逐項比對，僅允許核定path替換，86個step換圖；包含保留的兩張舊圖，並未略過其step。4個外部C9變更另列未驗證。
- [瀏覽器報告](../../test-results/narva-art-025/browser-report.json)：獨立Chrome/測試存檔，S1、P1、D7真實閱讀控制載入三版；1440×900、390×844、844×390共9截圖；無水平溢出、無載入失敗提示、存檔快照不變；22新runtime於遊戲origin解碼成功。首次舊存檔fixture失敗與清單尚未完成的中間失敗報告均保留，不算通過證據。
- [青年聯絡表](../../test-results/narva-art-025/young-contact.jpg)、[成年聯絡表](../../test-results/narva-art-025/adult-contact.jpg)，續章5圖另逐張檢視。產品已確認新版能區分朔、人物身份和祭司服飾一致。
- `scripts/version-assets.py` 與 `tests/asset-versions.py`：98個本機JS/CSS引用通過。
- [工程審查](../../test-results/narva-art-025/engineer-review.md)，[scope diff](../../test-results/change-scopes/STORY-NARVA-025-after.json)。不是全遊戲回歸或全狀態互動通過宣稱。

### 未完成與限制

1. **phosphor-found、p1-stage-3** 兩張抱嬰兒畫面，各經一次澄清重試仍被內建圖片服務output safety拒絕（category other），無可交付輸出。保留原scene path及P1章節封面；生成失敗與完整提示詞見young-scenes/manifest.json。角色立繪已更新，但這兩張插畫仍是舊造型；不得把工單標全部完成。
2. **既有手機橫向裁切**：844×390時active人物420px最小高度×1.07導致頭頂裁切，工程師以相同場景切回舊圖獨立確認同樣發生；本輪不修改共用舞台CSS。[對照證據](../../test-results/narva-art-025/engineer-crop-report.json)。載入/解碼通過不等於此版面缺陷已修復。
3. **外部並行改動**：動工期間其他程序新增C9冥淵scene及4個step切換，並修改story-energy-ui.js/css、_audit7.js、_audit8.js、_dump_steps.js。已詢問使用者來源，仍待確認。最後審查時又新增bossHall、H1切換及A1/A2/E3/C3/C4/A3插畫切換與scene，改變story-stage-assets.js和story-art.js雜湊；上列486-step/browser/98-version結果只描述報告中記錄的版本，**不宣稱目前共享工作目錄整合通過**。工程師另核對當前490step無throw/缺檔，及本工單受影響範圍，見工程報告。保持所有外部內容原樣；scope的REVIEW_REQUIRED不被改寫成全案通過。story-campaign.js已另存追加基線，產品的差異只有一處path。整體並行整合仍未驗收。
4. 未測實體手機/Safari、完整故事流程與戰鬥；本輪沒有發佈或重載使用者對局。
