# SHIELD-RHYTHM-077｜T3三十秒撐盾

使用者確認單鍵固定鼓點30秒撐盾。正式30s，預備四拍不算，容許0～3次失誤，第4次失敗。空白鍵/大型觸控按鈕同操作，固定36音符，±150ms；漏拍/錯時機一音符最多扣一次、禁止長按自動連擊；允許練習、重試、取消，無法用亂按通關。單獨小遊戲module不碰戰鬥RNG或存檔；音訊時鐘同步，音訊不可用提供明確無聲視覺模式，靜音/音量遵循既有shield設定。blur/hidden自動暫停、恢復倒數、清理audio/timer/RAF/listener。成功30s後一次onComplete，失敗/取消/practice不推進。

分工單一寫入者：module主責maze_art（切FX/UI）只src/js/story-shield-rhythm.js、src/css/story-shield-rhythm.css、tests/shield-rhythm-077.cjs；integration主責a3_end（GAME-TREE）只story-campaign.js/story-chapters.js/tests/shield-rhythm-integration-077.cjs。產品唯一HTML/素材/工單/workboard寫入，reviewer只review。API window.NDShieldRhythm.open({onComplete,practice=false,trigger=document.activeElement})→dialog或null；成功須玩家確認離開時callback一次，close事件供campaign清busy；config30s/3miss+第四失敗固定。

整合新增T3-shield-rhythm類型rhythm（位於T3-step-02旁白之後，原步驟保留），campaign明確rhythm分支不冒用route；成功接母女救援後文，章完成仍需收錄。T2母女提前分離措辭局部調整，使女孩仍在母親身邊受掩護，T3幾秒改短暫；不改其他章節。圖：單張16:9約1536×864城門撐盾場景、左母女後方/格蘭向右舉盾/右夜域，runtime assets/story/shield-rhythm-077/hold-the-gate.webp ≤600KiB、原稿單份storage/source-art/SHIELD-RHYTHM-077/。夜域/護盾/裂紋以CSS層動態呈現，減少動態停震但保留時間和判定，無閃爍。

基線test-results/change-scopes/SHIELD-RHYTHM-077-before.json。必要驗證完整純引擎邊界/30s時序/失誤3vs4/輸入重複/取消重試暫停恢復，隔離DOM/API與campaigncallback/回看/存檔不提前提交；版本與素材strict、獨立工程審查。瀏覽器政策限制不得繞行server或替代瀏覽器，實際視聽與觸控未驗須說明。僅本地不發布。

追加helper範圍：修改前已保存SHIELD-RHYTHM-077-helper-before.json，integration唯一寫入tests/story-test-helpers.cjs，新增明示rhythm terminal fixture供章節走訪，不是節奏通關證據；原baseline白名單不擴大。

新圖使用內建image_gen單張，原稿1672×941／2,631,920 bytes，runtime1535×864／227,368 bytes（222.0KiB），總新增runtime同值；strict background PASS。原稿/完整prompt/SHA/轉檔紀錄storage/source-art/SHIELD-RHYTHM-077/，WebP quality85 method6。產品已檢視runtime圖，左母女與格蘭、右夜域構圖符合要求，無新其他圖片。

實作驗證：module 11組隔離engine/DOM/WebAudio stub檢查通過，含40拍等距、非拍點暫停恢復、±150ms、3/4失誤、長按/觸控去重、亂按、取消解鎖、重試/練習/靜音；integration真實章節VM與callback gate通過，T2/T3之外不變。新module與CSS已在Story入口載入，119筆JS/CSS版本檢查PASS。證據test-results/SHIELD-RHYTHM-077/module/與integration/。scope唯一例外helper已有追加基線與授權，保留REVIEW_REQUIRED，不擴白名單。

實際修改檔案：新story-shield-rhythm.js/css、campaign/chapter整合、兩份定向測試、helper、Story HTML、新圖及本單/審查/工作板。未驗證瀏覽器真實事件/視聽同步/觸控/手機布局；CSS為媒體條件靜態檢查，不能冒稱實機可玩已驗收。只本地，未發布。

