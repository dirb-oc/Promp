const WS_URL = import.meta.env.VITE_API_URL
    .replace("https", "wss")
    .replace("http", "ws");

export function createWebSocket(path, onMessage) {
    let socket;
    let shouldReconnect = true;

    function connect() {
        socket = new WebSocket(`${WS_URL}${path}`);

        socket.onopen = () => {
            console.log("WS conectado:", path);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        socket.onclose = () => {
            if (shouldReconnect) {
                console.warn("WS reconectando...");
                setTimeout(connect, 2000);
            }
        };

        socket.onerror = (err) => {
            console.error("WS error:", err);
            socket.close();
        };
    }

    connect();

    return {
        close: () => {
            shouldReconnect = false;
            socket?.close();
        },
    };
}