import { useState } from "react";
import { updateSet } from "../Services/Sets";
import './Setheader.css';

export default function Setheader({ setData, onUpdate }) {
    const [openNameModal, setOpenNameModal] = useState(false);
    const [openDateModal, setOpenDateModal] = useState(false);

    const [newName, setNewName] = useState(setData.nombre);
    const [newDate, setNewDate] = useState(
        setData.fecha_entrega ? setData.fecha_entrega.split("T")[0] : ""
    );

    const handleUpdateName = async () => {
        const updated = await updateSet(setData.id, { nombre: newName });
        onUpdate(updated);
        setOpenNameModal(false);
    };

    const handleUpdateDate = async () => {
        const updated = await updateSet(setData.id, { fecha_entrega: newDate });
        onUpdate(updated);
        setOpenDateModal(false);
    };

    return (
        <div className="Setheader">
            {/* CLICK EN NOMBRE */}
            <h1 onClick={() => setOpenNameModal(true)} className="editable">
                {setData.nombre}
            </h1>

            <div className="set-meta">
                <span className="meta-item">
                    Creado: {new Date(setData.fecha_creacion).toLocaleDateString()}
                </span>

                {/* CLICK EN FECHA */}
                <span 
                    className="meta-item editable"
                    onClick={() => setOpenDateModal(true)}
                >
                    Subido: {
                        setData.fecha_entrega
                            ? new Date(setData.fecha_entrega).toLocaleDateString()
                            : "Sin Entregar"
                    }
                </span>
            </div>

            {/* MODAL NOMBRE */}
            {openNameModal && (
                <div className="modal-overlay" onClick={() => setOpenNameModal(false)}>
                    <div className="Set-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar nombre</h2>
                        <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button onClick={handleUpdateName}>Guardar</button>
                    </div>
                </div>
            )}

            {/* MODAL FECHA */}
            {openDateModal && (
                <div className="modal-overlay" onClick={() => setOpenDateModal(false)}>
                    <div className="Set-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Editar fecha</h2>
                        <input 
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                        <button onClick={handleUpdateDate}>Guardar</button>
                    </div>
                </div>
            )}
        </div>
    );
}