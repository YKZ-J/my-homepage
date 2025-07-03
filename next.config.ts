// next.config.ts

import type { NextConfig } from 'next'

const isGithubPages = process.env.GITHUB_PAGES === 'true'



const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isGithubPages ? '/my-homepage/' : '',
  basePath: isGithubPages ? '/my-homepage' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig