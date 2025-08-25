"use client";
import React, { useState } from "react";
import Image from "next/image";
import { dogBreeds } from "@/app/data/dogBreeds";

type Rarity = "common" | "uncommon" | "rare" | "legendary";

export type Breed = {
  id: string;
  name: string;
  image: string;
  silhouette?: string;
  hint?: string;
  rarity: Rarity;
};

type Props = {
  discovered?: string[];
  onBack?: () => void;
};

const DEFAULT_SILHOUETTE = "/images/dogs/silhouette.png";

const RarityBadge: React.FC<{ rarity: Rarity | string }> = ({ rarity }) => {
  const rarityConfig = {
    common: {
      color: "from-blue-400/90 to-blue-500/90 border-blue-300/60",
      text: "コモン",
    },
    uncommon: {
      color: "from-green-400/90 to-green-500/90 border-green-300/60",
      text: "アンコモン",
    },
    rare: {
      color: "from-purple-400/90 to-purple-500/90 border-purple-300/60",
      text: "レア",
    },
    legendary: {
      color: "from-yellow-400/90 to-orange-500/90 border-yellow-300/60",
      text: "レジェンド",
    },
  };

  const config =
    rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${config.color} border backdrop-blur-md text-white text-xs font-semibold shadow-lg`}
    >
      {config.text}
    </div>
  );
};

const BreedCard: React.FC<{
  breed: Breed;
  discovered: boolean;
}> = ({ breed, discovered }) => {
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

  const imgSrc = discovered
    ? breed.image
    : fallbackSrc ?? breed.silhouette ?? DEFAULT_SILHOUETTE;

  const name = discovered ? breed.name : "？？？";
  const showPlaceholder = !imgSrc;

  return (
    <div className="breed-card">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-black/20 to-black/40">
        {showPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            🐾
          </div>
        ) : (
          <>
            <Image
              src={imgSrc}
              alt={name}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 ${
                discovered
                  ? "opacity-100 brightness-100 saturate-100"
                  : "opacity-20 brightness-50 blur-[2px] saturate-0"
              }`}
              priority={false}
              onError={() => {
                if (imgSrc !== DEFAULT_SILHOUETTE && !discovered) {
                  setFallbackSrc(DEFAULT_SILHOUETTE);
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        )}

        {/* レア度バッジ */}
        <div className="absolute top-3 left-3 z-10">
          <RarityBadge rarity={breed.rarity} />
        </div>

        {/* 発見済みマーク */}
        {discovered && (
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white/30">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
        )}

        {/* カード番号 */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-lg border border-white/20">
            <span className="text-white text-xs font-mono">#{breed.id}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-xl mb-3 text-white drop-shadow-lg">
          {name}
        </h3>

        {discovered ? (
          <p className="text-sm text-white/85 leading-relaxed line-clamp-2">
            {breed.hint || "美しい柴犬です"}
          </p>
        ) : (
          <p className="text-sm text-white/50 leading-relaxed italic">
            まだ発見されていない神秘の柴犬...
          </p>
        )}
      </div>
    </div>
  );
};

