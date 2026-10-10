# src/css｜UI 模組化樣式

樣式的**原始碼是模組**（本資料夾內的各 `.css`），頁面實際載入的是 `dist/` 內每頁一支的 bundle。改樣式請改模組，再執行 `python3 scripts/version-assets.py`（會先重建 bundle 再更新版本號）。

## 載入方式

- `config/css-manifest.json`：每個 HTML 入口載入哪些模組、**依什麼順序**（順序即 cascade 順序）；`bundles` 指出輸出檔。
- `scripts/build-css.py`：依 manifest 把模組串成 `dist/home.css`、`duel.css`、`story.css`、`art-gallery.css`、`frame-gallery.css`、`icon-gallery.css`（每個模組前有 `/* ==== 路徑 ==== */` 標記，方便在 DevTools 對照）。`--check` 只檢查 bundle 是否過期、模組是否漏列。
- `tests/tooling/asset-versions.py` 會同時檢查版本號與 bundle 是否最新；`dist/` 不要手改。

## 分層與資料夾職責

| 層 | 內容 | 規則 |
|---|---|---|
| `tokens.css` | `:root` 設計 token：`--nd-font`、字級 `--nd-fs-*`、間距 `--nd-sp-*`、圓角 `--nd-r-*`、色票 `--nd-gold*`／`--nd-ink-*`／`--nd-line*` 等 | 所有頁面第一個載入。新數值先找現有 token，沒有再新增到這裡 |
| `base/` | 字型（`fonts`）、全域重設與 `html/body/button` 等（`global`）、動畫關鍵影格（`keyframes`） | 只放與具體元件無關的規則 |
| `layout/` | 版面骨架：`app`（頁面容器）、`duel-board`（對戰舞台、雙方面板、中央場地、手牌盤、底部指令列的網格與定位） | 只決定位置、尺寸、間距、斷點行為 |
| `components/` | 可重用元件外觀：`card`、`hand`、`hud`、`control`、`modal`、`panel`、`log`、`environment`、`preloader` | 元件各自一組；不要在這裡寫整頁版面 |
| `screens/` | 整頁／整個流程專屬：`home`、`setup`（選角與設定）、`result`（結算／擲幣）、`gallery.*`（三個 gallery 頁自己的樣式） | 只在對應畫面出現的樣式 |
| `story/` | 劇情模式：`shell`（外框）、`stage`（舞台／對話）、`campaign`（地圖、節點、收藏）、`battle`（劇情戰鬥）、`puzzle`、`maze`、`route`、`search`、`archive-wall`、`shield-rhythm`、`sidequest`（支線共用框）、`shared` | 小遊戲各自一個模組，共用的支線對話框放 `sidequest` |

## 檔名規則

- **範圍後綴**表示哪些頁面會載入該檔：無後綴＝首頁＋對戰＋劇情（story 資料夾內無後綴＝只有劇情）；`.shared`（story 資料夾）＝首頁＋對戰＋劇情都載入的劇情相關規則；`.duel`＝只有對戰頁；`.story`＝只有劇情頁；`.gallery-art`／`.gallery-frame`／`.gallery-icon`／`.gallery-art-icon`／`.gallery-all`＝除了遊戲頁，還有這些 gallery 頁需要。這是為了讓每個頁面載入的規則與模組化之前完全相同。
- **數字後綴**（`card.2.css`、`modal.3.css`…）：同一元件在 cascade 中被其他元件的規則「夾住」，順序不能對調，所以分成多段；載入順序以 manifest 為準，**數字不代表優先序，只是第幾段**。

## 修改時的規則

1. 改既有規則：在它所在的模組直接改，不要為了覆蓋它在別處再加一條更晚的規則。
2. 新增元件／畫面：新建模組，加入 `config/css-manifest.json` 想載入的頁面清單（位置決定 cascade 順序），再跑 `python3 scripts/version-assets.py`。
3. 數值用 token：字級、間距、圓角、常用色用 `var(--nd-*)`；token 不夠用就加 token，不要寫新的魔術數字。
4. 本專案大量規則靠「同權重、後者勝」互相覆蓋。**調整模組順序、合併或搬動規則之前**，先用 `tests/tooling/css-snapshot.py` 前後各拍一份快照比對（見下），沒有差異才算安全。
5. 避免新增 `!important`；已存在的多半是歷史修補層留下的，移除前同樣要跑快照比對。

## 驗證工具

`tests/tooling/css-snapshot.py` 會把首頁、對戰、劇情地圖、三個 gallery 與劇情小遊戲／戰鬥各狀態在 4 種視窗尺寸下，每個元素（含 `::before/::after`）的 computed style 存成 JSON，並可逐屬性比對兩個版本。流程：
```sh
python3 tests/tooling/css-snapshot.py snap <改前專案副本> before.json --set all
python3 tests/tooling/css-snapshot.py snap <改前專案副本> noise.json  --set all   # 同版本再拍一次，用來排除圖片載入／打字機動畫的時序雜訊
python3 tests/tooling/css-snapshot.py snap .                 after.json  --set all
python3 tests/tooling/css-snapshot.py diff before.json after.json noise.json
```
加 `--force` 會把所有元素強制成 hover／active／focus 狀態再拍。需要 `pip install playwright` 與 Chromium；素材圖不需要齊全。

