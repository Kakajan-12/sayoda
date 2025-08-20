import { fetcher } from "@/lib/fetcher";

export const getTours = () => fetcher("http://localhost:3001/api/tours");
