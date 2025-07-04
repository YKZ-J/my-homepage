import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { app } from '../src/firebase';
import { FaXTwitter } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';

const basePath = process.env.NODE_ENV === 'production' ? '/my-homepage' : '';

type Article = {
  id: string;
  title: string;
  createdAt?: { seconds: number; nanoseconds: number } | Date | string;
  imageUrl?: string;
  isDraft?: boolean;
};

function formatDate(createdAt?: { seconds: number; nanoseconds: number } | Date | string) {
  if (!createdAt) return '';
  let dateObj: Date;
  if (typeof createdAt === 'object' && 'seconds' in createdAt) {
    dateObj = new Date(createdAt.seconds * 1000);
  } else if (typeof createdAt === 'string') {
    dateObj = new Date(createdAt);
  } else {
    dateObj = createdAt as Date;
  }
  return dateObj.toLocaleDateString();
}

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch('https://asia-northeast1-my-homepage-bbc9d.cloudfunctions.net/incrementCounter', { method: 'POST' })
      .then(res => res.json())
      .then(data => setCount(data.value ?? 1))
      .catch(async (e) => {
        const db = getFirestore(app);
        const ref = doc(db, 'counters', 'visits');
        const snap = await getDoc(ref);
        setCount(snap.data()?.value ?? 1);
      });
  }, []);

  useEffect(() => {
    // 新着記事4件取得（下書きは除外）
    const fetchArticles = async () => {
      const db = getFirestore(app);
      const q = query(
        collection(db, 'articles'),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const snap = await getDocs(q);
      setLatestArticles(
        snap.docs
          .map(doc => ({ id: doc.id, ...(doc.data() as Omit<Article, 'id'>) }))
          .filter(article => !article.isDraft)
      );
    };
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div
        className="w-full max-w-5xl mx-auto bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw' }}
      >
        {/* タイトル */}
        <h1 className="text-4xl font-extrabold text-center text-blue-900 dark:text-blue-200 tracking-tight drop-shadow-sm">
          ykz HomePage
        </h1>
        {/* プロフィール画像 */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-500 shadow-lg mb-2">
          <Image
            src={`${basePath}/profile.jpg`}
            alt="プロフィール画像"
            width={112}
            height={112}
            className="object-cover object-center w-full h-full"
            priority
          />
        </div>
        {/* サブタイトル */}
        <p className="text-base text-gray-600 dark:text-gray-300 text-center mb-2">
          Webエンジニア / 技術ブログ / ポートフォリオ
        </p>
        {/* 訪問数 */}
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-gray-700 rounded-full px-4 py-1 shadow">
          訪問数: <span className="font-bold text-blue-700 dark:text-blue-300">{count !== null ? count : '-'}</span>
        </div>
        {/* SNSアイコン */}
        <div className="flex items-center gap-4 mt-2">
          <a
            href="https://twitter.com/ykz_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors"
          >
            <FaXTwitter className="w-6 h-6" />
            <span className="hidden sm:inline"> (Twitter)</span>
          </a>
        </div>
        {/* ページ内リンク */}
        <nav className="flex flex-col items-center gap-2 w-full mt-2">
          <Link href="/articles" className="w-full">
            <span className="block w-full text-center py-2 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors shadow">
              Articles
            </span>
          </Link>
          <Link href="/contact" className="w-full">
            <span className="block w-full text-center py-2 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors shadow">
              Contact
            </span>
          </Link>
        </nav>
        {/* 新着記事 */}
        <section className="w-full mt-8">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-100 mb-4 text-center">新着記事</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {latestArticles.length === 0 && (
              <li className="text-gray-400 dark:text-gray-500">記事がありません</li>
            )}
            {latestArticles.map(article => (
              <li key={article.id} className="bg-white dark:bg-gray-700 rounded-xl shadow p-4 flex flex-col items-center max-w-xs mx-auto w-full">
                {article.imageUrl && (
                  <div className="w-full flex justify-center mb-2">
                    <Image
                      src={article.imageUrl}
                      alt="記事画像"
                      width={200}
                      height={120}
                      className="rounded object-cover"
                      style={{ maxWidth: 200, height: "auto" }}
                    />
                  </div>
                )}
                <Link href={`/articles/${article.id}`} className="w-full">
                  <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 hover:underline text-center mb-2 break-words">
                    {article.title}
                  </h3>
                </Link>
                <div className="text-xs text-gray-500 dark:text-gray-300 text-center w-full">
                  投稿日: {formatDate(article.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}