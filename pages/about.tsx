export default function About() {
  return (
  <main className="min-h-screen flex items-center justify-center">
    <div
      className="container flex flex-col items-center gap-8 border border-blue-100 dark:border-gray-700 backdrop-blur"
    >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-4 text-center tracking-tight"
          style={{ color: 'var(--primary)' }}
        >
          About Me
        </h1>
        <p
          className="text-base md:text-lg text-center leading-relaxed"
          style={{ color: 'var(--foreground)' }}
        >
          Hello! I&apos;m a software engineer passionate about frontend development.<br />
          I love building modern, user-friendly web applications and exploring new technologies.<br />
          <span
            className="inline-block mt-2 font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            Let&apos;s create something amazing together!
          </span>
        </p>
      </div>
    </main>
  );
}