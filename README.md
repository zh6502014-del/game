# Nightfall Duel｜夜幕決鬥

瀏覽器卡牌對戰與故事冒險遊戲。使用 HTML、CSS、JavaScript，遊玩不需要 npm 安裝或建置。

## 本機啟動

在專案根目錄執行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

瀏覽器開啟 <http://127.0.0.1:8765/>。進度與音量設定儲存在目前瀏覽器的 `localStorage`；更換網址或連接埠會使用不同的儲存空間。

| 入口 | 用途 |
| --- | --- |
| `index.html` | 首頁，選擇故事或自由決鬥 |
| `Nightfall-Duel-Story.html` | 故事、探索、解謎與暮晶戰鬥 |
| `Nightfall-Duel-V12.12.39-Test.html` | 自由決鬥 |
| `art-gallery.html`、`icon-gallery.html`、`frame-gallery.html` | 開發用素材展示 |

遊戲圖片與字型保存在 `assets/`。部分音訊仍使用外部來源並有合成備援，不能保證完全離線時與線上聽感相同。

## 目錄分類

```text
index.html / Nightfall-*.html   遊戲入口（保留既有網址）
*-gallery.html                素材展示入口
sw.js                         素材快取（service worker）
src/
  js/                         遊戲程式、劇情資料、特效與音效邏輯（preloader.js 為載入畫面與預載）
  css/                        共用樣式及各模式介面
assets/                       遊戲與展示頁使用的圖片、音訊、字型（分類見 assets/README.md）
config/                       美術預算與工作流設定
scripts/                      素材生成、版本更新與檢查工具
tests/                        自動化測試，依領域分資料夾（見 tests/README.md）
docs/
  agents/                     協作入口與工作板
  design/                     現行設計與工單，依領域分 story／art／fx-audio／ui／project
  archive/                    歷史決策與研究文件
storage/                      本機原稿、備份、預覽、暫存及未採用素材
test-results/                 本機測試產物，不加入 Git
```

命名規則：資料夾與素材檔名一律英文小寫 kebab-case，依「內容類型」分類，不以工單編號當資料夾名；工單編號只放在文件檔名後綴（例如 `STORY-REWRITE-050.md`）。舊路徑對照見 `docs/assets-path-map-2026-10-09.json`、`docs/docs-tests-path-map-2026-10-09.json`。

程式導覽：`src/js/game.js` 為自由決鬥核心，`src/js/story-*.js` 為故事模式；樣式仍依各 HTML 的載入順序套用。JS 產生的素材網址以 HTML 頁面位置為基準，CSS 中素材網址以 CSS 檔案位置為基準。

[存放區說明](storage/README.md)及[搬移索引](storage/moved-files.json)可查找舊資料。原始美術與生成紀錄已無損封存在本機 `storage/source-art.tar.gz`，逐檔清單為 `storage/source-art-manifest.json`。改圖或執行原稿生成工具前，先執行下方恢復指令；大封存包不包含在 GitHub 版本中，請另外備份。

```sh
python3 scripts/source-art-archive.py verify
python3 scripts/source-art-archive.py restore
```

`restore` 會還原至 `storage/source-art/`，拒絕覆寫既有目錄。恢復後會重新占用約 837 MiB；封存包仍保留。工具目前支援 macOS 與 Linux 的安全安裝目的目錄，封存本身是標準 tar.gz 格式；若改用一般解壓工具，可能保留 hard-link，編輯前須拆成獨立檔案並避免覆寫。

## 上傳 GitHub

`.gitignore` 已排除本機存放區內容、測試產物、快取、系統檔及常見環境設定；`storage/` 只收錄說明、搬移索引與原稿雜湊清單。遊戲所需的 `src/`、`assets/` 和 HTML 會納入版本管理。

在 GitHub 建立空白 repository 後，可從本機根目錄執行下列指令。先檢視 staged 清單再提交；把最後一行的網址換成自己的 repository。

```sh
git init -b main
git add .
git diff --cached --stat
git status --short
git commit -m "Initial Nightfall Duel project"
git remote add origin https://github.com/YOUR-NAME/YOUR-REPOSITORY.git
git push -u origin main
```

本次整理尚未執行初始化、commit 或上傳。GitHub 網頁直接拖曳資料夾不會替你套用 `.gitignore`，請使用 Git 或 GitHub Desktop 提交。

## 開發與驗證

```sh
python3 scripts/workflow.py map
# 會先重建 src/css/dist 的 CSS bundle（模組見 src/css/README.md），再更新版本號
python3 scripts/version-assets.py
python3 tests/tooling/asset-versions.py
python3 tests/tooling/workflow.py
python3 tests/tooling/change-scope.py
```

JS/CSS 修改後更新版本，再驗證引用。新增圖片另執行 `python3 scripts/check-art-budget.py --strict <素材路徑>`。Node 測試需要 Node.js；瀏覽器測試另需 Playwright 與 Chrome。各測試的伺服器、fixture 及輸出需求不同，參見 [工作流工具](docs/workflow-tools.md)，舊比較測試不等同一般啟動檢查。需要本機歷史基線的套件不能僅靠 GitHub checkout 完成；缺少基線時不可宣稱已通過。

## 文件入口

- [AGENTS.md](AGENTS.md)：協作規範。
- [工作板](docs/agents/WORKBOARD.md)：現況與工單索引。
- [工程審查流程](docs/engineering-workflow.md)：基線、差異審查與驗收。
- [素材預算](docs/art-asset-budget.md)：尺寸與容量。
- [暮晶戰鬥規則](docs/story-energy-v1-contract.md)：故事戰鬥契約。
- [本次整理紀錄](docs/design/project/PROJECT-CLEANUP-062.md)：範圍、驗證及限制。
