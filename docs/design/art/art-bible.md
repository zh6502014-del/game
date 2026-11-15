# Nightfall 續篇（J1–J4）美術設定集 Art Bible v1

> 往後所有立繪、劇情圖、情境圖都以本文件為準。每一張圖的 prompt 都要「整段貼上」對應角色的 **Character Token**，再加上場景描述。左右一律以**角色本人的左右**為準（正面 3/4 視角時，角色的左手在畫面右側）。
> 視覺參考：`docs/design/art/bible/<id>-sheet.png`（設定圖，本文件下稱 `bible/`）與 `assets/story/actors/sequel/<id>.webp`（定稿立繪；皇權派衛兵是 `assets/characters/enemies/royal-guard.webp`）。

---

## 0. 全域規則

### 0.1 畫風
- 寫實暗黑奇幻、厚塗油畫筆觸（painterly），細節豐富但不是照片感。
- 人物比例寫實（約 7.5 頭身），不做 Q 版、不做動漫大眼。
- 立繪：全身、正面 3/4 視角、腳要入鏡、純深灰背景（之後去背成透明）。
- 劇情圖：1536×864 電影構圖；背景圖：1536×864，畫面不能出現任何人物，下方中央留給立繪站位。

### 0.2 色彩與光線
| 用途 | 色票 | 說明 |
|---|---|---|
| 主色：深綠 | #1F3A2E ~ #2B4A3A | 布料、牆面、自由派 |
| 主色：古金 | #A8823A ~ #C29A4B | 滾邊、黃銅、刺繡 |
| 暗部 | #141414 ~ #23201C | 陰影帶暖黑，不用純黑 |
| 燈火暖光 | #E8A54A | 只做點光源（油燈、燈籠、火花），面積小 |
| 冷環境光 | #3E5A55 | 夜景、地下空間的主光 |
| 警示紅 | #B3261E | 壓力錶紅區、事故光，只在危險場景用 |
- 原則：冷綠的環境光＋小面積暖光點。臉部可以補一點暖光，不要整張畫面偏橘。
- 黃昏場景（例如阿恩費爾德城門）才允許大面積暖橘天光。

### 0.3 蒸汽科技材質規則
- 金屬只用三種：**黃銅**（主要、帶使用痕跡的霧面金色）、**鑄鐵／鉚釘鐵板**（深灰帶鏽）、**銅管**（偏紅的銅色）。不用鉻、不用亮銀、不做霓虹發光。
- 結構語彙：外露鉚釘、壓力錶（圓形白底錶盤，**不放數字或文字**，只用刻度和紅區）、閥輪、波紋軟管、小型排氣口和白色蒸汽。
- 科技感是「手工打造、修過很多次」，不是軍工量產的流線造型。
- 發光只來自燈火、儀錶背光（琥珀色），不用藍色能量光。

### 0.4 陣營
| 陣營 | 主色 | 輔色 | 紋章（抽象、不放字） |
|---|---|---|---|
| 自由派（主角方） | 深綠 #2B4A3A | 古金 #B08D45 | 金色三角，中間一滴水滴形（旗）；個人服飾上用金色鳶尾紋 |
| 皇權派（君主派） | 深藏青 #1C2541 | 亮金 #D4A93C | 抽象皇冠（三尖冠形）；旗上用金色方框 |
| 機體派 | 鏽紅 #8C2F1E | 黃銅 #B5873A | 黃銅六角形（齒輪化） |
- 敵我一眼可辨：主角方絕對不穿藏青；皇權派絕對不穿深綠。

### 0.5 Do / Don't
- ✅ 每張圖都貼 Global Token＋角色 Token。
- ✅ 角色道具的左右邊固定（見各角色表）。
- ✅ 劇情圖要寫明「exactly N people」。
- ❌ 不放任何可讀文字、數字、字母、Logo、浮水印、UI。
- ❌ 背景圖不放人物、不放剪影。
- ❌ 不改角色髮型、服裝顏色、道具位置；路線變體只改表內列出的「變動」項目。
- ❌ 不用現代物件（拉鍊、塑膠、電燈泡以外的現代電子）。