產品接受本地實作及工程複審，獨立module11組/integration7組、119版本及素材strict均PASS，無未解相關P0/P1/P2。真實視聽/觸控/布局待驗，未發布。

## v2（2026-10-08）音樂節奏化 + 打擊感重做

使用者需求：判定線對齊情境圖盾牌；擋下時往右推、失誤往左推；成功自動轉場接劇情；節奏 UI 更精緻；音樂遊戲式體驗＋免授權緊張配樂。

- 配樂：Determined Pursuit（Emma_MA，CC0），160 BPM；來源、轉檔指令、節拍分析見 storage/source-audio/SHIELD-RHYTHM-077/SOURCE.md。runtime assets/audio/story/shield-rhythm-theme.mp3（577,245 bytes）。fetch/decode 失敗（例如 file://）時退回合成戰鼓。
- 譜面：41 顆，全在 160 BPM 格點；前 15 秒每二分音符，15 秒起每小節前加 pickup，28.5 秒終結重擊。判定：完美 ±70ms、擋下 ±150ms；可失誤 3 次（第 4 次破盾）不變。四拍倒數改為二分音符，配樂暫停後會倒回同長度重播接上。
- 版面：音軌與情境圖合為同一框，判定線 x=52% 對齊格蘭盾面，音符（夜域碎晶）由右往左撞向盾；HUD＝母女撤離進度、護盾四格、連擋數。
- 打擊感：擋下＝盾面金光 flash、火花粒子、衝擊環、輕震、畫面右推＋夜域退後、盾擊音（blockShield.mp3）；失誤＝重震、紅暗角、裂痕、畫面左推、低沉碎裂音。判定線與按鈕隨拍點呼吸。
- 成功：「撐住了」橫幅＋夜域退散、城門光增強，2.6 秒後淡黑並自動 onComplete 接回 T3 劇情（空白鍵／繼續故事可跳過）。練習成功不會推進劇情。
- 效能：移除 ::backdrop 的 backdrop-filter（軟體算繪下由 ~15fps 回到 ~55–60fps）。
- 驗證：tests/shield-rhythm-077.cjs 已改寫為 v2 規格並 PASS；Playwright 實測自動通關→自動轉場→onComplete、擋下/失誤特效截圖；version-assets 119 PASS。shield-rhythm-integration-077 的「no unrelated final runtime data changes」失敗為既有問題（比對舊快照，T2/T3 以外章節已在本次之前變動），本次未改劇情檔。
- 未驗證：實機觸控、手機版面、各裝置輸出延遲（已用 AudioContext.outputLatency 補償）。

## v2.1（2026-10-08）長按放開＋手繪貼圖特效

- 譜面改為 31 顆：26 點擊＋5 個一小節長按（4.5–6、10.5–12、18–19.5、24–25.5、27–28.5s；最後一個為終結長按）。長按：頭部按下（±150ms）→ 按住 → 尾端「放」金環 ±180ms 放開（±80ms 且頭部完美＝完美推回）。太早放開、太晚放開、漏按頭部各算一次失誤。暫停時若正在長按，倒回該長音前半小節重打。
- 觸控：按鈕 pointerdown 開始、任意位置 pointerup 放開；鍵盤空白鍵 keydown/keyup。
- 特效改用 fx-060 既有手繪貼圖：判定點＝fx-hero-sigil、點擊音符＝fx-awaken-shard＋fx-smoke-wisps 尾煙、長按本體＝fx-smoke-wisps-2 流動帶、擋下＝fx-gold-shockwave＋fx-sword-arc 盾緣閃光＋fx-gold-motes 粒子、長按中＝fx-hero-backlight 護幕＋持續金粒＋低頻撐持聲、失誤＝fx-shadow-smoke＋fx-awaken-shard 碎片。未新增 runtime 素材。
- 待生新圖（prompt 與參考縮圖）：storage/source-art/SHIELD-RHYTHM-077/v2/prompts-v2.json、reference-sheet.png、ref-sheets/。共 5 張：hold-the-gate-held（成功轉場圖）、fx-night-shard、fx-night-torrent、fx-shield-ward、fx-shield-crack。
- 驗證：module 12 組 PASS（含長按頭／早放／晚放／暫停倒回）；Playwright 自動通關含 5 個長按→成功→自動轉場。

