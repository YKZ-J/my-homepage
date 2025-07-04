import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../src/firebase';
import { useUserRole } from '../../src/hooks/useUserRole';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../../src/firebase';
import { storage } from "../../src/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from 'next/image';

type ArticleDoc = {
  title: string;
  body: string;
  createdAt?: ReturnType<typeof serverTimestamp>;
  updatedAt?: ReturnType<typeof serverTimestamp>;
  authorId?: string;
  tags?: string[];
  isDraft?: boolean;
  imageUrl?: string;
};

export default function ArticlesCreatePage() {
  const [user, loading] = useAuthState(auth);
  const role = useUserRole(user ?? null);
  const isAdmin = role === 'admin';
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isDraft, setIsDraft] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState(false);
  const DEFAULT_IMAGE_URL = '/articledefalt.png'; 

  const handleCancelImage = () => {
    setImageFile(null);
    setImageUrl(undefined);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getFirestore(app);
      let uploadedImageUrl = imageUrl;

      // 画像が未選択の場合はデフォルト画像を使用
      if (!imageFile && !uploadedImageUrl) {
        uploadedImageUrl = DEFAULT_IMAGE_URL;
      }

      if (imageFile) {
        const storageRef = ref(storage, `articles/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      if (id) {
        const updateData: Partial<ArticleDoc> = {
          title,
          body,
          updatedAt: serverTimestamp(),
          isDraft,
        };
        if (uploadedImageUrl !== undefined) {
          updateData.imageUrl = uploadedImageUrl;
        }
        await updateDoc(doc(db, 'articles', id as string), updateData);
      } else {
        const newDoc: ArticleDoc = {
          title,
          body,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          authorId: user?.uid,
          tags: [],
          isDraft,
        };
        if (uploadedImageUrl !== undefined) {
          newDoc.imageUrl = uploadedImageUrl;
        }
        await addDoc(collection(db, 'articles'), newDoc);
      }
      setIsCompleted(true);
    } catch (err) {
      alert('保存時にエラーが発生しました: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  useEffect(() => {
    if (id) {
      const db = getFirestore(app);
      getDoc(doc(db, 'articles', id as string)).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || '');
          setBody(data.body || '');
          setIsDraft(data.isDraft || false);
          setImageUrl(data.imageUrl || undefined);
        }
      });
    }
  }, [id]);

  if (loading || role === null) return <div>Loading...</div>;
  if (!isAdmin) return <div className="text-center text-red-500 py-10">権限がありません</div>;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className="container w-full max-w-2xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw', background: 'var(--card-bg)' }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ color: 'var(--primary)' }}>
          {id ? 'edit' : 'create'}（admin）
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="title"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>body</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="body"
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-gray-100 transition resize-y"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDraft}
              onChange={e => setIsDraft(e.target.checked)}
              id="isDraft"
              className="accent-blue-600"
            />
            <label htmlFor="isDraft" className="text-sm select-none" style={{ color: 'var(--foreground)' }}>
              draft
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>image upload</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="block" />
            {imageUrl && (
              <div className="mt-3 flex flex-col items-center gap-2">
                <Image
                  src={imageUrl}
                  alt="記事画像"
                  width={320}
                  height={180}
                  className="rounded object-cover border"
                  style={{ maxWidth: 320, height: "auto" }}
                />
                <button
                  type="button"
                  onClick={handleCancelImage}
                  className="mt-1 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100 rounded transition"
                  disabled={isCompleted}
                >
                  cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="button button-blue font-semibold px-6 py-2 rounded shadow transition-colors duration-150"
              disabled={isCompleted}
            >
              {id ? 'update' : 'create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setBody('');
                setIsDraft(false);
                setImageFile(null);
                setImageUrl(undefined);
              }}
              className="button button-gray font-semibold px-6 py-2 rounded shadow transition-colors duration-150"
              disabled={isCompleted}
            >
              reset
            </button>
          </div>
        </form>
        {isCompleted && (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              className="button button-blue font-semibold px-8 py-3 rounded shadow transition-colors duration-150"
              onClick={() => router.push('/articles')}
            >
              complete
            </button>
          </div>
        )}
      </div>
    </main>
  );
}