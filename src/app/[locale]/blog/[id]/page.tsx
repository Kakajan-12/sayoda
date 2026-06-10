import React from "react";
import MainCountries from "../../../../Components/Countries/MainCountries";
import TextsCountry from "../../../../Components/Countries/TextsCountry";
import GalleryCountry from "../../../../Components/Countries/GalleryCountry";
import { notFound } from "next/navigation";
import { BASE_API_URL } from "@/i18n/api";

async function getBlogData(id: string) {
  const res = await fetch(`${BASE_API_URL}/api/blogs/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Не удалось загрузить данные");
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;

  const blog = await getBlogData(id);
  const blogData = Array.isArray(blog) ? blog[0] : blog;
  if (!blogData) notFound();
  return (
    <div>
      <MainCountries data={blogData} />
      <TextsCountry data={blogData} />
      <GalleryCountry blogId={blogData.id} />
    </div>
  );
}
