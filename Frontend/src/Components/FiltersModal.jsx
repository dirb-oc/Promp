import { useEffect, useState } from "react";
import "./FiltersModal.css"

export default function FiltersModal({ open, onClose, filters, setFilters }) {
    const [tempFilters, setTempFilters] = useState(filters);

    useEffect(() => { if (open) setTempFilters(filters); }, [open, filters]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        if (open) { window.addEventListener("keydown", handleEsc); }
        
        return () => { window.removeEventListener("keydown", handleEsc); };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="filters-overlay" onClick={onClose}>
            <div className="filters-modal" onClick={(e) => e.stopPropagation()}>
                <div className="filters-header">
                    <h3>Filtros</h3>
                </div>

                <div className="filters-body">

                    {/* 🔍 Nombre */}
                    <div className="filter-group">
                        <label>Buscar</label>
                        <input
                            placeholder="Nombre del prompt..."
                            value={tempFilters.nombre}
                            onChange={(e) =>
                                setTempFilters({ ...tempFilters, nombre: e.target.value })
                            }
                        />
                    </div>

                    {/* 🟢 Tipo */}
                    <div className="filter-group">
                        <label>Estado</label>
                        <select
                            value={tempFilters.tipo}
                            onChange={(e) =>
                                setTempFilters({ ...tempFilters, tipo: e.target.value })
                            }
                        >
                            <option value="">Todos</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="revision">Revisión</option>
                            <option value="terminado">Terminado</option>
                            <option value="entregado">Entregado</option>
                            <option value="vacio">Vacío</option>
                        </select>
                    </div>

                    {/* 📊 Orden */}
                    <div className="filter-group">
                        <label>Ordenar por</label>
                        <select
                            value={tempFilters.orden}
                            onChange={(e) =>
                                setTempFilters({ ...tempFilters, orden: e.target.value })
                            }
                        >
                            <option value="az">A-Z</option>
                            <option value="recientes">Más recientes</option>
                            <option value="antiguos">Más antiguos</option>
                        </select>
                    </div>

                </div>

                <div className="filters-footer">
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setFilters(tempFilters);
                            onClose();
                        }}
                    >
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}