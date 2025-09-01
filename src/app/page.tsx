// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";

// HomeScreen（ホーム・スクリーン: titleやメニューを見せる画面）
import HomeScreen from "@/app/components/HomeScreen";
// GameScreen（ゲーム・スクリーン: 実際に探す画面）
import GameScreen from "@/app/components/GameScreen";
// LevelSelectScreen（レベル・セレクト: レベル選択画面）
import LevelSelectScreen from "@/app/components/LevelSelectScreen";

// camouflagelevels（カモフラージュ・レベルズ: レベル定義の配列）
import { camouflagelevels } from "@/app/data/camouflagelevels";

// 図鑑（Dex デックス）とカード（Card カード）
import DogDex from "@/app/components/DogDex";
import DogCard from "@/app/components/DogCard";

// 犬種ランダム取得（getRandomBreed ゲット・ランダム・ブリード）
import { getRandomBreed } from "@/app/data/dogBreeds";

// 型（types タイプス）
import type { BackgroundType, DogEntity } from "@/app/types/game"; // DogEntity には id/x/y/size/breedId 等がある前提

const STORAGE_KEY = "shibaGameProgress";

/* ===================== 追加した型 ===================== */
// BestTimes（ベスト・タイムズ）: レベル番号 → クリア秒
type BestTimes = Record<number, number>;

// 保存用（SavedProgress セイブド・プログレス）: まとめてlocalStorageへ
type SavedProgress = {
  completedLevels: number[]; // クリア済レベル
  bestTimes: BestTimes; // ベストタイム
  discoveredBreeds: string[]; // 図鑑で見つけた犬種ID
  totalStars: number; // 獲得した星の総数
};

// DynamicDog（ダイナミック・ドッグ）: クリックで使う犬データ
type DynamicDog = DogEntity;

type LevelBase = {
  id?: string | number;
  name: string;
  backgroundType?: BackgroundType;
  backgroundImage?: string;
  dogs: Array<{
    x: number;
    y: number;
    size: number;
  }>;
};

type DynamicLevel = {
  id?: string | number;
  name: string;
  backgroundType?: BackgroundType;
  backgroundImage?: string;
  dogs: DynamicDog[];
};

/* ===================== 星計算関数 ===================== */
// レベルクリア時の獲得星数を計算
const calculateStarsForLevel = (clearTime: number, levelIndex: number): number => {
  // レベルごとの目安時間（秒）を設定
  const timeThresholds = {
    0: [30, 60, 120], // レベル1: 30秒以内=3星, 60秒以内=2星, 120秒以内=1星
    1: [45, 90, 180], // レベル2: 45秒以内=3星, 90秒以内=2星, 180秒以内=1星
    // 必要に応じて他のレベルも追加
  };

  // デフォルトの時間基準
  const defaultThresholds = [60, 120, 300]; // 60秒以内=3星, 120秒以内=2星, 300秒以内=1星

  const thresholds = timeThresholds[levelIndex as keyof typeof timeThresholds] || defaultThresholds;

  if (clearTime <= thresholds[0]) return 3; // 3星
  if (clearTime <= thresholds[1]) return 2; // 2星
  if (clearTime <= thresholds[2]) return 1; // 1星
  return 0; // 星なし（クリアはしているが時間がかかりすぎ）
};

// 全レベルの獲得星数を計算
const calculateTotalStars = (bestTimes: BestTimes): number => {
  return Object.entries(bestTimes).reduce((total, [levelStr, time]) => {
    const levelIndex = parseInt(levelStr);
    return total + calculateStarsForLevel(time, levelIndex);
  }, 0);
};
/* ===================================================== */

