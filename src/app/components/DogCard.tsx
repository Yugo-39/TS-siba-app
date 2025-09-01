"use client";
import Image from "next/image";
import * as React from "react";

/** Rarity（レア度 / らりてぃ） */
type Rarity = "common" | "uncommon" | "rare" | "legendary";

/** Breed（犬種 / ぶりーど） */
type Breed = {
  id: string;
  image: string;
  name: string;
  hint?: string;
  rarity?: Rarity | string; // 外部の想定外文字列も一応許容
};

type Props = { breed: Breed | null; onClose: () => void };

/** type guard（タイプガード） */
const isRarity = (v: unknown): v is Rarity =>
  typeof v === "string" &&
  (v === "common" || v === "uncommon" || v === "rare" || v === "legendary");

/** rarity -> stars */
const rarityToStars = (r?: string): number => {
  if (!r || !isRarity(r)) return 0;
  const map: Record<Rarity, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    legendary: 5,
  };
  return map[r];
};

export default function DogCard({ breed, onClose }: Props) {
  if (!breed) return null;

  const rarity = (breed.rarity ?? "").toLowerCase();
  const raritySafe: Rarity | null = isRarity(rarity) ? rarity : null;
  const starCount = rarityToStars(raritySafe ?? undefined);

  const isSpecial = raritySafe === "rare" || raritySafe === "legendary";

  // 背景クリックで閉じる（backdrop / ばっくどろっぷ）
  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget === e.target) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className={[
          "foil-border glass-card relative w-80 p-8 transition-all duration-700 rounded-3xl",
          raritySafe === "legendary"
            ? "bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-red-500/5"
            : raritySafe === "rare"
            ? "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-600/5"
            : raritySafe === "uncommon"
            ? "bg-gradient-to-br from-green-400/10 via-emerald-500/10 to-green-600/5"
            : "bg-gradient-to-br from-blue-400/10 via-cyan-500/10 to-blue-600/5",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* === 枠の周り：オーラ＋モヤ＋微粒（around the card） === */}
        {isSpecial && (
          <>
            <div
              className={[
                "card-aura",
                raritySafe === "legendary"
                  ? "glow-gold"
                  : raritySafe === "rare"
                  ? "glow-purple"
                  : raritySafe === "uncommon"
                  ? "glow-green"
                  : "glow-blue",
              ].join(" ")}
              aria-hidden
            />
            <div
              className={[
                "aura-haze",
                raritySafe === "legendary"
                  ? "glow-gold"
                  : raritySafe === "rare"
                  ? "glow-purple"
                  : raritySafe === "uncommon"
                  ? "glow-green"
                  : "glow-blue",
              ].join(" ")}
              aria-hidden
            />
            <div className="ambient-dust" aria-hidden />
          </>
        )}

        {/* === カード面：ホログラム等（on the card surface） === */}
        {isSpecial && (
          <>
            <div className="holo-foil" aria-hidden />
            <div className="spectrum-sheen" aria-hidden />
            <div className="scanlines" aria-hidden />
            <div className="bokeh" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 vignette"
              aria-hidden
            />
          </>
        )}

        {/* === コンテンツ（前面） === */}
        <div className="relative z-10">
          {/* 画像（image / いめーじ） */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={breed.image}
              alt={breed.name}
              width={220}
              height={220}
              className="mx-auto rounded-2xl object-cover"
              priority
            />
          </div>

          {/* 犬の名前（breed name / ぶりーど ねーむ） */}
          <div className="mt-4 text-center">
            <h2
              className={[
                "text-xl font-bold drop-shadow-lg",
                raritySafe === "legendary"
                  ? "text-yellow-300"
                  : raritySafe === "rare"
                  ? "text-purple-300"
                  : raritySafe === "uncommon"
                  ? "text-green-300"
                  : "text-blue-300",
              ].join(" ")}
            >
              {breed.name}
            </h2>
          </div>

          {/* ⭐ レア度*/}
          {starCount > 0 && (
            <div className="mt-2 text-center">
              <div
                className={[
                  "text-2xl font-bold drop-shadow-lg starshine",
                  raritySafe === "legendary"
                    ? "star-gold"
                    : raritySafe === "rare"
                    ? "star-purple"
                    : raritySafe === "uncommon"
                    ? "star-green"
                    : "star-blue",
                ].join(" ")}
              >
                {"★".repeat(starCount)}
              </div>
            </div>
          )}

          {/* ヒント（hint / ひんと） */}
          {breed.hint && (
            <p className="mt-4 text-center text-sm leading-relaxed text-white/90 drop-shadow">
              {breed.hint}
            </p>
          )}

          {/* 閉じる（close / くろーず） */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/30"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
