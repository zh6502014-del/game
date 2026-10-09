# STORY-C4-ARCHIVE-022｜C4〈文件庫〉實作紀錄

2026-09-28 完成。依使用者提供的補寫稿實作；框架見 [STORY-C4-ARCHIVE-022-框架](STORY-C4-ARCHIVE-022-框架.md)。

## 採用決定
- 磷手上的紙改為「入庫索引」：只有庫位與件號，沒有命令正文。C3 結尾旁白、C3 第 3 幕標題、P3 封存案卷說明同步修改。
- 文件庫：研究機構外圍行政樓地下，暮鐘協會行政保管體系（依補寫稿；保管者不等於簽發者）。
- 章內資料值：研字第017號、簽發日九月十六日、凜於十七日晚上接任務（依補寫稿）。
- 修正補寫稿中凜的人稱：一律「她／妳」；「研究区」改「研究區」。

## 內容
- C4 三幕：前往文件庫／內庫取件／核對命令正本，共 53 步。
- 戰鬥 `C4-outer`：凜＋伊芙 對 外廊看守（劍客 10/1）、警戒槍手（槍手 10/1）。
- 戰鬥 `C4-inner`：凜＋朔 對 內庫盾衛（坦克 12/1）、內庫槍手（槍手 10/1）。
- 任務 `orders-archive`（取代 `orders-crosscheck`）：單份文件，依序標記研究案號→簽發日期→處置對象；順序錯誤只提示、不扣分。
- 第 2 幕暫用研究室背景＋凜、伊芙、朔立繪；外廊、文件庫、內庫的新背景待生成（畫面描述見補寫稿）。

## 修改檔案
story-chapters.js、story-task-data.js、story-tasks.js／css、story-campaign.js（encounters）、story-campaign-data.js、story-stage-assets.js、story-art.js、tests/story-c4-archive.cjs；修改前備份在 backups/pre-c4-archive-2026-09-28/。

## 驗證
- tests/story-c4-archive.cjs：1440／390 兩種寬度通過（解鎖、兩場戰鬥、欄位順序防呆、三欄標記、無橫向捲動、完成收錄、無頁面錯誤）。
- story-campaign（40 節點完整遊玩，含新 C4）、story-complete、story-tasks、story-storage 通過。先前失敗是測試環境缺少另一工作階段新增的 story-maze.js，以及該階段已更新的任務數；非程式缺陷。
- story-route.cjs 仍檢查舊版宮格連路對話框，但 T1 已改為街區轉向（story-maze.js），測試待該工作負責人更新。
