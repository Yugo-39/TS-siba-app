"use client";
import React, { useEffect, useState } from "react";
import HomeScreen from "@/app/components/HomeScreen";
import GameScreen from "@/app/components/GameScreen";
import LevelSelectScreen from "@/app/components/LevelSelectScreen";
import { camouflagelevels } from "@/app/data/camouflagelevels";
import DogDex from "@/app/components/DogDex";
import DogCard from "@/app/components/DogCard";
import { getRandomBreed } from "@/app/data/dogBreeds";
import type { DogEntity } from "@/app/types/game"; // id, x,y,size, breedId など

const STORAGE_KEY = "shibaGameProgress";

/* ===================== 追加した型 ===================== */
type BestTimes = Record<number, number>; // levelIndex -> seconds
type SavedProgress = {
  completedLevels: number[];
  bestTimes: BestTimes;
  discoveredBreeds: string[];
};
type DynamicDog = DogEntity; // クリックで使う犬データ（DogEntityをそのまま流用）

type LevelBase = {
  id?: string | number;
  name: string;
  backgroundType?: "forest" | "desert" | "snow" | "library" | "night" | string;
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
  backgroundType?: string;
  backgroundImage?: string;
  dogs: DynamicDog[];
};
/* ===================================================== */

const Page: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "levelSelect" | "game" | "dogdex"
  >("home");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [dynamicLevel, setDynamicLevel] = useState<DynamicLevel | null>(null);
  const [foundDogs, setFoundDogs] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [wrongClicks, setWrongClicks] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [bestTimes, setBestTimes] = useState<BestTimes>({});
  const [discoveredBreeds, setDiscoveredBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<DynamicDog | null>(null);

  // 進捗読み込み
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const progress = JSON.parse(saved) as Partial<SavedProgress>;
      setCompletedLevels(progress.completedLevels ?? []);
      setBestTimes(progress.bestTimes ?? {});
      setDiscoveredBreeds(progress.discoveredBreeds ?? []);
    } catch (err) {
      console.error("進捗データの読み込みエラー:", err);
    }
  }, []);

  // タイマー
  useEffect(() => {
    if (!isPlaying || showSuccess) return;
    const id = window.setInterval(() => setTimer((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, showSuccess]);

  const handleImageLoad = () => setImageLoaded(true);

  // 進捗保存
  const persistAll = (extra: Partial<SavedProgress> = {}) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedLevels,
        bestTimes,
        discoveredBreeds,
        ...extra,
      })
    );
  };

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

  // レベル選択
  const selectLevel = (levelIndex: number) => {
    if (levelIndex < 0 || levelIndex >= camouflagelevels.length) {
      setCurrentScreen("home");
      return;
    }
    const baseLevel = camouflagelevels[levelIndex] as LevelBase;

    // 出現犬をランダム割当（breed情報付与）
    const randomizedDogs: DynamicDog[] = baseLevel.dogs.map((dog, idx) => {
      const breed = getRandomBreed();
      return {
        id: `${levelIndex}-${idx}`,
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

    setDynamicLevel({ ...baseLevel, dogs: randomizedDogs });
    setCurrentLevel(levelIndex);
    resetGame();
    setCurrentScreen("game");
  };

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

  // 犬クリック
  const handleDogClick = (dog: DynamicDog, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!dog || !dog.id || foundDogs.includes(dog.id)) return;

    const newFound = [...foundDogs, dog.id];
    setFoundDogs(newFound);

    if (dog.breedId && !discoveredBreeds.includes(dog.breedId)) {
      const nextDiscovered = [...discoveredBreeds, dog.breedId];
      setDiscoveredBreeds(nextDiscovered);
      persistAll({ discoveredBreeds: nextDiscovered });
    }

    setSelectedBreed(dog);

    // 全発見チェック
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

      setBestTimes(updatedTimes);
      setCompletedLevels(updatedCompleted);
      persistAll({
        bestTimes: updatedTimes,
        completedLevels: updatedCompleted,
      });

      setShowSuccess(true);
    }
  };

  const handleWrongClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const mark = { id: Date.now(), x, y };
    setWrongClicks((prev) => [...prev, mark]);
    window.setTimeout(() => {
      setWrongClicks((prev) => prev.filter((c) => c.id !== mark.id));
    }, 1200);
  };

  const isNewRecord =
    bestTimes[currentLevel] !== undefined && timer < bestTimes[currentLevel];

  // 画面分岐
  if (currentScreen === "home") {
    return (
      <HomeScreen
        completedLevels={completedLevels.length}
        totalLevels={camouflagelevels.length}
        onStartGame={() => selectLevel(0)}
        onLevelSelect={() => setCurrentScreen("levelSelect")}
        onResetProgress={() => {
          localStorage.removeItem(STORAGE_KEY);
          setCompletedLevels([]);
          setBestTimes({});
          setDiscoveredBreeds([]);
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
        level={{ ...dynamicLevel, index: currentLevel }} // GameScreen側で index を使う前提
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
