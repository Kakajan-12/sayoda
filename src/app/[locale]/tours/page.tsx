'use client';

import React, { useEffect, useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BASE_API_URL } from '@/i18n/api';
import { useTranslations, useLocale } from 'next-intl';
import TourCards from '@/Components/MainComonents/TourCards';
import DiscoverMain from '@/Components/Discover/DiscoverMain';
import ReactPaginate from 'react-paginate';
import { FiFilter } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { useSearchParams } from "next/navigation";


interface Filters {
    popular: boolean | null;
    tourType: number | null;
    category: number | null;
    location: number | null;
}

interface Tour {
    id: number;
    slug: string;
    image: string;
    popular: number;
    title_tk: string;
    title_en: string;
    title_ru: string;
    text_tk: string;
    text_en: string;
    text_ru: string;
    duration_tk: string;
    duration_en: string;
    duration_ru: string;
    lang_tk: string;
    lang_en: string;
    lang_ru: string;
    price: number;
    tour_cat_id: number;
    location_id: number;
    tour_type_id: number;
    type_tk: string;
    type_en: string;
    type_ru: string;
}

const initial: Filters = { popular: null, tourType: null, category: null, location: null };

const filterSlice = createSlice({
    name: 'filters',
    initialState: initial,
    reducers: {
        setPopular: (s, a) => { s.popular = a.payload; },
        setTourType: (s, a) => { s.tourType = a.payload; },
        setCategory: (s, a) => { s.category = a.payload; },
        setLocation: (s, a) => { s.location = a.payload; }, // 🔹 добавили
        resetFilters: () => initial,
    },
});
const store = configureStore({ reducer: { filters: filterSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
const { setPopular, setTourType, setCategory, setLocation, resetFilters } = filterSlice.actions;

export default function Page() {
    return (
        <Provider store={store}>
            <ToursPage />
        </Provider>
    );
}

function ToursPage() {
    const dispatch = useDispatch<AppDispatch>();
    const filters = useSelector((s: RootState) => s.filters);
    const t = useTranslations('Filter');
    const locale = useLocale();
    interface TourType {
        id: number;
        [key: string]: string | number;
    }
    const [tours, setTours] = useState<Tour[]>([]);
    const [tourTypes, setTourTypes] = useState<TourType[]>([]);
    const [categories, setCategories] = useState<TourType[]>([]);
    const [locations, setLocations] = useState<TourType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);

    const ITEMS_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(0);

    const searchParams = useSearchParams();
    const locationFromQuery = searchParams.get("location");

    useEffect(() => {
        if (locationFromQuery !== null) {
            dispatch(setLocation(Number(locationFromQuery)));
        } else {
            dispatch(setLocation(null));
        }
    }, [locationFromQuery, dispatch]);


    useEffect(() => {
        setCurrentPage(0);
    }, [filters]);


    useEffect(() => {
        Promise.all([
            fetch(`${BASE_API_URL}/api/tours`).then(r => r.json() as Promise<Tour[]>),
            fetch(`${BASE_API_URL}/api/tour-category`).then(r => r.json() as Promise<any[]>),
            fetch(`${BASE_API_URL}/api/tour-location`).then(r => r.json() as Promise<any[]>),
        ])
            .then(([toursData, categoriesData, locationsData]) => {
                setTours(toursData);
                interface TourTypeItem {
                    id: number;
                    [key: string]: string | number;
                }

                setTourTypes(
                    Array.from(new Map(toursData.map((t: Tour) => [t.tour_type_id, t])).values())
                        .map(t => {
                            const key = `type_${locale}`;
                            return {
                                id: t.tour_type_id,
                                [key]: (t as any)[key] || t.type_en
                            } as TourTypeItem;
                        })
                );

                setCategories(categoriesData);
                setLocations(locationsData); // 🔹 сохраняем
            })
            .finally(() => setLoading(false));
    }, [locale]);

    const filtered = tours.filter(t =>
        (filters.popular === null || t.popular === (filters.popular ? 1 : 0)) &&
        (filters.tourType === null || Number(t.tour_type_id) === filters.tourType) &&
        (filters.category === null || Number(t.tour_cat_id) === filters.category) &&
        (filters.location === null || Number(t.location_id) === filters.location)
    );

    const offset = currentPage * ITEMS_PER_PAGE;
    const displayTours = filtered.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const handlePageClick = ({ selected }: { selected: number }) =>
        setCurrentPage(selected);

    const FilterForm = (
        <div className="flex flex-col lg:flex-row justify-between items-center w-full space-y-4 md:space-y-0 md:space-x-4">
            <select
                value={filters.popular === null ? '' : filters.popular ? '1' : '0'}
                onChange={e => dispatch(setPopular(e.target.value === '' ? null : e.target.value === '1'))}
                className="border p-2 rounded-md w-56 h-12"
            >
                <option value="">{t('all-tours')}</option>
                <option value="1">{t('popular')}</option>
            </select>

            <select
                value={filters.tourType ?? ''}
                onChange={e => dispatch(setTourType(e.target.value ? Number(e.target.value) : null))}
                className="border p-2 rounded-md w-56 h-12"
            >
                <option value="">{t('all-types')}</option>
                {tourTypes.map(type => (
                    <option key={type.id} value={type.id}>
                        {type[`type_${locale}`]}
                    </option>
                ))}
            </select>

            <select
                value={filters.category ?? ''}
                onChange={e => dispatch(setCategory(e.target.value ? Number(e.target.value) : null))}
                className="border p-2 rounded-md w-56 h-12"
            >
                <option value="">{t('all-categories')}</option>
                {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                        {cat[`cat_${locale}`]}
                    </option>
                ))}
            </select>

            <select
                value={filters.location ?? ''}
                onChange={e => dispatch(setLocation(e.target.value ? Number(e.target.value) : null))}
                className="border p-2 rounded-md w-56 h-12"
            >
                <option value="">{t('all-locations')}</option>
                {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                        {loc[`location_${locale}`]}
                    </option>
                ))}
            </select>

            <button
                onClick={() => dispatch(resetFilters())}
                className="border px-4 py-2 rounded-md w-56 h-12 main-background-color text-white"
            >
                {t('reset')}
            </button>
        </div>
    );

    return (
        <>
            <DiscoverMain />

            <div className="hidden lg:flex container mx-auto px-5 justify-center -mt-16 z-20 relative mb-10">
                <div className="flex justify-center w-full max-w-[1200px] space-x-4 bg-white shadow rounded py-10 px-5">
                    {FilterForm}
                </div>
            </div>

            <div className="flex lg:hidden justify-end px-5 mt-4">
                <button onClick={() => setMobileFilterOpen(true)} className="p-2 border rounded-full">
                    <FiFilter size={24} />
                </button>
            </div>

            {isMobileFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-11/12 p-6 rounded-lg relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500"
                            onClick={() => setMobileFilterOpen(false)}
                        >
                            <IoClose size={28} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">{t('filter')}</h2>
                        {FilterForm}
                        <button
                            className="mt-4 w-full py-2 rounded bg-mainBlue text-white"
                            onClick={() => setMobileFilterOpen(false)}
                        >
                            {t('search')}
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto py-2 px-5">
                {loading ? (
                    <p>Загрузка туров...</p>
                ) : displayTours.length ? (
                    <TourCards tours={displayTours} />
                ) : (
                    <p className="text-center py-10 text-gray-500">Туры не найдены</p>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName="flex space-x-2"
                    pageClassName="border px-3 py-1 rounded cursor-pointer"
                    activeClassName="main-background-color text-white"
                    previousLabel="<"
                    nextLabel=">"
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                />
            </div>
        </>
    );
}
