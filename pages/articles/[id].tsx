import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth } from '../../src/firebase';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useUserRole } from '../../src/hooks/useUserRole';
import Link from 'next/link';

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
    <div className="max-w-2xl mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-6 mb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center">
        {article.title}
        {isAdmin && article.isDraft && (
          <span className="ml-3 text-xs text-orange-500 border border-orange-400 rounded px-2 py-0.5 bg-orange-50 font-semibold">
            下書き
          </span>
        )}
      </h2>
      {article.imageUrl && (
        <div className="w-full flex justify-center mb-6">
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
      <div className="text-gray-800 text-base leading-relaxed whitespace-pre-line mb-4 break-words">
        {article.body}
      </div>
      {article.tags && article.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {article.tags.map(tag => (
            <span key={tag} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
      {article.createdAt && (
        <div className="text-xs text-gray-400 mb-4">
          投稿日: {typeof article.createdAt === 'object' && article.createdAt.toDate
            ? article.createdAt.toDate().toLocaleString()
            : String(article.createdAt)}
        </div>
      )}
      {isAdmin && (
        <div className="flex justify-end">
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