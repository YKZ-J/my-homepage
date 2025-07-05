import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { app, auth } from '../../src/firebase';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserRole } from '../../src/hooks/useUserRole';
import Image from 'next/image';

type Article = {
  id: string;
  title: string;
  imageUrl?: string;
  isDraft?: boolean;
  createdAt?: { seconds: number; nanoseconds: number } | Date | string;
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

// デフォルト画像のパス
const basePath = process.env.NODE_ENV === 'production' ? '/my-homepage' : '';
const DEFAULT_IMAGE_URL = `${basePath}/articledefault.png`;

export default function ArticlesIndexPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user] = useAuthState(auth);
  const role = useUserRole(user ?? null);
  const isAdmin = role === 'admin';

  useEffect(() => {
    const fetchArticles = async () => {
      const db = getFirestore(app);
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setArticles(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Article, 'id'>),
        })),
      );
    };
    fetchArticles();
  }, []);

  // 下書き記事はadminのみ表示
  const visibleArticles = isAdmin
    ? articles
    : articles.filter((article) => !article.isDraft);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur">
        {isAdmin && (
          <div className="flex justify-start mb-8 w-full">
            <Link href="/articles/create">
              <button className="button button-blue" type="button">
                ＋ create article
              </button>
            </Link>
          </div>
        )}
        <h2
          className="text-4xl font-extrabold rounded-xl px-8 py-8 text-center w-full max-w-md mx-auto shadow-sm tracking-wide"
          style={{
            letterSpacing: '0.05em',
            fontFamily: `'Inter', 'Noto Sans JP', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'`,
            background: 'var(--card-bg)',
            color: 'var(--primary)',
          }}
        >
          Articles
        </h2>
        <ul className="flex flex-col gap-10 w-full mt-8">
          {visibleArticles.map((article) => (
            <li
              key={article.id}
              className="article-card w-full max-w-md mx-auto cursor-pointer flex flex-col items-center"
            >
              <Link
                href={`/articles/${article.id}`}
                className="w-full flex flex-col items-center"
                style={{ color: 'var(--primary)', textDecoration: 'none' }}
              >
                <h3
                  className="text-lg font-semibold hover:underline text-center w-full break-words"
                  style={{ color: 'var(--primary)' }}
                >
                  {article.title}
                  {isAdmin && article.isDraft && (
                    <span className="ml-2 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50">
                      draft
                    </span>
                  )}
                </h3>
                <div className="my-4 w-full flex justify-center">
                  <Image
                    src={article.imageUrl || DEFAULT_IMAGE_URL}
                    alt="image"
                    width={240}
                    height={160}
                    className="rounded object-cover"
                    style={{ maxWidth: 240, height: 'auto' }}
                  />
                </div>
                <div
                  className="text-xs mt-2 text-center w-full"
                  style={{ color: 'var(--secondary)' }}
                >
                  posted on: {formatDate(article.createdAt)}
                </div>
              </Link>
              {isAdmin && (
                <div className="mt-3 w-full flex justify-end">
                  <Link
                    href={`/articles/create?id=${article.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="button button-blue text-xs px-3 py-1"
                      type="button"
                    >
                      edit
                    </button>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
