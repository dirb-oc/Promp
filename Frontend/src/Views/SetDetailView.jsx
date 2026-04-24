import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSetById } from "../Services/Sets";

import PromptModal from "../Components/PromptModal";
import SetHeader from "../Components/SetHeader";
import Card from "../Components/Card";

export default function SetDetailView() {
    const { id } = useParams();
    const [setData, setSetData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const loadSet = async () => {const data = await getSetById(id);setSetData(data);};

    useEffect(() => {loadSet();}, [id]);

    const handleEdit = (prompt) => {setEditData(prompt);setOpenModal(true);};

    if (!setData) return <p>Cargando...</p>;

    return (
        <div className="General">
            <SetHeader setData={setData} />

            <h2>Prompts</h2>

            <div className="grid grid-auto grid-gap-md" style={{ "--min": "420px" }}>
                {setData.prompts.map((p) => (
                    <Card
                        key={p.id}
                        title={p.titulo}
                        image={p.imagen}
                        date={new Date(p.fecha_creacion).toLocaleDateString()}
                        status={p.categoria}
                        onClick={() => handleEdit(p)}
                    />
                ))}
            </div>

            <PromptModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={loadSet}
                editData={editData}
                setId={setData.id}
            />
        </div>
    );
}