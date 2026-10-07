# Nightfall Duel｜夜幕決鬥

故事從四位主角各自的過往展開。他們因一名尋找父親的女孩而相遇，帶著不完整的線索與各自的傷痕，逐步追查暮晶、鐘聲與失蹤者背後的秘密。

瀏覽器卡牌對戰與故事冒險遊戲，使用 HTML、CSS、JavaScript，無需 npm 安裝或建置。

## 本機遊玩

在此資料夾執行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

開啟 http://127.0.0.1:8765/ 。遊戲進度保存在目前瀏覽器、網址及連接埠對應的 localStorage。

| 入口 | 用途 |
| --- | --- |
| index.html | 遊戲首頁 |
| Nightfall-Duel-Story.html | 故事、探索、解謎與暮晶戰鬥 |
| Nightfall-Duel-V12.12.39-Test.html | 自由決鬥 |
| art-gallery.html、icon-gallery.html、frame-gallery.html | 素材展示 |

`src/js/` 保存程式，`src/css/` 保存樣式，`assets/` 保存遊戲素材與字型。請保留目錄結構，避免搬動素材而使相對路徑失效。部分音訊使用外部來源並提供合成備援。

本次上傳提供可遊玩的遊戲檔案；開發工具、測試、原稿封存及测试輸出保留在本機開發專案。原稿封存不需要下載，也不影響遊戲載入。
