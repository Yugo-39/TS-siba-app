// src/types/game.ts
export type Rarity = "common" | "uncommon" | "rare" | "legendary";

export interface DogBreed {
  id: string;
  name: string;
  image: string;
  silhouette: string;
  hint: string;
  rarity: Rarity;
  weight: number;
  description: string;
}

export interface DogEntity {
  id: string;
  x: number;
  y: number;
  size: number;
  breedId: string;
  image: string;
  silhouette: string;
  name: string;
  hint: string;
  rarity: Rarity;
}
