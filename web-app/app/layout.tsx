import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b p-4 flex gap-6">
          <Link href="/" className="font-bold">
            ArchInsight
          </Link>

          <Link href="/search">Search</Link>

          <Link href="/library">Library</Link>

          <Link href="/chat">AI Chat</Link>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
