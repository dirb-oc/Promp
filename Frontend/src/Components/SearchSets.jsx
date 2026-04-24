import { useState } from "react";
import { getSetsfilter } from "../Services/Sets";
import "./SearchSets.css";

export default function SearchSets({ onSelect, selectedId }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);

        try {
            const data = await getSetsfilter({
                nombre: query,
                orden: "az",
                page: 1,
            });

            setResults(data.results || []);
        } catch (err) {
            console.error("Error buscando:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="searchsets-container">
            <label>Buscar Sets</label>

            {/* 🔍 Buscador */}
            <div className="searchsets-bar">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar sets..."
                />

                <button onClick={handleSearch}>Buscar</button>
            </div>

            <div className="searchsets-results">
                {loading && (<p className="searchsets-status">Cargando...</p>)}

                {!loading && results.length === 0 && (<p className="searchsets-status">No hay resultados</p>)}

                <div className="searchsets-grid">
                    {results.map((set) => (
                        <div
                            key={set.id}
                            className={`searchsets-card ${selectedId === set.id ? "selected" : ""}`}
                            onClick={() => onSelect && onSelect(set)}
                        >
                            {set.imagen_referencia ? (
                                <img src={set.imagen_referencia} alt={set.nombre}/>
                            ) : (
                                <div className="searchsets-placeholder">Sin imagen</div>
                            )}

                            <div className="searchsets-info"><h4>{set.nombre}</h4></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}