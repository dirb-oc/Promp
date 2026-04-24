import { copyToClipboard } from "../Services/clipboard";
import { getImageUrl, openImageInNewTab } from "../Services/images";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useSwipeNavigation from "../Hooks/useSwipeNavigation";
import "./ImageModal.css";

export default function ImageModal({ images, selectedIndex, setSelectedIndex }) {
    const [copied, setCopied] = useState(null);
    const [view, setView] = useState("image");
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {setView("image");}, [selectedIndex]);

    useEffect(() => {
        const handleKey = (e) => {
            if (selectedIndex === null) return;
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") setSelectedIndex(null);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedIndex]);


    const img = images[selectedIndex];

    const next = () => {setSelectedIndex((prev) => (prev + 1) % images.length);};
    const prev = () => {setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);};
    const swipeHandlers = useSwipeNavigation({onNext: next,onPrev: prev,});

    const handleCopy = async (text, type) => {
        if (await copyToClipboard(text)) {
            setCopied(type);
            setTimeout(() => setCopied(null), 1200);
        }
    };

    if (selectedIndex === null || !images[selectedIndex]) return null;

    const CopyField = ({ label, value, type, isNegative }) => (
        <div className="field readonly">
            <label>{label}</label>
            <div className="copy-block">
                <span className={isNegative ? "negative" : ""}>
                    {value?.trim() || "Nothing"}
                </span>
                <button onClick={() => handleCopy(value, type)}>
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

            <CopyField label="Prompt" value={img.positive} type="prompt" />
            <CopyField label="Negative" value={img.negative} type="negative" isNegative />

            <div className="modal-buttons">
                <button className="btn-secondary" onClick={() => openImageInNewTab(img)}>
                    Ver imagen
                </button>

                <button
                    className="btn-primary"
                    onClick={() => navigate("/save", { state: { image: img } })}
                >
                    Guardar
                </button>
            </div>
        </div>
    );

    return (
        <div className="modal-overlay" onClick={() => setSelectedIndex(null)}>
            <div
                className={`modal ${isMobile ? "mobile" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-body">

                    {(!isMobile || view === "image") && (
                        <div className="modal-preview" {...swipeHandlers}>
                            <img src={getImageUrl(img)} alt="preview" />
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

                    {(!isMobile || view === "info") && InfoContent}

                </div>
            </div>
        </div>
    );
}