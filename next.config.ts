import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // `unoptimized: true` отключало оптимизацию целиком: картинки отдавались
    // в исходном весе (в public лежит PNG на 11.5 МБ), без WebP/AVIF и без
    // подгонки под размер экрана. Для мобильной аудитории в поездке это
    // главный источник плохого LCP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.sayodatravel.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.sayodatravel.com",
        pathname: "/app/uploads/**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
