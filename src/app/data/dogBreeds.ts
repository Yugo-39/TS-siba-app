// src/app/data/dogBreeds.ts
import type { DogBreed, Rarity } from "@/app/types/game";

// ========== データ本体 ==========
export const dogBreeds: DogBreed[] = [
  {
    id: "aka",
    name: "赤柴",
    rarity: "common", // よく出る
    weight: 50, // 出現率 50%
    image: "/images/dogs/aka.jpg",
    silhouette: "/images/dogs/silhouette.png",
    hint: "木陰が好き",
    description: "最も一般的な柴犬。木のそばや影に隠れることが多い。",
  },
  {
    id: "kuro",
    name: "黒柴",
    rarity: "uncommon", // 少しレア
    weight: 25, // 出現率 25%
    image: "/images/dogs/kuro.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "暗い場所に紛れる",
    description: "黒い毛色で夜や影に隠れるのが得意。",
  },
  {
    id: "mame",
    name: "豆柴",
    rarity: "rare",
    weight: 10, // 出現率 10%
    image: "/images/dogs/mame.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "小さくて見落としがち",
    description: "体が小さいため、見つけるのが難しい。",
  },
  {
    id: "siro",
    name: "白柴",
    rarity: "rare",
    weight: 5,
    image: "/images/dogs/siro.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "ホワイトカラー",
    description: "真っ白な毛並み。雪景色だと特に見つけにくい。",
  },
  {
    id: "goma",
    name: "胡麻柴",
    rarity: "rare",
    weight: 5,
    image: "/images/dogs/goma.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "景色に溶け込む",
    description: "複雑な毛色で周囲に溶け込む達人。",
  },
  {
    id: "gold",
    name: "金柴",
    rarity: "legendary", // 特別レア枠
    weight: 5,
    image: "/images/dogs/gold.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "金に光ってる",
    description: "めったに現れない黄金の柴犬。幸運を呼ぶといわれる。",
  },
  {
    id: "rainbow",
    name: "虹柴",
    rarity: "legendary", // 特別レア枠
    weight: 0.5,
    image: "/images/dogs/rainbow.png",
    silhouette: "/images/dogs/silhouette.png",
    hint: "カラフル",
    description: "虹色の毛並みを持つ幻の柴犬。発見できれば超ラッキー！",
  },
];

// ========== UI補助 ==========
export const rarityColors: Record<Rarity, string> = {
  common: "#9CA3AF",     // gray
  uncommon: "#10B981",   // green
  rare: "#3B82F6",       // blue
  legendary: "#F59E0B",  // gold
};

// ========== 便利関数 ==========
// 重複を削除！関数は1つだけにする
export function getRandomBreed(): DogBreed {
  const totalWeight = dogBreeds.reduce((sum, b) => sum + b.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const breed of dogBreeds) {
    if (rand < breed.weight) {
      return breed;
    }
    rand -= breed.weight;
  }
  return dogBreeds[0];
}

/** idをキーにした高速参照マップ */
export const getBreedMap = (): Record<string, DogBreed> =>
  Object.fromEntries(dogBreeds.map((b) => [b.id, b]));