## 與舊檔案的對照

2026-10-10 之前的樣式是 31 個依「版本修補順序」命名的平面檔（`styles.css`、`card-theme.css`、`story-energy-ui.css`…）。`docs/css-legacy-map.json` 列出每個舊檔的規則現在分散在哪些模組；舊檔備份在 `storage/legacy-css-2026-10-10/`（不進 GitHub）與 `storage/pre-ui-modular-2026-10-10.tgz`。歷史工單與文件提到的舊檔名，請用對照表換算。

## 模組清單

| 模組 | KB | 載入的頁面 |
|---|---|---|
| `tokens.css` | 1.7 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `base/fonts.gallery-all.css` | 106.7 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `base/fonts.story.css` | 0.2 | 劇情 |
| `base/global.css` | 0.9 | 首頁、對戰、劇情 |
| `base/global.gallery-all.2.css` | 0.9 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `base/global.gallery-all.css` | 0.2 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `base/global.gallery-art-frame.css` | 0.7 | 首頁、對戰、劇情、art-gallery、frame-gallery |
| `base/global.gallery-art-icon.css` | 0.5 | 首頁、對戰、劇情、art-gallery、icon-gallery |
| `base/global.gallery-art.2.css` | 0.9 | 首頁、對戰、劇情、art-gallery |
| `base/global.gallery-art.css` | 2.2 | 首頁、對戰、劇情、art-gallery |
| `base/keyframes.css` | 0.1 | 首頁、對戰、劇情 |
| `base/keyframes.duel.css` | 0.6 | 對戰 |
| `base/keyframes.gallery-art-icon.css` | 1.0 | 首頁、對戰、劇情、art-gallery、icon-gallery |
| `base/keyframes.gallery-art.css` | 4.4 | 首頁、對戰、劇情、art-gallery |
| `base/keyframes.story.css` | 14.3 | 劇情 |
| `layout/app.css` | 0.9 | 首頁、對戰、劇情 |
| `layout/duel-board.2.css` | 5.3 | 首頁、對戰、劇情 |
| `layout/duel-board.3.css` | 23.3 | 首頁、對戰、劇情 |
| `layout/duel-board.css` | 12.0 | 首頁、對戰、劇情 |
| `layout/duel-board.duel.css` | 14.8 | 對戰 |
| `layout/duel-board.gallery-art.2.css` | 0.1 | 首頁、對戰、劇情、art-gallery |
| `layout/duel-board.gallery-art.css` | 6.4 | 首頁、對戰、劇情、art-gallery |
| `components/card.2.css` | 2.9 | 首頁、對戰、劇情 |
| `components/card.3.css` | 9.7 | 首頁、對戰、劇情 |
| `components/card.4.css` | 1.7 | 首頁、對戰、劇情 |
| `components/card.css` | 15.9 | 首頁、對戰、劇情 |
| `components/card.duel.css` | 1.5 | 對戰 |
| `components/card.gallery-all.css` | 0.8 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `components/card.gallery-art-frame.css` | 0.8 | 首頁、對戰、劇情、art-gallery、frame-gallery |
| `components/card.gallery-art-icon.css` | 0.4 | 首頁、對戰、劇情、art-gallery、icon-gallery |
| `components/card.gallery-art.2.css` | 0.6 | 首頁、對戰、劇情、art-gallery |
| `components/card.gallery-art.3.css` | 1.8 | 首頁、對戰、劇情、art-gallery |
| `components/card.gallery-art.css` | 1.6 | 首頁、對戰、劇情、art-gallery |
| `components/card.gallery-frame.css` | 0.3 | 首頁、對戰、劇情、frame-gallery |
| `components/control.2.css` | 1.1 | 首頁、對戰、劇情 |
| `components/control.3.css` | 2.9 | 首頁、對戰、劇情 |
| `components/control.css` | 5.9 | 首頁、對戰、劇情 |
| `components/control.duel.css` | 0.8 | 對戰 |
| `components/environment.css` | 1.9 | 首頁、對戰、劇情 |
| `components/environment.duel.css` | 0.1 | 對戰 |
| `components/environment.gallery-art.css` | 1.5 | 首頁、對戰、劇情、art-gallery |
| `components/hand.2.css` | 7.7 | 首頁、對戰、劇情 |
| `components/hand.css` | 0.2 | 首頁、對戰、劇情 |
| `components/hand.duel.css` | 1.1 | 對戰 |
| `components/hud.css` | 28.1 | 首頁、對戰、劇情 |
| `components/hud.duel.css` | 2.8 | 對戰 |
| `components/hud.gallery-art.css` | 0.6 | 首頁、對戰、劇情、art-gallery |
| `components/log.2.css` | 0.6 | 首頁、對戰、劇情 |
| `components/log.css` | 1.5 | 首頁、對戰、劇情 |
| `components/modal.2.css` | 3.1 | 首頁、對戰、劇情 |
| `components/modal.3.css` | 1.6 | 首頁、對戰、劇情 |
| `components/modal.4.css` | 2.7 | 首頁、對戰、劇情 |
| `components/modal.5.css` | 0.5 | 首頁、對戰、劇情 |
| `components/modal.css` | 2.3 | 首頁、對戰、劇情 |
| `components/modal.gallery-all.css` | 0.2 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `components/panel.2.css` | 1.2 | 首頁、對戰、劇情 |
| `components/panel.css` | 3.4 | 首頁、對戰、劇情 |
| `components/panel.duel.css` | 0.3 | 對戰 |
| `components/preloader.css` | 1.7 | 首頁、對戰、劇情 |
| `screens/gallery.art.css` | 2.3 | art-gallery |
| `screens/gallery.frame.css` | 1.4 | frame-gallery |
| `screens/gallery.gallery-art-icon.css` | 0.2 | 首頁、對戰、劇情、art-gallery、icon-gallery |
| `screens/gallery.gallery-art.css` | 0.5 | 首頁、對戰、劇情、art-gallery |
| `screens/gallery.gallery-icon.css` | 0.1 | 首頁、對戰、劇情、icon-gallery |
| `screens/gallery.icon.css` | 2.9 | icon-gallery |
| `screens/home.css` | 5.5 | 首頁、對戰、劇情 |
| `screens/home.gallery-all.css` | 0.3 | 首頁、對戰、劇情、art-gallery、frame-gallery、icon-gallery |
| `screens/result.css` | 5.9 | 首頁、對戰、劇情 |
| `screens/result.duel.css` | 0.4 | 對戰 |
| `screens/setup.2.css` | 7.2 | 首頁、對戰、劇情 |
| `screens/setup.3.css` | 1.3 | 首頁、對戰、劇情 |
| `screens/setup.css` | 12.2 | 首頁、對戰、劇情 |
| `screens/setup.duel.css` | 0.2 | 對戰 |
| `story/archive-wall.css` | 2.6 | 劇情 |
| `story/battle.css` | 92.8 | 劇情 |
| `story/battle.shared.css` | 1.1 | 首頁、對戰、劇情 |
| `story/campaign.2.css` | 0.7 | 劇情 |
| `story/campaign.css` | 5.4 | 劇情 |
| `story/campaign.shared.2.css` | 0.4 | 首頁、對戰、劇情 |
| `story/campaign.shared.3.css` | 1.2 | 首頁、對戰、劇情 |
| `story/campaign.shared.4.css` | 2.2 | 首頁、對戰、劇情 |
| `story/campaign.shared.5.css` | 1.5 | 首頁、對戰、劇情 |
| `story/campaign.shared.6.css` | 1.2 | 首頁、對戰、劇情 |
| `story/campaign.shared.css` | 1.0 | 首頁、對戰、劇情 |
| `story/maze.css` | 6.9 | 劇情 |
| `story/maze.shared.css` | 0.2 | 首頁、對戰、劇情 |
| `story/puzzle.css` | 28.2 | 劇情 |
| `story/puzzle.shared.2.css` | 0.8 | 首頁、對戰、劇情 |
| `story/puzzle.shared.css` | 0.6 | 首頁、對戰、劇情 |
| `story/route.css` | 3.7 | 劇情 |
| `story/route.shared.2.css` | 0.7 | 首頁、對戰、劇情 |
| `story/route.shared.css` | 0.6 | 首頁、對戰、劇情 |
| `story/search.css` | 30.7 | 劇情 |
| `story/search.shared.css` | 1.2 | 首頁、對戰、劇情 |
| `story/shared.css` | 3.0 | 劇情 |
| `story/shell.2.css` | 2.3 | 劇情 |
| `story/shell.css` | 3.8 | 劇情 |
| `story/shell.shared.2.css` | 0.9 | 首頁、對戰、劇情 |
| `story/shell.shared.3.css` | 0.8 | 首頁、對戰、劇情 |
| `story/shell.shared.4.css` | 1.4 | 首頁、對戰、劇情 |
| `story/shell.shared.5.css` | 0.1 | 首頁、對戰、劇情 |
| `story/shell.shared.6.css` | 2.8 | 首頁、對戰、劇情 |
| `story/shell.shared.css` | 2.1 | 首頁、對戰、劇情 |
| `story/shield-rhythm.css` | 19.0 | 劇情 |
| `story/sidequest.css` | 3.2 | 劇情 |
| `story/stage.2.css` | 2.7 | 劇情 |
| `story/stage.css` | 23.0 | 劇情 |
| `story/stage.shared.2.css` | 0.6 | 首頁、對戰、劇情 |
| `story/stage.shared.3.css` | 0.5 | 首頁、對戰、劇情 |
| `story/stage.shared.4.css` | 0.3 | 首頁、對戰、劇情 |
| `story/stage.shared.5.css` | 2.6 | 首頁、對戰、劇情 |
| `story/stage.shared.css` | 0.4 | 首頁、對戰、劇情 |
