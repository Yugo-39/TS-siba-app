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
    name: "花火の夜景",
    backgroundImage: "/images/background/hanabi.jpg",
    backgroundType: "forest",
    difficulty: "やさしい",
    description: "夜空に咲く美しい花火の下で、柴犬たちが夜景を楽しんでいます",
    dogs: [
      { id: 1, x: 25, y: 35, size: 45 },
      { id: 2, x: 70, y: 65, size: 42 },
    ],
  },
  {
    name: "海遊館",
    backgroundImage: "/images/background/kaiyukann.jpg",
    backgroundType: "desert",
    difficulty: "ふつう",
    description: "大きな水族館の前で、柴犬たちが海の生き物に興味深そうに見入っています",
    dogs: [
      { id: 3, x: 15, y: 28, size: 40 },
      { id: 4, x: 55, y: 72, size: 38 },
      { id: 5, x: 80, y: 45, size: 41 },
    ],
  },
  {
    name: "黒門市場",
    backgroundImage: "/images/background/kuromon.jpg",
    backgroundType: "snow",
    difficulty: "ふつう",
    description: "活気あふれる市場で、柴犬たちが美味しそうな匂いに誘われています",
    dogs: [
      { id: 6, x: 20, y: 20, size: 36 },
      { id: 7, x: 45, y: 60, size: 34 },
      { id: 8, x: 75, y: 80, size: 37 },
      { id: 9, x: 60, y: 25, size: 35 },
    ],
  },
  {
    name: "大阪城",
    backgroundImage: "/images/background/osakazyou.jpg",
    backgroundType: "library",
    difficulty: "むずかしい",
    description: "歴史ある大阪城の美しい庭園で、柴犬たちが桜の季節を楽しんでいます",
    dogs: [
      { id: 10, x: 12, y: 35, size: 32 },
      { id: 11, x: 38, y: 15, size: 30 },
      { id: 12, x: 65, y: 70, size: 33 },
      { id: 13, x: 85, y: 45, size: 31 },
      { id: 14, x: 22, y: 78, size: 29 },
    ],
  },
  {
    name: "新世界",
    backgroundImage: "/images/background/sinsekai.jpg",
    backgroundType: "night",
    difficulty: "とてもむずかしい",
    description: "通天閣がそびえる賑やかな新世界で、柴犬たちが大阪の下町情緒を満喫中です",
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
    name: "USJ",
    backgroundImage: "/images/background/uniba.jpg",
    backgroundType: "watercolor",
    difficulty: "エクストリーム",
    description: "魔法のような世界観のテーマパークで、柴犬たちがアトラクションに夢中になっています",
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
