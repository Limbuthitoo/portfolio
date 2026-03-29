"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import MeshBackground from "./MeshBackground";
import StatusBar from "./StatusBar";
import Dock from "./Dock";
import { ThemeProvider } from "./ThemeProvider";

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
        <StatusBar />
        <main className="relative z-10 h-full overflow-y-auto bento-scroll pb-20 sm:pb-24 pt-10 page-enter">
          {children}
        </main>
        <Dock />
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}
