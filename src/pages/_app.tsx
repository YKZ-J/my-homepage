// pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

// Removed duplicate default export



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="bg-blue-600 text-white p-4">
        <h1>My Homepage ヘッダー</h1>
      </header>
      <Component {...pageProps} />
      <footer className="bg-gray-200 text-center p-4">
        © 2025 My Homepage
      </footer>
    </>
  );
}

export default MyApp;