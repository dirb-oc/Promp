import "./ModeTabs.css";

export default function ModeTabs({ mode, setMode }) {
    return (
        <div className="tabs-container">
            <button
                className={mode === "create" ? "active" : ""}
                onClick={() => setMode("create")}
            >
                Nuevo
            </button>

            <button
                className={mode === "add" ? "active" : ""}
                onClick={() => setMode("add")}
            >
                Agregar
            </button>

            <button
                className={mode === "replace" ? "active" : ""}
                onClick={() => setMode("replace")}
            >
                Reemplazar
            </button>
        </div>
    );
}