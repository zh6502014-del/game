# Selector Merge Pass 5

日期：2026-09-21。範圍僅 `.arena`、`.board`、`.vs`、`.arena-hud`。
原有 AGENTS.md 與 selector-merge-plan.md 未提供；本文件記錄本輪實際工作。

## 備份

`styles.css.pre-selector-merge-pass5.backup.css` 為修改前完整樣式。

## 分析與修改

- `.arena`：移除最早的 `margin:16px 0`，它被後續同 scope 的 `margin:12px 0 14px` 覆蓋；430px 的 margin 覆蓋保留。移除 V6.4 的 padding-top/bottom，因後面的 V6.7 padding shorthand 已覆蓋。保留 V6.7 layout、手機 padding/min-height、V12.10.17 background 的位置。
- `.arena-hud`：移除 V6.4 規則；position/left/right 被 V6.7 同 selector 覆蓋，z-index/pointer-events 與 V6.7 完全重複。保留 enemy/player 更高 specificity 的規則及手機覆蓋。
- `.vs`：將最早規則的 color/text-shadow 合併至 V12.9.3 同 selector；無其他 `.vs` color/text-shadow 宣告衝突。
- `.board`：保留。Base height 與手機 height 存在順序關係；`.arena .board` specificity 更高；V12.9.4 使用 important 且另有手機 scope。本輪不搬移或跨 scope 合併。
- 上述精確 selector 的修改位於 Base；Final UI Patch 未修改。其他 selector、HTML、JS 與音效未修改。

## 實際驗證

- `node --check game.js`：通過；game.js 與提供的來源檔完全相同。
- Chrome CSSStyleSheet 解析：修改後比修改前少 3 個頂層規則；非本輪 selector 的解析結果完全相同。
- 指定 selector 測試 fixture：1440、900、700、390px 的計算樣式均與修改前一致。
- 完整戰鬥頁 DOM 及偽元素：同四種寬度計算樣式均與修改前一致。
- Chrome 實測選角頁 → 開始決鬥 → 滑鼠拖曳手牌至己方放置區 → 自動結算 → 第 2 回合：四種寬度均通過。
- 四種寬度戰鬥頁均無水平溢出、無未捕捉的 JavaScript 例外。
- 本機 coinFlip.wav HTTP 200。
- 已檢視 1440px 與 390px 戰鬥截圖。

## 測試限制與既有問題

- 為穩定比較 computed style，測試使用 reduced motion 並停用動畫／transition；未驗證動態 FLIP clipping、實體手機觸控或整場對戰所有職業。
- 部分外部音效請求出現 ERR_ABORTED；遊戲仍完成回合。本機 WAV 可讀取不等同已驗證音訊輸出。
- 原始 CSS 含 `.arena.phase-reveal @keyframes combatStatusIn` 非標準寫法，未在本輪範圍修改。瀏覽器 CSSOM 會容錯，因此本輪解析檢查不代表整份原始 CSS 符合嚴格語法驗證。

## 重跑

需 Node.js、Playwright 套件與 Google Chrome。可透過 PLAYWRIGHT_MODULE 環境變數指定 Playwright 模組路徑。

```sh
node --check game.js
node tests/css-check.cjs
node tests/smoke.cjs
```

結果：`test-results/css-check.json`、`test-results/smoke.json` 與 `battle-*.png`。