const Page: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "levelSelect" | "game" | "dogdex"
  >("home");

  const [currentLevel, setCurrentLevel] = useState(0);
  const [dynamicLevel, setDynamicLevel] = useState<DynamicLevel | null>(null);

  // foundDogs（ファウンド・ドッグズ）: 見つけた犬の id（string）
  const [foundDogs, setFoundDogs] = useState<string[]>([]);

  // timer（タイマー）: 経過秒数
  const [timer, setTimer] = useState(0);

  // isPlaying（イズ・プレーイング）: 計測中か
  const [isPlaying, setIsPlaying] = useState(false);

  // showSuccess（ショー・サクセス）: クリア演出の表示
  const [showSuccess, setShowSuccess] = useState(false);

  // wrongClicks（ロング・クリックス）: 外れクリックの印
  const [wrongClicks, setWrongClicks] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // imageLoaded（イメージ・ローデッド）: 背景画像のロード完了
  const [imageLoaded, setImageLoaded] = useState(false);

  // 全体進捗
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [bestTimes, setBestTimes] = useState<BestTimes>({});
  const [discoveredBreeds, setDiscoveredBreeds] = useState<string[]>([]);
  const [totalStars, setTotalStars] = useState(0);

  // クリック後に表示するカードの犬
  const [selectedBreed, setSelectedBreed] = useState<DynamicDog | null>(null);

  /* ---------- 進捗読み込み（load ロード） ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const progress = JSON.parse(saved) as Partial<SavedProgress>;
      const loadedBestTimes = progress.bestTimes ?? {};
      const calculatedStars = calculateTotalStars(loadedBestTimes);

      setCompletedLevels(progress.completedLevels ?? []);
      setBestTimes(loadedBestTimes);
      setDiscoveredBreeds(progress.discoveredBreeds ?? []);
      setTotalStars(calculatedStars);
    } catch (err) {
      console.error("進捗データの読み込みエラー:", err);
    }
  }, []);

  /* ---------- タイマー（interval インターバル） ---------- */
  useEffect(() => {
    if (!isPlaying || showSuccess) return;
    const id = window.setInterval(() => setTimer((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, showSuccess]);

  const handleImageLoad = () => setImageLoaded(true);

  /* ---------- 進捗保存（persist パーシスト） ---------- */
  const persistAll = (extra: Partial<SavedProgress> = {}) => {
    const currentData = {
      completedLevels,
      bestTimes,
      discoveredBreeds,
      totalStars,
      ...extra,
    };

    // 星数を再計算して保存
    const updatedStars = calculateTotalStars(currentData.bestTimes);
    currentData.totalStars = updatedStars;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
  };

  /* ---------- リセット（reset リセット） ---------- */
  const resetGame = () => {
    setIsPlaying(false);
    setFoundDogs([]);
    setTimer(0);
    setShowSuccess(false);
    setWrongClicks([]);
    setImageLoaded(false);
    setSelectedBreed(null);
  };

  const startGame = () => setIsPlaying(true);

  /* ---------- レベル選択（select セレクト） ---------- */
  const selectLevel = (levelIndex: number) => {
    if (levelIndex < 0 || levelIndex >= camouflagelevels.length) {
      setCurrentScreen("home");
      return;
    }

    const baseLevel = camouflagelevels[levelIndex] as LevelBase;

    // ランダム犬種を割当（assign アサイン）
    const randomizedDogs: DynamicDog[] = baseLevel.dogs.map((dog, idx) => {
      const breed = getRandomBreed(); // { id, image, silhouette, name, hint, rarity }
      return {
        id: `${levelIndex}-${idx}`, // stringで統一（foundDogsがstring[]のため）
        x: dog.x,
        y: dog.y,
        size: dog.size,
        breedId: breed.id,
        image: breed.image,
        silhouette: breed.silhouette,
        name: breed.name,
        hint: breed.hint,
        rarity: breed.rarity,
      };
    });

    // より安全にdynamicLevelを作成
    const dynamicLevelData: DynamicLevel = {
      id: baseLevel.id,
      name: baseLevel.name,
      backgroundType: baseLevel.backgroundType || "forest", // デフォルト値を設定
      backgroundImage: baseLevel.backgroundImage,
      dogs: randomizedDogs,
    };

    setDynamicLevel(dynamicLevelData);
    setCurrentLevel(levelIndex);
    resetGame();
    setCurrentScreen("game");
  };

  /* ---------- 次へ（next ネクスト）/ ホームへ（home ホーム） ---------- */
  const nextLevel = () => {
    const lastIndex = camouflagelevels.length - 1;
    if (currentLevel < lastIndex) {
      selectLevel(currentLevel + 1);
    } else {
      goToHome();
    }
  };

  const goToHome = () => {
    setCurrentScreen("home");
    resetGame();
  };

  /* ---------- 犬クリック（onDogClick オン・ドッグ・クリック） ---------- */
  const handleDogClick = (dog: DynamicDog, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!dog || !dog.id || foundDogs.includes(dog.id)) return;

    const newFound = [...foundDogs, dog.id];
    setFoundDogs(newFound);

    // 図鑑登録（Dex デックス）
    if (dog.breedId && !discoveredBreeds.includes(dog.breedId)) {
      const nextDiscovered = [...discoveredBreeds, dog.breedId];
      setDiscoveredBreeds(nextDiscovered);
      persistAll({ discoveredBreeds: nextDiscovered });
    }

    // クリックした犬の詳細カードを表示
    setSelectedBreed(dog);

    // 全発見チェック（all found オール・ファウンド）
    if (dynamicLevel && newFound.length === dynamicLevel.dogs.length) {
      setIsPlaying(false);
      const clearTime = timer;

      const prevBest = bestTimes[currentLevel];
      const newBest =
        prevBest === undefined || clearTime < prevBest ? clearTime : prevBest;

      const updatedTimes: BestTimes = { ...bestTimes, [currentLevel]: newBest };
      const updatedCompleted = Array.from(
        new Set([...completedLevels, currentLevel])
      );

      // 星数を再計算
      const newTotalStars = calculateTotalStars(updatedTimes);

      setBestTimes(updatedTimes);
      setCompletedLevels(updatedCompleted);
      setTotalStars(newTotalStars);

      persistAll({
        bestTimes: updatedTimes,
        completedLevels: updatedCompleted,
        totalStars: newTotalStars,
      });

      setShowSuccess(true);
    }
  };

  /* ---------- 外れクリック（wrong click ロング・クリック） ---------- */
  const handleWrongClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // %（パーセント）で保存するとレスポンシブで位置がズレにくい
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const mark = { id: Date.now(), x, y };
    setWrongClicks((prev) => [...prev, mark]);
    window.setTimeout(() => {
      setWrongClicks((prev) => prev.filter((c) => c.id !== mark.id));
    }, 1200);
  };

  // isNewRecord（イズ・ニュー・レコード）: プレイ中ベストを更新中か
  const isNewRecord =
    bestTimes[currentLevel] !== undefined && timer < bestTimes[currentLevel];

  /* ---------- 画面分岐（routing ルーティング的に出し分け） ---------- */
  if (currentScreen === "home") {
    return (
      <HomeScreen
        completedLevels={completedLevels.length}
        totalLevels={camouflagelevels.length}
        totalStars={totalStars}
        onStartGame={() => selectLevel(0)}
        onLevelSelect={() => setCurrentScreen("levelSelect")}
        onResetProgress={() => {
          localStorage.removeItem(STORAGE_KEY);
          setCompletedLevels([]);
          setBestTimes({});
          setDiscoveredBreeds([]);
          setTotalStars(0);
        }}
        onOpenDogDex={() => setCurrentScreen("dogdex")}
      />
    );
  }

  if (currentScreen === "dogdex") {
    return (
      <DogDex
        discovered={discoveredBreeds}
        onBack={() => setCurrentScreen("home")}
      />
    );
  }

  if (currentScreen === "levelSelect") {
    return (
      <LevelSelectScreen
        levels={camouflagelevels}
        completedLevels={completedLevels}
        bestTimes={bestTimes}
        onSelectLevel={selectLevel}
        onBack={() => setCurrentScreen("home")}
      />
    );
  }

  if (!dynamicLevel) return null;

  return (
    <>
      <GameScreen
        level={{ ...dynamicLevel, index: currentLevel }} // GameScreen側がindexを読む前提
        foundDogs={foundDogs}
        timer={timer}
        isPlaying={isPlaying}
        showSuccess={showSuccess}
        wrongClicks={wrongClicks}
        imageLoaded={imageLoaded}
        isNewRecord={isNewRecord}
        onImageLoad={handleImageLoad}
        onDogClick={handleDogClick}
        onWrongClick={handleWrongClick}
        onStartGame={startGame}
        onGoHome={goToHome}
        onNextLevel={nextLevel}
        totalLevels={camouflagelevels.length}
      />
      {selectedBreed && (
        <DogCard breed={selectedBreed} onClose={() => setSelectedBreed(null)} />
      )}
    </>
  );
};

export default Page;
