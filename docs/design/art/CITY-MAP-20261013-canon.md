# CITY-MAP-20261013｜城市、地區與地圖依據

日期：2026-10-13。劇情專責來源核對；不修改程式或 runtime，不生成圖。

## 來源優先順序

1. `src/js/story-chapters.js` 後段生效覆寫，尤其 2029–2033 序章、2044–2056 前傳、2145–2450 現行共同線。前段 F 章、渡垣和舊末日地理不能蓋過它。
2. 050 定稿：`storage/project-history.tar.gz` 內 `docs/design/story/STORY-REWRITE-050.md`。本次從既有解包 `/tmp/game-folder-090/history-restored/docs/design/story/STORY-REWRITE-050.md` 核對，地理節列出八城與三地區。其早期「結局先停國王戰」已被現行 H2 覆寫，不能用來刪掉目前結局。
3. 現行圖像是 V 外觀，不自動證明地理方位；新城景、平面與世界圖布局都是 D 補充設計。

## 全部具名城市：八座

| 正式名稱 | 英文 | 性質與確定身分 | 可確認的時間狀態 | 可用現存圖像 |
| --- | --- | --- | --- | --- |
| 暮城 | 尚無已確認英文專名 | 王都，暮鐘、曜火研究所與文件庫所在；八城中靠暮鐘讓逼近夜域退去的城市 | 十年前 S1–S3 鐘樓仍運作；現代研究事故、封鎖與調查；H2 暮鐘被夷為平地，不等於整座暮城完全消失 | `assets/story/backgrounds/street-scenes/maku-street.webp`、`assets/story/illustrations/chapters/prologue-bell-prayer.webp`、`assets/story/illustrations/chapters/b2-city-bookmark.webp`、`assets/story/illustrations/chapters/h2-bell-explosion.webp` |
| 莫爾威爾 | Morwell | 遭移夜的城市；官方紀錄無人生還與實際嬰兒倖存存在刻意反差 | 十年前仍有居民時遭夜域；幾天後夜域退去，纳爾瓦在廢屋發現磷；十年後是否重建未確定 | `assets/story/illustrations/chapters/p1-morwell-ruins.webp` |
| 迪普霍姆 | Deepholm | 礦業小城；礦坑、暮晶與秘密生物實驗有關。小城本體不等於整座都在地底 | 現代王室運送物資、派兵看守；礦坑口無守衛，深處遭遇冥淵與獅鷲；結局後是否封礦或復興未確定 | `assets/story/backgrounds/locations/bg-deepholm-mine.webp`、`bg-mine-lab.webp`；`assets/story/illustrations/chapters/mine-recorder.webp`、`mine-griffin-battle.webp` |
| 格雷海文 | Greyhaven | 河港，暮晶由此運往各城 | 未出現具體章節狀態；不能捏造被摧毀或倖存的定論 | 尚未查得專屬命名現存圖；需 D 新城景 |
| 弗羅斯福德 | Frostford | 北方渡口，通往諾德馬克 | 未出現具體章節狀態；名稱不等於常年結冰 | 尚未查得專屬命名現存圖；需 D 新城景 |
| 蘭維爾 | Lanvale | 山谷小城，新兵格蘭撤離任務所在地 | 前傳原告示無須撤離；夜域提早到，改走高地，盾片只能短暫抵擋；現代重建／廢棄程度未確定 | `assets/story/illustrations/class-origin/tank-bell.webp`、`tank-return.webp`、`tank-shield.webp`；`assets/story/minigames/shield-rhythm/hold-the-gate.webp` |
| 阿恩費爾德 | Arnfeld | 平原城，暮城士兵團駐地 | 未出現具體章節狀態；不能從駐地推出獨立軍事國家 | 尚未查得專屬命名現存圖；需 D 新城景 |
| 索爾布魯克 | Saltbrook | 農業城，供應暮城糧食 | 未出現具體章節狀態；名稱不等於已有鹽田／鹽業設定 | 尚未查得專屬命名現存圖；需 D 新城景 |

八座城市名稱表採 050 地理定稿；目前可見 runtime 序章明說八座，具體演出主要涉及暮城、莫爾威爾、迪普霍姆、蘭維爾。後四城的完整建築形制、旗制與佈局均未有 C 細節，不可用生成圖再反推為原有正史。`maku` 是檔名鍵，不是要求新增另一城市或定作英文名。

## 地區與方位

| 名稱 | 英文 | 層級 | 確定方位／性質 | 現存圖像 |
| --- | --- | --- | --- | --- |
| 維斯珀蘭 | Vesperland | 本作地區，包含八城 | 大陸西側；不等於已確定國界或王國法定疆域 | `assets/story/illustrations/chapters/prologue-vesperland.webp` 可供整體山地聚落氣氛，不作測繪 |
| 諾德馬克 | Nordmark | 北方地區 | 北方高地；弗羅斯福德通往它 | 無專屬圖像已確認 |
| 艾許莫爾 | Ashmoor | 東方地區 | 東方荒原 | 無專屬圖像已確認 |

大陸、河流、山脈、海洋沒有現行已確認專名。可以画未命名地形，不能自行添加海名／山名並標 C。西側不等於每座城皆沿海；河港不等於海港。

## 地標與場景：不另計城市

