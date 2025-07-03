import { Html, Head, Main, NextScript } from 'next/document';

const basePath = process.env.NODE_ENV === 'production' ? '/my-homepage' : '';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="stylesheet" href={`${basePath}/styles.css`} />
        <link rel="preload" href={`${basePath}/styles.css`} as="style" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}