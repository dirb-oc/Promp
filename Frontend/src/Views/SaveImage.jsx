import { useLocation } from "react-router-dom";
import { useState } from "react";

import PreviewImage from "../Components/PreviewImage";
import ModeTabs from "../Components/ModeTabs";
import CreateSetFlow from "../Components/CreateSetFlow";
import AddToSetFlow from "../Components/AddToSetFlow";
import ReplaceFlow from "../Components/ReplaceFlow";

export default function SaveImage() {
    const { state } = useLocation();
    const [mode, setMode] = useState("create");

    if (!state || !state.image) {
        return <div>No hay datos</div>;
    }

    const { image } = state;

    return (
        <div className="General">
            <h2>Guardar imagen</h2>
            <div className="save-layout">
                <PreviewImage image={image} />

                <div className="action-panel">
                    <ModeTabs mode={mode} setMode={setMode} />

                    <div className="action-content">
                        {mode === "create" && <CreateSetFlow image={image} />}
                        {mode === "add" && <AddToSetFlow image={image} />}
                        {mode === "replace" && <ReplaceFlow image={image} />}
                    </div>
                </div>

            </div>
        </div>
    );
}