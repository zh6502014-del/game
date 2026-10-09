# UI-CONSISTENCY-002｜控制項與圖示實際呈現一致性

本輪針對實際畫面上的控制項，延續 UI-CONSISTENCY-001 的圖示幾何與語意檢查。美術／UI agent 唯讀審查，產品負責程式與共用樣式，回歸 agent 負責既有操作測試。

## 發現與修正

| 已確認問題 | 本輪修正 |
| --- | --- |
| 音效／關閉按鈕在 390px 只有 40×44px | 圖示操作鈕統一 44×44px，20px 圖示置中；保留 aria-label |
| 結算返回／複製圖示貼字，其他畫面靠字串空白間隔 | 指定控制項共用 flex 對齊、8px gap，去除標籤邊緣空白 |
| 劇情對戰及失敗結算的返回按鈕是瀏覽器白底淡字 | 改為墨綠琺瑯底、古金文字及既有 PNG 邊框；補返回／再戰圖示 |
| 故事導覽連結僅約 16–22px 高，同列按鈕44px | 導覽連結統一至少44px高，保留連結語意與文字 |
| 桌面選角輔助按鈕11px、音量值11px | 相同用途至少12px；數值不換行 |
| 音量滑桿只有16px高的操作區 | 擴大到44px，保留原生拖曳、鍵盤、值域與音量事件 |
| 返回首頁用「上一個」箭頭；偷牌用通用卡牌圖 | 返回導航用 back，前後切換仍用 left/right；偷牌用 steal |
| 標題與說明膠囊的20px圖示沒有尺寸層級 | 彈窗標題24px、操作20px、說明膠囊16px，全部沿用1.75主線 |

## 模組與改動範圍

新增 [ui-controls.css](../../src/css/ui-controls.css)，提供 `.nd-control`、`.nd-icon-button` 與尺寸／色彩／間距 token。採明確選擇的元件套用，卡片、翻牌、故事選項、拼圖形狀不受通用控制項布局影響。沒有宣稱完整 UI 已模組化。

[game-art.js](../../src/js/game-art.js) 的呈現轉接器為既有控制項加 class 和圖示；不改事件處理、對外 API 或核心遊戲規則。

三個遊戲入口載入新模組；五個 HTML 的既有 game-art.js 版本引用更新。圖示原檔、角色／卡牌原畫及故事敘事模組未改動。

## 驗證

- [定向測試](../../test-results/ui-controls.json)：1440／900／700／390／320px，圖示44px操作區及置中誤差<1px、20px本體／1.75線寬、返回／偷牌語意、輔助文字尺寸、滑桿 End／ArrowLeft 與99%／100%、故事對戰離開確認、結算重試／返回，無水平溢出或 JS 錯誤。
- 320px 音效面板文字放大200%後，彈窗沒有水平溢出，關閉圖示仍完整。
- `node --check game-art.js` 通過；`python3 tests/asset-versions.py` 共73筆引用符合內容摘要。
- [操作回歸](../../test-results/ui-smoke.json) 本輪 exit 0：四寬度實際拖牌進第2回合、戰況／規則／音效／詳情、三種注入終局、再戰及返回大廳；errors=[]。執行時 game-art.js 與 ui-controls.css 摘要一致，涵蓋最終版本。

已人工查看 [手機音效面板](../../test-results/controls-audio-390.png) 與 [手機故事結算](../../test-results/controls-story-result-390.png)。[桌面音效面板](../../test-results/controls-audio-1440.png)、[桌面故事結算](../../test-results/controls-story-result-1440.png) 亦保留作對照。

## 邊界

這是桌面 Chrome 的 viewport／文字放大驗證，不代表實體手機、Safari 或完整故事遊戲樹驗證。滑桿驗證為控制項與設定數值，不等同實際音量聽測。UI smoke 記錄既有外部音效12次 ERR_ABORTED（四寬度分別5／2／3／2），沒有阻止UI操作；完整聲音播放仍未驗證。沒有重新載入使用者對局或寫入真實存檔。

初次定向測試在原生 dialog 的 close 事件尚未派送時立即查詢 DOM，得到仍有1個節點；改為等候對話框實際移除後重跑通過，沒有因此修改遊戲行為。
