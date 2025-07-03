import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { auth } from '../src/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useUserRole } from '../src/hooks/useUserRole';



export default function MyApp({ Component, pageProps }: AppProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    // router.push('/');
  };

  const handleLogin = () => {
    router.push('/auth');
  };

  const role = useUserRole(user);
  const isAdmin = role === 'admin';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col min-h-screen">
        {/* ✅ ヘッダー */}
        <header className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center relative z-20">
          <Link href="/" className="text-xl font-bold hover:underline">
            ykz HomePage
          </Link>
          {/* ログイン状態による表示切替 */}        
          {user ? (
            <span className="ml-4 flex items-center whitespace-nowrap">
              <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <button
              onClick={handleLogout}
              className="ml-2 px-2 py-1 bg-gray-600 rounded whitespace-nowrap"
              style={{ minWidth: "80px" }}
              >
              ログアウト
              </button>
            </span>
          ) : (
            <span className="ml-4 flex items-center whitespace-nowrap">
              <button
              onClick={handleLogin}
              className="hover:underline flex items-center"
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, whiteSpace: "nowrap" }}
              >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              ログイン/新規登録
              </button>
            </span>
          )}
          {/* ✅ ハンバーガーボタン（モバイルのみ表示） */}
          <button
            className="lg:hidden"
            onClick={toggleMenu}
            onTouchStart={toggleMenu} 
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* ✅ メニュー（PC用） */}
<nav className="hidden lg:flex gap-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/auth" className="hover:underline">
              Auth
            </Link>
            <Link href="/articles" className="hover:underline">
              Articles
            </Link>
            {isAdmin && (
              <Link href="/articles/create" className="hover:underline">
                Articles Create
              </Link>
            )}
          </nav>
          {/* ...ハンバーガーボタン... */}
        </header>

        {/* ✅ モバイルメニュー（開閉対応・全画面固定配置） */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-800 flex flex-col lg:hidden">
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
              Contact
            </Link>
            <Link href="/auth" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
              Auth
            </Link>
            <Link href="/articles" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
              Articles
            </Link>
            {isAdmin && (
              <Link href="/articles/create" className="block px-4 py-2 hover:bg-gray-700 text-white text-lg" onClick={closeMenu}>
                Articles Create
              </Link>
            )}
          </div>
        )}
        {/* ✅ メイン */}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>

        {/* ✅ フッター */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <small>&copy; {new Date().getFullYear()} ykz All rights reserved.</small>
        </footer>
      </div>
    </>
  );
}