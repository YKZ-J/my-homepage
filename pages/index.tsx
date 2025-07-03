import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../src/firebase';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

// basePathを環境変数から取得
const basePath = process.env.NODE_ENV === 'production' ? '/my-homepage' : '';

export default function Home() {
  const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
      console.log('カウントアップAPI呼び出し');
      fetch('https://asia-northeast1-my-homepage-bbc9d.cloudfunctions.net/incrementCounter', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          console.log('APIレスポンス', data);
          setCount(data.value ?? 1);
        })
        .catch(async (e) => {
          console.error('APIエラー', e);
          // エラー時はFirestoreから直接取得
          const db = getFirestore(app);
          const ref = doc(db, 'counters', 'visits');
          const snap = await getDoc(ref);
          setCount(snap.data()?.value ?? 1);
        });
    }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center gap-6">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">ykz HomePage</h1>
        <div>訪問数: {count !== null ? count : ''}</div>
        {/* アイコンとロゴ */}
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/ykz_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-black dark:text-gray-100 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <FaXTwitter className="w-6 h-6" />
            <span>（Twitter）</span>
          </a>
        </div>
        {/* プロフィール画像 */}
        <Image
          src={`${basePath}/profile.jpg`}
          alt="プロフィール画像"
          width={96}
          height={96}
          className="object-cover object-center w-full h-full"
          priority
        />
        {/* ページ内リンク */}
        <nav className="flex flex-col items-center gap-2">
          <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline block">About</Link>
          <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline block">Contact</Link>
        </nav>
      </div>
    </main>
  );
}