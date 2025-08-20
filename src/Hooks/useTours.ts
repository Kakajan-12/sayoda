import { useEffect, useState } from "react";
import { getTours } from "@/api/getTours";

export const useTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTours().then(setTours).finally(() => setLoading(false));
    }, []);

    return { tours, loading };
};
