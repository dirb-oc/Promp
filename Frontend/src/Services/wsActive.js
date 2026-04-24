import { createWebSocket } from "../Web/ws";

export function connectActiveWS(onChange) {
    return createWebSocket("/ws/active", (data) => {
        console.log(data)
        if (typeof data.active !== "undefined") {
            onChange({
                active: data.active,
                running: data.running ?? 0,
                pending: data.pending ?? 0,
            });
        }
    });
}