# STORY-DIALOGUE-010｜聲源與小任務敘事交接

2026-09-24。劇情 agent 唯讀盤點；本文件是呈現層實作的內容建議，尚未修改遊戲。唯一寫入檔案為本文件。

## 盤點範圍與結論

以目前 28 節點、267 個穩定 step ID 逐步解析 `NDStageAssets.resolve`。91 步具 speaker，共 15 個原始稱謂；另外 176 步沒有 speaker，不應一律偽裝成角色說話。尚未執行瀏覽器或端到端測試。

| 類型 | 步數 | 呈現身份 |
| --- | ---: | --- |
| `narration` | 94 | 旁白，不指定角色發言 |
| `dialogue` | 91 | 保留說話者姓名／原始稱謂，另標聲源 |
| `inspect` | 12 | 調查提示；物件內容不冒充現場台詞 |
| `action` | 29 | 行動提示；動作名稱不代表已執行 |
| `complete` | 28 | 記憶收錄／進度提示 |
| `battle` | 4 | 戰鬥目標 |
| `puzzle` | 4 | 當前操作目標 |
| `search` | 4 | 尋物目標 |
| `choice` | 1 | 共同抉擇；意圖保持 help/direct |

## 姓名、聲源與素材映射

`actor ID` 指既有 `NDStageAssets.actors`；先使用當步 resolve 的 actor 版本，不能把青年、受傷或持槍版本一律替成預設圖。沒有立繪時使用文字聲源；不要為辨識說話者加不相干人物。角色原畫是否出現在對話徽記由 UI 定版，不能因此把人物添進場景。

| 原始 speaker | 步數 | 可用 actor ID / 來源 | 呈現約束 |
| --- | ---: | --- | --- |
| 尺烏首腦 | 2 | 無 | A1-step-02/03 畫外音，不亮起凜 |
| 赫爾曼 | 5 | `herman` | A1、E1、E2 已有台詞；E2-step-05 死訊後不能重新出場 |
| 凜 | 11 | `rin` / `rin-wounded` | A1 未受傷；A2 事故後與其餘章節採受傷版本。玩家已知真名，其他角色仍稱「尺烏的人」 |
| 朔 | 8 | `shuo-young` / `shuo` | S1–S3 青年；B2/C7 成年；不添加師父素材 |
| 鳴者 | 9 | `father-young` | S1–S3/P1 保留「鳴者」，不提前標「磷的父親」 |
| 師父 | 1 | 無 | S3-step-03 畫外音；不得拿朔或鳴者立繪冒充 |
| 居民 | 1 | 無 | T1-step-02 畫外音；不擅取姓名或身分 |
| 渡垣隊員 | 1 | 無 | T1-step-05 插畫內聲源，保留職務稱謂 |
| 格蘭 | 9 | `gran-young` / `gran` | T1–T3 青年；B1/B2/C6/C7 成年 |
| 母親 | 1 | 無 | T3-step-03 撤離場景中的母親；不能用磷或磷母親的假定身分 |
| 暮晶中的聲音 | 1 | 無 | E1-step-02 標「殘響」；未知女孩不可配磷肖像、姓名 |
| 伊芙 | 18 | `eve` / `eve-armed` | 依當步 cast；E3 已組裝後、C5–C7 才用持槍版本，不提前拿槍 |
| 父親 | 5 | `father` | P2–P4 現場對話；保留原稱謂，不另取未公開姓名 |
| 磷 | 14 | `phosphor` | 只對應已長大的磷；P1 嬰兒插畫不可用成年立繪替代 |
| 父親的錄音 | 5 | 無現場 actor | C9-step-05～09 明示「錄音」，不能添 father 到房內 |

### 特殊聲源與心聲

- 現場圖中沒有說話者立繪：A1-step-02/03、S3-step-03、T1-step-02。可以顯示「畫外音」，不應高亮另一個人。
- 錄音：C9-step-05～09，身份應讀作「父親，錄音」。五步均使用紀錄器插畫；留在原圖，不能暗示父親在場或仍存活。
- 殘響：E1-step-02，讀作「暮晶中的聲音，殘響」；不能將聲音辨識成磷、磷的母親或 T3 母親。
- 心聲候選，尚非源資料明確型別：B3-step-05「那個標記……」發生在凜藏身觀察時，產品可指定為「凜｜心聲」。不採詮釋性特例時維持「凜」即可。A2-step-07 不能僅因獨處便認定心聲，也不能當成他人的記憶錄音。
- 插畫中的說話：下表 kind=illustration 的步驟，明示姓名即可；不必把關鍵情節插畫換成雙人場景。「沒有獨立立繪」不等於人物不在場。
- 94 步旁白不指定說話者，避免把兩位角色亮成正在發言；調查／行動／抉擇等另外 82 步使用任務語義標籤。

