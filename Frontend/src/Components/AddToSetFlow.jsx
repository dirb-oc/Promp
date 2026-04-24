import { useState } from "react";
import { getImageUrl, urlToFile } from "../Services/images";
import { createPrompt } from "../Services/prompts";

import SearchSets from "./SearchSets";
import "./AddToSetFlow.css";

export default function AddToSetFlow({ image }) {
    const [selectedSet, setSelectedSet] = useState(null);
    const [titulo, setTitulo] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        if (!selectedSet) {
            setError("Selecciona un set");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const file = await urlToFile(getImageUrl(image));

            await createPrompt({
                titulo: titulo || "Sin título",
                prompt: image.positive,
                negative_prompt: image.negative,
                set: selectedSet.id,
                imagen: file,
            });

            setSuccess(true);

        } catch (err) {
            console.error(err);
            setError("Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-container">

            {/* 🔎 Buscar y seleccionar */}
            <SearchSets
                onSelect={setSelectedSet}
                selectedId={selectedSet?.id}
            />

            {/* 🎯 Set seleccionado */}
            {selectedSet && (
                <div className="select-set">
                    <span className="select-set-label">Seleccionado</span>
                    <span className="select-set-name">{selectedSet.nombre}</span>
                </div>
            )}

            {/* 🏷️ Título */}
            <div className="input-group">
                <label>Título del Prompt</label>
                <input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej: chica cyberpunk"
                />
            </div>

            {/* 🚀 Acción */}
            <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
            >
                {loading ? "Guardando..." : "Agregar al set"}
            </button>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Guardado ✅</p>}
        </div>
    );
}