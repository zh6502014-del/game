# CHARACTER-BIBLE-20261011｜角色故事約束

日期：2026-10-11。劇情分工交付。共10位具名人物、1位刻意匿名核心人物、9種敵人造型及8類匿名配角。跨年代狀態不另算新角色。詳細造型新增定義由同目錄 art-spec 承接，不能把新設計冒充舊正史。

## 判讀方式

以 `story.html:29–34` 的載入次序，合看 `src/js/story-chapters.js:2000` 之後的重寫、H2新增與尾段修文。050大綱「停在國王戰鬥」已被H2延續覆蓋；原始資料的未來磷、記憶共振等舊內容不能恢復為設定。姓名另核對仍有效的 `docs/design/story/STORY-NAMES-018.md`。本次未啟動遊戲或測試節點可達性。

所有人物的精確身高、生日、瞳色、未見背面結構，均未由本次故事清查確認。設定集可設計，但須標為本次美術新增；不要憑空填具體年齡。

## 全人物與必備狀態

| 人物 | 身份與狀態 | 故事明示／不可混用 | 證據 |
| --- | --- | --- | --- |
| 凜 | 尺烏刺客；任務前、灼傷逃亡、H2右臂晶化、夜襲分支晶化上臉 | 傷在右手；A3割去制服標誌。H2右袖破裂、繃帶落下，左手從後背抽伊芙交付的槍。硬幣兩面太陽/夜襲，中央小片暮晶。不能將晶化提前到A1。 | `src/js/story-chapters.js:2093`、`:2384`、`:2398`、`:2435` |
| 朔 | 伊藤弟子、納爾瓦朋友；十年前年輕、S3負傷、十年後成年 | S3肩上誓約繩斷、握劍手受傷，文字未指定左右；木書籤是他刻給納爾瓦，當代轉交磷。 | `src/js/story-campaign-data.js:77`；`src/js/story-chapters.js:2192`、`:2288` |
| 格蘭 | 暮城士兵團；T1–T3年輕新兵、當代成年隊長、礦坑苦撐 | 年輕情境必用年輕版、主線用成年版。救援盾可插地、有暮晶片，接應隊員能抓其背帶。主線腰間有封王室蠟印命令筒；礦坑戰後盾裂。T前傳與S前傳沒有可精確等同的年份。 | `src/js/story-chapters.js:2051`、`:2180`、`:2296`、`:2305`、`:2604` |
| 伊芙・赫森 | 曜火研究員、赫爾曼學生；研究、E3組槍後、逃亡大衣燒破、H2交槍後 | 紅髮明示。E3前不能提前攜帶完成槍；攜博士信與設計圖。H2把槍給凜後不能又複製同一把槍。 | `src/js/story-mode.js:20`；`src/js/story-chapters.js:2118`、`:2138`、`:2209`、`:2407` |
| 磷 | 納爾瓦養女；P1嬰兒、十年後兒童 | 十年經過支持約十歲尺度，非精確生日/足歲。當代一個包、木書籤。非共振者、預知者；不製作成年未來磷。未確認親生母親身份外貌。 | `src/js/story-chapters.js:2044`、`:2048`、`:2156` |
| 納爾瓦 | 祭司、被通緝者、磷養父、朔朋友；十年前、當代、礦區受傷 | 同一人跨十年；赫爾曼為暮城書信聯絡人。送別後書籤在磷手裡。礦區傷要止血，不自動等同晶化；錄音機是調查道具。 | `src/js/story-stage-assets.js:30`；`src/js/story-chapters.js:2146`、`:2292` |
| 赫爾曼 | 曜火博士、伊芙導師；研究、持實驗銃、反噬死亡 | 曾替國王研發頭戴裝置。未完成實驗銃與伊芙完成槍不同狀態。十年前只以信件被提及，無須虛構十年前立繪；現代主線不能活著同行。 | `src/js/story-chapters.js:2120`、`:2468`、`:2582` |
| 伊藤 | 朔師父；十年前、当代、H2疲憊單膝跪地、撤離倖存 | 十年前已為師父，不能畫成年輕朔同齡。H2仍持劍，凜救他免受槍擊。未明示永久傷疤或截肢。 | `src/js/story-chapters.js:2061`、`:2366`、`:2382`、`:2451` |
| 路易斯 | 國王、暮鐘遠端操控者；戰前、戰鬥、破甲階段、倒下 | 額前暮晶頭戴裝置、佩劍；各戰鬥階段仍同一人。倒下後額前晶體暗去，H2不能活著指揮。 | `src/js/story-chapters.js:2344`、`:2351`、`:2365`；`src/js/story-campaign.js:19` |
| 馬德爾 | 格蘭的副手；當代 | 姓名已正式確認、src正文未同步姓名。無獨立原圖；新臉/衣/配件須標新增。不可把T1–T3匿名接應隊員全當成他；不自行指定單獨死亡鏡頭。 | `docs/design/story/STORY-NAMES-018.md:10` |
| 尺烏首腦 | 組織領袖；A1交任務、A3死去 | 刻意匿名，不是待取名角色；無人知道真名，不暗示凜知道。首腦知道凜的名字不代表相反。美術依據須追溯A1現行尺烏首領概念圖（assets/story/actors/boss.webp），這是參考來源要求，不增訂出場限制。 | `docs/design/story/STORY-NAMES-018.md:9`；`src/js/story-campaign-data.js:23` |

