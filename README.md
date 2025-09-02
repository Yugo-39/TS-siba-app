# 🐕 SIBAINU

このアプリは **子供から大人まで楽しめる柴犬探しゲーム** です。  
背景の中から柴犬を探し、たまに出てくる **レア柴犬** を見つけて図鑑を完成させましょう！

---

## 🛠 使用技術
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

---

## 🎮 デモ
👉 [Netlifyで公開中](https://regal-salmiakki-afe98b.netlify.app/)

---

## 🚀 インストール方法

```bash
git clone https://github.com/Yugo-39/TS-siba-app.git
cd TS-siba-app
npm install
npm run dev

---
主な機能

背景から柴犬をクリックして見つけるゲーム

レベル選択 & 難易度別ステージ

ローカル保存機能（進捗を記録）

柴犬のランダム出現機能

図鑑機能（集めた柴犬をコレクション）

ランク機能（プレイヤーの達成度を評価）

---
📁 ディレクトリ構造

TS-SIBA-APP/
├── public/                     # 静的ファイル
│   ├── images/                 # 画像素材
│   │   ├── background/         # 背景画像
│   │   ├── dogs/               # 犬キャラクター画像
│   │   └── home/               # ホーム画面用画像
│   ├── sounds/                 # 効果音・BGM
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/                        # アプリ本体
│   └── app/                    # Next.js App Router 構造
│       ├── components/         # 再利用コンポーネント
│       │   ├── utils/          # ユーティリティ関数
│       │   │   └── getRandomBreed.ts
│       │   ├── CamouflageShibaInuDog.tsx
│       │   ├── DogCard.tsx
│       │   ├── DogDex.tsx
│       │   ├── GameScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   └── LevelSelectScreen.tsx
│       │
│       ├── data/               # データ管理
│       │   ├── camouflagelevels.ts
│       │   └── dogBreeds.ts
│       │
│       ├── types/              # 型定義
│       │   └── game.ts
│       │
│       ├── favicon.ico
│       ├── globals.css         # グローバルスタイル
│       ├── layout.tsx          # レイアウト
│       └── page.tsx            # エントリーポイント（Home）
│
├── .gitignore
├── eslint.config.mjs           # ESLint 設定
├── next-env.d.ts               # TypeScript 型補完
├── next.config.ts              # Next.js 設定
├── package.json
├── package-lock.json
├── postcss.config.mjs          # PostCSS 設定
├── README.md                   # プロジェクト説明
└── tsconfig.json               # TypeScript 設定

