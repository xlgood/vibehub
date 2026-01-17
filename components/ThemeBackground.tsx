"use client";

import { useVibe } from "@/context/VibeProvider";
import { clsx } from "clsx";

export default function ThemeBackground() {
  const { theme } = useVibe();

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-1000 ease-in-out">
      {/* 1. 基础黑色背景 (作为底色) */}
      <div className="absolute inset-0 bg-vibe-black" />

      {/* 2. Fire 主题光晕 (红色) - 增强版 */}
      <div 
        className={clsx(
          // 修改点：opacity 0.15 -> 0.4 (更亮), transparent_70% -> 90% (范围更大)
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(249,115,22,0.4),transparent_90%)] transition-opacity duration-1000 ease-in-out",
          theme === 'fire' ? "opacity-100" : "opacity-0"
        )} 
      />

      {/* 3. Ice 主题光晕 (青色) - 增强版 */}
      <div 
        className={clsx(
          // 修改点：opacity 0.15 -> 0.4 (更亮), transparent_70% -> 90% (范围更大)
          "absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,211,238,0.4),transparent_90%)] transition-opacity duration-1000 ease-in-out",
          theme === 'ice' ? "opacity-100" : "opacity-0"
        )} 
      />
      
      {/* 4. 增加一个全屏噪点纹理 (可选，增加赛博朋克质感) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}