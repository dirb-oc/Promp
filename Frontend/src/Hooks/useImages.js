import { useEffect, useState } from "react";
import { getImages } from "../Services/images";
import { imagesSocket } from "../Services/imagesWS";

export function useImages() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // 🔥 API inicial
        getImages()
            .then(setImages)
            .catch(console.error);

        // 🔥 WebSocket
        const socket = imagesSocket((newImg) => {
            setImages((prev) => {
                if (prev.some((img) => img.filename === newImg.filename)) return prev;
                return [{ ...newImg, id: newImg.filename + Math.random() }, ...prev];
            });
        });

        return () => socket.close();
    }, []);

    return { images };
}