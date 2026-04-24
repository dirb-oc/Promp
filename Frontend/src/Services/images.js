import { apiRequest } from "../Api/Api";

export function getImages() {
    return apiRequest("/gallery/images/");
}

export function getImageUrl(img) {
    const API_URL = import.meta.env.VITE_API_URL;

    return `${API_URL}/gallery/image/?filename=${img.filename}&subfolder=${img.subfolder}&type=${img.type}`;
}

export async function urlToFile(url, filename = "image.png") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

export function openImageInNewTab(imgOrUrl) {
    const url =
        typeof imgOrUrl === "string"
            ? imgOrUrl
            : getImageUrl(imgOrUrl);

    window.open(url, "_blank", "noopener,noreferrer");
}