**Global Token（每張都要貼）**
```
Detailed realistic dark-fantasy painting, painterly brushwork, realistic proportions, deep green and antique gold palette, cool green ambient light with small warm lantern highlights, hand-built brass, riveted iron and copper steam technology, pressure gauges with blank dials and no numbers, no readable text, no letters, no numbers, no UI, no logo, no watermark.
```
**Cutout Token（立繪加貼）**
```
Character cutout: full-body standing, front 3/4 view, whole body including feet visible with margin, flat neutral dark-grey background, tall portrait.
```

---

## 1. 璐易絲 Luis（成年磷）｜南方城市私兵指揮官
- **年齡**：25 歲左右　**身高／體型**：約 170 cm，修長、肩背挺直、軍人站姿
- **臉型**：瓜子臉偏長，高顴骨，下顎線俐落；延續磷的五官但更成熟銳利
- **眼睛**：灰綠色，眼型略細長，眼神沉穩
- **眉毛**：深色、平直略粗，眉尾微上揚
- **髮型**：深棕黑，自然捲，長度到下顎，蓬鬆不紮，瀏海偏分
- **膚色**：偏白、帶一點冷調，臉頰微有日曬
- **招牌表情**：冷靜、嘴角平，不笑；喊話時眉頭收緊
- **服裝（由內到外）**：
  1. 深棕色立領襯衫
  2. 深棕色皮背心，金色細扣
  3. 深色長褲（近黑的深棕）
  4. **深綠色長版指揮官大衣**，及小腿，高立領扣起，前襟、袖口、下襬有古金刺繡滾邊
  5. 棕色皮腰帶，腰前兩個皮革小包，腰帶中央垂一條灰色流蘇
  6. 雙前臂：棕色皮革護腕，邊緣黃銅
- **配件與左右**：
  - **左手腕**：一般的黃銅錶式壓力錶（圓形白錶盤、無數字、完好，不強調裂痕）。**只在左手**。胸前不放任何東西。
  - **胸前斜背帶**：一條棕色皮帶從**右肩**斜到**左腰**（帶上兩個小皮包），用來掛噴火器。
  - **背後中央**：小型蒸汽噴射背包（圓胖黃銅雙罐），兩支短黃銅噴嘴從肩後冒出。
  - **背後（獨立）**：短黃銅噴火器，細長槍管＋喇叭口，從**左肩**後方往上伸出、比噴射背包噴嘴更高；一條捲曲軟管連到腰後的小燃料罐。
- **鞋**：棕色及膝皮靴，低跟
- **變體**：
  | 版本 | 不變 | 變動 |
  |---|---|---|
  | `luis` | 全部 | — |
  | `luis-cmd` | 臉、髮、大衣、背心、腰帶、左腕錶、噴火器 | 加**金色肩章**；**右手**舉高喊話、嘴張開；噴射背包**收合**成一個扁平的黃銅箱，低貼在兩肩胛之間，從正面看不到噴嘴；肩後只看得到噴火器槍管 |

**Character Token（luis）**
```
Luis, a woman of about 25, 170 cm, slim upright soldier's posture, long oval face with high cheekbones and a crisp jaw, narrow grey-green eyes, straight dark slightly thick brows, dark brown-black naturally wavy jaw-length loose hair with a side-swept fringe, fair cool-toned skin, calm unsmiling authoritative expression. Wearing a dark-brown stand-collar shirt, dark-brown leather waistcoat with small gold buttons, near-black trousers, a calf-length deep-green commander coat with the high collar buttoned and antique-gold embroidered trim on the front edges, cuffs and hem, a brown leather belt with two leather pouches at the front and a small grey tassel, brown leather forearm bracers edged in brass, brown knee-high low-heeled boots. Ordinary intact brass gauge-watch with a round white blank dial on her LEFT wrist only; nothing on her chest. A brown leather harness strap crosses her chest from her right shoulder to her left hip. On her back a compact steam jetpack (two rounded brass tanks) centred between the shoulder blades with two short brass nozzles peeking above the shoulders, AND a separate short brass flamethrower (long narrow brass barrel with a flared nozzle) rising behind her LEFT shoulder higher than the jetpack nozzles, with a coiled hose down to a small canister at her hip.
```
`luis-cmd` 追加：`Gold epaulettes on both shoulders, right hand raised high mid-speech with mouth open, jetpack stowed: folded into a flat closed brass case low between her shoulder blades, no nozzles visible; only the flamethrower barrel rises behind her LEFT shoulder.`

