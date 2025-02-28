interface MainLayoutProps {
  toolbar: React.ReactNode;
  canvas: React.ReactNode;
}

export function MainLayout({ toolbar, canvas }: MainLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {toolbar}
      {canvas}
    </div>
  );
}
