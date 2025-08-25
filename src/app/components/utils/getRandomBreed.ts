// utils/getRandomBreed.ts
import { dogBreeds } from "@/app/data/dogBreeds";

// 犬種の型定義（dogBreeds.tsファイルで定義されていない場合はここで定義）
export interface DogBreed {
  id: string;
  name: string;
  weight: number;
  // 他のプロパティがあれば追加
  description?: string;
  difficulty?: number;
  image?: string;
}

export function getRandomBreed(): DogBreed {
  const totalWeight = dogBreeds.reduce((sum, b) => sum + b.weight, 0);
  let rand = Math.random() * totalWeight;

  for (const breed of dogBreeds) {
    if (rand < breed.weight) {
      return breed;
    }
    rand -= breed.weight;
  }
  return dogBreeds[0]; // fallback
}
