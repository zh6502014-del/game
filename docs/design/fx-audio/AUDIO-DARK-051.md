# AUDIO-DARK-051｜沉穩暗黑音效

> **已依使用者要求還原（2026-10-03）**：本次音效不採用，執行碼已完整回復動工前版本。以下為歷史實作紀錄，現行交付以 [AUDIO-RESTORE-051](AUDIO-RESTORE-051.md) 為準。


日期：2026-10-03。需求：優化遊戲音效檔，不要太俏皮。

## 授權與成果

唯一實作：fx_audio；整合、工作板與 HTML 版本：product。允許 fx_audio 寫入 `src/js/game.js` 的 AUDIO_URLS/AUDIO_DEFAULTS 及音訊播放、音量、ND_BGM_FALLBACK/ND_SFX_FALLBACK 區段（不得觸碰 beginReveal/showAssassinCoin 或其他遊戲函式）、`src/js/story-battle-sfx.js`、`scripts/render-dark-audio.cjs`、`assets/audio/dark-051/`、`source-art/AUDIO-DARK-051/`、`test-results/audio-dark-051/` 及本工單交付欄。基線：`test-results/change-scopes/AUDIO-DARK-051-before.json`。

以既有事件 key 替換本機音檔，涵蓋卡牌、命中、護盾、封鎖、反擊、勝敗與故事戰鬥；厚實低中頻、短尾韻、紙張與鈍金屬，去掉方波嗶聲、歡快上行琶音與滑稽彈跳。保留事件辨識度；音樂若會破壞一致性，同步調整成低調氣氛層。原始素材保留。不得變更戰鬥規則、事件時序、AI/RNG、故事、存檔鍵或使用者已有音量。

## 素材與驗收

本機自行合成音訊，不冒稱錄音；保留可重現腳本及每檔時長、格式、bytes、SHA256、来源。優先單聲道 PCM WAV 22050/24000 Hz，短 SFX，總 runtime 目標≤6MiB。不新增外部下載／依賴。音訊不適用圖片尺寸檢查。

fx_audio 唯一執行：檢查每檔完整解碼、非靜音、起訖包絡、峰值餘裕與無削波；在獨立瀏覽器資料驗證實际檔案播放、主路徑/失敗備援、音量/靜音/重設與延遲回呼。測試品質與限制須分列，未實際聽測不可寫已聽測。提供前後試聽樣本給產品／使用者。product 執行版本腳本與 versions test；凍結後工程師真實 diff 審查。

## 狀態

進行中；本工單以外的前期美術修正由產品另案整合，不共寫 game.js/story-battle-sfx.js。

## 實作交付（2026-10-03，已凍結待工程審查）

### 音色與事件對照

- 拿牌／放牌／翻牌：短紙張摩擦、低木質落點；無效操作：低沉阻擋聲，移除雙方波提示。
- 命中／反擊／暴擊／爆炸：低中頻撞擊、短顆粒噪聲與有界尾韻。護盾／封鎖／硬幣：鈍黃銅共振與機械卡榫，保留辨識度。
- 故事技能／能量／變身／冥淵／錄音裝置：共用沉穩材質，去除過亮高頻及滑稽上行提示；原事件 key、呼叫點與時序均保留。
- 勝利：緩慢展開的低音開放五度；失敗：低鐘與下沉尾音。三種 BGM 皆為 24 秒持續氣氛層，無鼓點、無跳躍拍點、無上行大調琶音。
- 全部是原創程序合成，**不是實地錄音**。低音量 UI 不做逐檔等峰值正規化：卡牌峰值約 .096–.226，命中 .449、暴擊／爆炸更高。統一 .72 SFX 渲染增益並保留原預設／使用者已保存音量。

### 修改檔案

- `src/js/game.js`：本機 AUDIO_URLS；音訊音量／播放池／靜音與 BGM 切換；沉穩合成備援。其餘程式以可信基線做逐字區段比較完全相同，含 showAssassinCoin、beginReveal、AI／戰鬥規則與 RNG。
- `src/js/story-battle-sfx.js`：21 個故事專用音效加入本機檔案與同材質備援；主音效的 shield／lock／burn／counter／victory／defeat 在主模組已有完整備援，不再靠故事模組覆蓋。
- `scripts/render-dark-audio.cjs`：本機可重製渲染腳本，使用既有 Playwright／Chrome OfflineAudioContext 與原生 WAV 包裝，無外部音檔／樣本下載。音樂使用週期加法合成。
- `assets/audio/dark-051/`：36 個 WAV 與每檔資訊 manifest。
- `source-art/AUDIO-DARK-051/`：舊音訊映射／備援 recipe 紀錄及生成參數、程式 hash、音檔 hash；現有 `assets/coinFlip.wav`、`assets/audio/story/` 全數保留。
- 本工單、`test-results/audio-dark-051/`：定向測試、前後預覽、基線 diff 與凍結指紋。HTML／工作板／版本腳本由產品整合，fx_audio 未寫入。

### 播放與生命週期補正

- 各 key 的音量與 reset 同時套用檔案、clone pool、活躍合成聲部與氣氛備援。保存鍵仍是 `nightfallAudioVolumesV1`。
- 靜音、隱藏、離開頁面會停播放池、淡化 frame、備援 timer 與已排定 Web Audio 節點。代次檢查排除靜音／換模式前遺留的 play rejection／resume Promise；恢復音訊不會重播舊效果。
- 檔案拒播／未載好／解碼錯誤會用本機合成備援；無 Audio／AudioContext 時安全返回。每類最多三個聲部。
- 快速切換 setup／battle／result 會收掉第三個遺留音軌；檔案恢復後停合成備援。保留 320ms 淡化。
- 測試抓到原 toggleAudio 從首頁／故事畫面誤呼叫 renderSetup 的例外。已在音訊函式內移除重建遊戲頁面，只更新控制；實際決鬥及故事頁靜音前後 DOM／S／非音訊存檔保持相同。