---

## 2. 朔 Shuo｜蒸汽鬥士（前傳十年後）
- **年齡**：38 歲左右（比前傳 shuo.webp 明顯老十歲）　**身高／體型**：約 180 cm，精瘦但肩膀比前傳寬、更結實
- **臉型**：長臉、顴骨高而削，臉頰微凹，下顎方
- **眼睛**：深棕，單眼皮偏細長，眼神疲憊、冷淡；眼角有細紋
- **眉毛**：濃黑、劍眉，眉間有淺淺的皺紋
- **髮型**：黑色長髮綁**高馬尾髻**（頭頂髮髻），兩鬢垂下幾縷碎髮；髮髻裡夾雜**少量白髮**
- **膚色**：小麥色、風霜感
- **鬍子**：短短的黑色鬍渣（下巴與上唇）
- **招牌表情**：疲倦、乾冷、嘴角微下垂，不咧嘴
- **服裝（由內到外）**：
  1. 米白交領內衣（領口可見）
  2. 深綠底暗紋交領長袍，長及小腿，前擺分片（深綠、棕、米褐條紋布片）
  3. 深棕寬腰帶兩層，皮革
  4. 斜背棕色皮帶（右肩→左腰），帶上掛**黃銅太陽輪護符＋流蘇**（胸前左側）
  5. 磨舊的深綠／深棕傭兵外袍，肩部加皮革墊肩
- **配件與左右**：
  - **左腰**：直劍（黑鞘、黃銅護手）
  - **雙前臂**：一對**相同**的厚重黃銅蒸汽臂套，腕到肘，帶小管線、排氣孔，各一個圓形錶盤
- **鞋**：棕色綁帶長靴
- **變體**：
  | 版本 | 不變 | 變動 |
  |---|---|---|
  | `shuo-steam` | 全部 | 兩邊臂套完好 |
  | `shuo-steam-damaged` | 全部 | **右臂套**外殼碎裂凹陷、錶盤破、裂縫冒白蒸汽；左臂套完好 |

**Character Token（shuo）**
```
Shuo, a man of about 38, 180 cm, lean but broad-shouldered and sturdy, long face with sharp high cheekbones, slightly hollow cheeks and a square jaw, narrow dark-brown monolid eyes with fine crow's feet, thick black sword-shaped brows with a faint frown line, black hair tied in a high topknot with a few grey strands and loose strands at the temples, weathered tan skin, short black stubble on chin and upper lip, tired dry expression. Wearing an off-white cross-collar under-robe, a calf-length deep-green patterned cross-collar robe with front panels in deep green, brown and taupe stripes, a double brown leather waist belt, a diagonal brown leather strap from right shoulder to left hip carrying a brass sun-wheel charm with a tassel on the left chest, a worn dark green-brown mercenary over-coat with leather shoulder pads, a straight sword with a black scabbard and brass guard at his LEFT hip, laced brown tall boots. BOTH forearms wear a matching pair of heavy brass steam armbands from wrist to elbow with small pipes, vents and one round blank dial each.
```
`shuo-steam-damaged` 追加：`His RIGHT armband is cracked and dented with a broken dial and white steam leaking from the cracks; the left armband is intact.`

---

