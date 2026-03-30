"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import MeshBackground from "./MeshBackground";
import StatusBar from "./StatusBar";
import Dock from "./Dock";
import { ThemeProvider } from "./ThemeProvider";
import SmoothScroll from "@/components/common/SmoothScroll";
import PageTransition from "@/components/common/PageTransition";
import ScrollProgress from "@/components/common/ScrollProgress";
import GrainOverlay from "@/components/common/GrainOverlay";

const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });
const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function SystemShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider>
      <div className="relative h-full w-full overflow-hidden">
        <CustomCursor />
        <MeshBackground />
        <GrainOverlay />
        <ScrollProgress />
        <StatusBar />
        <SmoothScroll>
          <main className="relative z-10 h-full overflow-y-auto bento-scroll pb-20 sm:pb-24 pt-10 page-enter">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </SmoothScroll>
        <Dock />
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
