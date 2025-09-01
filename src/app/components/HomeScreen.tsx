"use client";
import React from "react";
import Image from "next/image";

type Props = {
  completedLevels?: number;
  totalLevels?: number;
  totalStars?: number;
  onStartGame?: () => void;
  onLevelSelect?: () => void;
  onResetProgress?: () => void;
  onOpenDogDex?: () => void;
};

const HomeScreen: React.FC<Props> = ({
  completedLevels = 0,
  totalLevels = 0,
  totalStars = 0,
  onStartGame = () => {},
  onLevelSelect = () => {},
  onResetProgress = () => {},
  onOpenDogDex = () => {},
}) => {
  const achievementRate =
    totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  // 星の表示用関数
  const renderStars = (starCount: number, maxDisplay: number = 10) => {
    if (starCount === 0) return null;

    const displayStars = Math.min(starCount, maxDisplay);
    const remainingStars = Math.max(0, starCount - maxDisplay);

    return (
      <span className="inline-block">
        <span className="text-yellow-300 drop-shadow-md animate-pulse">
          {"⭐".repeat(displayStars)}
        </span>
        {remainingStars > 0 && (
          <span className="text-yellow-300/70 text-sm ml-1">
            +{remainingStars}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
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

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-4xl text-center p-6">
        {/* ロゴとタイトル */}
        <div className="mb-12">
          <div
            className="w-40 h-40 mx-auto mb-6 rounded-full p-[4px] animate-fade-in"
            style={{
              background: "linear-gradient(135deg, #ff8800, #ff00ff)",
              boxShadow:
                "0 0 20px 6px rgba(255, 136, 0, 0.6), 0 0 40px 10px rgba(255, 0, 255, 0.4)",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden shadow-2xl bg-white">
              <Image
                src="/images/dogs/dog.jpg"
                alt="SIBAINU Logo"
                width={500}
                height={500}
                className="w-full h-full object-cover"
                priority={false}
              />
            </div>
          </div>

          {/* タイトルと星 */}
          <div className="flex flex-col items-center">
            <h1 className="text-8xl font-extrabold mb-2 bg-gradient-to-b from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg tracking-widest">
              SIBAINU
            </h1>

            {/* 獲得した星の表示 */}
            {totalStars > 0 && (
              <div className="mb-4 flex items-center justify-center gap-2">
                {renderStars(totalStars, 15)}
                <span className="text-yellow-300 font-bold text-lg">
                  {totalStars}個
                </span>
              </div>
            )}
          </div>

          <p className="text-lg font-bold text-white/90">
            風景の中から柴犬を探し出そう！
            <br />
            レア柴を見つけ図鑑を埋めよう
          </p>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-6 max-w-md mx-auto ">
          <button
            onClick={onStartGame}
            className="w-4/5 mx-auto py-4 font-bold text-2xl text-black rounded-full relative overflow-hidden transition-transform hover:scale-105"
            style={{
              border: "4px solid transparent",
              borderRadius: "3rem",
              background:
                "linear-gradient(90deg, #efc416ff, #e020a0ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc) border-box",
              boxShadow:
                "0 0 15px rgba(255, 221, 85, 0.8), 0 0 30px rgba(255, 136, 0, 0.6), 0 0 50px rgba(255, 102, 204, 0.4)",
            }}
          >
            🚀 ゲームスタート
          </button>
          <button
            onClick={onLevelSelect}
            className="w-4/5 mx-auto py-4 font-bold text-2xl text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
            style={{
              border: "4px solid transparent",
              borderRadius: "3rem",
              background:
                "linear-gradient(90deg, #ff3366, #9933ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc, #9933ff) border-box",
              boxShadow:
                "0 0 15px rgba(255, 51, 102, 0.8), 0 0 30px rgba(255, 102, 204, 0.6), 0 0 50px rgba(153, 51, 255, 0.4)",
            }}
          >
            🏆 ステージ選択
          </button>
          <button
            onClick={onOpenDogDex}
            className="w-4/5 mx-auto py-4 font-bold text-2xl text-white rounded-full relative overflow-hidden transition-transform hover:scale-105"
            style={{
              border: "4px solid transparent",
              borderRadius: "3rem",
              background:
                "linear-gradient(90deg, #ff3366, #9933ff) padding-box, linear-gradient(90deg, #ffdd55 70%, #ff66cc, #9933ff) border-box",
              boxShadow:
                "0 0 15px rgba(255, 51, 102, 0.8), 0 0 30px rgba(255, 102, 204, 0.6), 0 0 50px rgba(153, 51, 255, 0.4)",
            }}
          >
            📚 図鑑を見る
          </button>
        </div>

        {/* 成績パネル */}
        <div className="mt-10 backdrop-blur-md bg-white/10 rounded-xl p-6 shadow-lg border border-white/20 max-w-md mx-auto">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-center gap-2">
            ⭐ あなたの成績
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="text-center">
              <p className="text-3xl font-bold">{completedLevels}</p>
              <p className="text-sm opacity-80">クリア済み</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalLevels}</p>
              <p className="text-sm opacity-80">全レベル</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-300">{totalStars}</p>
              <p className="text-sm opacity-80">獲得した星</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{achievementRate}%</p>
              <p className="text-sm opacity-80">達成率</p>
            </div>
          </div>

          {/* 星のランク表示 */}
          {totalStars > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-center gap-2">
                <span className="text-white/80 text-sm">ランク:</span>
                <span className="font-bold text-lg">
                  {totalStars >= 30 ? (
                    <span className="text-yellow-300">⭐ マスター ⭐</span>
                  ) : totalStars >= 20 ? (
                    <span className="text-blue-300">💎 エクスパート</span>
                  ) : totalStars >= 10 ? (
                    <span className="text-green-300">🏅 アドバンス</span>
                  ) : totalStars >= 5 ? (
                    <span className="text-purple-300">🥉 インターミディエイト</span>
                  ) : (
                    <span className="text-white/70">🌟 ビギナー</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* リセットボタン */}
          {(completedLevels > 0 || totalStars > 0) && (
            <div className="mt-6 pt-4 border-t border-white/20">
              <button
                onClick={onResetProgress}
                className="w-full py-3 text-sm font-bold text-red-300 border-2 border-red-300/50 rounded-lg bg-red-500/10 hover:bg-red-500/20 hover:border-red-300 transition-all duration-200 hover:scale-105"
              >
                🗑️ データをリセット
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
