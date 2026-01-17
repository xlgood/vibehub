export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景光晕 */}
      <circle cx="50" cy="50" r="45" className="fill-white/5 stroke-white/10 stroke-2" />
      
      {/* 核心闪电：使用渐变色 */}
      <path 
        d="M55 15L25 55H50L45 85L75 45H50L55 15Z" 
        fill="url(#vibe-gradient)" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      
      {/* 定义渐变：从 Fire 到 Ice */}
      <defs>
        <linearGradient id="vibe-gradient" x1="25" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F97316" /> {/* Orange-500 */}
          <stop offset="100%" stopColor="#22D3EE" /> {/* Cyan-400 */}
        </linearGradient>
      </defs>
    </svg>
  );
}