import React from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b shadow-sm p-4 flex justify-between items-center">
        <div>{React.Children.toArray(children)[0]}</div>
        <ThemeToggle />
      </header>
      <main className="flex-1">{React.Children.toArray(children)[1]}</main>
    </div>
  );
}
