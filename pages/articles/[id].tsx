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
    getDoc(doc(db, 'articles', id)).then(snap => {
      if (snap.exists()) {
        setArticle({ id: snap.id, ...(snap.data() as Omit<Article, 'id'>) });
      }
    });
  }, [id]);

  // 下書き記事はadminのみ表示
  if (!article) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (article.isDraft && !isAdmin) return <div className="text-center py-10 text-red-500">このページは表示できません</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6 mb-10 flex flex-col items-center">
      <h2
        className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 mt-6 text-center flex items-center justify-center w-full"
        style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
      >
        {article.title}
        {isAdmin && article.isDraft && (
          <span className="ml-3 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50 font-semibold">
            下書き
          </span>
        )}
      </h2>
      {article.imageUrl && (
        <div className="w-full flex justify-center mb-4">
          <Image
            src={article.imageUrl}
            alt="記事画像"
            width={400}
            height={240}
            className="rounded-lg object-cover max-h-60 w-full sm:w-[400px]"
            style={{ maxWidth: 400, height: "auto" }}
          />
        </div>
      )}
      {article.createdAt && (
        <div className="text-xs text-gray-400 mb-6 text-center w-full">
          投稿日: {formatDate(article.createdAt)}
        </div>
      )}
      <div
        className="text-gray-800 text-base leading-relaxed mb-4 break-words w-full px-4"
        style={{ wordBreak: 'break-word', overflowWrap: 'break-word', textAlign: 'left' }}
      >
        <ReactMarkdown>
          {article.body || ''}
        </ReactMarkdown>
      </div>
      {article.tags && article.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 justify-center w-full">
          {article.tags.map(tag => (
            <span key={tag} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
      {isAdmin && (
        <div className="flex justify-end w-full">
          <Link href={`/articles/create?id=${article.id}`}>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-4 py-2 text-sm font-semibold transition-colors duration-150">
              編集
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}