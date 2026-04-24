import { apiRequest } from "../Api/Api";

const BASE = "/api/prompts/";

export function getPrompts() {
    return apiRequest(BASE);
}

export function createPrompt({ titulo, prompt, negative_prompt, set, imagen }) {
    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("prompt", prompt);
    formData.append("negative_prompt", negative_prompt || "");
    formData.append("set", set);

    if (imagen) {
        formData.append("imagen", imagen);
    }

    return apiRequest("/api/prompts/", {
        method: "POST",
        body: formData,
    });
}

export function updatePrompt(id, data) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    return apiRequest(`${BASE}${id}/`, {
        method: "PATCH", // 🔥 CAMBIO CLAVE
        body: formData,
        headers: {}
    });
}