| 地標 | 所屬與正史關係 | 可用參考 |
| --- | --- | --- |
| 暮鐘／鐘樓 | 暮城中央；地下操控室、維修入口、主閥、核心；不以多座同型鐘散布八城 | `assets/story/backgrounds/tower.webp`、`assets/story/backgrounds/street-scenes/bell-stairs.webp`、`assets/story/backgrounds/locations/royal-control-h1.webp` |
| 曜火研究所 | 暮城內的研究機構；博士與伊芙研究室 | `assets/story/backgrounds/lab.webp`；本輪 `world-expand-20261013/images/scene-institute.webp` |
| 尺烏據點 | 凜任務交付與 A3 清洗場所；相對城門、鐘樓方位不明 | `assets/story/backgrounds/locations/boss-hall-interior.webp`、`a3-chiwu-outside.webp` |
| 文件庫 | 暮城行政文件場所，有外區、資料廳、內區順序；不能從板上 EAST WALL 判定世界東方 | `assets/story/backgrounds/locations/c4-outer.webp`、`c4-archive.webp`、`c4-inner.webp` |
| 迪普霍姆礦坑與礦坑實驗室 | 屬迪普霍姆地點；实验室在礦坑深處 | `assets/story/backgrounds/locations/bg-deepholm-mine.webp`、`bg-mine-lab.webp` |
| 避難所／臨時落腳處 | 功能場景，不是新具名城；與特定城市的精確位置須依具體章節，通用背景不能立為世界坐標 | `assets/story/backgrounds/shelter.webp` |
| 城外道路、撤離高地 | 暮城外相遇道路與蘭維爾撤離高地不可當同一地點；高地當時暫在夜域外而非永久安全 | `assets/story/backgrounds/road.webp`、T 系列情境圖 |
| 夜域侵襲範圍 | 暫時變動現象，非國家、固定地區或永久疆界 | `assets/story/illustrations/chapters/prologue-nightfall.webp` |

## 可確認路線與未知

C 關係：

- 暮城居於維斯珀蘭的敘事中心；「中心」不等於精確幾何中央。
- 弗羅斯福德渡口通向北方諾德馬克。
- 格雷海文承接暮晶轉運到各城；索爾布魯克供應暮城糧食。
- 現代納爾瓦前往迪普霍姆，磷前往暮城文件庫；四人查到物資流向後離開暮城去迪普霍姆（`story-chapters.js:2150–2159、2219–2220、2506`）。
- 蘭維爾撤離集合點失效後改走高地（2053–2056）；高地不因此與諾德馬克相同。
- 十年前莫爾威爾被指定為移夜目的地（2582–2583）；不代表暮城到莫爾威爾有固定可見光束或永遠同一風向。

D／尚未知：八城相對經緯、彼此公里、旅程天數、城門朝向、河流源頭與分支、道路唯一走法、海岸線、國界。新世界圖可整合為可讀的提案，必須標「地理布局為美術提案」，移動線標關係而非精確路程；不放冒稱正史的公里尺。

## 舊世界地圖不作新地理定稿

`assets/maps/manifest.json` 自標「地理配置概念稿，非定稿」。其中 PNG 路徑 `assets/maps/nightfall-world-map-v1.png` 現在不存在於該目錄；目前只剩 manifest，不能在交付頁當作可載入圖片。其長提示詞是歷史生成紀錄，不是新的使用者指令。

舊圖包含「暮鐘城市」「暮鐘協會」「守誓鐘樓」「曜火研究區」「渡垣接應站」「灰地聚落」「古老災區」「第一號晶化觀測區」「最後藏身處」「熟地（機密規劃）」等，沒有按現行八城命名。這些不能直接當新具名城市；尤其第一號晶化觀測區及熟地等故事線不能憑舊圖恢復。舊圖撤離／移夜箭頭也不能決定新世界圖路線。可借用紙材、線畫風格，但城市名稱與關係全部按本表重建。

## 建議完整美術板範圍

1. 一張八城世界布局板：八城名稱明確、三地區層級、北／東方向、地形與關係路線；D 布局聲明醒目，夜域邊界可變，不畫永久結界。
2. 八張城市板，一城一板：城市剪影、鳥瞰配置 D、代表街區／產業構件、材料色票、人物尺度。暮城以現有鐘樓與街道；莫爾威爾以前傳廢墟作主要可見狀態；迪普霍姆分地表城鎮與礦坑；蘭維爾分撤離前／夜域逼近。
3. 暮城既有局部場景板是零件庫，不能冒充已完成全城設計。已有鐘、研究所、文件庫板以引用整合，避免另造第二款。
4. 諾德馬克／艾許莫爾若補地形板，標「地區氣氛 D」，不再擴出具名新城市。兩地目前只有高地／荒原身份，無需捏造劇情事件。
5. 各城結局後是否重建無來源，一律不補確定狀態。H2 的暮晶熄滅適用維斯珀蘭，但不能由此畫成八城都爆炸或焚毀。

## 核對範圍與限制

已查現行後段故事、050 地理表、地圖 manifest、現存背景／情境路徑及本輪場景規範；未把所有歷史原稿逐張渲染。四個未具專屬場景的城採名稱與功能搜尋，故「未查得」不是斷言所有外部原稿庫絕無圖片。城市板生成前應避免使用其他城情境當該城既定建築；通用材質参考可以沿用並標 D。
