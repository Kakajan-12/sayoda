import { Link } from "@/i18n/navigation";
import { PoppinFont } from "@/components/ui/Fonts";

/**
 * Постраничная навигация ссылками.
 *
 * Именно ссылками, а не кнопками с обработчиком: каждая страница получает
 * собственный адрес, поэтому её видит поисковик, её можно отправить в
 * переписке и открыть в новой вкладке. Прежняя разбивка жила в состоянии
 * React — страница 3 ничем не отличалась от страницы 1, и половина
 * каталога была недостижима для краулера.
 *
 * Прочие параметры отбора переносятся в ссылку как есть, иначе переход на
 * вторую страницу сбрасывал бы выбранный фильтр.
 */

/** Сколько номеров показывать вокруг текущего, не считая краёв. */
const AROUND = 1;

function buildHref(
    basePath: string,
    params: Record<string, string | undefined>,
    page: number,
) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value) search.set(key, value);
    }
    // Первую страницу не помечаем: /tours и /tours?page=1 — один и тот же
    // список, и два адреса на одно содержимое поисковику только вредят.
    if (page > 1) search.set("page", String(page));
    else search.delete("page");

    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
}

/**
 * Номера страниц с многоточиями: 1 … 4 5 6 … 12
 *
 * Вынесено с экспортом, чтобы проверять отдельно: пока записей меньше
 * страницы, ссылки на сайте не появляются, и ошибка здесь всплыла бы
 * только когда туров станет много.
 */
export function pageNumbers(page: number, pageCount: number): (number | "…")[] {
    const keep = new Set<number>([1, pageCount]);
    for (let i = page - AROUND; i <= page + AROUND; i += 1) {
        if (i >= 1 && i <= pageCount) keep.add(i);
    }

    const sorted = [...keep].sort((a, b) => a - b);
    const out: (number | "…")[] = [];
    let previous = 0;
    for (const n of sorted) {
        // Разрыв ровно в одну страницу заполняем номером, а не многоточием:
        // «1 … 3» занимает столько же места, сколько «1 2 3», но хуже.
        if (previous && n - previous === 2) out.push(previous + 1);
        else if (previous && n - previous > 2) out.push("…");
        out.push(n);
        previous = n;
    }
    return out;
}

export default function PageLinks({
    page,
    pageCount,
    basePath,
    params = {},
    label,
}: {
    page: number;
    pageCount: number;
    basePath: string;
    params?: Record<string, string | undefined>;
    /** Подпись для экранного диктора. */
    label: string;
}) {
    if (pageCount <= 1) return null;

    const item =
        "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm transition-colors";

    return (
        <nav
            aria-label={label}
            className={`${PoppinFont.className} my-10 flex flex-wrap items-center justify-center gap-2`}
        >
            {page > 1 && (
                <Link
                    href={buildHref(basePath, params, page - 1)}
                    rel="prev"
                    aria-label={`${label}: ${page - 1}`}
                    className={`${item} border-sand text-ink hover:border-tileLight`}
                >
                    ‹
                </Link>
            )}

            {pageNumbers(page, pageCount).map((n, i) =>
                n === "…" ? (
                    <span
                        key={`gap-${i}`}
                        aria-hidden
                        className="px-1 text-sm text-inkMuted"
                    >
                        …
                    </span>
                ) : (
                    <Link
                        key={n}
                        href={buildHref(basePath, params, n)}
                        aria-current={n === page ? "page" : undefined}
                        className={`${item} ${
                            n === page
                                ? "border-tile bg-tile text-white"
                                : "border-sand text-ink hover:border-tileLight"
                        }`}
                    >
                        {n}
                    </Link>
                ),
            )}

            {page < pageCount && (
                <Link
                    href={buildHref(basePath, params, page + 1)}
                    rel="next"
                    aria-label={`${label}: ${page + 1}`}
                    className={`${item} border-sand text-ink hover:border-tileLight`}
                >
                    ›
                </Link>
            )}
        </nav>
    );
}
