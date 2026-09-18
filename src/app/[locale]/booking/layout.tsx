import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

/**
 * Макет заявки существует только ради метаданных.
 *
 * Сама страница — форма, то есть клиентский компонент, а generateMetadata
 * бывает только у серверных. Своих метаданных у неё поэтому не было вовсе,
 * и она наследовала заголовок главной: в выдаче «Tours to Turkmenistan —
 * Darvaza, Ashgabat & Ancient Merv» показывался дважды — для главной и для
 * формы. Для поиска это два одинаковых заголовка на разных адресах.
 *
 * Канонический адрес здесь тоже важен: на форму ведут ссылки с номером тура
 * (/booking?tour=…), и без него каждая такая ссылка выглядит отдельной
 * страницей.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "booking", "booking");
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
