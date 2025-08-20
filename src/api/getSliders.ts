import { fetcher } from "@/lib/fetcher";
import {BASE_API_URL} from "@/i18n/api";

export type Slider = {
    id: number;
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
    image: string;
};

export const getSliders = (): Promise<Slider[]> => {
    return fetcher(`${BASE_API_URL}api/sliders`);
};
