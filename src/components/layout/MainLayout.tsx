import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b shadow-sm">
        {React.Children.toArray(children)[0]}
      </header>
      <main className="flex-1">{React.Children.toArray(children)[1]}</main>
    </div>
  );
}
