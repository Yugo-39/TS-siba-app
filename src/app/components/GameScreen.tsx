"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  Home,
  ChevronRight,
  Target,
  Camera,
  Clock,
  Search,
  PawPrint,
  Dog,
  Trophy,
} from "lucide-react";
import CamouflageShibaInuDog from "@/app/components/CamouflageShibaInuDog";
import type { DogEntity } from "@/app/types/game";

// 型定義
type BackgroundType =
  | "forest"
  | "desert"
  | "snow"
  | "library"
  | "night"
  | string;

type Level = {
  dogs: DogEntity[];
  name: string;
  index: number;
  backgroundType?: BackgroundType;
  backgroundImage?: string;
  difficulty?: string;
};

type WrongClick = { id: number; x: number; y: number };

type Props = {
  level: Level;
  foundDogs: string[];
  timer: number;
  isPlaying: boolean;
  showSuccess: boolean;
  wrongClicks: WrongClick[];
  imageLoaded: boolean;
  isNewRecord: boolean;
  onImageLoad: () => void;
  onDogClick: (dog: DogEntity, e: React.MouseEvent) => void;
  onWrongClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onStartGame: () => void;
  onGoHome: () => void;
  onNextLevel: () => void;
  totalLevels: number;
};

const GameScreen: React.FC<Props> = ({
  level,
  foundDogs,
  timer,
  isPlaying,
  showSuccess,
  wrongClicks,
  imageLoaded,
  isNewRecord,
  onImageLoad,
  onDogClick,
  onWrongClick,
  onStartGame,
  onGoHome,
  onNextLevel,
  totalLevels,
}) => {
  // ランダム化された犬の配置を管理
  const [randomizedDogs, setRandomizedDogs] = useState<DogEntity[]>([]);

  // 犬の配置をランダム化する関数
  const randomizeDogPositions = (dogs: DogEntity[]) => {
    const minDistance = 8; // 犬同士の最小距離（%）
    const margin = 5; // 画面端からの余白（%）

    const positions: Array<{ x: number; y: number }> = [];

    return dogs.map((dog, index) => {
      let attempts = 0;
      let newPosition: { x: number; y: number };

      do {
        newPosition = {
          x: Math.random() * (100 - margin * 2) + margin,
          y: Math.random() * (100 - margin * 2) + margin,
        };
        attempts++;
      } while (
        attempts < 50 && // 無限ループ防止
        positions.some(
          (pos) =>
            Math.sqrt(
              Math.pow(pos.x - newPosition.x, 2) +
                Math.pow(pos.y - newPosition.y, 2)
            ) < minDistance
        )
      );

      positions.push(newPosition);

      return {
        ...dog,
        x: newPosition.x,
        y: newPosition.y,
      };
    });
  };

  // レベルが変更されたときに犬の位置をランダム化
  useEffect(() => {
    if (level.dogs && level.dogs.length > 0) {
      const randomized = randomizeDogPositions(level.dogs);
      setRandomizedDogs(randomized);
    }
  }, [level.index, level.dogs]); // level.indexが変わったときに再ランダム化

  // タイマーフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // テーマカラー取得
  const themeColors = (() => {
    const themes = {
      forest: {
        primary: "from-green-600 via-emerald-600 to-teal-700",
        accent: "from-green-100 to-emerald-100",
        text: "text-green-700",
      },
      desert: {
        primary: "from-yellow-600 via-orange-600 to-red-700",
        accent: "from-yellow-100 to-orange-100",
        text: "text-orange-700",
      },
      snow: {
        primary: "from-blue-600 via-cyan-600 to-purple-700",
        accent: "from-blue-100 to-cyan-100",
        text: "text-blue-700",
      },
      library: {
        primary: "from-amber-600 via-yellow-600 to-orange-700",
        accent: "from-amber-100 to-yellow-100",
        text: "text-amber-700",
      },
      night: {
        primary: "from-purple-600 via-indigo-600 to-blue-700",
        accent: "from-purple-100 to-indigo-100",
        text: "text-purple-700",
      },
    };
    return (
      themes[(level.backgroundType as keyof typeof themes) ?? "forest"] ||
      themes.forest
    );
  })();

  const bgSrc = level.backgroundImage ?? "";
  const isLastLevel = level.index + 1 === totalLevels;

  // 最後のステージをクリアしたら数秒後に自動でホームへ
  useEffect(() => {
    if (showSuccess && isLastLevel) {
      const t = setTimeout(() => onGoHome(), 3000);
      return () => clearTimeout(t);
    }
  }, [showSuccess, isLastLevel, onGoHome]);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* ヘッダー */}
      <div
        className={`bg-gradient-to-r ${themeColors.primary} text-white p-4 shadow-lg`}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onGoHome}
            className="bg-white/20 backdrop-blur hover:bg-white/30 p-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">
              レベル {level.index + 1}: {level.name}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-lg">{formatTime(timer)}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
            <Target className="w-5 h-5" />
            <span className="font-semibold">
              {foundDogs.length}/{level.dogs.length} 匹
            </span>
          </div>
        </div>
      </div>

      {/* ゲームエリア */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {/* 背景画像（Next/Image） */}
        {bgSrc && (
          <Image
            src={bgSrc}
            alt={level.name ?? "stage"}
            fill
            sizes="100vw"
            className="absolute inset-0 object-cover"
            onLoadingComplete={() => onImageLoad()}
            priority={false}
          />
        )}

        {/* ローディング */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 animate-pulse mx-auto mb-4" />
              <p className="text-gray-600 text-lg flex items-center gap-2 justify-center">
                <Dog />
                ローディング中...
                <PawPrint />
                <PawPrint />
                <PawPrint />
              </p>
            </div>
          </div>
        )}

        {/* スタートオーバーレイ */}
        {!isPlaying && !showSuccess && imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur p-8 rounded-2xl text-center max-w-md shadow-2xl border border-white/20">
              <div className="mb-6">
                <div className="text-6xl mb-4">🕵️‍♀️</div>
                <h2
                  className={`text-3xl font-bold mb-2 bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}
                >
                  レベル {level.index + 1}
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {level.name}
                </h3>
                {level.difficulty && (
                  <div
                    className={`inline-block bg-gradient-to-r ${themeColors.accent} px-3 py-1 rounded-full text-sm font-medium ${themeColors.text}`}
                  >
                    {level.difficulty}
                  </div>
                )}
              </div>
              <p className="mb-2 text-gray-700">
                この場所に
                <span className="font-bold text-purple-500">
                  {level.dogs.length}匹
                </span>
                の柴犬が巧妙に隠れています！
              </p>
              <p className="text-sm text-gray-600 mb-4">
                背景に溶け込んでいるので、じっくり観察してね 🔍
              </p>
              <button
                onClick={onStartGame}
                className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto`}
              >
                <Search className="w-5 h-5" />
                探偵開始
              </button>
            </div>
          </div>
        )}

        {/* 犬の配置 - ランダム化されたものを使用 */}
        {imageLoaded && isPlaying && randomizedDogs.length > 0 && (
          <div className="relative w-full h-full" onClick={onWrongClick}>
            {randomizedDogs.map((dog) => (
              <CamouflageShibaInuDog
                key={dog.id}
                dog={dog}
                backgroundType={(level.backgroundType as any) ?? "forest"}
                isFound={!!dog.id && foundDogs.includes(dog.id)}
                onClick={(e) => onDogClick(dog, e)}
                showPulse={false}
              />
            ))}

            {/* ミスクリック表示 */}
            {wrongClicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-amber-600 text-6xl font-bold animate-ping pointer-events-none"
                style={{
                  left: `${click.x}%`,
                  top: `${click.y}%`,
                  transform: "translate(-50%, -50%)",
                  textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
                }}
              >
                🐾
              </div>
            ))}
          </div>
        )}

        {/* 成功オーバーレイ */}
        {showSuccess && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 p-8 rounded-2xl text-center shadow-2xl">
              {isLastLevel ? (
                <>
                  <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-800">
                    全ステージクリア！おめでとう 🎉
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {formatTime(timer)} で達成。3秒後にホームへ戻ります…
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2
                    className={`text-3xl font-bold mb-2 bg-gradient-to-r ${themeColors.primary} bg-clip-text text-transparent`}
                  >
                    探偵ミッション完了！
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-800">
                      {formatTime(timer)}
                    </span>
                  </div>
                  {isNewRecord && (
                    <div
                      className={`bg-gradient-to-r ${themeColors.accent} px-4 py-2 rounded-full mb-4`}
                    >
                      <span className={`${themeColors.text} font-bold`}>
                        🏆 新記録達成！
                      </span>
                    </div>
                  )}
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={onGoHome}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      ホーム
                    </button>
                    <button
                      onClick={onNextLevel}
                      className={`bg-gradient-to-r ${themeColors.primary} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center gap-2`}
                    >
                      次の場所へ <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
