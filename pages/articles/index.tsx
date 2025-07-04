import React from 'react';
import { useEffect, useState } from 'react';
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
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col items-center">
      {isAdmin && (
        <div className="flex justify-end mb-8 w-full">
          <Link href="/articles/create">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-5 py-2 rounded shadow transition-colors duration-150"
            >
              ＋ 新規作成
            </button>
          </Link>
        </div>
      )}
      <div style={{ height: 48 }} />
      <h2
        className="text-3xl font-extrabold text-blue-800 bg-blue-50 rounded-xl px-8 py-8 text-center w-full shadow-sm tracking-wide"
        style={{
          letterSpacing: '0.05em',
          fontFamily: `'Inter', 'Noto Sans JP', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'`,
        }}
      >
        記事一覧
      </h2>
      <div style={{ height: 48 }} />
      <ul className="flex flex-col items-center w-full">
        {visibleArticles.map((article, idx) => (
          <React.Fragment key={article.id}>
            {idx !== 0 && <div style={{ height: 48 }} />}
            <li
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-150 p-5 flex flex-col items-center w-full max-w-md mx-auto"
            >
              <Link href={`/articles/${article.id}`} className="w-full">
                <h3 className="text-lg font-semibold text-blue-700 hover:underline text-center w-full">
                  {article.title}
                  {isAdmin && article.isDraft && (
                    <span className="ml-2 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50">
                      下書き
                    </span>
                  )}
                </h3>
              </Link>
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
              <div className="text-xs text-gray-500 mt-2 text-center w-full">
                投稿日: {formatDate(article.createdAt)}
              </div>
              {isAdmin && (
                <div className="mt-3">
                  <Link href={`/articles/create?id=${article.id}`}>
                    <button className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 transition-colors duration-150">
                      編集
                    </button>
                  </Link>
                </div>
              )}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}