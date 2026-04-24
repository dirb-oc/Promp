import { useState } from "react";
import { createSet } from "../Services/Sets";
import { createPrompt } from "../Services/prompts";
import { getImageUrl, urlToFile } from "../Services/images";

import "./CreateSetFlow.css";

export default function CreateSetFlow({ image }) {
    const [nombreSet, setNombreSet] = useState("");
    const [titulo, setTitulo] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSave = async () => {
        if (!nombreSet.trim()) {
            setError("El nombre del set es obligatorio");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const newSet = await createSet({
                nombre: nombreSet,
            });

            const file = await urlToFile(getImageUrl(image));

            await createPrompt({
                titulo: titulo || "Sin título",
                prompt: image.positive,
                negative_prompt: image.negative,
                set: newSet.id,
                imagen: file,
            });

            setSuccess(true);

        } catch (err) {
            console.error(err);
            setError("Error al crear el set");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-container">

            {/* 📦 Nombre del set */}
            <div className="input-group">
                <label>Nombre del Set</label>
                <input
                    value={nombreSet}
                    onChange={(e) => setNombreSet(e.target.value)}
                    placeholder="Ej: Personajes anime"
                />
            </div>

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
                {loading ? "Creando..." : "Crear Set y Guardar"}
            </button>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">Creado correctamente ✅</p>}
        </div>
    );
}