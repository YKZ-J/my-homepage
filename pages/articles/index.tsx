import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
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
        snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Article, 'id'>)
        }))
      );
    };
    fetchArticles();
  }, []);

  // 下書き記事はadminのみ表示
  const visibleArticles = isAdmin
    ? articles
    : articles.filter(article => !article.isDraft);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div
        className="w-full max-w-4xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw' }}
      >
        {isAdmin && (
          <div className="flex justify-start mb-8 w-full">
            <Link href="/articles/create">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors duration-150"
              >
                ＋ 新規作成
              </button>
            </Link>
          </div>
        )}
        <h2
          className="text-4xl font-extrabold text-blue-800 bg-blue-50 dark:bg-blue-900 rounded-xl px-8 py-8 text-center w-full max-w-md mx-auto shadow-sm tracking-wide"
          style={{
            letterSpacing: '0.05em',
            fontFamily: `'Inter', 'Noto Sans JP', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'`,
          }}
        >
          articles
        </h2>
<ul className="flex flex-col gap-10 w-full mt-8">
          {visibleArticles.map((article) => (
            <li
              key={article.id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow hover:shadow-lg transition-shadow duration-150 p-6 flex flex-col items-center w-full max-w-md mx-auto cursor-pointer"
            >
              <Link href={`/articles/${article.id}`} className="w-full flex flex-col items-center">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-200 hover:underline text-center w-full break-words">
                  {article.title}
                  {isAdmin && article.isDraft && (
                    <span className="ml-2 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50">
                      下書き
                    </span>
                  )}
                </h3>
                {article.imageUrl && (
                  <div className="my-4 w-full flex justify-center">
                    <Image
                      src={article.imageUrl}
                      alt="記事画像"
                      width={240}
                      height={160}
                      className="rounded object-cover"
                      style={{ maxWidth: 240, height: "auto" }}
                    />
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-300 mt-2 text-center w-full">
                  投稿日: {formatDate(article.createdAt)}
                </div>
              </Link>
              {isAdmin && (
                <div className="mt-3 w-full flex justify-end">
                  <Link href={`/articles/create?id=${article.id}`} onClick={e => e.stopPropagation()}>
                    <button className="text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-100 rounded px-3 py-1 transition-colors duration-150">
                      編集
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