# Nightfall 續篇 美術交接清單（art-handoff）

- 產生時間：2026-11-15（UTC+8）
- 來源：/workspace/nightfall/out、/workspace/nightfall-fx/out、/workspace/nightfall-fx/cards、/workspace/nightfall/art-bible.md、/workspace/nightfall/bible
- 比對對象：/workspace/repos/game（HEAD 1307432，只讀；沒有修改，沒有 commit）
- 共 56 個檔案。第 1～53 項是第一批，全部 **NEW**；repo 的 assets/ 裡沒有任何同路徑的檔案，所以沒有需要覆蓋的。
- **2026-11-15 赫爾曼 v4 追加**：第 54～56 項是 NEW；第 48 項 art-bible.md 是 UPDATE，覆蓋 art/sequel-assets 分支上的現有版本（保留整合時改寫的 repo 內路徑）。
- 「取代借用圖」指的是劇情程式目前借用的舊圖。（更正：luis / luis-cmd 是續篇新角色圖（成年磷），臉部延續 phosphor.webp，不取代 rin.webp 或 phosphor.webp。）新圖不同名，整合時要改程式的引用路徑，不是覆蓋檔案。repo 程式裡目前搜不到任何續篇的檔名。
- 格式：遊戲素材全部是 WebP，規格都已經符合需求文件；只有設定集附的設定圖是 PNG 文件。

## 檔案清單