## 3. 瑟爾遜 Serson｜南方城市傳令兵
- **年齡**：18–19 歲　**身高／體型**：約 172 cm，瘦、肩窄、少年體型
- **臉型**：窄長臉、下巴略尖，五官普通但乾淨；**絕對不能像 gran-young**（不寬下顎、不鬍渣、不壯）
- **眼睛**：棕色，雙眼皮、眼型圓潤柔和
- **眉毛**：深棕、細、略呈八字（顯得有點不確定）
- **髮型**：深棕短髮，蓬亂、瀏海落在額頭
- **膚色**：淡小麥色，乾淨無鬍
- **招牌表情**：有點不確定、溫和；路線版各有不同（見下）
- **服裝（由內到外）**：
  1. 深綠長袖內衣
  2. **深綠傳令兵罩衫**（及膝），古金滾邊，胸前與下襬各一個**金色鳶尾紋**
  3. 棕色皮腰帶
  4. 深綠圍巾
  5. **塵土色的棕色連帽騎行斗篷**，邊緣有淡金色刺繡
  6. 棕色皮護腕＋棕色皮手套
- **配件與左右**：斜背皮革郵包（右肩→左腰，包在**左腰前方**），包口插**三支黃銅公文筒**
- **鞋**：棕色騎馬靴
- **變體**（斗篷棕色、罩衫深綠金邊、鳶尾紋、郵包在所有版本保留）：
  | 版本 | 主題 | 變動 |
  |---|---|---|
  | `serson` | 起點 | — |
  | `serson-wheelchair` | 接受 | 坐黃銅蒸汽輪椅（大輻條輪、後置小鍋爐帶壓力錶、兩側推進噴嘴、皮座）；腿上蓋**深綠毛毯**，小腿套黃銅皮革支架；表情堅定、衣著整齊；雙手扶輪圈 |
  | `serson-mecha` | 依賴 | 坐在 mecha-body 胸口駕駛艙，只露胸口以上；雙手握操縱桿；琥珀色儀錶光；電纜從機體後下方拖出畫面 |
  | `serson-mecha-out` | 停機後被迫脫離 | 機甲路線：管線切斷、機甲停機後。坐在地上，背靠一條停機的機甲小腿（只畫膝下到腳掌，造型、深綠漆＋古金滾邊完全照 mecha-body，位置在畫面左側）；雙腿伸直癱軟、膝蓋不彎；**右手**撐地，**左手**握一支黃銅公文筒當棍子；斗篷下襬焦黑、滿是塵土，臉上有煤灰；咬緊牙關、疲憊但不服輸；旁邊地上一條斷掉的動力電纜，斷口冒小火花；機甲關節冒中性深灰煙＋少量琥珀火星（**不用綠色**）。立繪去背後煙會被去掉，需要的話由遊戲特效補 |
  | `serson-blackmarket` | 代價 | 斗篷有補丁；**雙小腿**換成粗糙黃銅義肢（外露活塞、不成套的鐵片）；**左前臂**換成齒輪＋鋼纜機械臂；肉與金屬交界有縫線；眼神發燒、站姿不穩；右臂是正常手臂 |

**Character Token（serson）**
```
Serson, a young man of 18-19, 172 cm, slim narrow-shouldered build, narrow long face with a slightly pointed chin, plain clean features, soft round brown double-lidded eyes, thin dark-brown slightly upturned-inner brows, short messy dark-brown hair with a fringe over the forehead, light tan clean-shaven skin, gentle slightly uncertain expression; clearly not a broad-jawed or stubbled man. Wearing a deep-green long-sleeved undershirt, a knee-length deep-green messenger tabard with antique-gold edging and a gold fleur emblem on the chest and on the hem, a brown leather belt, a deep-green scarf, a dusty brown hooded riding cloak with faint gold embroidery at the edges, brown leather bracers and gloves, a leather satchel slung from right shoulder to left hip holding three brass dispatch tubes, brown riding boots.
```
- wheelchair 追加：`seated in a brass steam wheelchair with large spoked wheels, a small rear boiler with a blank pressure gauge, side thruster nozzles and a leather seat; a deep-green wool blanket over his lap and brass-and-leather leg braces on his shins; tidy clothes, determined face, hands on the wheel rims.`
- mecha 追加：`seated inside the open chest cockpit of the mecha (see Mecha Token), visible from the chest up, hands on brass control levers, amber gauge glow, power cable trailing from the mech's lower back.`
- mecha-out 追加：`forced out of the dead mecha: sitting on the ground, back propped against one powered-down mecha lower leg (knee to broad square foot only, exactly the Mecha Token design, deep green with antique-gold edging) at frame-left; both legs stretched straight and limp, knees not bent; right hand braced flat on the ground, left hand gripping a heavy brass dispatch tube like a club; scorched dusty cloak hem, soot on his face, jaw set, exhausted but defiant; a severed thick black power cable with a few sparks beside him; thin neutral dark-grey smoke with tiny amber embers from the mecha joint, no green.`
- blackmarket 追加：`patched cloak; both lower legs replaced by crude brass prosthetics with exposed pistons and mismatched plates; his LEFT forearm replaced by a gear-and-cable mechanical arm; stitched seams where flesh meets metal; right arm normal; faint feverish eyes; slightly unsteady stance.`

