import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to My Homepage</h1>
      <p className="mt-4 text-gray-700">I am YKZ</p>
      <div
        className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
        style={{ fontFamily: 'var(--font-geist-sans)' }}
      >
            <section className="flex flex-col items-center justify-center gap-8 row-start-2 w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
              <Image
                src="/profile.jpg"
                alt="プロフィール画像"
                width={160}
                height={160}
                className="rounded-full object-cover border-4 border-blue-200 shadow-lg w-32 h-32 sm:w-40 sm:h-40"
              />
              <h2 className="text-2xl font-semibold text-blue-700 text-center">YKZ</h2>
              <p className="text-gray-700 text-center">Welcome to my homepage!</p>
              <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
                <Link
                  className="rounded-full border border-solid border-blue-500 transition-colors flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] text-blue-600"
                  href="/about"
                >
                  Aboutページへ
                </Link>
              </div>
            </section>
            
          </div>
    </main>
  )
}