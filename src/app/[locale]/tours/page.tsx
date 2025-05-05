'use client'
import React, { useState } from "react";
import DiscoverMain from "@/Components/Discover/DiscoverMain";
import PopularCardProps from "@/Components/CardProps/PopularCardProps";
import { popularArray } from "../ArrayForTest/ArrayForTest";
import MobileFilter from "@/Components/Discover/MobileFilter";
import PaginationUi from "@/Ui/Pagination";
const ITEMS_PER_PAGE = 3;
const page = () => {
  const [page, setPage] = useState(1);
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const selectedItems = popularArray.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  return (
    <div>
      <DiscoverMain />
      <MobileFilter />
      <div className="container mx-auto  py-2 md:pt-36 px-5">
        <PopularCardProps children={selectedItems} />
      </div>
      <PaginationUi items={popularArray} onchange={handleChange} page={page} itemsPerPage={ITEMS_PER_PAGE} />
    </div>
  );
};

export default page;
