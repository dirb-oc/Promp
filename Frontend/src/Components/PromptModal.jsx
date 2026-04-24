import { updatePrompt, createPrompt } from "../Services/prompts";
import { copyToClipboard } from "../Services/clipboard";
import { openImageInNewTab } from "../Services/images";
import { useState, useEffect } from "react";
import "./PromptModal.css";

export default function PromptModal({ open, onClose, onCreated, editData, setId }) {
    const [titulo, setTitulo] = useState("");
    const [prompt, setPrompt] = useState("");
    const [negative, setNegative] = useState("");
    const [categoria, setCategoria] = useState("set");
    const [copied, setCopied] = useState(null);
    const [view, setView] = useState("image");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    useEffect(() => {
        if (editData) {
            setTitulo(editData.titulo || "");
            setPrompt(editData.prompt || "");
            setNegative(editData.negative_prompt || "");
            setCategoria(editData.categoria || "set");
        } else {
            setTitulo("");
            setPrompt("");
            setNegative("");
            setCategoria("set");
        }
        setView("image");
    }, [editData]);

    const handleCopy = async (text, type) => {
        if (await copyToClipboard(text)) {
            setCopied(type);
            setTimeout(() => setCopied(null), 1200);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            titulo,
            prompt,
            negative_prompt: negative,
            categoria,
            set: editData ? editData.set : setId
        };

        try {
            editData
                ? await updatePrompt(editData.id, payload)
                : await createPrompt(payload);

            onCreated();
            onClose();
        } catch (err) {
            console.error("Error guardando prompt", err);
        }
    };

    if (!open) return null;

    const CopyField = ({ label, value, type, isNegative }) => (
        <div className="field readonly">
            <label>{label}</label>
            <div className="copy-block">
                <span className={isNegative ? "negative" : ""}>
                    {value?.trim() || "Nothing"}
                </span>
                <button
                    className="copy-btn"
                    onClick={() => handleCopy(value, type)}
                >
                    {copied === type ? "✔" : "Copiar"}
                </button>
            </div>
        </div>
    );

    const InfoContent = (
        <div className="modal-info">
            {isMobile && view === "info" && (
                <button className="back-btn" onClick={() => setView("image")}>
                    ← Volver
                </button>
            )}

            <div className="field">
                <label>Título</label>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>

            <div className="field">
                <label>Estado</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="set">Set</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="revision">Revisión</option>
                    <option value="accion">Acción</option>
                </select>
            </div>

            <CopyField label="Prompt" value={prompt} type="prompt" />
            <CopyField label="Negative" value={negative} type="negative" isNegative />

            <div className="modal-buttons">
                <button className="btn-secondary" onClick={() => openImageInNewTab(editData.imagen)}>
                    Ver imagen
                </button>
                <button className="btn-primary" onClick={handleSubmit}>Guardar</button>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal ${isMobile ? "mobile" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-body">

                    {/* IMAGE */}
                    {(!isMobile || view === "image") && (
                        <div className="modal-preview">
                            {editData?.imagen && (
                                <img src={editData.imagen} alt="preview" />
                            )}

                            {isMobile && (
                                <button
                                    className="switch-btn"
                                    onClick={() => setView("info")}
                                >
                                    Ver info →
                                </button>
                            )}
                        </div>
                    )}

                    {/* INFO */}
                    {(!isMobile || view === "info") && InfoContent}

                </div>
            </div>
        </div>
    );
}