## 四個既有拼圖：情境目標與每件就位回饋

四拼圖仍是 16 件形狀配對，允許任意放入順序。以下文案只說明局部動作，不新增零件依賴、限時、錯誤懲罰、節點、flag 或配對規則。進度前綴保留「已放入 X / N」，避免混淆局部動作與整段完成。

| 拼圖／節點 | 短目標 | 完整目標 |
| --- | --- | --- |
| `evac` / T1 | 確認撤離備用路線 | 整理已勘查的街口、通道、高地與接應處，確認原集合點失效時可辨認的備用路線。 |
| `gun` / E3 | 組裝臨時暮晶銃 | 將五件零件接回設計中的位置；全數確認後，伊芙才限制輸出並蓄能。 |
| `archive` / C8 | 比對舊圖與資料 | 把已取得的地圖碎片放回對應位置，供伊芙核對舊地名、採掘編號與移夜日期。 |
| `recorder` / C9 | 接通父親留下的紀錄器 | 將隨身配件接入供能、讀取與輸出位置；全數接妥後，再聽裝置留下的內容。 |

| part ID | 放入成功時的一句具體回饋 |
| --- | --- |
| `evac-0` 街口 | 街口位置已標明，還要和通道、接應處一起核對。 |
| `evac-1` 通道 | 通道圖塊已補回，這是隊伍轉往高地時要辨認的路段。 |
| `evac-2` 高地 | 高地位置已標明，留作原集合點失效時的備用方向。 |
| `evac-3` 接應處 | 接應處已圈出，出發前仍要把整條路線核對完整。 |
| `gun-0` 機匣 | 機匣已放回設計位置，其餘零件將以它為接合基準。 |
| `gun-1` 銃管 | 銃管已對準接合位置，還要核對其餘零件。 |
| `gun-2` 握柄 | 握柄已固定在握持處，讓改裝後的裝置能被穩定握住。 |
| `gun-3` 暮晶核心 | 暮晶核心已放入預定位置，完成組裝後才限制輸出並蓄能。 |
| `gun-4` 保險片 | 保險片已接入共振路徑，過載時將碎裂並切斷回流。 |
| `archive-0` 舊街區 | 舊街區標記已放回，先用它核對文件裡的舊地名。 |
| `archive-1` 河道記錄 | 河道紀錄已對齊，能與舊圖上的地形一起比對。 |
| `archive-2` 災區地形 | 災區地形已補回，可供比對殘響與紀錄中的位置。 |
| `archive-3` 採掘標記 | 採掘標記已歸位，還要核對編號與移夜日期。 |
| `recorder-0` 供能接頭 | 供能接頭已接入對應插槽，還要確認其餘連接。 |
| `recorder-1` 讀取模組 | 讀取模組已固定，準備讀取裝置裡既有的紀錄。 |
| `recorder-2` 輸出接頭 | 輸出接頭已接妥，全部連接完成後才能聽到聲音。 |

完成內容維持現行來源：T1 不預知夜域或保證安全；E3 保險片不能保證無限射擊；C8 不恢復刪除資料、不確認磷身世；C9 只是接線，不修復錄音、不確認父親生死。「拼合完成」可依情境換成「路線核對完成／組裝完成／資料整理完成／接線完成」，但不能誤稱章節已保存。

### T2/T3 候選缺口，非本文件新增實作

T2 的「折返母女身邊 → 把女孩交給隊友 → 扶母親走向出口」、T3 的「插下救援盾 → 循聲引導母親 → 放開盾，抓住接應」皆為單一按鈕推進，缺少對人物／道具位置的操作及階段回饋。後續可在同一 step 內把目標綁到既有畫面中的母女、接應手、盾與出口，保留現行順序；需產品另派 UI／互動工程工單。不能擅自新增節點、可擊殺夜域、永久防護或 QTE 限時失敗。

## 交付與驗證界線

