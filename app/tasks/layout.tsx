export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen bg-slate-900 px-2 py-4">
      {children}
    </main>
  );
}