const DogDex: React.FC<Props> = ({ discovered = [], onBack = () => {} }) => {
  const breeds = dogBreeds as Breed[];
  const total = breeds.length;
  const found = discovered.length;
  const completionRate = Math.round((found / total) * 100);

  // レア度別の統計
  const rarityStats = {
    common: breeds.filter(
      (b) => b.rarity === "common" && discovered.includes(b.id)
    ).length,
    uncommon: breeds.filter(
      (b) => b.rarity === "uncommon" && discovered.includes(b.id)
    ).length,
    rare: breeds.filter((b) => b.rarity === "rare" && discovered.includes(b.id))
      .length,
    legendary: breeds.filter(
      (b) => b.rarity === "legendary" && discovered.includes(b.id)
    ).length,
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 夜の公園風背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-800">
        {/* 月の光 */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-radial from-yellow-200/40 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-24 right-24 w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-80"></div>

        {/* 街灯の光 */}
        <div className="absolute top-40 left-10 w-40 h-40 bg-gradient-radial from-amber-300/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute top-60 right-1/4 w-32 h-32 bg-gradient-radial from-amber-300/15 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/3 w-36 h-36 bg-gradient-radial from-amber-300/20 to-transparent rounded-full blur-2xl"></div>

        {/* 遠くの街の光 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-900/20 to-transparent"></div>

        {/* 木々のシルエット（CSS で描画） */}
        <div className="absolute bottom-0 left-8 tree-silhouette opacity-40"></div>
        <div className="absolute bottom-0 right-12 tree-silhouette-2 opacity-30"></div>
        <div className="absolute bottom-0 left-1/4 tree-silhouette opacity-20"></div>
        <div className="absolute bottom-0 right-1/3 tree-silhouette-2 opacity-35"></div>

        {/* 穏やかな星 */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-100 animate-gentle-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 4 + 4}s`,
              }}
            />
          ))}
        </div>

        {/* 公園のパス風 */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-slate-700/30 via-slate-600/40 to-slate-700/30 blur-sm"></div>
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 min-h-screen text-white">
        {/* ヘッダー */}
        <div className="header-container">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-8">
              <button className="back-button" onClick={onBack}>
                <span className="mr-2">←</span>
                戻る
              </button>
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  🐕 柴犬図鑑 🐕
                </h1>
                <p className="text-white/80 text-lg">
                  様々な場所で出会った柴犬たちのコレクション
                </p>
              </div>
              <div className="w-20" /> {/* スペーサー */}
            </div>

            {/* 統計情報 */}
            <div className="stats-container mb-8">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="stat-item">
                  <div className="text-2xl font-bold text-emerald-400">
                    {found}
                  </div>
                  <div className="text-xs text-white/70">発見済み</div>
                </div>
                <div className="stat-item">
                  <div className="text-2xl font-bold text-white">{total}</div>
                  <div className="text-xs text-white/70">全種類</div>
                </div>
                <div className="stat-item">
                  <div className="text-2xl font-bold text-blue-400">
                    {rarityStats.common}
                  </div>
                  <div className="text-xs text-white/70">コモン</div>
                </div>
                <div className="stat-item">
                  <div className="text-2xl font-bold text-green-400">
                    {rarityStats.uncommon}
                  </div>
                  <div className="text-xs text-white/70">アンコモン</div>
                </div>
                <div className="stat-item">
                  <div className="text-2xl font-bold text-purple-400">
                    {rarityStats.rare}
                  </div>
                  <div className="text-xs text-white/70">レア</div>
                </div>
                <div className="stat-item">
                  <div className="text-2xl font-bold text-yellow-400">
                    {rarityStats.legendary}
                  </div>
                  <div className="text-xs text-white/70">レジェンド</div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                  <span className="text-sm">図鑑達成率:</span>
                  <span className="text-lg font-bold text-yellow-300">
                    {completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* カードグリッド */}
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {breeds.map((breed) => (
                <BreedCard
                  key={breed.id}
                  breed={breed}
                  discovered={discovered.includes(breed.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-container {
          background: linear-gradient(
            135deg,
            rgba(30, 41, 59, 0.4),
            rgba(51, 65, 85, 0.3)
          );
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);
        }

        .breed-card {
          background: linear-gradient(
            135deg,
            rgba(51, 65, 85, 0.4),
            rgba(30, 41, 59, 0.3)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          transition: all 0.3s ease;
        }

        .breed-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
          border-color: rgba(148, 163, 184, 0.3);
        }

        .stats-container {
          background: linear-gradient(
            135deg,
            rgba(30, 41, 59, 0.3),
            rgba(51, 65, 85, 0.2)
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .stat-item {
          text-align: center;
          padding: 0.5rem;
        }

        .back-button {
          background: linear-gradient(
            135deg,
            rgba(71, 85, 105, 0.9),
            rgba(51, 65, 85, 0.9)
          );
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 12px 24px;
          border-radius: 50px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(30, 41, 59, 0.4);
          display: flex;
          align-items: center;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(30, 41, 59, 0.6);
          background: linear-gradient(
            135deg,
            rgba(71, 85, 105, 1),
            rgba(51, 65, 85, 1)
          );
          border-color: rgba(148, 163, 184, 0.5);
        }

        @keyframes gentle-twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        .animate-gentle-twinkle {
          animation: gentle-twinkle 6s ease-in-out infinite;
        }

        /* 木のシルエット */
        .tree-silhouette {
          width: 80px;
          height: 120px;
          background: linear-gradient(
            to bottom,
            rgba(30, 41, 59, 0.8) 0%,
            rgba(30, 41, 59, 0.6) 30%,
            rgba(51, 65, 85, 0.4) 100%
          );
          clip-path: polygon(
            40% 0%,
            45% 15%,
            55% 10%,
            60% 25%,
            70% 20%,
            75% 35%,
            85% 30%,
            80% 50%,
            90% 45%,
            85% 65%,
            95% 60%,
            90% 80%,
            95% 85%,
            85% 95%,
            60% 90%,
            55% 100%,
            45% 100%,
            40% 90%,
            15% 95%,
            5% 85%,
            10% 80%,
            5% 60%,
            15% 65%,
            10% 45%,
            20% 50%,
            15% 35%,
            25% 30%,
            30% 20%,
            35% 25%,
            40% 10%
          );
        }

        .tree-silhouette-2 {
          width: 100px;
          height: 140px;
          background: linear-gradient(
            to bottom,
            rgba(30, 41, 59, 0.7) 0%,
            rgba(30, 41, 59, 0.5) 40%,
            rgba(51, 65, 85, 0.3) 100%
          );
          clip-path: polygon(
            45% 0%,
            50% 20%,
            65% 15%,
            70% 30%,
            80% 25%,
            85% 45%,
            95% 40%,
            90% 60%,
            100% 55%,
            95% 75%,
            100% 80%,
            90% 90%,
            70% 95%,
            60% 100%,
            40% 100%,
            30% 95%,
            10% 90%,
            0% 80%,
            5% 75%,
            0% 55%,
            10% 60%,
            5% 40%,
            15% 45%,
            20% 25%,
            30% 30%,
            35% 15%,
            50% 20%
          );
        }

        /* グラデーションラジアル */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DogDex;
