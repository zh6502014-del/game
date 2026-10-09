# PROJECT-CLEANUP-062｜獨立工程審查

日期：2026-10-07。角色：工程師唯讀審查；只寫本報告，未修改程式、測試、版本或素材。

## 結論

可交付本次專案整理，交由產品最終驗收。本次未發現需補正的 P0／P1／P2；這不是全遊戲零缺陷或所有歷史測試通過的聲明。

## 範圍與基線

依 AGENTS.md、ENGINEER.md 及 PROJECT-CLEANUP-062 工單，核對根 JS/CSS 搬移、六 HTML 引用、scripts/tests/config 適配、Git 忽略設定、storage 搬移、README、文件及素材來源 metadata。使用整理前 `test-results/project-cleanup/before/` 原文及 `before-manifest.json` 全檔雜湊；核對實際 unified diff，並非只相信 implementation-files 清單。此基線可證明本輪差異，不能識別歷史作者或證明歷史改動無越權。

## 本次獨立檢查

- 對 57 份原 JS/CSS/HTML 做全文比較：CSS 還原 `../../assets/`、HTML 還原 `src/js/`、`src/css/` 並忽略內容版本碼後，與 before 完全一致。JS 本文未變，故未夾帶 AI、傷害、RNG、故事、存檔或 UI 行為修改。該比較在 combat-visuals 最後封存前執行，最終為 50 份現用 JS/CSS、6 HTML 及 1 份封存 CSS。
- 最後依 moved-files 對 before-manifest 重新計算 903 份封存檔 SHA-256，全數相符；包含 `storage/unused-code/combat-visuals.css`，不含改寫相對 URL 的新版本。確認現用 src 與 HTML 沒有 dark-051、v1 slices/originals 的執行引用；combat-visuals 未被六入口載入，並有已撤回工單依據。
- `python3 scripts/workflow.py map` 可用；config 的 source glob、檔案與依賴更新至 src。版本脚本原本即可處理子路徑，毋須改寫。
- 實跑 `python3 tests/asset-versions.py`：114 筆本機 JS/CSS 引用版本通過。
- 檢查測試實際 diff：主要是載入與 hash 路徑；兩處未使用的歷史 baseline 讀取移除，未移除行為斷言。hud-polish 保留舊 fixture 本文，route 對舊 HTML 根目錄 URL 提供現用程式 fallback；一般比較 fixture 不再依賴本機 backups。必要 fixture 已列入 Git 預計清單。
- .gitignore 保留 storage 說明／搬移索引、排除原稿／備份／產物；runtime src/assets/HTML 未排除。.gitattributes 的文字及二進位區分未發現本次問題。素材生成工具使用本機 storage 原稿，屬生成工具的明示依賴，遊玩不依賴它們。
- README 清楚交代啟動、分類、Git 操作、本機原稿另存及外部音訊限制。文件／metadata 路徑變更未改規則或資產內容。

## 沿用證據與限制

沿用 `test-results/project-cleanup/` 的 preservation、upload、local-references/static-links、syntax、source-equivalence、fixtures、browser-report 及各測試 log；另外独立核對上述全文與封存雜湊。browser-report 記錄六入口 errors/missing 為空；本審查未另開瀏覽器，不將此視為全章節、戰鬥分支、所有視窗尺寸或完整音訊聽感驗收。瀏覽器記錄之 images 空陣列未提供每張圖片覆蓋清單。

既有 skin-store、story-battle、story-chapter-art 三組 assertion 失敗，以及 story-stage-assets 在有 Pillow 的 bundled Python 中仍發生 resolve(image.title) undefined，均有 before 重現紀錄（後者為 story-stage-assets-bundled.log 與 story-stage-assets-bundled-baseline.log），不能標為測試通過，也不能為此次搬移擅改規則。story-energy-frames 仍需要 `STORY-BATTLE-UI-001-before.json` 的可信歷史 snapshot；未隨 Git 交付，不能宣稱乾淨 checkout 可跑全部歷史比較。部分舊測試具有本機 Node 路徑、Playwright／Chrome、固定服務埠等既有環境前提，這次未全面移植或實跑。

Git 上傳清單與容量報告為取樣時點；產品新增本報告及最後驗收紀錄後应重算最終檔數／bytes。未初始化本專案 Git、未 commit、未建立遠端、未 push。storage 不隨 clone 返回，原稿保留仍需另外備份。
