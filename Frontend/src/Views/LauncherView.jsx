import { useEffect, useState } from "react";
import { connectActiveWS } from "../Services/wsActive";
import { launchPrompt } from "../Services/launcher";
import { FaCheck } from "react-icons/fa";
import "../Components/launcher.css";

const STORAGE_KEYS = {
    prompt: "launcher_prompt",
    negative: "launcher_negative",
};

export default function Launcher() {
    const [status, setStatus] = useState({ active: false });

    const [prompt, setPrompt] = useState("");
    const [negative, setNegative] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const RESOLUTIONS = [
        { label: "Cuadrado (960x960)", width: 960, height: 960 },
        { label: "Horizontal (1440x1152)", width: 1440, height: 1152 },
        { label: "Vertical (1080x1440)", width: 1080, height: 1440 },
    ];

    const [resolution, setResolution] = useState(RESOLUTIONS[0]);

    // 🔌 WebSocket
    useEffect(() => {
        const ws = connectActiveWS((data) => { setStatus(data); });

        return () => ws.close();
    }, []);

    // 📥 localStorage
    useEffect(() => {
        const savedPrompt = localStorage.getItem(STORAGE_KEYS.prompt);
        const savedNegative = localStorage.getItem(STORAGE_KEYS.negative);

        if (savedPrompt) setPrompt(savedPrompt);
        if (savedNegative) setNegative(savedNegative);

    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.prompt, prompt);
    }, [prompt]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.negative, negative);
    }, [negative]);

    // ⏱ delay helper
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    // 🚀 Lanzar
    const handleLaunch = async () => {
        if (!prompt.trim()) return;

        try {
            setLoading(true);
            setResult(null);

            // 👇 delay mínimo UX
            await delay(800);

            const res = await launchPrompt({
                prompt,
                negative_prompt: negative,
                width: resolution.width,
                height: resolution.height,
            });

            setResult(res);
        } catch (err) {
            console.error(err);
            setResult({ error: "Error al lanzar" });
        } finally {
            // 👇 pequeño delay final para suavizar
            await delay(400);
            setLoading(false);
        }
    };

    return (
        <div className="General">
            <div className="status">
                <h2>Lanzador</h2>

                <div className="status-line">
                    <span className={`status-dot ${status.active ? "active" : "inactive"}`} />
                    <span>{status.active ? "Generando" : "Apagado"}</span>
                </div>
            </div>


            <div className="card-launcher">
                <h3>Workflow</h3>

                <label className="label">Prompt</label>
                <textarea
                    className="input textarea-big"
                    placeholder="Describe tu imagen..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <label className="label">Negative</label>
                <textarea
                    className="input textarea-small"
                    placeholder="Negative prompt..."
                    value={negative}
                    onChange={(e) => setNegative(e.target.value)}
                />

                <label className="label">Resolución</label>
                <select
                    className="select"
                    value={`${resolution.width}x${resolution.height}`}
                    onChange={(e) => {
                        const selected = RESOLUTIONS.find(
                            (r) => `${r.width}x${r.height}` === e.target.value
                        );
                        setResolution(selected);
                    }}
                >
                    {RESOLUTIONS.map((r) => (
                        <option key={r.label} value={`${r.width}x${r.height}`}>
                            {r.label}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleLaunch}
                    disabled={loading}
                    className={`btn ${loading ? "loading" : ""}`}
                >
                    {loading ? "Generando..." : "Generar"}
                </button>
            </div>

            {/* Resultado */}
            {result && (
                <div className="result">
                    {result.error ? (
                        <p className="error">{result.error}</p>
                    ) : (
                        <p><FaCheck /> Generado correctamente</p>
                    )}
                </div>
            )}
        </div>
    );
}