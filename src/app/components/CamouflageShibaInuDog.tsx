"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { DogEntity } from "@/app/types/game";

type BackgroundType = "forest" | "desert" | "snow" | "library" | "night";

type Props = {
  dog: DogEntity; // ← 必須に統一（types/game.ts に合わせる）
  isFound?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  showPulse?: boolean;
  backgroundType?: BackgroundType;
  mouseRadius?: number; // 近接判定の半径(px)
};

const CamouflageShibaInuDog: React.FC<Props> = ({
  dog,
  isFound = false,
  onClick,
  showPulse = false,
  backgroundType = "forest",
  mouseRadius = 100,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dogRef = useRef<HTMLDivElement | null>(null);

  const [mouseDistance, setMouseDistance] = useState<number>(1000);
  const [isNearby, setIsNearby] = useState<boolean>(false);

  const RING = 0;
  const SILHOUETTE = dog.silhouette ?? "/images/dogs/silhouette.png";

  // 効果音の事前読み込み
  useEffect(() => {
    const audio = new Audio("/sounds/dog.mp3");
    audio.volume = 0.3;
    audio.preload = "auto";
    audioRef.current = audio;
    return () => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audioRef.current = null;
      } catch {}
    };
  }, []);

  // 近接判定（マウスと柴犬の中心距離）
  useEffect(() => {
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dogRef.current) return;
      if (rafId != null) return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const rect = dogRef.current!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);

        setMouseDistance(dist);
        setIsNearby(dist <= mouseRadius);
      });
    };

    const handleLeave = () => {
      setMouseDistance(1000);
      setIsNearby(false);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [mouseRadius]);

  // カモフラージュの見た目
  const getCamouflageStyle = (): React.CSSProperties => {
    const baseOpacity = Math.max(
      0.15,
      Math.min(0.8, (100 - mouseDistance) / 100 + 0.2)
    );
    const styles: Record<
      BackgroundType,
      {
        filter: string;
        opacity: number;
        mixBlendMode: React.CSSProperties["mixBlendMode"];
      }
    > = {
      forest: {
        filter: `hue-rotate(40deg) saturate(0.8) brightness(0.7) contrast(0.9) blur(${
          isNearby ? 0 : 0.8
        }px)`,
        opacity: isFound ? 1 : showPulse ? 0.6 : baseOpacity,
        mixBlendMode: isFound ? "normal" : "multiply",
      },
      desert: {
        filter: `sepia(0.7) brightness(1.1) contrast(0.8) saturate(1.2) blur(${
          isNearby ? 0 : 1
        }px)`,
        opacity: isFound ? 1 : showPulse ? 0.5 : baseOpacity * 0.8,
        mixBlendMode: isFound ? "normal" : "overlay",
      },
      snow: {
        filter: `brightness(1.4) contrast(0.6) saturate(0.3) blur(${
          isNearby ? 0 : 1.2
        }px)`,
        opacity: isFound ? 1 : showPulse ? 0.4 : baseOpacity * 0.7,
        mixBlendMode: isFound ? "normal" : "screen",
      },
      library: {
        filter: `grayscale(0.6) contrast(1.1) brightness(0.8) blur(${
          isNearby ? 0 : 0.6
        }px)`,
        opacity: isFound ? 1 : showPulse ? 0.5 : baseOpacity,
        mixBlendMode: isFound ? "normal" : "darken",
      },
      night: {
        filter: `brightness(0.4) contrast(1.3) saturate(0.4) blur(${
          isNearby ? 0 : 1
        }px)`,
        opacity: isFound ? 1 : showPulse ? 0.3 : baseOpacity * 0.6,
        mixBlendMode: isFound ? "normal" : "multiply",
      },
    };
    return styles[backgroundType] ?? styles.forest;
  };

  // クリック時
  const handleDogClick = (e: React.MouseEvent<HTMLDivElement>) => {
    try {
      onClick?.(e);
    } finally {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = 0.5;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
  };

  const imageSrc = isFound ? dog.image || SILHOUETTE : SILHOUETTE;

  return (
    <div
      ref={dogRef}
      className={`absolute cursor-pointer transition-all duration-1000 ease-out ${
        isFound ? "z-50" : "z-20"
      }`}
      style={{
        left: `${dog.x}%`,
        top: `${dog.y}%`,
        width: `${dog.size}px`,
        height: `${dog.size}px`,
        transform: isFound
          ? "scale(1.5) translateY(-15px)"
          : isNearby
          ? "scale(1.05)"
          : "scale(1)",
      }}
      onClick={handleDogClick}
    >
      {/* 波紋エフェクト */}
      {isNearby && !isFound && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute rounded-full border-2 border-white/30 animate-ping"
            style={{
              width: `${dog.size + 20}px`,
              height: `${dog.size + 20}px`,
            }}
          />
          <div
            className="absolute rounded-full border-2 border-blue-300/20 animate-ping"
            style={{
              width: `${dog.size + 40}px`,
              height: `${dog.size + 40}px`,
              animationDelay: "0.3s",
            }}
          />
        </div>
      )}

      {/* 枠と中の画像 */}
      <div
        className={`relative w-full h-full rounded-full transition-all duration-1000 overflow-visible ${
          showPulse && !isFound ? "animate-pulse" : ""
        }`}
        style={{
          border: isFound
            ? `${RING}px solid #FFD700`
            : isNearby
            ? `${RING}px solid rgba(255,255,255,0.6)`
            : `${RING}px solid rgba(255,255,255,0.2)`,
          boxShadow: isFound
            ? "0 0 25px rgba(255,215,0,0.9), 0 0 50px rgba(255,215,0,0.5)" // ← クォート統一
            : isNearby
            ? "0 0 15px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2)"
            : "0 0 5px rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            inset: RING,
            backgroundColor: "transparent",
            ...getCamouflageStyle(),
          }}
        >
          <Image
            src={imageSrc}
            alt={dog.name || "柴犬"}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>

        {/* スポットライト */}
        {isFound && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
              animation: "spotlight 2s ease-out",
            }}
          />
        )}
      </div>

      {/* 近接ヒント */}
      {isNearby && !isFound && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-80 pointer-events-none whitespace-nowrap">
          何かいる...？
        </div>
      )}

      <style jsx>{`
        @keyframes spotlight {
          0% {
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0) 0%,
              transparent 70%
            );
          }
          50% {
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.5) 0%,
              transparent 70%
            );
          }
          100% {
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 70%
            );
          }
        }
      `}</style>
    </div>
  );
};

export default CamouflageShibaInuDog;