### 尺寸與容量

音訊不適用圖片 strict 工具；以完整 WAV 解碼、音訊量測及本工單 6 MiB 閘門驗收。

| 類型 | 數量 | 格式／時長 | 合計 |
|---|---:|---|---:|
| 短音效 | 33 | WAV PCM16，24000 Hz，單聲道；約 .26–3.1 秒 | 1,367,062 bytes |
| 氣氛 loop | 3 | 同格式，各 24 秒、每檔 1,152,044 bytes | 3,456,132 bytes |
| runtime 合計 | 36 | 不含非 runtime 預覽與 metadata | **4,823,194 bytes（4.60 MiB）** |
| 原始／生成紀錄 | 2 JSON | 原素材保留於原位置，不複製錄音 | 35,117 bytes |

完整每檔 bytes、SHA256、峰值、RMS、起訖值與時長：[manifest](../../storage/unused-assets/audio/dark-051/manifest.json)。最大浮點峰值 .7582、無削波、最小 RMS .00874。WAV 檔有 16-bit 量化；報告同時包含瀏覽器解碼值，不能把原始 float 精度當成 PCM 精度。

### 驗收證據

- [verify.cjs](../../test-results/audio-dark-051/verify.cjs)／[verification.json](../../test-results/audio-dark-051/verification.json)：**12 組通過**。36 檔全部完整 decode 與實際 HTMLAudio playing／時間前進；原有音量、pool／合成／音樂音量及 reset；檔案遺失／載入中／拒播；靜音清理與延遲回呼；快速模式變化與檔案恢復；零音量／三聲部上限；pagehide／pageshow／visibility；缺少 Audio API；晚載入故事設定；實際決鬥／故事頁操作；非音訊程式與存檔不變。
- [freeze.json](../../test-results/audio-dark-051/freeze.json)：所有 36 WAV 實際檔案 hash 已核對 manifest，另含程式、腳本、來源、预覽與 manifest 指紋。
- [implementation.diff](../../test-results/audio-dark-051/implementation.diff)：基線至凍結的真實兩檔差異。
- [reproducibility.json](../../test-results/audio-dark-051/reproducibility.json)：同參數重製後 34／36 SHA 完全相同；victory／explode 的 OfflineAudioContext 浮點差異導致 hash 改變，峰值差 ≤ 5.97e-8、RMS 差 < 9e-11。**不宣稱 bit-exact 重製**；最終音檔重新跑完 12 組驗證。
- [after-preview.wav](../../test-results/audio-dark-051/after-preview.wav)：11.75 秒卡牌→命中→護盾→槍擊→技能→勝利→失敗片段。[before-fallback-preview.wav](../../test-results/audio-dark-051/before-fallback-preview.wav) 僅為舊合成備援，並非舊遠端音檔錄音。
- 最初兩次 harness 問題（decodeAudioData 移交 buffer 後 byteLength=0、在 audio quantum 生效前讀 gain）已修正；原始失敗紀錄保留。第三次抓到的 toggleAudio 首頁例外已修正後複驗。

### 未驗證／依賴

未做主觀耳聽驗收、手機／Safari 或實體喇叭音色比較；技術證據僅確認解碼、實際播放進度、包絡／電平與生命週期。未宣稱全戰鬥狀態覆蓋。仍需產品整合 HTML 版本、資源版本檢查、工程師審查及產品驗收；不自動重新載入使用者對局。

## 工程補正 AUDIO-DARK-051-FIX（product 唯一寫入，2026-10-03）

獨立工程審查以真實 404 找出 P2：HTMLAudio 失敗時仍可能 paused=false，700ms guard 誤判已播放而關掉備援。補正前另存 `test-results/change-scopes/AUDIO-DARK-051-FIX-before.json`；僅改 `src/js/game.js` 音訊區。成功判定同時要求無媒體錯誤、readyState≥3、非暫停／結束；現在以當代播放者的 playing/error/waiting/stalled 事件收斂備援，切換或靜音即移除舊監聽。音檔與合成 recipe 不變，不重製素材。

`media-failure.cjs`／`media-failure.json` 實跑 4 組通過：真實404與損毀檔（error=4、networkState=3、paused=false）在700ms後及再次要求播放後仍有6個備援節點；2200ms延遲載入同樣保留備援，檔案 playing 後歸零；載入中靜音清除監聽、timer和節點，沒有過期聲音，呈現未消耗 Math.random。原12組 `verify.cjs` 亦以補正後程式重跑全部通過，舊報告保留 `verification-pre-fix.json`。`freeze.json` 已更新最終程式與證據指紋，前版仍存 `freeze-pre-fix.json`；原稿生成紀錄的舊程式hash是生成當時來源，非聲稱由修補後程式重製。

最終版本整合更新 index.html、Nightfall-Duel-Story.html、Nightfall-Duel-V12.12.39-Test.html 的本機版本值；`tests/asset-versions.py` 通過104筆。最终完整差異為 `implementation-final.diff`。本補正也須由獨立工程师複審，見 engineering-review.md。
