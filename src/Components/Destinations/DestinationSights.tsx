"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BASE_API_URL } from "@/i18n/api";
import BlogCard, { Blog } from "@/Components/CardProps/BlogCard";

const stripHtml = (html: string) => (html || "").replace(/<[^>]+>/g, "");

type Props = {
  /** lowercased keywords identifying the country (names, slug, sight names) */
  keywords: string[];
  /** shown when no blogs match and there is nothing to fall back to */
  emptyLabel: string;
};

export default function DestinationSights({ keywords, emptyLabel }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load blogs", err));
  }, []);

  const filtered = useMemo(() => {
    if (!blogs.length) return [];
    // Blogs are not country-tagged in the API, so we match strictly on the
    // country name. Destinations without their own articles stay empty.
    return blogs.filter((b) => {
      const haystack =
        `${stripHtml(b.title_en)} ${stripHtml(b.title_ru)} ${stripHtml(
          b.title_tk,
        )} ${stripHtml(b.text_en)} ${stripHtml(b.text_ru)} ${stripHtml(
          b.text_tk,
        )}`.toLowerCase();
      return keywords.some((k) => k && haystack.includes(k));
    });
  }, [blogs, keywords]);

  if (!filtered.length) {
    return <p className="text-center py-10 text-gray-500">{emptyLabel}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {filtered.map((item) => (
        <BlogCard
          key={item.id}
          blog={item}
          href={`/blog/${item.id}`}
          className="w-full"
        />
      ))}
    </div>
  );
}
