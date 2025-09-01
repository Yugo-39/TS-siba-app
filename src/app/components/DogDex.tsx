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
      color: "from-blue-400/20 to-cyan-400/20 text-blue-300 border-blue-300/30",
      text: "コモン",
    },
    uncommon: {
      color:
        "from-green-400/20 to-emerald-400/20 text-green-300 border-green-300/30",
      text: "アンコモン",
    },
    rare: {
      color:
        "from-purple-400/20 to-pink-400/20 text-purple-300 border-purple-300/30",
      text: "レア",
    },
    legendary: {
      color:
        "from-yellow-400/20 to-orange-400/20 text-yellow-300 border-yellow-300/30",
      text: "レジェンド",
    },
  };

  const config =
    rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${config.color} border backdrop-blur-sm text-xs font-semibold shadow-lg`}
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
    <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-lg border border-white/20 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-black/20 to-black/40">
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
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400/80 to-teal-500/80 rounded-full flex items-center justify-center shadow-xl border-2 border-white/30 backdrop-blur-sm">
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
            まだ発見されていない柴犬...
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-6xl mx-auto text-white p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8 pt-8">
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
          <div className="text-center flex-1">
            <h1 className="text-6xl font-extrabold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg tracking-widest">
              柴犬図鑑
            </h1>
            <p className="text-lg font-bold text-white/90">
              柴犬たちのコレクション
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* 統計情報パネル */}
        <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
            📊 図鑑統計
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{found}</p>
              <p className="text-sm opacity-80">発見済み</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{total}</p>
              <p className="text-sm opacity-80">全種類</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">
                {rarityStats.common}
              </p>
              <p className="text-sm opacity-80">コモン</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                {rarityStats.uncommon}
              </p>
              <p className="text-sm opacity-80">アンコモン</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-400">
                {rarityStats.rare}
              </p>
              <p className="text-sm opacity-80">レア</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">
                {rarityStats.legendary}
              </p>
              <p className="text-sm opacity-80">レジェンド</p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <span className="text-sm">図鑑達成率:</span>
              <span className="text-xl font-bold text-yellow-300">
                {completionRate}%
              </span>
            </div>
          </div>
        </div>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
          {breeds.map((breed) => (
            <BreedCard
              key={breed.id}
              breed={breed}
              discovered={discovered.includes(breed.id)}
            />
          ))}
        </div>

        {/* フッターメッセージ */}
        <div className="text-center mt-8">
          <p className="text-white/70 text-lg">
            ゲームをプレイして新しい柴犬を発見しよう！
          </p>
        </div>
      </div>
    </div>
  );
};

export default DogDex;