## v2.2（2026-10-08）音效重做

- 新音效組 assets/audio/story/shield-rhythm/（10 檔，共約 233KB）：sr-block-1~3（擋下輪替）、sr-perfect（完美疊加層）、sr-hold-loop（長按 2 秒無縫循環）、sr-release（放開推回）、sr-miss-1~2、sr-break（破盾）、sr-success（撐住了）。
- 全部離線合成（storage/source-audio/SHIELD-RHYTHM-077/gen_shield_sfx.py → post_and_demo.py 修尾、轉 mp3、做示範混音），無授權問題。有音高的成分只用 C/G，對齊配樂調性中心 C（chroma 分析）。
- 程式：輪替不重複＋±1.5% 音高飄移（純表現用 Math.random，不碰戰鬥 RNG）；放開推回 / 失誤時配樂短暫讓位 4–5 dB；長按改用循環檔，淡入 70ms、淡出 90ms；破盾、成功改用設計音效。檔案載入失敗時退回原本合成音。
- 增益（SFX_GAIN）依示範混音量測：80ms 視窗擋下約高於配樂 8–10 dB、長按中約 +3 dB。
- 試聽：storage/source-audio/SHIELD-RHYTHM-077/sfx-preview.html（含實際譜面示範混音）。
- 驗證：module 12 組 PASS；Playwright 確認 11 個 mp3 皆 200 並完整通關。音色品味需使用者實際試聽定稿。

## v2.3（2026-10-08）新美術接入；成功音效還原

- 使用者交付 5 張圖（原稿 storage/source-art/SHIELD-RHYTHM-077/v2/generated/），runtime 於 assets/story/shield-rhythm-077/：hold-the-gate-held.webp 1536×864 283KiB（成功時由原圖交叉淡入）、fx-night-shard.webp 512×246 25KiB（點擊／長按頭）、fx-night-torrent.webp 768×278 66KiB（長按本體，左右邊 180px 交叉混合成無縫循環）、fx-shield-ward.webp 256×512 59KiB（長按護幕，黑底轉亮度＝透明度）、fx-shield-crack.webp 256×512 49KiB（取代 SVG 裂痕）。check-art-budget --strict：5 檔 0.47MiB，0 超標。
- 「撐住了」橫幅移到畫面上方，避免蓋住新成功圖中格蘭的臉。
- 成功音效依使用者要求還原為原本的低沉重擊（合成），不再載入 sr-success.mp3（檔案保留於資料夾未使用）。
- 驗證：module 12 組 PASS、版本 119 PASS；Playwright 截圖確認長按護幕對齊盾面、成功交叉淡入。


## v2.4 – v2.5（2026-10-08）

