// src/app/components/LevelSelectScreen.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Trophy, ArrowRight } from "lucide-react";

type Level = {
  name: string;
  difficulty?: string;
  backgroundImage?: string;
  backgroundType?: "forest" | "desert" | "snow" | "library" | "night" | string;
};

type Props = {
  levels: Level[];
  completedLevels?: number[];
  bestTimes?: Record<number, number>; // index -> 秒
  onSelectLevel: (index: number) => void;
  onBack: () => void;
};

const chipColorByDifficulty = (d?: string) => {
  if (!d) return "from-blue-400/20 to-cyan-400/20 text-blue-300";
  const key = d.toLowerCase();
  if (key.includes("やさ") || key.includes("easy")) {
    return "from-green-400/20 to-emerald-400/20 text-green-300";
  }
  if (key.includes("ふつ") || key.includes("normal") || key.includes("中")) {
    return "from-yellow-400/20 to-orange-400/20 text-yellow-300";
  }
  if (key.includes("むず") || key.includes("hard") || key.includes("上")) {
    return "from-red-400/20 to-pink-400/20 text-red-300";
  }
  return "from-blue-400/20 to-cyan-400/20 text-blue-300";
};

const LevelSelectScreen: React.FC<Props> = ({
  levels,
  completedLevels = [],
  bestTimes = {},
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden">
      {/* HomeScreenと同じ背景システム */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center responsive-bg"></div>

      <style jsx>{`
        .responsive-bg {
          background-image: url("/images/home/img-mobile.png");
          background-size: cover;
          background-position: center;
        }

        @media (min-width: 1024px) {
          .responsive-bg {
            background-image: url("/images/home/img-desktop.png");
          }
        }
      `}</style>

      {/* ヘッダー */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-8 pb-6">
        {/* 戻るボタン */}
        <div className="flex justify-start mb-6">
          <button
            onClick={onBack}
            className="py-3 px-6 font-bold text-xl text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
            style={{
              border: "3px solid transparent",
              borderRadius: "2rem",
              background:
                "linear-gradient(90deg, #ff3366, #9933ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc, #9933ff) border-box",
              boxShadow:
                "0 0 15px rgba(255, 51, 102, 0.8), 0 0 30px rgba(255, 102, 204, 0.6), 0 0 50px rgba(153, 51, 255, 0.4)",
            }}
          >
            戻る
          </button>
        </div>

        {/* 中央寄せのタイトル */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg tracking-widest">
            ステージ選択
          </h1>
          <p className="text-lg font-bold text-white/90">
            お気に入りのステージで、柴犬探しの腕を磨こう
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const cleared = completedLevels.includes(index);
            const best = bestTimes[index];
            const diffChip = chipColorByDifficulty(level.difficulty);

            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectLevel(index)}
                className="group relative backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/30"
              >
                {/* カード画像エリア */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  {level.backgroundImage ? (
                    <Image
                      src={level.backgroundImage}
                      alt={level.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-white/20 to-white/5" />
                  )}

                  {/* レベル番号（右上） */}
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1 rounded-full text-sm font-bold bg-black/60 text-white backdrop-blur-sm">
                      Lv. {index + 1}
                    </div>
                  </div>

                  {/* グラデーションオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* カード情報 */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-3 drop-shadow-md">
                    {level.name}
                  </h2>

                  {/* ステータス表示 */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    {/* 難易度チップ */}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r ${diffChip} backdrop-blur-sm`}
                    >
                      {level.difficulty || "ふつう"}
                    </span>

                    {/* クリア状態 */}
                    {cleared && (
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 backdrop-blur-sm">
                        <Trophy className="w-3 h-3" />
                        クリア済み
                      </span>
                    )}
                  </div>

                  {/* ベストタイム */}
                  <div className="mb-4">
                    {best !== undefined ? (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-yellow-300 drop-shadow-md">
                          {best}秒
                        </span>
                        <p className="text-sm text-white/70">ベストタイム</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-lg text-white/60">未挑戦</span>
                        <p className="text-sm text-white/50">初回プレイ</p>
                      </div>
                    )}
                  </div>

                  {/* 選択ボタンエリア */}
                  <div className="flex items-center justify-center gap-2 text-white/80 group-hover:text-white transition-colors">
                    <span className="text-sm font-medium">選択する</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* ホバー時のネオン効果 */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-pink-400/10 pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* フッターメッセージ */}
        <div className="mt-12 text-center">
          <p className="text-white/70 text-lg">
            ステージをクリックして柴犬探しを始めよう！
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelSelectScreen;
