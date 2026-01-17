import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { VibeProvider } from "@/context/VibeProvider";
import AmbientBackground from "@/components/AmbientBackground"; // 🌟 引入背景

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VibeHub | Digital Resonance",
  description: "Share your energy. Choose your faction. Boost or Chill.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-[#050505] text-white antialiased min-h-screen flex flex-col`}>
        <VibeProvider>
          {/* 🌟 放置全局动态背景 */}
          <AmbientBackground />
          
          <div className="flex-grow relative z-10">
            {children}
          </div>
          <Footer />
        </VibeProvider>
      </body>
    </html>
  );
}