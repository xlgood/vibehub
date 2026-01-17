"use client";

import { useVibe } from "@/context/VibeProvider";
import { clsx } from "clsx";

export default function AmbientBackground() {
  const { globalVibe } = useVibe();

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none transition-all duration-[2000ms] ease-in-out">
      {/* 这里我们使用两层背景叠加来实现平滑过渡。
         底层是深黑色，上层是根据 vibe 变化的渐变光晕。
      */}
      
      {/* 1. Fire Theme Gradient Layer */}
      <div 
        className={clsx(
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(249,115,22,0.15),_rgba(0,0,0,0)_70%)] transition-opacity duration-[2000ms]",
          globalVibe === 'fire' ? "opacity-100" : "opacity-0"
        )} 
      />
      
      {/* 2. Ice Theme Gradient Layer */}
      <div 
        className={clsx(
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(34,211,238,0.15),_rgba(0,0,0,0)_70%)] transition-opacity duration-[2000ms]",
          globalVibe === 'ice' ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* 3. Subtle Secondary Glow (Bottom Right) */}
      <div 
        className={clsx(
          "absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] transition-colors duration-[2000ms]",
          globalVibe === 'fire' ? "bg-orange-900/10" : "bg-cyan-900/10"
        )}
      />
    </div>
  );
}