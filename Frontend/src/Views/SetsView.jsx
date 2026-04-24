import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInfiniteScroll from "../Hooks/useInfiniteScroll";
import FiltersModal from "../Components/FiltersModal";
import Card from "../Components/Card";
import useSets from "../Hooks/useSets";

export default function SetsView() {
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({nombre: "",tipo: "",orden: "az",});

    const { sets, loading, hasMore, setPage } = useSets(filters);
    const [tempFilters, setTempFilters] = useState(filters);

    useEffect(() => { if (openModal) { setTempFilters(filters); } }, [openModal]);

    const lastElementRef = useInfiniteScroll({
        loading,
        hasMore,
        onLoadMore: () => setPage((prev) => prev + 1),
    });

    return (
        <div className="General">
            <h2>Galería de Sets</h2>
            <div className="grid grid-auto grid-gap-lg" style={{ "--min": "325px" }}>
                {sets.map((set, index) => {
                    const isLast = index === sets.length - 1;

                    return (
                        <Card
                            key={set.id}
                            title={set.nombre}
                            image={set.imagen_referencia}
                            date={new Date(set.fecha_creacion).toLocaleDateString()}
                            status={set.estado}
                            onClick={() => navigate(`/sets/${set.id}`)}
                            innerRef={isLast ? lastElementRef : null}
                        />
                    );
                })}
            </div>

            <button className="filter-btn" onClick={() => setOpenModal(true)}>Filtros</button>

            <FiltersModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                filters={filters}
                setFilters={setFilters}
            />

            {loading && (
                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    Cargando...
                </p>
            )}

            {!hasMore && (
                <p style={{ textAlign: "center", marginTop: "20px", color: 'white' }}>
                    No hay más sets...
                </p>
            )}
        </div>
    );
}