import React from 'react';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // 必要に応じて調整
import Link from 'next/link';


function MyApp({ Component, pageProps }: AppProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center relative">
      <div className="text-xl font-bold">My App</div>

      <button
        className="z-20"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* メニュー本体 */}
      <nav
        className={`absolute top-full left-0 w-full bg-gray-800 flex-col items-start transition-all duration-300
        ${menuOpen ? 'flex' : 'hidden'}`}
      >
        <Link href="/" legacyBehavior>
        <a
          className="block w-full px-4 py-2 hover:bg-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </a>
        </Link>
        <Link href="/about" legacyBehavior>
        <a
          className="block w-full px-4 py-2 hover:bg-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          About
        </a>
        </Link>
        <Link href="/contact" legacyBehavior>
        <a
          className="block w-full px-4 py-2 hover:bg-gray-700"
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </a>
        </Link>
      </nav>
      </header>

      <main>
      <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;