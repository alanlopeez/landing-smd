"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Floating3DEffectsProps {
  className?: string;
}

export default function Floating3DEffects({ className = "" }: Floating3DEffectsProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse offset (-1 to 1) from window center
      const { innerWidth, innerHeight } = window;
      const targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: targetX, y: targetY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-10 ${className}`}
      style={{ perspective: "1000px" }}
    >
      {/* Element 1: Main Hero 3D Star (Top Right of Hero) */}
      <div
        className="absolute top-16 sm:top-20 right-[-30px] sm:right-6 md:right-16 lg:right-24 w-44 sm:w-56 md:w-72 lg:w-84 aspect-square transition-transform duration-700 ease-out animate-float-slow"
        style={{
          transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0) rotateX(${
            -mousePos.y * 14
          }deg) rotateY(${mousePos.x * 16}deg)`,
        }}
      >
        <div className="relative w-full h-full filter drop-shadow-[0_20px_45px_rgba(206,247,158,0.22)]">
          <Image
            src="/images/efectos-3d.png"
            alt=""
            width={480}
            height={480}
            priority
            className="w-full h-full object-contain filter contrast-[1.08] brightness-[1.05]"
          />
        </div>
      </div>

      {/* Element 2: Secondary 3D Star (Floating Mid-Left Background, smaller, soft blur) */}
      <div
        className="absolute top-1/2 -left-12 sm:left-4 md:left-12 w-28 sm:w-36 md:w-48 aspect-square transition-transform duration-1000 ease-out animate-float-reverse opacity-75"
        style={{
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0) rotateZ(35deg) rotateY(${
            mousePos.x * 20
          }deg)`,
        }}
      >
        <div className="relative w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,130,124,0.35)] blur-[0.4px]">
          <Image
            src="/images/efectos-3d.png"
            alt=""
            width={320}
            height={320}
            className="w-full h-full object-contain filter contrast-[1.05]"
          />
        </div>
      </div>

      {/* Element 3: Accent Small 3D Star (Bottom Right, subtle floating wobble) */}
      <div
        className="hidden sm:block absolute bottom-24 right-1/4 w-20 sm:w-28 md:w-32 aspect-square transition-transform duration-700 ease-out animate-float-wobble opacity-60"
        style={{
          transform: `translate3d(${mousePos.x * 32}px, ${mousePos.y * 28}px, 0) rotateZ(-25deg)`,
        }}
      >
        <div className="relative w-full h-full filter drop-shadow-[0_10px_20px_rgba(206,247,158,0.18)]">
          <Image
            src="/images/efectos-3d.png"
            alt=""
            width={220}
            height={220}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Subtle Radial Ambient Lighting behind 3D objects */}
      <div className="absolute top-24 right-12 w-96 h-96 bg-bioluminescent-lime/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-8 w-80 h-80 bg-[#00827c]/15 rounded-full blur-[110px] pointer-events-none -z-10" />
    </div>
  );
}
