import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { auth } from '../src/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useUserRole } from '../src/hooks/useUserRole';
import AuthButton from '../src/components/AuthButton';
import '../src/styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false); // 認証モーダル表示用
  const router = useRouter();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  const handleLogin = () => {
    setShowAuth(true); // モーダル表示
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const role = useUserRole(user);
  const isAdmin = role === 'admin';

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* 認証モーダル */}
      {showAuth && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 1001,
              width: '100%',
              maxWidth: 480,
            }}
          >
            <button
              onClick={handleCloseAuth}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: 24,
                background: 'transparent',
                border: 'none',
                color: '#333',
                cursor: 'pointer',
                zIndex: 1002,
              }}
              aria-label="Close authentication"
            >
              ×
            </button>
            <div
              className="container flex flex-col items-center justify-center rounded-3xl shadow-2xl p-8 gap-6 border border-blue-100 dark:border-gray-700 backdrop-blur"
              style={{
                width: '80vw',
                maxWidth: 480,
                background: 'var(--card-bg)',
              }}
            >
              <h1
                className="text-3xl font-extrabold mb-6 text-center tracking-tight"
                style={{ color: 'var(--primary)' }}
              >
                Authentication
              </h1>
              <div className="w-full flex flex-col items-center">
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* globals.cssの--backgroundが反映されるようにbg-*系クラスを削除 */}
      <div
        className="flex flex-col min-h-screen"
        style={{ background: 'var(--background)' }}
      >
        {/* ヘッダー */}
        <header
          className="w-full flex justify-center shadow-md backdrop-blur sticky top-0 z-30"
          style={{ background: 'var(--header-bg)' }}
        >
          <div
            className="flex items-center justify-between w-full"
            style={{ maxWidth: '1200px', width: '80vw' }}
          >
            <Link
              href="/"
              className="text-2xl font-extrabold py-3 px-2 tracking-tight hover:opacity-80 transition"
              style={{ color: 'var(--header-foreground)' }}
            >
              ykz HomePage
            </Link>
            {/* PCナビ */}
            <nav className="hidden lg:flex gap-6 items-center">
              <Link
                href="/"
                className="hover:opacity-80 transition"
                style={{ color: 'var(--header-foreground)' }}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="hover:opacity-80 transition"
                style={{ color: 'var(--header-foreground)' }}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:opacity-80 transition"
                style={{ color: 'var(--header-foreground)' }}
              >
                Contact
              </Link>
              <Link
                href="/articles"
                className="hover:opacity-80 transition"
                style={{ color: 'var(--header-foreground)' }}
              >
                Articles
              </Link>
              {isAdmin && (
                <Link
                  href="/articles/create"
                  className="hover:opacity-80 transition"
                  style={{ color: 'var(--header-foreground)' }}
                >
                  Articles Create
                </Link>
              )}
            </nav>
            {/* ログイン状態 */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span
                    className="hidden md:inline-flex items-center text-sm"
                    style={{ color: 'var(--header-foreground)' }}
                  >
                    <svg
                      className="w-5 h-5 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Active
                  </span>
                  <button
                    onClick={handleLogout}
                    className="button button-gray ml-2 px-3 py-1 rounded transition text-sm font-semibold shadow"
                    style={{ minWidth: '100px', whiteSpace: 'nowrap' }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex flex-col md:flex-row items-center px-3 py-1 rounded transition text-sm font-semibold shadow"
                  style={{
                    background: 'var(--secondary)',
                    color: '#fff',
                    minWidth: '110px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mb-1 md:mb-0 md:mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span style={{ lineHeight: 1 }}>log in</span>
                  </span>
                  <span
                    className="md:ml-1"
                    style={{ fontSize: '0.95em', opacity: 0.85, lineHeight: 1 }}
                  >
                    {' '}
                    / sign up
                  </span>
                </button>
              )}
              {/* ハンバーガー */}
              <button
                className="lg:hidden ml-2 p-2 rounded transition"
                style={{ background: 'var(--secondary)', color: '#fff' }}
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* モバイルメニュー */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center lg:hidden"
            style={{ background: 'rgba(22,32,50,0.95)' }}
          >
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="absolute top-6 right-6"
              style={{ color: '#fff' }}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <nav
              className="flex flex-col gap-6 text-2xl mt-12"
              style={{ color: '#fff' }}
            >
              <Link href="/" onClick={closeMenu} className="hover:opacity-80">
                Home
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className="hover:opacity-80"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="hover:opacity-80"
              >
                Contact
              </Link>
              <Link
                href="/articles"
                onClick={closeMenu}
                className="hover:opacity-80"
              >
                Articles
              </Link>
              {/* Authページへのリンクは削除または非表示にしてOK */}
              {isAdmin && (
                <Link
                  href="/articles/create"
                  onClick={closeMenu}
                  className="hover:opacity-80"
                >
                  Articles Create
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* メイン */}
        <main className="flex-grow flex justify-center">
          <div className="w-full" style={{ maxWidth: '1200px', width: '80vw' }}>
            <Component {...pageProps} />
          </div>
        </main>

        {/* フッター */}
        <footer
          className="w-full flex justify-center shadow-inner py-4 mt-8"
          style={{ background: 'var(--footer-bg)' }}
        >
          <div
            className="text-sm flex justify-end"
            style={{
              maxWidth: '1200px',
              width: '80vw',
              color: 'var(--footer-foreground)',
            }}
          >
            <small>
              &copy; {new Date().getFullYear()} ykz All rights reserved.
            </small>
          </div>
        </footer>
      </div>
    </>
  );
}
