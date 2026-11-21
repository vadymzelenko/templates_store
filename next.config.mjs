/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем HMR для локального IP (чтобы тестить с телефона или другого ПК)
  allowedDevOrigins: ['192.168.0.30'],

  // Статические сайты из sites/* лежат в public/projects/<slug>/ (npm run sites:build).
  // Next не отдаёт index.html для папок сам, поэтому адрес страницы переписываем на её index.html.
  async rewrites() {
    return {
      fallback: [
        { source: '/projects/:site', destination: '/projects/:site/index.html' },
        { source: '/projects/:site/:path*', destination: '/projects/:site/:path*/index.html' },
      ],
    };
  },
};

export default nextConfig;
