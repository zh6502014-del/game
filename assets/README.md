# assets 分類說明

依「內容類型」分資料夾；檔名為英文小寫 kebab-case。新增素材先找對應資料夾，沒有再新增，不要用工單編號命名資料夾。

| 路徑 | 內容 |
| --- | --- |
| `audio/duel/` | 決鬥音效與環境音 |
| `audio/story/` | 劇情音樂與特效音（`fx/`、`shield-rhythm/`） |
| `cards/` | 卡面、卡背 |
| `characters/` | 四職業立繪與敵人（`enemies/`） |
| `coins/` `emblems/` `environments/` `icons/` `maps/` `skins/` | 硬幣、徽章、場景、圖示、地圖、皮膚 |
| `fonts/` | 本機字型（Noto Serif TC 分片） |
| `frames/v1` `frames/v2` | UI 框架（v2 為現行） |
| `puzzles/` | 支線小遊戲素材（`recorder/` 錄音機等） |
| `story/actors/` | 劇情角色立繪（`narva/` `extra/` `gun-unify/` 為各版本補充） |
| `story/backgrounds/` | 場景背景（`locations/` 章節場景、`street-scenes/`、`h1-control-room/`） |
| `story/illustrations/` | 整張插圖（`chapters/` 主線章節、`gun-unify/` 槍械統一版、`class-origin/` 職業前傳、`node-posters/`、`swordsman-stills/`、`corrections/`、`wolf-facing/`、`rin-wanted/`、`h1-valve-action/`） |
| `story/props/` | 道具（`archive-materials/` `guns/` `map-art/` `chapter-props/`） |
| `story/fx/awaken/` | 覺醒特效序列圖 |
| `story/minigames/shield-rhythm/` | 盾牌節奏小遊戲素材 |
| `story/_records/` | 生成紀錄與提示詞（不載入遊戲） |

同名檔案出現在多個資料夾時，代表不同版本，遊戲以程式內的完整路徑為準；刪除前先確認沒有被引用。
改動素材或路徑後執行：`python3 scripts/build-preload-manifest.py`、`python3 scripts/version-assets.py`、`python3 tests/tooling/asset-versions.py`。
