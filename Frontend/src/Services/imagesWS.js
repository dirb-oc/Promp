import { createWebSocket } from "../Web/ws";

export function imagesSocket(onNewImage) {
    return createWebSocket("/ws/images", onNewImage);
}