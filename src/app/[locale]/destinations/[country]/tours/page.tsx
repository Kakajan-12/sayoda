import { notFound } from "next/navigation";
import { destField, getDestinationBySlug } from "@/lib/api/destinations";
import { ComfortaFont } from "@/components/ui/Fonts";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  PER_PAGE,
  getTourCategories,
  getTourTypes,
  getToursPage,
} from "@/lib/api/catalog";
import TourCards from "@/components/home/TourCards";
import ToursFilters from "@/components/tours/ToursFilters";
import PageLinks from "@/components/ui/PageLinks";
import { asIds, asPage, one, type Search } from "@/lib/searchParams";

export const revalidate = 300;

/*
 * Страница читает параметры отбора из адреса и поэтому собирается на запрос,
 * а не заранее. Список стран для сегмента задаёт макет — на нём
 * generateStaticParams и остаётся; здесь он ничего бы не дал, потому что
 * вариантов столько же, сколько сочетаний фильтров.
 *
 * Для поисковика это ничего не меняет: карточки по-прежнему попадают в
 * серверную разметку. Динамический рендер и пустая страница — разные вещи.
 */

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; country: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);
  const destination = await getDestinationBySlug(country);
  if (!destination) notFound();
  const search = await searchParams;
  const t = await getTranslations("Destinations");

  /*
   * Страна берётся из адреса, а не из фильтра, и перебить её параметром
   * нельзя: ?destination=5 здесь просто не читается. Иначе вкладка
   * Туркменистана показывала бы узбекские туры под своей обложкой.
   */
  const values = {
    type: asIds(search.type),
    cat: asIds(search.cat),
    destination: [] as string[],
    popular: "",
    q: one(search.q).slice(0, 100),
  };
  const page = asPage(search.page);

  /*
   * Отбор и разбивка на страницы — на сервере. Раньше сюда приезжал весь
   * каталог страны разом: при десятке туров незаметно, а их станет больше,
   * и сотня карточек в одном ответе бьёт и по трафику, и по разметке.
   *
   * Справочники тянем те же, что и общий каталог: типы и категории приходят
   * списком целиком, поэтому отдельного запроса «какие типы есть у этой
   * страны» нет. Тип, под который в стране туров нет, даст пустую выдачу —
   * это честно и понятно, но если такие пустые варианты начнут мешать,
   * нужен будет отбор справочников по стране на бэкенде.
   */
  const [{ items, total }, types, categories] = await Promise.all([
    getToursPage({
      page,
      perPage: PER_PAGE,
      destination: String(destination.id),
      type: values.type.join(","),
      cat: values.cat.join(","),
      q: values.q,
    }),
    getTourTypes(),
    getTourCategories(),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const filterLabels = await getTranslations({ locale, namespace: "Filter" });
  const common = await getTranslations({ locale, namespace: "Common" });
  const basePath = `/destinations/${country}/tours`;

  /*
   * Пустая выдача бывает двух разных видов, и путать их нельзя.
   *
   * Без фильтра пусто — значит по стране туров пока нет: «Туры по этому
   * направлению пока недоступны». С фильтром пусто — туры есть, просто не
   * под этот отбор: тогда та же фраза вводила бы в заблуждение, и человек
   * ушёл бы со страницы вместо того, чтобы снять лишнюю галочку.
   */
  const isFiltered = Boolean(
    values.type.length || values.cat.length || values.q,
  );

  return (
    <div className={ComfortaFont.className}>
      <h2 className="text-xl sm:text-2xl font-bold text-mainBlue break-words border-b-2 border-mainBlue pb-2 mb-6">
        {t("tabTours")} — {destField(destination, "name", locale)}
      </h2>

      <div className="max-w-4xl mx-auto">
        <ToursFilters
            values={values}
            types={types.map((item) => ({
              id: Number(item.id),
              label: String(item[`type_${locale}`] ?? item.type_en ?? ""),
            }))}
            categories={categories}
            basePath={basePath}
            inset
        />

      </div>

      {items.length > 0 ? (
        <TourCards tours={items} />
      ) : (
        <p className="text-center py-10 text-gray-500">
          {isFiltered ? common("noTours") : t("noTours")}
        </p>
      )}

      <PageLinks
        page={page}
        pageCount={pageCount}
        basePath={basePath}
        // Разбивка собирает адрес из тех же условий: без этого переход на
        // вторую страницу сбрасывал бы выбранный фильтр.
        params={{
          type: values.type.join(","),
          cat: values.cat.join(","),
          q: values.q,
        }}
        label={filterLabels("filter")}
      />
    </div>
  );
}