| # | 交接檔案（相對 /workspace/art-handoff/） | 目標路徑 | 狀態 | 大小 | 規格 | 備註 |
|---|---|---|---|---|---|---|
| 1 | `assets/story/actors/luis.webp` | `assets/story/actors/sequel/luis.webp` | NEW | 150 KB | 853×1280 RGBA | 續篇新角色圖（成年磷） |
| 2 | `assets/story/actors/luis-cmd.webp` | `assets/story/actors/sequel/luis-cmd.webp` | NEW | 136 KB | 853×1280 RGBA | 續篇新角色圖（成年磷） |
| 3 | `assets/story/actors/shuo-steam.webp` | `assets/story/actors/sequel/shuo-steam.webp` | NEW | 170 KB | 853×1280 RGBA | 取代借用中的 shuo.webp（非同名，不覆蓋） |
| 4 | `assets/story/actors/shuo-steam-damaged.webp` | `assets/story/actors/sequel/shuo-steam-damaged.webp` | NEW | 168 KB | 853×1280 RGBA |  |
| 5 | `assets/story/actors/serson.webp` | `assets/story/actors/sequel/serson.webp` | NEW | 149 KB | 853×1280 RGBA | 取代借用中的 gran-young.webp（非同名） |
| 6 | `assets/story/actors/serson-wheelchair.webp` | `assets/story/actors/sequel/serson-wheelchair.webp` | NEW | 198 KB | 853×1280 RGBA |  |
| 7 | `assets/story/actors/serson-mecha.webp` | `assets/story/actors/sequel/serson-mecha.webp` | NEW | 195 KB | 853×1280 RGBA |  |
| 8 | `assets/story/actors/serson-blackmarket.webp` | `assets/story/actors/sequel/serson-blackmarket.webp` | NEW | 166 KB | 853×1280 RGBA |  |
| 9 | `assets/story/actors/mecha-body.webp` | `assets/story/actors/sequel/mecha-body.webp` | NEW | 198 KB | 853×1280 RGBA | 需求寫「道具／戰鬥肖像」但列在 A｜角色立繪，放 actors；853×1280 透明 |
| 10 | `assets/story/actors/royal-officer.webp` | `assets/story/actors/sequel/royal-officer.webp` | NEW | 119 KB | 853×1280 RGBA | 取代借用中的 enemy-blade（非同名，不覆蓋） |
| 11 | `assets/story/actors/sequel/serson-mecha-out.webp` | `assets/story/actors/sequel/serson-mecha-out.webp` | NEW | 150 KB | 853×1280 RGBA | 路徑照 new-req.txt（sequel/ 子資料夾）；其他續篇立繪的舊需求寫 actors/ 根目錄，兩者不一致 |
| 12 | `assets/characters/enemies/royal-guard.webp` | `assets/characters/enemies/royal-guard.webp` | NEW | 114 KB | 640×960 RGBA | 需求只寫「同 assets/characters/enemies/*.webp 格式」，沒寫路徑；選 enemies/。640×960 透明 |
| 13 | `assets/story/backgrounds/locations/bg-lanvale-gate.webp` | `assets/story/backgrounds/locations/bg-lanvale-gate.webp` | NEW | 269 KB | 1536×864 RGB |  |
| 14 | `assets/story/backgrounds/locations/bg-arnfeld-gate.webp` | `assets/story/backgrounds/locations/bg-arnfeld-gate.webp` | NEW | 317 KB | 1536×864 RGB |  |
| 15 | `assets/story/backgrounds/locations/bg-tunnel-entrance.webp` | `assets/story/backgrounds/locations/bg-tunnel-entrance.webp` | NEW | 252 KB | 1536×864 RGB |  |
| 16 | `assets/story/backgrounds/locations/bg-tunnel-deep.webp` | `assets/story/backgrounds/locations/bg-tunnel-deep.webp` | NEW | 317 KB | 1536×864 RGB |  |
| 17 | `assets/story/backgrounds/locations/bg-infirmary.webp` | `assets/story/backgrounds/locations/bg-infirmary.webp` | NEW | 268 KB | 1536×864 RGB |  |
| 18 | `assets/story/backgrounds/locations/bg-hub-station.webp` | `assets/story/backgrounds/locations/bg-hub-station.webp` | NEW | 282 KB | 1536×864 RGB | 三面旗配色已於 11/14 核准，旗幟圖未製作 |
| 19 | `assets/story/backgrounds/locations/bg-hub-control.webp` | `assets/story/backgrounds/locations/bg-hub-control.webp` | NEW | 282 KB | 1536×864 RGB |  |
| 20 | `assets/story/illustrations/chapters/cg-runaway-train.webp` | `assets/story/illustrations/chapters/cg-runaway-train.webp` | NEW | 230 KB | 1536×864 RGB | 需求沒寫劇情圖路徑；選現有劇情圖所在的 illustrations/chapters/ |
| 21 | `assets/story/illustrations/chapters/cg-three-paths.webp` | `assets/story/illustrations/chapters/cg-three-paths.webp` | NEW | 260 KB | 1536×864 RGB | 需求沒寫劇情圖路徑；選現有劇情圖所在的 illustrations/chapters/ |
| 22 | `assets/story/illustrations/chapters/cg-hub-retake-wheelchair.webp` | `assets/story/illustrations/chapters/cg-hub-retake-wheelchair.webp` | NEW | 258 KB | 1536×864 RGB | 需求沒寫劇情圖路徑；選現有劇情圖所在的 illustrations/chapters/；原需求 id 為單一 cg-hub-retake，依路線拆成 3 檔 |
| 23 | `assets/story/illustrations/chapters/cg-hub-retake-mecha.webp` | `assets/story/illustrations/chapters/cg-hub-retake-mecha.webp` | NEW | 284 KB | 1536×864 RGB | 需求沒寫劇情圖路徑；選現有劇情圖所在的 illustrations/chapters/；原需求 id 為單一 cg-hub-retake，依路線拆成 3 檔 |
| 24 | `assets/story/illustrations/chapters/cg-hub-retake-blackmarket.webp` | `assets/story/illustrations/chapters/cg-hub-retake-blackmarket.webp` | NEW | 276 KB | 1536×864 RGB | 需求沒寫劇情圖路徑；選現有劇情圖所在的 illustrations/chapters/；原需求 id 為單一 cg-hub-retake，依路線拆成 3 檔 |
| 25 | `assets/story/fx/sequel/fx-flame-cone.webp` | `assets/story/fx/sequel/fx-flame-cone.webp` | NEW | 33 KB | 640×155 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 26 | `assets/story/fx/sequel/fx-frost-burst.webp` | `assets/story/fx/sequel/fx-frost-burst.webp` | NEW | 77 KB | 512×512 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 27 | `assets/story/fx/sequel/fx-heat-puff-1.webp` | `assets/story/fx/sequel/fx-heat-puff-1.webp` | NEW | 8 KB | 128×128 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/；需求檔名 fx-heat-puff.webp，依你回覆拆成 3 張單檔 |
| 28 | `assets/story/fx/sequel/fx-heat-puff-2.webp` | `assets/story/fx/sequel/fx-heat-puff-2.webp` | NEW | 7 KB | 128×128 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/；需求檔名 fx-heat-puff.webp，依你回覆拆成 3 張單檔 |
| 29 | `assets/story/fx/sequel/fx-heat-puff-3.webp` | `assets/story/fx/sequel/fx-heat-puff-3.webp` | NEW | 9 KB | 128×128 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/；需求檔名 fx-heat-puff.webp，依你回覆拆成 3 張單檔 |
| 30 | `assets/story/fx/sequel/fx-jet-plume.webp` | `assets/story/fx/sequel/fx-jet-plume.webp` | NEW | 30 KB | 256×384 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 31 | `assets/story/fx/sequel/fx-mecha-shutdown.webp` | `assets/story/fx/sequel/fx-mecha-shutdown.webp` | NEW | 72 KB | 512×512 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 32 | `assets/story/fx/sequel/fx-ram-dust.webp` | `assets/story/fx/sequel/fx-ram-dust.webp` | NEW | 41 KB | 512×199 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 33 | `assets/story/fx/sequel/fx-steam-burst.webp` | `assets/story/fx/sequel/fx-steam-burst.webp` | NEW | 86 KB | 512×512 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 34 | `assets/story/fx/sequel/fx-steam-slash.webp` | `assets/story/fx/sequel/fx-steam-slash.webp` | NEW | 12 KB | 119×512 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 35 | `assets/story/fx/sequel/fx-tether-spark.webp` | `assets/story/fx/sequel/fx-tether-spark.webp` | NEW | 37 KB | 512×256 RGBA | 需求沒寫新特效路徑（只說尺寸依 fx/awaken）；選 assets/story/fx/sequel/ |
| 36 | `assets/ui/status/ui-status-airborne.webp` | `assets/ui/status/ui-status-airborne.webp` | NEW | 8 KB | 128×128 RGBA | 需求檔名 ui-status-icons.webp（條圖），依你回覆拆成 4 張單檔；沒寫路徑，選 assets/ui/status/ |
| 37 | `assets/ui/status/ui-status-burn.webp` | `assets/ui/status/ui-status-burn.webp` | NEW | 8 KB | 128×128 RGBA | 需求檔名 ui-status-icons.webp（條圖），依你回覆拆成 4 張單檔；沒寫路徑，選 assets/ui/status/ |
| 38 | `assets/ui/status/ui-status-frozen.webp` | `assets/ui/status/ui-status-frozen.webp` | NEW | 7 KB | 128×128 RGBA | 需求檔名 ui-status-icons.webp（條圖），依你回覆拆成 4 張單檔；沒寫路徑，選 assets/ui/status/ |
| 39 | `assets/ui/status/ui-status-overheat.webp` | `assets/ui/status/ui-status-overheat.webp` | NEW | 8 KB | 128×128 RGBA | 需求檔名 ui-status-icons.webp（條圖），依你回覆拆成 4 張單檔；沒寫路徑，選 assets/ui/status/ |
| 40 | `assets/story/fx/skill-cards/card-cold.webp` | `assets/story/fx/skill-cards/card-cold.webp` | NEW | 61 KB | 560×800 RGB | 路徑照 new-req.txt |
| 41 | `assets/story/fx/skill-cards/card-fist.webp` | `assets/story/fx/skill-cards/card-fist.webp` | NEW | 99 KB | 560×800 RGB | 路徑照 new-req.txt |
| 42 | `assets/story/fx/skill-cards/card-flame.webp` | `assets/story/fx/skill-cards/card-flame.webp` | NEW | 66 KB | 560×800 RGB | 路徑照 new-req.txt |
| 43 | `assets/story/fx/skill-cards/card-overload.webp` | `assets/story/fx/skill-cards/card-overload.webp` | NEW | 106 KB | 560×800 RGB | 路徑照 new-req.txt |
| 44 | `assets/story/fx/skill-cards/card-qi.webp` | `assets/story/fx/skill-cards/card-qi.webp` | NEW | 68 KB | 560×800 RGB | 路徑照 new-req.txt |
| 45 | `assets/story/fx/skill-cards/card-recoil.webp` | `assets/story/fx/skill-cards/card-recoil.webp` | NEW | 109 KB | 560×800 RGB | 路徑照 new-req.txt |
| 46 | `assets/story/fx/skill-cards/card-shield.webp` | `assets/story/fx/skill-cards/card-shield.webp` | NEW | 118 KB | 560×800 RGB | 路徑照 new-req.txt |
| 47 | `assets/story/fx/skill-cards/card-up.webp` | `assets/story/fx/skill-cards/card-up.webp` | NEW | 70 KB | 560×800 RGB | 路徑照 new-req.txt |
| 48 | `docs/design/art/art-bible.md` | `docs/design/art/art-bible.md` | UPDATE（2026-11-15 赫爾曼 v4；第一批為 NEW 24 KB） | 33 KB | text | 續篇美術設定集。赫爾曼 v4 版覆蓋第一批版本：新增或改寫 §6A 赫爾曼、§10 設定圖表、§12 #9～#11。文件內的參考圖路徑原本指向 /workspace/nightfall/，整合時已改成 repo 內的 `bible/`、`assets/story/actors/sequel/` 與 `assets/characters/enemies/` |
| 49 | `docs/design/art/bible/luis-sheet.png` | `docs/design/art/bible/luis-sheet.png` | NEW | 674 KB | 1280×720 RGB | 設定圖（無文字），PNG 1280×720；只是文件，不給遊戲讀取 |
| 50 | `docs/design/art/bible/mecha-sheet.png` | `docs/design/art/bible/mecha-sheet.png` | NEW | 1190 KB | 1280×720 RGB | 設定圖（無文字），PNG 1280×720；只是文件，不給遊戲讀取 |
| 51 | `docs/design/art/bible/royal-sheet.png` | `docs/design/art/bible/royal-sheet.png` | NEW | 928 KB | 1280×720 RGB | 設定圖（無文字），PNG 1280×720；只是文件，不給遊戲讀取 |
| 52 | `docs/design/art/bible/serson-sheet.png` | `docs/design/art/bible/serson-sheet.png` | NEW | 965 KB | 1280×720 RGB | 設定圖（無文字），PNG 1280×720；只是文件，不給遊戲讀取 |
| 53 | `docs/design/art/bible/shuo-sheet.png` | `docs/design/art/bible/shuo-sheet.png` | NEW | 854 KB | 1280×720 RGB | 設定圖（無文字），PNG 1280×720；只是文件，不給遊戲讀取 |
| 54 | `assets/story/actors/sequel/herman-mecha.webp` | `assets/story/actors/sequel/herman-mecha.webp` | NEW（赫爾曼 v4） | 182 KB | 853×1280 RGBA | 現代主線赫爾曼立繪：敵人，全身只剩大腦是人類（左太陽穴有大腦窗），後腦有神經接駁夾（正面視角看不到，設定圖背面有），胸前是古金六角齒輪墜飾 |
| 55 | `assets/characters/enemies/herman-battle.webp` | `assets/characters/enemies/herman-battle.webp` | NEW（赫爾曼 v4） | 114 KB | 640×960 RGBA | 赫爾曼敵人戰鬥肖像，跟立繪同一份設計，全身構圖跟 royal-guard 一致（目標約 126KB） |
| 56 | `docs/design/art/bible/herman-sheet.png` | `docs/design/art/bible/herman-sheet.png` | NEW（赫爾曼 v4） | 1261 KB | 1280×720 RGB | 赫爾曼設定圖（無文字）：側後頭部特寫（大腦窗＋神經接駁夾）、面罩特寫、背面、正面 3/4、正面；只是文件，不給遊戲讀取 |

## 規格核對
- 立繪：853×1280 RGBA 透明，全部 ≤450KB（136–203KB）
- royal-guard：640×960 RGBA，約 113KB（目標約 126KB）
- herman-mecha：853×1280 RGBA，182KB（≤450KB）；herman-battle：640×960 RGBA，114KB（目標約 126KB）
- 背景與劇情圖：1536×864，全部 ≤600KB
- 特效：尺寸與需求一致（119×512、512×512、256×384、640×155、512×199、512×256、128×128），RGBA
- 狀態圖示：128×128 RGBA，各約 8KB
- 技能牌：560×800 WebP，全部 ≤120KB

## 赫爾曼 v4（2026-11-15）
- **定位**：他是**敵人**。前傳在 A2 肉身死亡，全身只剩**大腦**是人類；大腦被裝進機體；改造過度讓大腦錯亂，長出另一個人格「創世神」，並已被它完全佔據（劇中不用「AI」一詞）。陣營：自成一方，由創世神人格主導，不屬於機體派，所以不用機體派鏽紅。詳見 art-bible §6A。
- **造型**：延續前傳 `assets/story/actors/herman.webp`。
  - 頭部是發黑鑄鐵大腦艙，面罩是它的正面板，兩片圓形黃銅鏡片是光學感測器（前傳眼鏡是圓框）
  - **左太陽穴**有一個小圓窗，看得到泡在琥珀液裡的大腦；液體不發光
  - 外套是深咖啡底配古金藤蔓和星盤紋，裡面是機械軀幹和機械腿
  - 右臂和右胸改造最徹底，右肩有藍白電弧，右前臂內建儀器（不是槍）
  - 胸前的徽記是**古金六角齒輪墜飾**：實心六角外框、小齒、中央圓孔；刻意畫成齒輪，不是六芒星
- **神經接駁夾**（舊稱創造神／AI 控制夾，外型不變）：固定設計，大腦接上機體的主介面；創造神設定已作廢，改為大腦錯亂後長出的創世神人格。位置在後腦到上背脊椎，材質是發黑鑄鐵加銀灰護角，接出粗黑纜線。唯一的光是一個極小的警示紅點。
- **美術例外（art-bible §12 #11）**：神經接駁硬體（紅點代表過載警示）可以帶**一個極小的 #B3261E 警示紅點光**，這是發光清單唯一的例外。這個紅不能當表面色；鏽紅 #8C2F1E 保留給機體派。
- **路徑**：立繪放 `assets/story/actors/sequel/`，跟其他續篇立繪一致；戰鬥肖像跟 royal-guard 一樣放 `assets/characters/enemies/`；設定圖放 `docs/design/art/bible/`。整合時沿用美術 Bot 的路徑，沒有調整。

## 路徑有疑義的項目（我選的路徑）
1. **劇情圖 cg-***：需求只寫了 actors 和 backgrounds/locations 兩個路徑，沒寫劇情圖。我放在 `assets/story/illustrations/chapters/`，因為現有的劇情圖都在這裡。
2. **cg-hub-retake**：需求只有一個 id，依路線拆成 `-wheelchair`、`-mecha`、`-blackmarket` 三檔。
3. **新特效 fx-***：需求只說尺寸依 `assets/story/fx/awaken`，沒指定資料夾。我放在 `assets/story/fx/sequel/`，避免跟覺醒特效混在一起。
4. **狀態圖示**：需求寫一張 `ui-status-icons.webp`。依使用者回覆，遊戲只讀單檔，所以拆成 4 張 `ui-status-*.webp`，放在 `assets/ui/status/`（新資料夾）。
5. **fx-heat-puff**：需求寫一張，依回覆拆成 `-1`、`-2`、`-3` 三張單檔。
6. **royal-guard**：需求寫「同 enemies 格式」，所以放在 `assets/characters/enemies/`。
7. **立繪資料夾不一致**：新需求把 serson-mecha-out 放在 `actors/sequel/`，舊需求寫 `actors/`，所以其他 10 張續篇立繪原本交在 `actors/` 根目錄。**整合時（2026-11-15）已統一移到 `actors/sequel/`**，表格的「目標路徑」欄已更新；「交接檔案」欄保留交接資料夾的原始位置。
8. **mecha-body**：需求的用途寫「道具／戰鬥肖像」，但列在 A｜角色立繪，所以放在立繪資料夾（整合後是 `actors/sequel/`）。
9. **設定集**：放在 `docs/design/art/art-bible.md`，設定圖放在 `docs/design/art/bible/`，不跟現有的 CHARACTER-BIBLE-* 檔案衝突。文件內的參考圖路徑原本是 `/workspace/nightfall/...`，整合時已改成 repo 內路徑。
10. **bg-hub-station 的三面旗**：三面旗配色已於 11/14 核准（自由派綠＋三角、皇權派藏青金＋方框、機體派鏽紅黃銅＋六角，以 art-bible 為準），旗幟圖未製作。

## 沒有放進來的
- raw、picks、替代版本、預覽圖、contact sheet、舊的 zip
- `bible/style-lock-v0-superseded.md`（已作廢）

## 整合紀錄（2026-11-15）
- 10 張續篇立繪從 `assets/story/actors/` 移到 `assets/story/actors/sequel/`，和 `serson-mecha-out.webp` 放在一起。舊立繪（rin、shuo、gran-young 等）沒有移動也沒有刪除。
- 「取代借用圖」：查過後，repo 程式目前**沒有任何續篇（J1–J4）的劇情、章節或角色**。rin.webp、gran-young.webp、shuo.webp、enemy-blade.webp 的引用都是前傳角色本人（凜、少年格蘭、朔、前傳士兵／王室衛兵），不是借給續篇角色用，所以都沒有改。要等續篇劇情加進程式時，才直接引用 `sequel/` 的新檔。
- 全部素材都還沒接入遊戲流程，只登錄在 `docs/design/art/sequel-gallery.html` 展示頁（從 `art-gallery.html` 有連結）。這頁放在 docs/，所以不會被 `build-preload-manifest.py` 掃描，也不會讓玩家在背景下載。
- `royal-guard.webp` 在 `assets/characters/` 底下，依 `build-preload-manifest.py` 的規則會自動進入 core 預載。
- `config/art-budgets.json` 新增規則 `assets/ui/status/*` → `icon`。`check-art-budget.py --strict` 檢查 47 個遊戲素材，結果是 WITHIN_BUDGET。

## 整合紀錄（2026-11-15，赫爾曼 v4）
- 新增 `assets/story/actors/sequel/herman-mecha.webp`、`assets/characters/enemies/herman-battle.webp`、`docs/design/art/bible/herman-sheet.png`，路徑照交接，沒有調整。
- `art-bible.md` 以交接版覆蓋：比對後 repo 版沒有交接版缺少的內容，唯一差異是第一批整合時改寫的參考圖路徑，已保留；新段落裡的 `out/herman-*.webp` 也改成 repo 路徑。
- 兩張圖登錄在 `sequel-gallery.html`，沒有接入遊戲劇情程式。
- `herman-battle.webp` 在 `assets/characters/` 底下，跟 royal-guard 一樣，下次執行 `build-preload-manifest.py` 時會自動進入 core 預載（約 114KB）。`herman-mecha.webp` 在 `assets/story/` 底下，程式沒有引用，不會被預載。
- `herman-sheet.png` 在 docs/，不屬於任何 `config/art-budgets.json` 規則，也不會被預載。
