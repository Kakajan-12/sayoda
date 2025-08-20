
export const fetcher = async <T = any>(
    url: string,
    options?: RequestInit
): Promise<T> => {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options?.headers || {}),
        },
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData?.message || res.statusText;

        throw new Error(`Ошибка ${res.status}: ${errorMessage}`);
    }

    return res.json();
};