---

## 4. 外掛式機甲 Mecha（= `mecha-body`）
- **尺寸**：約 3 公尺高，單人駕駛
- **輪廓**：頭部沒有獨立頭盔，胸口是一個大型**八角形敞開駕駛艙**（框是黃銅＋鐵）；大而圓的肩甲；手臂粗短，兩個方塊狀的厚重鐵拳；粗壯雙腿、大方腳掌
- **塗裝**：鉚釘鐵板漆**深綠**，所有板緣**古金色**滾邊；關節露出黃銅齒輪與軟管
- **細節**：雙肩各一支黃銅排氣煙囪（冒白蒸汽）；肩甲側面有圓形排氣孔；一條粗**動力電纜**從**後腰／下背**接出、拖在地上
- **氣質**：手工打造、有點笨重，不是軍用流線
- **Mecha Token**
```
The steam exo-mech: about 3 m tall one-person walker, no separate head, a large octagonal open chest cockpit framed in brass and iron, big rounded shoulder pauldrons with round side vents, two brass exhaust stacks on the shoulders venting white steam, short thick arms ending in heavy blocky iron fists, sturdy legs with broad square feet, riveted iron plates painted deep green with antique-gold edging on every plate, brass gears and hoses at the joints, a thick power cable plugged into the lower back trailing on the ground; hand-built and slightly clumsy, not sleek.
```

---

## 5. 皇權派軍官 Royal Officer（不取名）
- **年齡**：48 歲左右　**身高／體型**：約 183 cm，挺拔、肩寬
- **臉型**：方臉、下顎寬，法令紋與額紋明顯　**眼睛**：灰藍、冷　**眉毛**：灰黑、平直
- **髮型**：灰白交雜的短髮，側邊推短、梳整齊　**膚色**：白、微紅　**鬍子**：無（刮乾淨）
- **招牌表情**：冷、守紀律、只服從體制；不是反派臉
- **服裝**：白色立領襯衫＋黑領帶；**深藏青雙排扣硬挺長大衣**，及小腿，立領、亮金滾邊、金扣、金色肩飾帶；棕色皮腰帶＋斜背劍帶
- **配件與左右**：**左胸**抽象皇冠形黃銅徽章；**左腰**軍刀（黃銅護手）；**右手**握一把大型黃銅鑰匙（環形握柄、長柄、齒狀鑰匙頭，約前臂長）；白手套
- **鞋**：黑色高筒馬靴
- **Character Token（royal-officer）**
```
The royalist officer, a man of about 48, 183 cm, upright and broad-shouldered, square face with a wide jaw and deep nasolabial and forehead lines, cold grey-blue eyes, straight grey-black brows, short grey-streaked hair neatly combed with short sides, fair slightly ruddy clean-shaven skin, cold disciplined expression, not a cartoon villain. Wearing a white stand-collar shirt with a black tie, a stiff calf-length double-breasted dark-navy greatcoat with a stand collar, bright gold piping, gold buttons and gold shoulder boards, a brown leather belt and sword belt, white gloves, black tall riding boots; an abstract crown-shaped brass badge on his LEFT chest; a sabre with a brass guard at his LEFT hip; in his RIGHT hand a large heavy brass key about forearm length with a ring bow, long shaft and toothed bit.
```

