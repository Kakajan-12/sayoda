import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Заголовки безопасности.
 *
 * Сайт не отдавал ни одного: страницу можно было вложить в чужой iframe
 * и подсунуть посетителю поверх неё свои элементы.
 *
 * CSP намеренно допускает 'unsafe-inline' для скриптов: Next вставляет
 * инлайновые скрипты гидратации, а раздача им nonce требует перевода всех
 * страниц в динамический рендер — то есть отказа от статической выдачи,
 * ради которой всё и делалось. Даже в таком виде политика запрещает грузить
 * скрипты с посторонних доменов, а это основной путь для сохранённого XSS.
 * Основная защита от него — санитизация на бэкенде.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Сайту не нужны ни камера, ни микрофон, ни геолокация, ни оплата
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // tawk.to — чат, googletagmanager и google-analytics — счётчик
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.tawk.to https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://*.tawk.to",
      "font-src 'self' data: https://*.tawk.to",
      "img-src 'self' data: blob: https://api.sayodatravel.com https://*.tawk.to https://www.googletagmanager.com https://www.google-analytics.com",
      "connect-src 'self' https://api.sayodatravel.com https://*.tawk.to wss://*.tawk.to https://www.google-analytics.com https://region1.google-analytics.com",
      // карта на странице контактов и окно чата
      "frame-src https://www.google.com https://*.tawk.to",
      "media-src 'self' https://*.tawk.to",
      // формы уходят только на свой домен и на API
      "form-action 'self' https://api.sayodatravel.com",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      // upgrade-insecure-requests не добавляем как избыточный: Vercel отдаёт
      // сайт только по HTTPS и ставит HSTS, а все внешние адреса в политике
      // выше и так https. Директива не запретила бы ничего нового.
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Заголовок сообщал версию фреймворка и ничего не давал взамен
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

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