- **撐住了／護盾破裂 橫幅**：下方副標已移除，只留大字。
- **背景音樂**：撐盾開啟時遊戲 BGM（含合成備援配樂）暫停，關閉後恢復（`window.NDMusicHold`，定義在 game.js；撐盾期間 `switchMusic` 與全域 pointerdown 都不會重啟它）。
- **準備畫面**：打開視窗即淡入配樂（2.4s、0.6 倍音量、循環），按開始／練習時 0.45s 淡出並進入四拍倒數；「撐盾」按鈕在 ready／starting 階段隱藏。
- **file:// 相容**：fetch 被擋時改讀 `assets/audio/story/shield-rhythm-embed.js`（base64 備份，約 1.8 MB，由 `scripts/embed-shield-audio.py` 產生；改音檔後須重跑）。
- **打擊聲 v2.4**：更重的撞擊＋碎晶飛濺；完美＝亮閃火花；新增 `sr-grab`（長按鎖盾聲，按下長音頭時播）；長按持續音加入 4Hz 能量火花；放開更爆。生成腳本 `storage/source-audio/SHIELD-RHYTHM-077/gen_shield_sfx.py`。
- **第二波攻勢（v2.5）**：
  - 流程：第一波（30s）通過後不結算，橫幅「第二波攻勢」3s → 四拍倒數 3s → 第二波 30s；全部通過才進劇情。練習模式只練第一波。失敗只重打第二波（失誤額度重新計算，按鈕「再試第二波／練習第二波」）。
  - 難度：52 顆（47 點擊＋5 長按；含 3 處八分音符連點）對第一波 31 顆；飛行時間 2.1s→1.55s（速度約 +36%）。判定窗口、可失誤 3 次不變。
  - 配樂 `shield-rhythm-theme.mp3` 重剪為約 72s：原曲 0–34.533s 接 12.033–51.033s（1.5s＝一小節等功率交叉淡化，節拍相位保持）。第一波 t=0＝音樂 3.033s；第二波 t=0＝音樂 39.033s（+36s），對應原曲 18.033s 起的全樂團段落；節拍相位已用 onset 相位檢查（兩波皆約 ±4ms）。
  - 程式：`wave()` 工廠產生 WAVE1／WAVE2（notes/times/lead/speed/musicAtZero）；`W` 為目前波次；`conclude()`→`nextWave()`；新階段 `interlude`。`spec.waves`／`spec.waveGap` 供測試。
  - 測試：`tests/shield-rhythm-077.cjs` 15 項 PASS（含第二波譜面、失敗重試、過場暫停續玩）。

## v2.6 兩波無縫銜接＋固定高度（2026-10-08）

- **一條連續譜面**：兩波合併為同一時間軸（第一波 0–30s、第二波 30–66s，`SEGMENTS`）。第一波結束不暫停、不倒數；30s 起是 6 秒二分音符橋段（配樂安靜蓄力段），36s 落拍重擊（`spec.drop`），之後是密集段（八分連點＋5 個長按）。共 92 顆（31＋61）。
- **延續**：連擋數跨波延續；失誤額度在 30s 重新計算（邊界先於判定，第二波第一顆漏掉算第二波）。「第二波攻勢」大字在遊玩中閃過（`.sr-banner.surge`，2.6s）。
- **速度**：每顆音符自帶飛行時間，第二波 1.55s（第一波 2.1s），30s 前就能看到第二波音符飛入。
- **失敗**：第二波失敗只從 30s 檢查點重打（四拍倒數、配樂回捲），按鈕「再試第二波／練習第二波」。
- **配樂**：不變（72s 剪輯）；t 與音樂一一對應：音樂時間＝3.033＋t。
- **固定高度**：撐盾按鈕與動作按鈕共用同一格（`.sr-dock`，以 visibility 切換）；狀態列單行；矮螢幕（≤900px 高）在所有階段都用同一套緊湊版面。實測 1440×900、1100×800、1100×640、390×780 在準備／倒數／遊玩／第二波／失敗各階段高度完全一致。
- 測試：`tests/shield-rhythm-077.cjs` 14 項 PASS。
- v2.6.1：移除「連擋」顯示（引擎仍內部計數）；失誤盾牌圖示改為 3 個（＝可失誤次數），每失誤一次暗一個，三個都暗後再失誤即護盾破裂。
- v2.6.2：移除「先練習／練習第二波／再練一次」按鈕（失敗後只剩「再試一次／再試第二波」）；全站字型統一為思源宋體（Noto Serif TC），見 src/css 各檔的 font 宣告。
- v2.6.3：撐住了／護盾破裂不再換圖或調色（不切 held 圖、不推移夜域、不變灰），畫面維持遊玩時的樣子，只顯示結果大字。
- v2.6.4：長按改為「連打」——按住期間每個 16 分音符（約 10.7 下／秒）敲一下盾（sr-roll-1~3，越撐越響、音高微升），持續低鳴降為 0.3 底層；放開或失誤立即停止已排程的連打。失敗大字改為「失敗了」。
- v2.6.5：移除連打的音高上揚（+6%）與隨機音高漂移；連打音量降低（0.42，漸強 0.7→1.0）；主輸出加安全限幅器（DynamicsCompressor，threshold -8dB, ratio 12），避免連打＋配樂疊加破音。
