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
type BackgroundType = "forest" | "desert" | "snow" | "library" | "night";

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

// テーマカラーの型定義
type Theme = {
  primary: string;
  accent: string;
  text: string;
};

// デフォルトテーマ（フォールバック）
const DEFAULT_THEME: Theme = {
  primary: "from-green-600 via-emerald-600 to-teal-700",
  accent: "from-green-100 to-emerald-100",
  text: "text-green-700",
};

// テーマカラー定義
const THEMES: Record<BackgroundType, Theme> = {
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

  // 安全なテーマカラー取得
  const getThemeColors = (): Theme => {
    if (!level?.backgroundType) {
      return DEFAULT_THEME;
    }
    return THEMES[level.backgroundType] || DEFAULT_THEME;
  };

  const themeColors = getThemeColors();

  // 犬の配置をランダム化する関数
  const randomizeDogPositions = (dogs: DogEntity[]) => {
    const minDistance = 8; // 犬同士の最小距離（%）
    const margin = 5; // 画面端からの余白（%）

    const positions: Array<{ x: number; y: number }> = [];

    return dogs.map((dog) => {
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
            Math.hypot(pos.x - newPosition.x, pos.y - newPosition.y) <
            minDistance
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
  }, [level.index, level.dogs]);

  // タイマーフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
    <div className="w-full h-screen flex flex-col relative overflow-hidden">
      {/* 統一された背景システム */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center responsive-bg"></div>

      <style jsx>{`
        .responsive-bg {
          background-image: url("/images/home/img-mobile.png");
          background-size: cover;
          background-position: center;
        }

        @media (min-width: 1024px) {
          .responsive-bg {
            background-image: url("/images/home/img-desktop.png");
          }
        }
      `}</style>
      {/* ヘッダー */}
      <div className="relative backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* 上部：ホームボタン */}
          <div className="flex justify-start mb-4">
            <button
              onClick={onGoHome}
              className="py-2 px-4 font-bold text-lg text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
              style={{
                border: "3px solid transparent",
                borderRadius: "1.5rem",
                background:
                  "linear-gradient(90deg, #ff3366, #9933ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc, #9933ff) border-box",
                boxShadow:
                  "0 0 10px rgba(255, 51, 102, 0.6), 0 0 20px rgba(255, 102, 204, 0.4), 0 0 30px rgba(153, 51, 255, 0.3)",
              }}
            >
              <Home className="w-4 h-4 inline mr-2" />
              ホーム
            </button>
          </div>

          {/* 中央：レベル情報 */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-extrabold mb-1 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              {level.name}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/80 text-sm">レベル {level.index + 1}</span>
              {level.difficulty && (
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/90 backdrop-blur-sm">
                  {level.difficulty}
                </span>
              )}
            </div>
          </div>

          {/* 下部：ゲーム情報 */}
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <Clock className="w-4 h-4 text-white" />
              <span className="font-mono text-lg text-white">{formatTime(timer)}</span>
              {isNewRecord && (
                <span className="text-yellow-300 text-xs ml-1">🏆</span>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <Target className="w-4 h-4 text-white" />
              <span className="font-semibold text-white">
                {foundDogs.length}/{level.dogs.length} 匹
              </span>
            </div>
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
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-lg border border-white/20 text-center max-w-md mx-4">
              <div className="mb-6">
                <div className="text-6xl mb-4">🕵️‍♀️</div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                  レベル {level.index + 1}
                </h2>
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow">
                  {level.name}
                </h3>
                {level.difficulty && (
                  <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-white/90 backdrop-blur-sm border border-white/20">
                    {level.difficulty}
                  </div>
                )}
              </div>
              <p className="mb-2 text-white/90 font-medium">
                この場所に
                <span className="font-bold text-yellow-300 mx-1">
                  {level.dogs.length}匹
                </span>
                の柴犬が巧妙に隠れています！
              </p>
              <p className="text-sm text-white/70 mb-6">
                背景に溶け込んでいるので、じっくり観察してね
              </p>
              <button
                onClick={onStartGame}
                className="py-4 px-8 font-bold text-xl text-black rounded-full relative overflow-hidden transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
                style={{
                  border: "4px solid transparent",
                  borderRadius: "3rem",
                  background:
                    "linear-gradient(90deg, #efc416ff, #e020a0ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc) border-box",
                  boxShadow:
                    "0 0 15px rgba(255, 221, 85, 0.8), 0 0 30px rgba(255, 136, 0, 0.6), 0 0 50px rgba(255, 102, 204, 0.4)",
                }}
              >
                <Search className="w-5 h-5" />
                開始
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
                backgroundType={level.backgroundType ?? "forest"}
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 shadow-lg border border-white/20 text-center max-w-md mx-4">
              {isLastLevel ? (
                <>
                  <Trophy className="w-20 h-20 mx-auto mb-4 text-yellow-300 drop-shadow-lg" />
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                    全ステージクリア！
                  </h2>
                  <p className="text-lg font-bold text-white/90 mb-2">おめでとう 🎉</p>
                  <p className="text-white/80">
                    {formatTime(timer)} で達成
                  </p>
                  <p className="text-sm text-white/70 mt-2">
                    3秒後にホームへ戻ります...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                    ミッション完了
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-white/80" />
                    <span className="text-2xl font-bold text-white">
                      {formatTime(timer)}
                    </span>
                  </div>
                  {isNewRecord && (
                    <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 rounded-full mb-4 border border-yellow-300/30">
                      <span className="text-yellow-300 font-bold">
                        🏆 新記録達成
                      </span>
                    </div>
                  )}
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      onClick={onGoHome}
                      className="py-3 px-6 font-bold text-lg text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
                      style={{
                        border: "3px solid transparent",
                        borderRadius: "2rem",
                        background:
                          "linear-gradient(90deg, #6b7280, #4b5563) padding-box, linear-gradient(90deg, #9ca3af, #6b7280) border-box",
                        boxShadow:
                          "0 0 15px rgba(107, 114, 128, 0.6), 0 0 30px rgba(75, 85, 99, 0.4)",
                      }}
                    >
                      <Home className="w-5 h-5 inline mr-2" />
                      ホーム
                    </button>
                    <button
                      onClick={onNextLevel}
                      className="py-3 px-6 font-bold text-lg text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
                      style={{
                        border: "3px solid transparent",
                        borderRadius: "2rem",
                        background:
                          "linear-gradient(90deg, #efc416ff, #e020a0ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc) border-box",
                        boxShadow:
                          "0 0 15px rgba(255, 221, 85, 0.8), 0 0 30px rgba(255, 136, 0, 0.6), 0 0 50px rgba(255, 102, 204, 0.4)",
                      }}
                    >
                      次の場所へ
                      <ChevronRight className="w-5 h-5 inline ml-2" />
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
