# Dev Plan

## 核心功能

- 完成輸贏的流程
- 定義與實作 n 與 heart 的數量關係
- 基本的外觀
- 固定的十個 puzzle
- 設定頁面
  - 選擇 queen 和 board 的 skin

## puzzle generator

實作一個簡單的 puzzle generator，能夠產生不同難度的 puzzle。

## 將專案改成 monorepo

- 將網頁跟模組化的遊戲邏輯分成兩個 package，並且放在同一個 monorepo 裡面

## 連接後端

- 評估用什麼方式做一個後端＋資料庫，放在 monorepo 裡面
  - 存 puzzle
  - 排行榜：紀錄秒數與軌跡（不需登入，使用者自己輸入名字就好）

## ghost 對戰模式

- 利用已經記錄的秒數與軌跡，讓玩家可以跟 ghost 對戰
  - 結算畫面會同時播放玩家跟 ghost 的軌跡，並且比較秒數

## realtime 對戰模式

- 用 socket 實作一個即時對戰模式，玩家可以跟其他線上玩家對戰
- 排行榜也會有即時對戰的紀錄

## 更多遊戲

- 弄一個入口網站，一開始只有 queener
- 相似邏輯的遊戲
  - 數獨
  - 踩地雷

> 不過要評估一下域名遷移的問題