## 6. 皇權派衛兵 Royal Guard（640×960 戰鬥肖像）
- **年齡**：30 歲左右，壯碩　**臉**：方臉、短黑鬍渣、表情嚴厲
- **服裝**：**黃銅鑲邊鋼盔**（寬帽簷、頂部黃銅飾）；深藏青及膝外衣，亮金滾邊，**沒有飾帶、沒有軍階綬帶**；棕色皮革交叉肩帶＋腰帶；深藏青長褲；鐵護腕＋皮手套；棕色長靴
- **武器**：短戟（斧刃＋矛尖），雙手持握斜放
- **Character Token（royal-guard）**
```
A royalist guard of about 30, stocky, square face with short black stubble and a stern look, wearing a steel helmet with a wide brim and brass trim and crest, a knee-length dark-navy coat with bright gold trim and no rank braid or cords, brown leather cross-straps and belt, dark-navy trousers, iron vambraces with leather gloves, brown tall boots, holding a short halberd with an axe blade and spear point diagonally in both hands.
```

---

## 7. 場景筆記（背景圖）
| id | 場景 | 時間／光 | 必要元素 | 禁止 |
|---|---|---|---|---|
| bg-lanvale-gate | 蘭維爾南城門 | 夜、冷綠＋將熄火把 | 石拱門、升起的鐵閘門、遠處警鐘光、煙、石板路上散落補給箱 | 人物 |
| bg-arnfeld-gate | 阿恩費爾德城門 | **黃昏**、低角度暖金夕陽 | 城牆蒸汽砲、傾斜半毀的防禦塔、空路障、塵土與蒸汽 | 民兵或任何人物 |
| bg-tunnel-entrance | 隧道入口與閥門室 | 夜、油燈 | 圓形鐵門、大黃銅閥輪、管線歧管、舊鐵軌 | 人物 |
| bg-tunnel-deep | 隧道深處 | 遠端紅色警示光 | 磚拱、頂部蒸汽管、支撐梁、鐵軌火花 | 人物 |
| bg-infirmary | 邊境醫護所 | 夜、冷綠月光＋暖燈 | 石室、鐵床、中左一張空床、草藥、蒸汽暖氣片 | 人物 |
| bg-hub-station | 樞紐站大廳 | 地下、冷綠＋燈 | 匯流軌道、中央黃銅號誌塔、鐵鍊鎖住的巨門；**三面旗**：自由派綠＋金三角、皇權派藏青＋金方框、機體派鏽紅＋黃銅六角 | 人物、旗上文字 |
| bg-hub-control | 樞紐站控制室 | 室內、燈 | 黃銅拉桿與錶盤、遠牆大鎖輪、俯瞰軌道的玻璃窗、深綠鑲金壁板 | 人物 |

## 8. 劇情圖筆記
| id | 人數 | 內容 |
|---|---|---|
| cg-runaway-train | 1 | 瑟爾遜獨自在失控列車車尾平台撬開連結器；壓力錶過紅線（無數字）、上方支撐梁崩落、火花、塵土 |
| cg-three-paths | 1 | 瑟爾遜背影站在醫護所門口；遠方三束光：空輪椅、空的 mecha-body、掛著義肢的黑市攤 |
| cg-hub-retake-* | 3 | 璐易絲（左）、朔（中）、瑟爾遜路線版（右）在中央鎖輪旁，巨門打開、蒸汽光湧入 |

## 9. 檔案規格
- 角色立繪：853×1280 透明 WebP，≤450KB（目標 150–215KB）
- 敵人戰鬥肖像：640×960 透明 WebP（目標約 126KB）
- 背景／劇情圖：1536×864 WebP，≤600KB

