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
  body: string;
  createdAt?: { toDate?: () => Date } | string;
  isDraft?: boolean;
  imageUrl?: string;
  tags?: string[];
};

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      {isAdmin && (
        <div className="flex justify-end mb-8">
          <Link href="/articles/create">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors duration-150"
            >
              ＋ 新規作成
            </button>
          </Link>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">記事一覧</h2>
      </div>
      <ul className="space-y-8">
        {visibleArticles.map(article => (
          <li
            key={article.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-150 p-5 flex flex-col sm:flex-row gap-6"
          >
            {article.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={article.imageUrl}
                  alt="記事画像"
                  width={120}
                  height={80}
                  className="rounded object-cover"
                  style={{ maxWidth: 120, height: "auto" }}
                />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <Link href={`/articles/${article.id}`}>
                <div className="border border-blue-200 bg-white/80 backdrop-blur-sm rounded px-0 py-2 mb-2 shadow-sm w-full">
                  <h3 className="text-lg font-semibold text-blue-700 hover:underline flex items-center px-3">
                    {article.title}
                    {isAdmin && article.isDraft && (
                      <span className="ml-2 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50">
                        下書き
                      </span>
                    )}
                  </h3>
                </div>
              </Link>
              <div className="border border-gray-200 bg-white/60 backdrop-blur-sm rounded px-0 py-2 mb-2 shadow-sm text-gray-700 line-clamp-2 w-full">
                <div className="px-3">
                  {article.body.slice(0, 80)}...
                </div>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  タグ: {article.tags.join(', ')}
                </div>
              )}
              {article.createdAt && (
                <div className="text-xs text-gray-400 mb-1">
                  投稿日: {typeof article.createdAt === 'object' && article.createdAt.toDate
                    ? article.createdAt.toDate().toLocaleString()
                    : String(article.createdAt)}
                </div>
              )}
              {isAdmin && (
                <div className="mt-1">
                  <Link href={`/articles/create?id=${article.id}`}>
                    <button className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-3 py-1 transition-colors duration-150">
                      編集
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}