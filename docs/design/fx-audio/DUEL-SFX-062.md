# DUEL-SFX-062｜卡牌對戰音效（打擊感、護盾、輔助技能）＋ HERO-DROP-FX 立繪拖放特效美術

2026-10-06。需求：自由卡牌對戰的打擊感不夠、護盾與輔助技能音效要改善；素材由 Claude 合成。立繪拖放特效換成使用者生成的美術。

## 主要問題
原本命中、反擊、護盾、灼傷、封鎖的音效都在「規則結算」當下播放（damageDirect／applyCard），比畫面上的命中動畫早 0.2–1 秒，刺客回合甚至在擲硬幣之前就響；所有攻擊都共用同一個 hit，多數環境下外站檔案載不到，實際播的是合成備援。

## 改動
- 新音效 22 個：`assets/audio/duel/*.mp3`（scripts/gen_duel_sfx.py 程式合成，scripts/master_duel_sfx.py 母帶：EBU R128 最大瞬時響度對齊分層目標、True Peak ≤ −1.8 dBTP，合計約 190 KiB）。量測結果：assets/audio/duel/loudness-report.json。
- 播放時機改到畫面時間軸：combat-fx.js 在武器出手時播揮擊聲（劍／盾擊／刺客突進／槍響／劍氣）、命中時依職業播撞擊聲（爆擊、反擊、護盾吸收、閃避、灼傷、領域轉回血各自不同）；出防禦牌時播立盾聲。environment.js 在打出職業卡、劍氣出竅、領域展開時播施放聲，進入夜晚時播入夜聲（減少動態時仍有聲音）。坦克護盾在打出當下播 shieldUp。
- game.js：移除規則程式裡的 hit／counter／burn／lock／shield 播放；新增 ndDuelSfx()（同一音效 70ms 內重複會錯開，避免雙方同時命中疊成一聲爆音）；22 個音效跟隨既有滑桿（攻擊與命中／護盾與防禦／反擊／灼傷／封鎖與夜襲），檔案載不到時改播該組的合成備援。
- 立繪拖放特效（HERO-DROP-FX）：使用者生成的背光與守護紋環（source-art/HERO-DROP-FX/generated/）轉成透明 WebP（黑→alpha）放在 assets/story/fx-060/fx-hero-backlight.webp、fx-hero-sigil.webp；拖曳時背光呼吸、紋環旋轉、金色光點上飄；放開成功時從胸口擴散既有的 fx-gold-shockwave。

## 驗收
- 試聽頁：source-art/DUEL-SFX-062/duel-sfx-audition.html（新舊對照、照遊戲時間差的組合連播）。
- 實際對局記錄：揮擊與命中間隔 105–130ms，與畫面 travel 一致；雙方同時防禦的兩聲立盾相隔 70ms；無 JS 錯誤。
- 測試 PASS：drag-surface、drag-multitouch、basic-art、job-attacks、card-drop-area、asset-versions。art budget strict：2 張共 0.25 MiB 在預算內。

## 未驗證
- 沒有實際用耳朵聽（沙盒無音訊輸出），音色需使用者試聽確認；沒在手機／Safari 實測。卡牌拿放翻的介面音（外站檔）不在這次範圍。
- 原檔備份：backups/duel-sfx-062/
