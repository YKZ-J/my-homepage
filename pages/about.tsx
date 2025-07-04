export default function About() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div
        className="container w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center gap-6 border border-blue-100 dark:border-gray-700 backdrop-blur"
        style={{ width: '80vw' }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 dark:text-blue-200 mb-4 text-center tracking-tight">
          About Me
        </h1>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-200 text-center leading-relaxed">
          Hello! I&apos;m a software engineer passionate about frontend development.<br />
          I love building modern, user-friendly web applications and exploring new technologies.<br />
          <span className="inline-block mt-2 text-blue-700 dark:text-blue-300 font-semibold">Let&apos;s create something amazing together!</span>
        </p>
      </div>
    </main>
  );
}