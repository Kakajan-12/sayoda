"use client";

import { useSelector } from "react-redux";
import { RootState } from "../Store/store";

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const booleon = useSelector((state: RootState) => state.trufalse.value);

  return <body className={`antialiased   ${booleon ? 'overflow-hidden' : ''}`}>{children}</body>;
}