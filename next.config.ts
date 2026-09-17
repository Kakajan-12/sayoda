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

  /**
   * Куда складывать сборку. Обычно .next, но переменная позволяет увести её
   * в сторону.
   *
   * Это нужно не в работе, а при проверках. `next build` очищает папку
   * сборки целиком, а `next dev` держит своё хозяйство в .next/dev — в той
   * же папке. Сборка, запущенная рядом с работающим dev-сервером, сносит
   * каталог у него из-под ног, и dev падает на ровном месте, без внятной
   * ошибки. Разойтись по разным папкам дешевле, чем каждый раз гасить dev.
   *
   * На сервере и на Vercel переменная не задана, поэтому там всё
   * по-прежнему в .next.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  /**
   * Визовый раздел переезжал дважды, и оба следа надо увести на живой адрес.
   *
   * Сначала он был четырьмя страницами и стал одной с якорями. Потом виза
   * Туркменистана ушла с четвёртого уровня вложенности на верхний:
   * /en/turkmenistan-visa. Это посадочная страница по самому частотному
   * запросу, и вдобавок на неё вели два разных адреса — из меню и из
   * футера, — которые делили вес между собой.
   *
   * Переадресация постоянная: адреса поменялись насовсем, и поисковику надо
   * передать вес на новый. Якорь браузер подставляет сам — до сервера он
   * не доходит, но в заголовке Location работает.
   *
   * Порядок важен. Правила проверяются сверху вниз, поэтому частные случаи
   * Туркменистана стоят раньше общего правила по :country — иначе оно
   * перехватило бы их и оставило человека на старом адресе.
   */
  async redirects() {
    const sections = [
      "embassies-in-turkmenistan",
      "embassies-abroad",
      "crossing-borders",
    ];

    return [
      ...sections.map((section) => ({
        source: `/:locale/destinations/turkmenistan/visa/${section}`,
        destination: `/:locale/turkmenistan-visa#${section}`,
        permanent: true,
      })),
      {
        source: "/:locale/destinations/turkmenistan/visa",
        destination: "/:locale/turkmenistan-visa",
        permanent: true,
      },
      // Вторая ссылка из футера: подстраницы нумеровались, и /visa/1 была
      // тем же разделом под другим адресом.
      {
        source: "/:locale/destinations/turkmenistan/visa/:page(\\d+)",
        destination: "/:locale/turkmenistan-visa",
        permanent: true,
      },
      ...sections.map((section) => ({
        source: `/:locale/destinations/:country/visa/${section}`,
        destination: `/:locale/destinations/:country/visa#${section}`,
        permanent: true,
      })),
    ];
  },

  images: {
    // `unoptimized: true` отключало оптимизацию целиком: картинки отдавались
    // в исходном весе (в public лежит PNG на 11.5 МБ), без WebP/AVIF и без
    // подгонки под размер экрана. Для мобильной аудитории в поездке это
    // главный источник плохого LCP.
    formats: ["image/avif", "image/webp"],

    /*
     * Разрешённые значения quality.
     *
     * В Next 16 список обязателен и по умолчанию содержит одно значение —
     * 75. Всё остальное молча приводится к ближайшему разрешённому: атрибут
     * quality={100} без этой записи просто ничего бы не изменил, и найти
     * причину можно было бы только по предупреждению в логе сборки.
     *
     * Сайт снимает все картинки на 100 — это решение заказчика, значение
     * задаётся константой IMAGE_QUALITY в ImageWithSkeleton. Замер на кадре
     * шириной 1920: 75 даёт 249 КБ, 90 — 434 КБ, 100 — 1,18 МБ.
     *
     * 75 и 90 оставлены в списке намеренно: если понадобится отступить от
     * сотни на отдельной картинке или вернуть прежнее значение целиком,
     * это будет правка одной константы, а не двух файлов сразу.
     */
    qualities: [75, 90, 100],
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