- 實際改動只有本文件；程式、素材、工作板與存檔未修改。
- 讀碼驗證：Node 載入目前 data／stage／art／search 資料，枚舉全 267 步並解析，確認 91 步有 speaker、15 種稱謂。人工閱讀全對話及四拼圖完成文案。
- 未驗證瀏覽器呈現、字幕高度、200% 文字、實際拖曳、聲源的輔助朗讀；由產品／UI 實作後測試。
- 依賴 UI 將聲源標籤與角色高亮分開；拼圖文字由指定的唯一 runtime 寫入者整合。
- 參考 [RESEARCH-008 對話進程研究](../research/benchmark-narrative-progression.md) 的角色知識、意圖與後果原則。本文件未量測 Detroit 介面尺寸或操作時間，未據此增添倒數。

## 91 個有名聲源的實際解析紀錄

以下為實作前讀碼快照。`—` 表示沒有可獨立高亮的 actor；插畫可能繪有說話者，不能一律判作畫外音。其餘 176 步沒有 speaker，類型已在上表完整計數。

| Step ID | speaker | 場景 kind | 可見 actor ID | active actor ID |
| --- | --- | --- | --- | --- |
| `A1-step-02` | 尺烏首腦 | layered | rin | - |
| `A1-step-03` | 尺烏首腦 | layered | rin | - |
| `A1-step-07` | 赫爾曼 | layered | rin, herman | herman |
| `A1-step-08` | 赫爾曼 | layered | rin, herman | herman |
| `A2-step-07` | 凜 | illustration | - | - |
| `S1-step-02` | 朔 | layered | shuo-young, father-young | shuo-young |
| `S1-step-04` | 鳴者 | illustration | - | - |
| `S1-step-05` | 朔 | illustration | - | - |
| `S1-step-07` | 鳴者 | layered | shuo-young, father-young | father-young |
| `S1-step-08` | 朔 | layered | shuo-young, father-young | shuo-young |
| `S1-step-09` | 鳴者 | layered | shuo-young, father-young | father-young |
| `S2-step-04` | 鳴者 | illustration | - | - |
| `S2-step-06` | 鳴者 | layered | father-young, shuo-young | father-young |
| `S3-step-01` | 鳴者 | layered | shuo-young, father-young | father-young |
| `S3-step-03` | 師父 | layered | shuo-young, father-young | - |
| `S3-step-04` | 朔 | layered | shuo-young, father-young | shuo-young |
| `T1-step-02` | 居民 | layered | gran-young | - |
| `T1-step-05` | 渡垣隊員 | illustration | - | - |
| `T2-step-03` | 格蘭 | illustration | - | - |
| `T2-step-07` | 格蘭 | layered | gran-young | gran-young |
| `T3-step-03` | 母親 | illustration | - | - |
| `T3-step-04` | 格蘭 | illustration | - | - |
| `E1-step-02` | 暮晶中的聲音 | illustration | - | - |
| `E1-step-03` | 伊芙 | illustration | - | - |
| `E1-step-05` | 赫爾曼 | illustration | - | - |
| `E1-step-06` | 伊芙 | illustration | - | - |
| `E1-step-08` | 伊芙 | layered | eve, herman | eve |
| `E2-step-02` | 赫爾曼 | layered | eve, herman | herman |
| `E2-step-03` | 伊芙 | layered | eve, herman | eve |
| `E2-step-04` | 赫爾曼 | layered | eve, herman | herman |
| `E3-step-02` | 伊芙 | layered | eve | eve |
| `P1-step-02` | 鳴者 | layered | father-young | father-young |
| `P1-step-05` | 鳴者 | illustration | - | - |
| `P1-step-07` | 鳴者 | illustration | - | - |
| `P2-step-02` | 父親 | layered | father, phosphor | father |
| `P2-step-04` | 磷 | illustration | - | - |
| `P2-step-06` | 磷 | layered | father, phosphor | phosphor |
| `P3-step-05` | 父親 | layered | father, phosphor | father |
| `P4-step-02` | 磷 | layered | father, phosphor | phosphor |
| `P4-step-03` | 父親 | layered | father, phosphor | father |
| `P4-step-04` | 磷 | layered | father, phosphor | phosphor |
| `P4-step-05` | 父親 | layered | father, phosphor | father |
| `P4-step-08` | 父親 | illustration | - | - |
| `P4-step-11` | 磷 | layered | phosphor | phosphor |
| `B1-step-05` | 格蘭 | illustration | - | - |
| `B1-step-07` | 格蘭 | layered | gran, phosphor | gran |
| `B2-step-02` | 格蘭 | layered | gran, phosphor | gran |
| `B2-step-04` | 朔 | illustration | - | - |
| `B2-step-05` | 磷 | illustration | - | - |
| `B2-step-06` | 朔 | illustration | - | - |
| `B2-step-07` | 磷 | illustration | - | - |
| `B2-step-09` | 朔 | layered | shuo, phosphor | shuo |
| `B3-step-05` | 凜 | layered | rin-wounded | rin-wounded |
| `C1-step-02` | 伊芙 | layered | eve, phosphor | eve |
| `C1-step-05` | 伊芙 | layered | eve, phosphor | eve |
| `C2-step-02` | 磷 | layered | eve, phosphor | phosphor |
| `C2-step-05` | 伊芙 | layered | eve, phosphor | eve |
| `C2-step-06` | 伊芙 | layered | eve, phosphor | eve |
| `C2-step-07` | 磷 | layered | eve, phosphor | phosphor |
| `C3-step-06` | 磷 | layered | rin-wounded, phosphor | phosphor |
| `C3-step-07` | 凜 | layered | rin-wounded, phosphor | rin-wounded |
| `C3-step-08` | 磷 | layered | rin-wounded, phosphor | phosphor |
| `C4-step-04` | 凜 | layered | rin-wounded, phosphor | rin-wounded |
| `C5-step-01` | 伊芙 | layered | eve-armed, rin-wounded | eve-armed |
| `C5-step-03` | 伊芙 | layered | eve-armed, rin-wounded | eve-armed |
| `C5-step-04` | 凜 | layered | eve-armed, rin-wounded | rin-wounded |
| `C5-step-06` | 伊芙 | illustration | - | - |
| `C5-step-07` | 凜 | illustration | - | - |
| `C5-step-08` | 凜 | illustration | - | - |
| `C5-step-09` | 伊芙 | illustration | - | - |
| `C5-step-10` | 凜 | illustration | - | - |
| `C5-step-12` | 凜 | illustration | - | - |
| `C6-step-01` | 磷 | illustration | - | - |
| `C6-step-03` | 格蘭 | illustration | - | - |
| `C6-step-06` | 伊芙 | layered | eve-armed, rin-wounded | eve-armed |
| `C6-step-07` | 伊芙 | layered | eve-armed, rin-wounded | eve-armed |
| `C6-step-08` | 凜 | layered | eve-armed, rin-wounded | rin-wounded |
| `C7-step-02` | 格蘭 | layered | gran, phosphor | gran |
| `C7-step-03` | 凜 | layered | gran, rin-wounded | rin-wounded |
| `C7-step-04` | 磷 | layered | gran, phosphor | phosphor |
| `C7-step-05` | 朔 | layered | gran, shuo | shuo |
| `C7-step-06` | 伊芙 | layered | gran, eve-armed | eve-armed |
| `C7-step-09` | 格蘭 | layered | gran, phosphor | gran |
| `C7-step-10` | 伊芙 | layered | gran, eve-armed | eve-armed |
| `C8-step-04` | 伊芙 | illustration | - | - |
| `C8-step-05` | 磷 | layered | phosphor, eve | phosphor |
| `C9-step-05` | 父親的錄音 | illustration | - | - |
| `C9-step-06` | 父親的錄音 | illustration | - | - |
| `C9-step-07` | 父親的錄音 | illustration | - | - |
| `C9-step-08` | 父親的錄音 | illustration | - | - |
| `C9-step-09` | 父親的錄音 | illustration | - | - |

### Read-only audit inputs (SHA-256)

| File | SHA-256 |
| --- | --- |
| `story-campaign-data.js` | `53d0074c5df52a432346a8ec1f2a39f30b83ed6843bcb193cf74d6c7f5cfec15` |
| `story-stage-assets.js` | `24c82a9d09d94d987be35044f2955c3f491ac53323613d085a3fb9bf50f8af57` |
| `story-puzzles.js` | `2090f22f4f59985a7016b507036e324a26c82f7f1fc1cf1c3c2da45473c930d1` |
| `story-art.js` | `fc305a32961565dc0e6681a5a178608d95fd37d5b344096a088d90b8107f21e8` |
| `story-search-assets.js` | `c4b76cd4ef92a1a402c60334e40f50609acee5c646e3228d2e47a2b06efc936b` |
