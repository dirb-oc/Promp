import { useState, useEffect, useCallback } from "react";
import { getSetsfilter } from "../Services/Sets";

export default function useSets(filters) {
    const [sets, setSets] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 🔥 cargar sets
    const loadSets = useCallback(async (pageToLoad) => {
        setLoading(true);

        try {
            const data = await getSetsfilter({
                page: pageToLoad,
                ...filters,
            });

            setSets((prev) =>
                pageToLoad === 1
                    ? data.results
                    : [...prev, ...data.results]
            );

            if (pageToLoad >= data.pages) {setHasMore(false);}

        } catch (err) { console.error(err);} finally { setLoading(false);}
    }, [filters]);

    // 🔁 cuando cambian filtros
    useEffect(() => {setSets([]);setPage(1);setHasMore(true);loadSets(1);}, [filters]);

    // 🔁 cargar más páginas
    useEffect(() => {if (page === 1) return;loadSets(page);}, [page]);

    // 🟢 primera carga
    useEffect(() => {loadSets(1);}, []);

    return {sets,loading,hasMore,setPage};
}