## 10. 視覺設定圖（無文字）
| 檔案 | 內容 |
|---|---|
| `bible/luis-sheet.png` | 璐易絲正面 3/4＋背面（噴射背包雙罐＋左肩後的獨立噴火器）＋臉、左腕錶、噴火器噴嘴、靴子特寫 |
| `bible/shuo-sheet.png` | 十年後的朔：正面 3/4＋背面＋臉、完好臂套、破損臂套、太陽輪護符特寫 |
| `bible/serson-sheet.png` | 瑟爾遜：原始、輪椅、黑市三版同比例並排＋臉部特寫（機甲版請看 `assets/story/actors/sequel/serson-mecha.webp`） |
| `bible/mecha-sheet.png` | 機甲：正面 3/4＋背面（後腰電纜接口）＋駕駛艙、拳頭、電纜接口特寫 |
| `bible/royal-sheet.png` | 皇權派軍官＋衛兵＋皇冠徽章、大鑰匙、頭盔特寫 |

## 11. 生成新情境圖的流程
1. 貼 Global Token → 貼場景描述（參考第 7、8 節）→ 依出場角色逐一貼 Character Token（變體再加追加句）。
2. 參考圖附上：該角色的 `bible/<id>-sheet.png` 或 `assets/story/actors/sequel/<id>.webp`（最多 3 張）。
3. 寫明 `exactly N people`，以及每個角色在畫面的左／中／右位置。
4. 生成後用第 0.5 節的 Do/Don't 檢查：左右道具、髮型、服裝顏色、文字。

## 12. 美術方向決議 Art direction decisions 2026-11-15
（美術總監定案；與前文衝突時以本節為準）
1. **瑟爾遜的機甲配色**：所有圖一律是深綠漆鐵甲＋古金滾邊＋黃銅關節，與 `mecha-body` 一致。鏽紅配黃銅只用於機體派的旗幟與其他單位，絕不用在瑟爾遜自己的機甲。
   `Serson's mecha is always deep-green painted riveted iron with antique-gold plate edging and brass joints, exactly as mecha-body; never rust red.`
2. **藍光例外**：「不用藍色能量光」的唯一例外是電弧（`fx-tether-spark`、管線過載），電弧為藍白色。魔法、氣、蒸汽招式一律不用藍色。
   `Blue-white is allowed ONLY for electrical arcs; never for magic, qi or steam skills.`
3. **璐易絲噴射背包**：指揮官版（`luis-cmd`）的收合背包只用於立繪。飛行／升空畫面一律用展開的雙罐背包（見 `bible/luis-sheet.png` 背面），噴嘴朝下噴白蒸汽。
   `When flying, Luis wears the deployed twin-tank jetpack; the folded case is for the luis-cmd portrait only.`
4. **立繪不含煙與地面**：去背立繪不放煙霧、不放地面陰影；煙和環境由遊戲特效疊加。`serson-mecha-out` 搭配 `fx-mecha-shutdown` 使用。
5. **坐姿立繪**：在 853×1280 畫布上**底部對齊**（與站姿立繪腳底同一基線），頂部留白是正常的。
6. **技能牌面**：560×800（7:10）、滿版繪圖、無牌框、無臉、無文字數字；每張只畫該角色在設定集裡的裝備；光線與色調對齊對應的特效小圖。檔案 ≤120KB。
7. **冷凝術視覺規則**：熱量是**流進**臂套。畫面要表現向內吸：螺旋狀的霧氣流被吸進臂套排氣孔，排氣孔內的琥珀光漸暗轉冷；冰晶只在中心或劍刃邊緣。**絕不畫向外冒的熱霧**。
   `Spiralling mist streams are drawn INTO the armband vents, the amber glow inside the vents dims to cold; no outward heat haze.`
8. **氣劍視覺規則**：一律畫出朔的直劍（黑鞘、黃銅護手，平時佩於左腰）；蒸汽月牙沿著揮劍的弧線延伸，白熱核心＋外緣琥珀色。
   `Qi slash: Shuo's straight steel sword is always shown; the white-hot, amber-edged steam crescent follows the blade's swing arc.`
