import Image from 'next/image';
import { FaXTwitter } from 'react-icons/fa6'; // Xのアイコン

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-6">

        {/* タイトル */}
        <h1 className="text-2xl font-bold text-center">ykz HomePage</h1>

        {/* アイコンとロゴ */}
        <div className="flex items-center gap-4">
          <a
            href="https://twitter.com/ykz_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-black hover:text-blue-500"
          >
            <FaXTwitter className="w-6 h-6" />
            <span>（旧Twitter）</span>
          </a>
        </div>

        {/* プロフィール画像 */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          <Image
            src="/profile.jpg" // public/profile.jpg に画像を置いてください
            alt="プロフィール画像"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>

        {/* ページ内リンク */}
        <nav className="flex flex-col items-center gap-2">
          <a href="#about" className="text-blue-600 hover:underline block">About</a>
          <a href="#works" className="text-blue-600 hover:underline block">Works</a>
          <a href="#contact" className="text-blue-600 hover:underline block">Contact</a>
        </nav>
      </div>
    </main>
  );
}