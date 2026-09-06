import React from "react";

/**
 * Рендерит блок schema.org в виде <script type="application/ld+json">.
 *
 * `JSON.stringify` уже экранирует кавычки, но не `<`, поэтому строка вида
 * "</script>" внутри данных из CMS порвала бы разметку — закрываем её отдельно.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
