import AuthButton from '../src/components/AuthButton';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div
        className="container flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 gap-6 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw', maxWidth: 480 }}
      >
        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 mb-6 text-center tracking-tight">
          認証ページ
        </h1>
        <div className="w-full flex flex-col items-center">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}