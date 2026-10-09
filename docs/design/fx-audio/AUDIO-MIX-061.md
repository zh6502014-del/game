# AUDIO-MIX-061｜音效重複與音量平衡

2026-10-06。需求：先修 bug 與音量忽大忽小，重複的音效也消除。依據：專案文件 claude/AUDIO-AUDIT-2026-10-06.md。

## 改動
- story-energy-ui.js：手繪（v2）技能已播自己的撞擊聲，同一招的傷害／護盾事件不再追加 hit／shield（原本晚 0.7–0.8 秒多響一次，晶錐每個目標各一次）。
- story-campaign.js：H2-r71 扣扳機不再重播 r69 已播過的蓄力，改為立即 fxResFire → 280ms fxResImpact。
- game.js：shield、lock 移除外站 URL（原本分別與 hit、cardInvalid 共用同一檔，聽不出差別），改用各自的合成音。
- game.js：新增 ND_MIX 音量修正表與 sfxVolume()；檔案與合成備援各自修正，乘在使用者音量上（設定滑桿照常）。分層目標（EBU R128 最大瞬時響度）：大場面約 −16、技能撞擊 −17.5、普通命中 −20、動作／狀態 −23、介面 −30。外站 OpenGameArt 檔案未量測，不修正。
- game.js：合成音輸出加 soft clipper（−2.5 dBFS 以下完全線性），防止疊音或尖峰削波。
- 素材：fxResFire.mp3、recorder-cut.mp3 降 1.5 dB 重新編碼（原 True Peak +0.7／+0.3）；coinFlip.wav 提高 6 dB（原 −29.7 LUFS）。原檔在 backups/audio-mix-061/。

## 驗收
- 三支 JS 語法通過；version-assets.py 已跑，asset-versions.py PASS 113。
- Chromium OfflineAudioContext 依新程式實際渲染全部 49 個合成音並量測：都落在目標 ±1 dB 內，加上 soft clipper 後峰值 ≤ 0 dBFS。本機音檔按新音量計算，全部落在目標內（例：recorderCut −9.7 → −20.9、coinFlip −30.5 → −21.0、技能撞擊 −13.4 → −17.5）。

## 未驗證
- 沒有實際用耳朵聽、沒有在手機／Safari 上測，也沒做整場戰鬥實機播放。外站檔案（hit、burn、counter、卡牌、victory、BGM）連不到，未量測也未修正。音檔網址沒有版本參數，瀏覽器可能要強制重新整理才會載到新檔。

## 追加（同日）：「燈燈燈」的聲音太搶
使用者反映戰鬥中「燈燈燈」的疊音太大聲。判斷是三個連續音高的鳴響：fxResImpact（共振彈、晶錐命中：0／85／170ms 三個鳴響音）、fxResTick（共振每回合發作）、victory（三音上行）。ND_MIX 調整：fxResImpact 檔案 −4.1 → −9 dB（實際響度約 −22.3）、fxResTick −6.5 → −11 dB（約 −25.5）、victory 合成 +4.5 → 0 dB；合成備援同步。只調音量，沒有改音色。備份：backups/audio-mix-061/game.before-ring-down.js。

## 追加：換回合音效
每次換回合會依序播 turnStart → 80ms 後 energy（暮晶 +1），有時再接 buff／stun，調大後疊成「燈燈燈」。turnStart +14.6 → +3 dB、energy +14.5 → +2 dB，接近原音量。備份：backups/audio-mix-061/game.before-turn-down.js。
