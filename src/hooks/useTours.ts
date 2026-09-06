import { useEffect, useState } from "react";
import { getTours } from "@/lib/api/tours";

export const useTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTours().then(setTours).finally(() => setLoading(false));
    }, []);

    return { tours, loading };
};
