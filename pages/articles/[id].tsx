import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../src/firebase';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserRole } from '../../src/hooks/useUserRole';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Article = {
  id: string;
  title: string;
  body: string;
  createdAt?: { toDate?: () => Date } | string;
  authorId?: string;
  tags?: string[];
  isDraft?: boolean;
  imageUrl?: string;
};

function formatDate(createdAt?: { toDate?: () => Date } | string) {
  if (!createdAt) return '';
  if (typeof createdAt === 'object' && createdAt.toDate) {
    return createdAt.toDate().toLocaleString();
  }
  return String(createdAt);
}

// デフォルト画像のパス
const basePath = process.env.NODE_ENV === 'production' ? '/my-homepage' : '';
const DEFAULT_IMAGE_URL = `${basePath}/articledefault.png`;

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);
  const [user] = useAuthState(auth);
  const role = useUserRole(user ?? null);
  const isAdmin = role === 'admin';

  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    const db = getFirestore(app);
    getDoc(doc(db, 'articles', id)).then((snap) => {
      if (snap.exists()) {
        setArticle({ id: snap.id, ...(snap.data() as Omit<Article, 'id'>) });
      }
    });
  }, [id]);

  // 下書き記事はadminのみ表示
  if (!article)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (article.isDraft && !isAdmin)
    return (
      <div className="text-center py-10 text-red-500">
        This page isn’t available
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-6 mt-6 text-center flex items-center justify-center w-full"
          style={{
            paddingTop: '1.5rem',
            paddingBottom: '1.5rem',
            color: 'var(--primary)',
          }}
        >
          {article.title}
          {isAdmin && article.isDraft && (
            <span className="ml-3 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50 font-semibold">
              draft
            </span>
          )}
        </h2>
        <div className="w-full flex justify-center mb-4">
          <Image
            src={article.imageUrl || DEFAULT_IMAGE_URL}
            alt="image"
            width={400}
            height={240}
            className="rounded-lg object-cover max-h-60 w-full sm:w-[400px]"
            style={{ maxWidth: 400, height: 'auto' }}
          />
        </div>
        {article.createdAt && (
          <div
            className="text-xs mb-6 text-center w-full"
            style={{ color: 'var(--secondary)' }}
          >
            posted on: {formatDate(article.createdAt)}
          </div>
        )}
        <div
          className="markdown-body text-base leading-relaxed mb-4 break-words w-full px-4"
          style={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            textAlign: 'left',
            color: 'var(--foreground)',
          }}
        >
          <ReactMarkdown>{article.body || ''}</ReactMarkdown>
        </div>
        {article.tags && article.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 justify-center w-full">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {isAdmin && (
          <div className="flex justify-end w-full">
            <Link href={`/articles/create?id=${article.id}`}>
              <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100 rounded px-4 py-2 text-sm font-semibold transition-colors duration-150">
                edit
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
