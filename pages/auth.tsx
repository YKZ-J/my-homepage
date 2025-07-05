import AuthButton from '../src/components/AuthButton';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div
        className="container flex flex-col items-center justify-center rounded-3xl shadow-2xl p-8 gap-6 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw', maxWidth: 480, background: 'var(--card-bg)' }}
      >
        <h1
          className="text-3xl font-extrabold mb-6 text-center tracking-tight"
          style={{ color: 'var(--primary)' }}
        >
          Authentication
        </h1>
        <div className="w-full flex flex-col items-center">
          <AuthButton />
        </div>
      </div>
    </main>
  );
}