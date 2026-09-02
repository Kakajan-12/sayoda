import JsonLd from "./JsonLd";
import { type Blog, localizedField, mediaUrl } from "@/lib/api/catalog";
import { SITE_NAME, absoluteUrl, localizedUrl } from "@/lib/site";
import { excerpt, plainText } from "@/lib/utils";

/** Article для статьи блога. Автор — компания: персональных авторов в CMS нет. */
export default function ArticleJsonLd({
  blog,
  locale,
}: {
  blog: Blog;
  locale: string;
}) {
  const url = localizedUrl(locale, `blog/${blog.id}`);
  const image = mediaUrl(blog.image);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: plainText(localizedField(blog, "title", locale)),
    description: excerpt(localizedField(blog, "text", locale), 300),
    inLanguage: locale,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${absoluteUrl("/")}#organization`,
      name: SITE_NAME,
    },
  };

  if (image) data.image = image;
  if (blog.date) {
    data.datePublished = new Date(blog.date).toISOString();
    data.dateModified = new Date(blog.date).toISOString();
  }

  return <JsonLd data={data} />;
}
