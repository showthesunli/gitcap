import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-border border-b shadow-sm p-4 flex justify-between items-center bg-card text-card-foreground">
        <div className="flex-1">
          {/* 左侧空白区域 */}
        </div>
        <div className="flex-1 flex justify-center">
          {React.Children.toArray(children)[0]}
        </div>
        <div className="flex-1 flex justify-end">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-4 bg-background">{React.Children.toArray(children)[1]}</main>
    </div>
  );
}
