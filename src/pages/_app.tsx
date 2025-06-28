import type { AppProps } from 'next/app';
import { useState } from 'react';
import Link from 'next/link';
import '../styles/globals.css';



export default function MyApp({ Component, pageProps }: AppProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ ヘッダー */}
      <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center relative z-20">
        <div className="text-xl font-bold">ykz HomePage</div>

        {/* ✅ ハンバーガーボタン（モバイルのみ表示） */}
        <button
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* ✅ メニュー（PC用） */}
        <nav className="hidden lg:flex gap-6">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>

        {/* ✅ モバイルメニュー（開閉対応） */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-gray-800 flex flex-col lg:hidden z-10">
            <Link href="/" className="block px-4 py-2 hover:bg-gray-700" onClick={closeMenu}>Home</Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-gray-700" onClick={closeMenu}>About</Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700" onClick={closeMenu}>Contact</Link>
          </div>
        )}
      </header>

      {/* ✅ メイン */}
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>

      {/* ✅ フッター */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <small>&copy; {new Date().getFullYear()} ykz All rights reserved.</small>
      </footer>
    </div>
  );
}