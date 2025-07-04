import React from "react";
import { FaXTwitter } from 'react-icons/fa6';

const X_LINK = "https://twitter.com/ykz_tech";

const Contact: React.FC = () => (
  <main className="min-h-screen flex items-center justify-center">
    <div
      className="container flex flex-col items-center justify-center rounded-3xl shadow-2xl p-8 gap-6 border border-blue-100 dark:border-gray-700 backdrop-blur"
      style={{ width: '80vw', maxWidth: 480, background: 'var(--card-bg)' }}
    >
      <h1 className="text-3xl font-extrabold mb-4 text-center tracking-tight" style={{ color: 'var(--primary)' }}>
        Contact
      </h1>
      <p className="text-base text-center mb-4" style={{ color: 'var(--foreground)' }}>
        ご連絡は
        <a
          href={X_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold transition-colors ml-1"
          style={{ color: 'var(--primary)' }}
        >
          <FaXTwitter className="w-6 h-6" />
          <span className="hidden sm:inline">(Twitter)</span>
        </a>
        までお願いします。
      </p>
    </div>
  </main>
);

export default Contact;