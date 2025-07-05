import { useEffect, useState } from 'react';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
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

function formatDate(
  createdAt?: { seconds: number; nanoseconds: number } | Date | string,
) {
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
    fetch(
      'https://asia-northeast1-my-homepage-bbc9d.cloudfunctions.net/incrementCounter',
      { method: 'POST' },
    )
      .then((res) => res.json())
      .then((data) => setCount(data.value ?? 1))
      .catch(async () => {
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
        limit(4),
      );
      const snap = await getDocs(q);
      setLatestArticles(
        snap.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Article, 'id'>),
          }))
          .filter((article) => !article.isDraft),
      );
    };
    fetchArticles();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur">
        {/* タイトル */}
        <h1
          className="text-4xl font-extrabold text-center tracking-tight drop-shadow-sm"
          style={{ color: 'var(--primary)' }}
        >
          ykz HomePage
        </h1>
        {/* プロフィール画像 */}
        <div className="profile-avatar">
          <Image
            src={`${basePath}/profile.jpg`}
            alt="image"
            width={112}
            height={112}
            className="object-cover object-center w-full h-full"
            priority
          />
        </div>
        {/* サブタイトル */}
        <p
          className="text-base text-center mb-2"
          style={{ color: 'var(--foreground)' }}
        >
          blog / portfolio
        </p>
        {/* 訪問数 */}
        <div
          className="text-sm rounded-full px-4 py-1 shadow"
          style={{ background: 'var(--card-bg)', color: 'var(--primary)' }}
        >
          thanks for comming:{' '}
          <span className="font-bold">{count !== null ? count : '-'}</span>
        </div>
        {/* SNSアイコン */}
        <div className="flex items-center gap-4 mt-2">
          <a
            href="https://twitter.com/ykz_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            <FaXTwitter className="w-6 h-6" />
            <span className="hidden sm:inline"> (Twitter)</span>
          </a>
        </div>
        {/* ページ内リンク */}
        <nav className="flex flex-col items-center gap-2 w-full mt-2">
          <Link href="/articles" className="w-full">
            <span className="page-link">Articles</span>
          </Link>
          <Link href="/contact" className="w-full">
            <span className="page-link">Contact</span>
          </Link>
        </nav>
        {/* 新着記事 */}
        <section className="w-full mt-8">
          <h2
            className="text-2xl font-bold mb-4 text-center"
            style={{ color: 'var(--primary)' }}
          >
            New Articles
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {latestArticles.length === 0 && (
              <li className="text-gray-400 dark:text-gray-500">no articles</li>
            )}
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="article-card flex flex-col items-center max-w-xs mx-auto w-full cursor-pointer transition"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {article.imageUrl && (
                  <div className="w-full flex justify-center mb-2">
                    <Image
                      src={article.imageUrl}
                      alt="image"
                      width={200}
                      height={120}
                      className="rounded object-cover"
                      style={{ maxWidth: 200, height: 'auto' }}
                    />
                  </div>
                )}
                <h3
                  className="text-lg font-semibold hover:underline text-center mb-2 break-words"
                  style={{ color: 'var(--primary)' }}
                >
                  {article.title}
                </h3>
                <div
                  className="text-xs text-center w-full"
                  style={{ color: 'var(--secondary)' }}
                >
                  posted on: {formatDate(article.createdAt)}
                </div>
              </Link>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
