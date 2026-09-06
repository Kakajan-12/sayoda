import { useEffect, useState } from "react";
import { getSliders, Slider } from "@/lib/api/sliders";

export const useSliders = () => {
    const [slides, setSlides] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSliders()
            .then(setSlides)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return { slides, loading, error };
};
