import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50 flex flex-col min-h-screen">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 flex justify-between items-center px-8 shadow-sm">
          <Link
            href="/"
            className="font-extrabold text-xl tracking-tight text-black"
          >
            ArchInsight<span className="text-blue-600">.</span>
          </Link>

          <div className="flex gap-6 text-sm font-medium text-gray-600 ml-4">
            <Link
              href="/project"
              className="hover:text-black transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/favorite"
              className="hover:text-black transition-colors"
            >
              Favorites
            </Link>
          </div>
        </nav>

        <main className="flex-1 pt-[73px]">{children}</main>
      </body>
    </html>
  );
}
