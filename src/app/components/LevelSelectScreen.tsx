// src/app/components/LevelSelectScreen.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";

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
  if (!d) return "from-slate-200 to-slate-100 text-slate-700";
  const key = d.toLowerCase();
  if (key.includes("やさ") || key.includes("easy")) {
    return "from-emerald-200 to-green-100 text-emerald-800";
  }
  if (key.includes("ふつ") || key.includes("normal") || key.includes("中")) {
    return "from-amber-200 to-yellow-100 text-amber-800";
  }
  if (key.includes("むず") || key.includes("hard") || key.includes("上")) {
    return "from-rose-200 to-pink-100 text-rose-800";
  }
  return "from-slate-200 to-slate-100 text-slate-700";
};

const LevelSelectScreen: React.FC<Props> = ({
  levels,
  completedLevels = [],
  bestTimes = {},
  onSelectLevel,
  onBack,
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景（モーションブラーのグラデ） */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_-10%,#6ee7b7_0%,transparent_60%),radial-gradient(800px_500px_at_90%_10%,#93c5fd_0%,transparent_60%),radial-gradient(800px_500px_at_40%_100%,#f0abfc_0%,transparent_60%)]" />
      <div className="absolute inset-0 -z-10 backdrop-blur-3xl bg-black/20" />

      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              ステージ選択
            </h1>
            <p className="mt-2 text-white/70">
              お気に入りのステージで、柴犬探しの腕を磨こう。
            </p>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            戻る
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {levels.map((level, index) => {
            const cleared = completedLevels.includes(index);
            const best = bestTimes[index];
            const diffChip = chipColorByDifficulty(level.difficulty);

            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectLevel(index)}
                className={[
                  // 外枠：グラデ線→中身はガラス
                  "group relative rounded-2xl p-[1.5px] bg-gradient-to-br from-white/60 via-white/10 to-white/60",
                  "transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01]",
                  "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_60px_-15px_rgba(0,0,0,0.5)]",
                  "focus:outline-none focus:ring-2 focus:ring-white/50",
                ].join(" ")}
              >
                <div className="rounded-2xl bg-white/10 backdrop-blur-xl h-full w-full overflow-hidden">
                  {/* 画像エリア */}
                  <div className="relative h-48">
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
                      <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/20" />
                    )}

                    {/* 上部ラベル群 */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                          "bg-gradient-to-r",
                          diffChip,
                          "shadow-sm",
                        ].join(" ")}
                      >
                        {level.difficulty ?? "ふつう"}
                      </span>
                      {cleared && (
                        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-200 shadow-sm">
                          <Trophy className="w-3.5 h-3.5" />
                          クリア済み
                        </span>
                      )}
                    </div>

                    {/* 右下：レベル番号の飾り */}
                    <div className="absolute bottom-3 right-3">
                      <div className="px-3 py-1 rounded-full text-xs font-bold bg-black/50 text-white/90 backdrop-blur">
                        Lv. {index + 1}
                      </div>
                    </div>

                    {/* 画像の上にうっすらグラデ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-80" />
                  </div>

                  {/* テキストエリア */}
                  <div className="p-4">
                    <h2 className="text-lg font-bold leading-snug text-white tracking-wide">
                      {level.name}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {best !== undefined ? (
                        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/90">
                          ベスト {best} 秒
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/60">
                          初挑戦
                        </span>
                      )}

                      {/* ホバーで矢印がスライド */}
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-white/80 group-hover:text-white transition">
                        選択する
                        <svg
                          className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-0.5 transition-transform"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 下に落ちるネオン影（ホバーで増幅） */}
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-40 group-hover:opacity-70 transition bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0%,#a78bfa_25%,#f472b6_50%,#22c55e_75%,#22d3ee_100%)]" />
              </button>
            );
          })}
        </div>

        {/* フッターヒント（任意） */}
        <p className="mt-10 text-center text-sm text-white/60">
          どのカードもクリックで即スタート。がんばってね！
        </p>
      </main>
    </div>
  );
};

export default LevelSelectScreen;
