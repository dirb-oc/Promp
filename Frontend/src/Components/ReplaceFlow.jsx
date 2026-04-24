import { useState, useEffect } from "react";
import { getSetById } from "../Services/Sets";
import { updatePrompt } from "../Services/prompts";
import { getImageUrl, urlToFile } from "../Services/images";

import SearchSets from "./SearchSets";
import "./ReplaceFlow.css";

export default function ReplaceFlow({ image }) {
    const [selectedSet, setSelectedSet] = useState(null);
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);

    const [loadingPrompts, setLoadingPrompts] = useState(false);

    const [confirmMode, setConfirmMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // 🔹 Cargar prompts
    useEffect(() => {
        if (!selectedSet) return;

        const fetchPrompts = async () => {
            try {
                setLoadingPrompts(true);

                const data = await getSetById(selectedSet.id);
                setPrompts(data.prompts || []);

            } catch (err) {
                console.error("Error cargando prompts:", err);
            } finally {
                setLoadingPrompts(false);
            }
        };

        fetchPrompts();
    }, [selectedSet]);

    // 🔥 REEMPLAZAR
    const handleReplace = async () => {
        if (!selectedPrompt) {
            setError("Selecciona un prompt");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const file = await urlToFile(getImageUrl(image));

            await updatePrompt(selectedPrompt.id, {
                titulo: selectedPrompt.titulo,
                prompt: image.positive,
                negative_prompt: image.negative,
                imagen: file,
            });

            setSuccess(true);
            setConfirmMode(false);

        } catch (err) {
            console.error(err);
            setError("Error al reemplazar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="replace-container">

            {/* 🔎 Buscar set */}
            <SearchSets
                onSelect={(set) => {
                    setSelectedSet(set);
                    setSelectedPrompt(null);
                    setConfirmMode(false);
                }}
                selectedId={selectedSet?.id}
            />

            {/* 🎯 Set */}
            {selectedSet && (
                <div className="select-set">
                    <span className="select-set-label">Set:</span>
                    <span className="select-set-name">{selectedSet.nombre}</span>
                </div>
            )}

            {/* ⏳ Loading */}
            {loadingPrompts && <p>Cargando prompts...</p>}

            {/* 🧱 Prompts */}
            {selectedSet && !loadingPrompts && (
                <div className="prompts-results">
                <div className="prompts-grid">
                    {prompts.map((p) => (
                        <div
                            key={p.id}
                            className={`prompt-card ${
                                selectedPrompt?.id === p.id ? "selected" : ""
                            }`}
                            onClick={() => {
                                setSelectedPrompt(p);
                                setConfirmMode(false);
                            }}
                        >
                            {p.imagen ? (
                                <img src={p.imagen} alt={p.titulo} />
                            ) : (
                                <div className="placeholder">Sin imagen</div>
                            )}

                            <div className="prompt-info">
                                <p>{p.titulo}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            )}

            {/* 🎯 Seleccionado */}
            {selectedPrompt && (
                 <div className="select-set">
                    <span className="select-set-label">Reemplazarás:</span>
                    <span className="select-set-name">{selectedPrompt.titulo}</span>
                </div>
            )}

            {/* 🚀 BOTÓN PRINCIPAL */}
            {selectedPrompt && !confirmMode && (
                <button
                    className="replace-btn"
                    onClick={() => setConfirmMode(true)}
                >
                    Reemplazar imagen
                </button>
            )}

            {/* ⚠️ CONFIRMACIÓN */}
            {confirmMode && (
                <div className="confirm-box">
                    <p>⚠️ Esta acción sobrescribirá la imagen actual</p>

                    <div className="confirm-actions">
                        <button
                            className="confirm"
                            onClick={handleReplace}
                            disabled={loading}
                        >
                            {loading ? "Reemplazando..." : "Sí, reemplazar"}
                        </button>

                        <button
                            className="cancel"
                            onClick={() => setConfirmMode(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* 🧾 Estados */}
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Reemplazado correctamente ✅</p>}
        </div>
    );
}