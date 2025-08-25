// src/app/data/camouflagelevels.ts
type BackgroundType = "forest" | "desert" | "snow" | "library" | "night" | "watercolor";

export type LevelDog = {
  id: number;        // ベース定義上のID（実プレイでは選択時に上書き可）
  x: number;         // %
  y: number;         // %
  size: number;      // px
  breedId: string;   // 例: "aka" | "kuro"
  hint: string;
};

export type LevelDef = {
  name: string;
  backgroundImage: string;
  backgroundType: BackgroundType;
  difficulty?: string;
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
    difficulty: "自然の中で",
    dogs: [
      { id: 1, x: 25, y: 35, size: 45, breedId: "aka", hint: "左側の緑の木々の陰に、茶色い毛玉が隠れてるよ" },
      { id: 2, x: 70, y: 65, size: 42, breedId: "aka", hint: "川岸の白い石の間、よく見ると何かがじっとしてる" },
    ],
  },
  {
    name: "海辺のバス停",
    backgroundImage: "/images/background/im2.jpg",
    backgroundType: "desert",
    difficulty: "のんびりと",
    dogs: [
      { id: 3, x: 15, y: 28, size: 40, breedId: "kuro", hint: "左側のコンクリートの陰、グレーの中に茶色い何かが..." },
      { id: 4, x: 55, y: 72, size: 38, breedId: "kuro", hint: "バス停の木の部分と同じ色で、カモフラージュしてる" },
      { id: 5, x: 80, y: 45, size: 41, breedId: "aka", hint: "右側の緑の木の根元、影になった場所をチェック" },
    ],
  },
  {
    name: "街角の自動販売機",
    backgroundImage: "/images/background/im3.jpg",
    backgroundType: "snow",
    difficulty: "都市の中で",
    dogs: [
      { id: 6, x: 20, y: 20, size: 36, breedId: "aka", hint: "左上の電柱の影、細い縦線の間に小さく" },
      { id: 7, x: 45, y: 60, size: 34, breedId: "aka", hint: "自動販売機の下の方、機械の影になった部分" },
      { id: 8, x: 75, y: 80, size: 37, breedId: "aka", hint: "右下の道路と歩道の境目、グレーに紛れて" },
      { id: 9, x: 60, y: 25, size: 35, breedId: "aka", hint: "紫の自動販売機の横、建物の壁と同化してる" },
    ],
  },
  {
    name: "憩いの中庭",
    backgroundImage: "/images/background/im4.jpg",
    backgroundType: "library",
    difficulty: "静かな場所で",
    dogs: [
      { id: 10, x: 12, y: 35, size: 32, breedId: "aka", hint: "左端のベンチの木の色と同じ茶色で隠れてる" },
      { id: 11, x: 38, y: 15, size: 30, breedId: "aka", hint: "上の方の建物の影、白い壁との境界線に" },
      { id: 12, x: 65, y: 70, size: 33, breedId: "aka", hint: "花壇の緑の植物の間、葉っぱに紛れて" },
      { id: 13, x: 85, y: 45, size: 31, breedId: "aka", hint: "右側の建物の下、暗くなった場所をよく見て" },
      { id: 14, x: 22, y: 78, size: 29, breedId: "aka", hint: "左下の芝生エリア、緑と茶色の境目に" },
    ],
  },
  {
    name: "お祭りの射的屋",
    backgroundImage: "/images/background/im5.jpg",
    backgroundType: "night",
    difficulty: "お祭り気分で",
    dogs: [
      { id: 15, x: 8, y: 25, size: 28, breedId: "aka", hint: "左上の黄色いテントの影、暗い部分に小さく" },
      { id: 16, x: 30, y: 58, size: 26, breedId: "aka", hint: "赤と白のストライプの下、カウンターの木の色と同じ" },
      { id: 17, x: 52, y: 82, size: 27, breedId: "aka", hint: "下の方の床、木目と茶色が混ざった場所に" },
      { id: 18, x: 75, y: 35, size: 29, breedId: "aka", hint: "棚の商品の間、賑やかな色に紛れて隠れてる" },
      { id: 19, x: 90, y: 15, size: 25, breedId: "aka", hint: "右上の角、テントの支柱の陰にちょこん" },
      { id: 20, x: 18, y: 70, size: 28, breedId: "aka", hint: "左下のカウンター下、暗がりでじっとしてる" },
      { id: 21, x: 65, y: 12, size: 24, breedId: "aka", hint: "上の方の商品棚、ぬいぐるみに混じって本物が一匹" },
    ],
  },
  {
    name: "みんなの公園",
    backgroundImage: "/images/background/im6.jpg",
    backgroundType: "watercolor",
    difficulty: "遊び心で",
    dogs: [
      { id: 22, x: 15, y: 30, size: 22, breedId: "aka", hint: "左の家の影、白い壁と茶色い地面の境目に" },
      { id: 23, x: 40, y: 55, size: 20, breedId: "aka", hint: "芝生の真ん中あたり、緑の草に埋もれて" },
      { id: 24, x: 68, y: 25, size: 23, breedId: "aka", hint: "大きな木の幹の色と同じ茶色で、根元に隠れてる" },
      { id: 25, x: 25, y: 75, size: 21, breedId: "aka", hint: "左下のベンチの下、木の足と間違えそう" },
      { id: 26, x: 85, y: 60, size: 19, breedId: "aka", hint: "右側の滑り台の影、遊具と同じ色で紛れてる" },
      { id: 27, x: 55, y: 10, size: 24, breedId: "aka", hint: "上の方の空と雲の境界、ふわっと浮いてる？" },
      { id: 28, x: 10, y: 85, size: 18, breedId: "aka", hint: "左の一番下、芝生と道路の境目にちょこん" },
    ],
  },
];

export const camouflageSettings: Record<BackgroundType, CamouflageSetting> = {
  forest:     { mouseEffectRadius: 80, baseCamouflageOpacity: 0.3,  discoveryTime: 30, soundType: "nature" },
  desert:     { mouseEffectRadius: 90, baseCamouflageOpacity: 0.25, discoveryTime: 35, soundType: "wind" },
  snow:       { mouseEffectRadius: 85, baseCamouflageOpacity: 0.2,  discoveryTime: 40, soundType: "city" },
  library:    { mouseEffectRadius: 75, baseCamouflageOpacity: 0.28, discoveryTime: 25, soundType: "quiet" },
  night:      { mouseEffectRadius: 70, baseCamouflageOpacity: 0.15, discoveryTime: 45, soundType: "festival" },
  watercolor: { mouseEffectRadius: 80, baseCamouflageOpacity: 0.22, discoveryTime: 35, soundType: "playground" },
};
