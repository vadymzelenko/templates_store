// Static export for the template store: `STATIC_EXPORT=1 BASE_PATH=/projects/<slug> npm run build`.
const basePath = process.env.BASE_PATH || '';
const staticExport = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_DEMO: staticExport ? '1' : '' },
  ...(staticExport && { output: 'export', trailingSlash: true }),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