## 參考圖路徑

| 人物 | 本地素材 |
| --- | --- |
| 凜 | `assets/story/actors/rin.webp`、`rin-wounded.webp`；`assets/story/illustrations/gun-unify/h2-rin-blocks.webp`、`h2-night-last-shot.webp` |
| 朔 | `assets/story/actors/shuo-young.webp`、`shuo-wounded.webp`、`shuo.webp` |
| 格蘭 | `assets/story/actors/gran-young.webp`、`gran.webp`；`assets/story/illustrations/chapters/mine-gran-last-stand.webp` |
| 伊芙 | `assets/story/actors/eve.webp`、`assets/story/actors/gun-unify/eve-armed.webp` |
| 磷 | `assets/story/actors/phosphor.webp`；`assets/story/illustrations/chapters/p1-morwell-ruins.webp` |
| 納爾瓦 | `assets/story/actors/narva/father-young.webp`、`father.webp`、`father-wounded.webp` |
| 赫爾曼 | `assets/story/actors/herman.webp`；`assets/story/actors/gun-unify/herman.webp` |
| 伊藤 | `assets/story/actors/ito.webp`；`assets/characters/enemies/ito.webp`；`assets/story/illustrations/gun-unify/h2-ito-gunpoint.webp` |
| 路易斯 | `assets/story/actors/louis.webp`；`assets/story/illustrations/gun-unify/h1-louis-showdown.webp`、`h1-louis-fallen.webp` |
| 馬德爾 | 無獨立角色原圖；一般士兵情境不能當作已確認專屬肖像。 |
| 尺烏首腦 | `assets/story/actors/boss.webp` |

同列未重複目錄的檔名沿用前一完整路徑目錄。圖像目視由美術agent負責；此處是來源索引，並非宣稱原圖每項設計均符合。

## 一般敵人與怪物

主要依據 `src/js/story-campaign.js:19` 戰鬥表。不同職稱可共用兵種，不憑職稱再新增具名人。

| 種類 | 參考素材 |
| --- | --- |
| 刀兵／王室守衛／研究區追兵 | `assets/characters/enemies/enemy-blade.webp` |
| 盾衛 | `assets/characters/enemies/enemy-shield.webp` |
| 槍手／槍兵 | `assets/story/actors/gun-unify/enemy-gunner.webp` |
| 截路追兵／暗影型 | `assets/characters/enemies/enemy-shadow.webp` |
| 晶狼 | `assets/characters/enemies/crystal-wolf.webp` |
| 晶鼠 | `assets/characters/enemies/crystal-rat.webp` |
| 冥淵晶爪 | `assets/characters/enemies/enemy-abyss-claw.webp` |
| 冥淵晶軀 | `assets/characters/enemies/enemy-abyss-body.webp` |
| 實驗獅鷲 | `assets/story/actors/extra/enemy-griffin.webp` |

冥淵是被暮晶侵蝕的人，不是天然石像種族。獅鷲是實驗產物，巨大雙翼、半數羽毛晶化、脖子斷鐵鍊為明示（`src/js/story-chapters.js:2298`、`:2307`）。當代晶狼襲磷，由朔出手，不能再畫格蘭救狼戰。一般敵人不能拿四主角換色代替。

## 匿名配角覆蓋

1. 蘭維爾母親。
2. 蘭維爾女孩，不能等同磷。
3. 年輕格蘭的隊長。
4. 接應隊員／暮城士兵團一般成員。
5. 替代詠唱祭司，不可等同納爾瓦。
6. 暮晶中的女孩聲音，身份未確認，不可等同磷。
7. 王室研究人員。
8. 居民／難民／商隊群像。

母女與接應見 `src/js/story-chapters.js:2604`；替代祭司見 `:2044`；暮晶女孩聲音見 `src/js/story-campaign-data.js:104` 起並合看後段E1覆寫。這些身份不用為設定集取新名字；聲音角色無確認肉身肖像，不應將新增面孔稱為正史還原。

## 道具與年代連續性

- 書籤：年輕朔刻製 → 納爾瓦保管十年 → P3交磷 → 朔認刀痕。不是三人各持一枚。
- 槍：博士未完成實驗銃；伊芙E3組完成槍；H2轉交凜，凜左手抽槍。不可隨意交換。
- 格蘭：新兵盾前傳崩裂；成年主線另有磨耗、礦坑戰後再裂。衣甲、面容按時間軸。
- 凜：右手灼傷 → 繃帶遮掩 → H2公開晶化 → 夜襲支線延至臉。
- 伊芙樣本：H2結尾失光成黑炭，不能仍亮藍發光（`src/js/story-chapters.js:2457`）。

## 交付限制

僅新增本文件與 `test-results/character-bible-20261011/canon.json`，未修改runtime、存檔、戰鬥或素材引用。只讀清查源碼與現行設計；不宣稱全狀態遊戲驗證、全歷史資產鑑定。三視圖新增角度與衣著細節由美術規格定義並清楚區分新增設計。
