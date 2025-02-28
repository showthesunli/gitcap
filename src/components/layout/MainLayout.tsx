interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b shadow-sm">
        {React.Children.toArray(children)[0]}
      </header>
      <main className="flex-1">
        {React.Children.toArray(children)[1]}
      </main>
    </div>
  );
}
