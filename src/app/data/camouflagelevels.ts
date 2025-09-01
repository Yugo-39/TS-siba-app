// src/app/data/camouflagelevels.ts
type BackgroundType = "forest" | "desert" | "snow" | "library" | "night" | "watercolor";

export type LevelDog = {
  id: number;        // ベース定義上のID（実プレイでは選択時に上書き可）
  x: number;         // %
  y: number;         // %
  size: number;      // px
  breedId?: string;  // ランダム割り当てなので省略可
};

export type LevelDef = {
  name: string;
  backgroundImage: string;
  backgroundType: BackgroundType;
  difficulty?: string;
  description?: string; // ステージの雰囲気を表現
  dogs: LevelDog[];
};

export type CamouflageSetting = {
  mouseEffectRadius: number;
  baseCamouflageOpacity: number;
  discoveryTime: number;
  soundType:
    | "nature"
    | "wind"
    | "city"
    | "quiet"
    | "festival"
    | "playground";
};

export const camouflagelevels: LevelDef[] = [
  {
    name: "清流のせせらぎ",
    backgroundImage: "/images/background/im1.jpg",
    backgroundType: "forest",
    difficulty: "やさしい",
    description: "自然豊かな川辺で、柴犬たちがのんびり散歩中です",
    dogs: [
      { id: 1, x: 25, y: 35, size: 45 },
      { id: 2, x: 70, y: 65, size: 42 },
    ],
  },
  {
    name: "海辺のバス停",
    backgroundImage: "/images/background/im2.jpg",
    backgroundType: "desert",
    difficulty: "ふつう",
    description: "穏やかな海風が吹く停留所で、柴犬たちがバスを待っています",
    dogs: [
      { id: 3, x: 15, y: 28, size: 40 },
      { id: 4, x: 55, y: 72, size: 38 },
      { id: 5, x: 80, y: 45, size: 41 },
    ],
  },
  {
    name: "街角の自動販売機",
    backgroundImage: "/images/background/im3.jpg",
    backgroundType: "snow",
    difficulty: "ふつう",
    description: "都市の一角で、柴犬たちが街の景色に溶け込んでいます",
    dogs: [
      { id: 6, x: 20, y: 20, size: 36 },
      { id: 7, x: 45, y: 60, size: 34 },
      { id: 8, x: 75, y: 80, size: 37 },
      { id: 9, x: 60, y: 25, size: 35 },
    ],
  },
  {
    name: "憩いの中庭",
    backgroundImage: "/images/background/im4.jpg",
    backgroundType: "library",
    difficulty: "むずかしい",
    description: "静かな中庭で、柴犬たちが思い思いの場所でくつろいでいます",
    dogs: [
      { id: 10, x: 12, y: 35, size: 32 },
      { id: 11, x: 38, y: 15, size: 30 },
      { id: 12, x: 65, y: 70, size: 33 },
      { id: 13, x: 85, y: 45, size: 31 },
      { id: 14, x: 22, y: 78, size: 29 },
    ],
  },
  {
    name: "お祭りの射的屋",
    backgroundImage: "/images/background/im5.jpg",
    backgroundType: "night",
    difficulty: "とてもむずかしい",
    description: "賑やかなお祭りの射的屋で、柴犬たちが夜の雰囲気を楽しんでいます",
    dogs: [
      { id: 15, x: 8, y: 25, size: 28 },
      { id: 16, x: 30, y: 58, size: 26 },
      { id: 17, x: 52, y: 82, size: 27 },
      { id: 18, x: 75, y: 35, size: 29 },
      { id: 19, x: 90, y: 15, size: 25 },
      { id: 20, x: 18, y: 70, size: 28 },
      { id: 21, x: 65, y: 12, size: 24 },
    ],
  },
  {
    name: "みんなの公園",
    backgroundImage: "/images/background/im6.jpg",
    backgroundType: "watercolor",
    difficulty: "エクストリーム",
    description: "カラフルな公園で、たくさんの柴犬たちが遊び回っています",
    dogs: [
      { id: 22, x: 15, y: 30, size: 22 },
      { id: 23, x: 40, y: 55, size: 20 },
      { id: 24, x: 68, y: 25, size: 23 },
      { id: 25, x: 25, y: 75, size: 21 },
      { id: 26, x: 85, y: 60, size: 19 },
      { id: 27, x: 55, y: 10, size: 24 },
      { id: 28, x: 10, y: 85, size: 18 },
      { id: 29, x: 75, y: 88, size: 20 }, // ボーナス柴犬
    ],
  },
];

// より細かい難易度設定
export const camouflageSettings: Record<BackgroundType, CamouflageSetting> = {
  forest: {
    mouseEffectRadius: 80,
    baseCamouflageOpacity: 0.3,
    discoveryTime: 30,
    soundType: "nature"
  },
  desert: {
    mouseEffectRadius: 85,
    baseCamouflageOpacity: 0.25,
    discoveryTime: 35,
    soundType: "wind"
  },
  snow: {
    mouseEffectRadius: 80,
    baseCamouflageOpacity: 0.22,
    discoveryTime: 40,
    soundType: "city"
  },
  library: {
    mouseEffectRadius: 75,
    baseCamouflageOpacity: 0.18,
    discoveryTime: 45,
    soundType: "quiet"
  },
  night: {
    mouseEffectRadius: 70,
    baseCamouflageOpacity: 0.15,
    discoveryTime: 50,
    soundType: "festival"
  },
  watercolor: {
    mouseEffectRadius: 65,
    baseCamouflageOpacity: 0.12,
    discoveryTime: 60,
    soundType: "playground"
  },
};

// レベル選択画面などで使用できる追加情報
export const levelInfo = {
  totalLevels: camouflagelevels.length,
  totalDogs: camouflagelevels.reduce((sum, level) => sum + level.dogs.length, 0),
  difficultyLevels: ["やさしい", "ふつう", "むずかしい", "とてもむずかしい", "エクストリーム"],
  backgroundTypes: ["forest", "desert", "snow", "library", "night", "watercolor"] as BackgroundType[],
};
