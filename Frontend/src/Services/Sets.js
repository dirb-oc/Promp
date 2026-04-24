import { apiRequest } from "../Api/Api";

const BASE = "/api/sets/";
const BASEs = "/api/sets/filter/";

export function getSets() {
    return apiRequest(BASE);
}

export function getSetById(id) {
    return apiRequest(`${BASE}${id}/`);
}

export function createSet(data) {
    return apiRequest(BASE, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function updateSet(id, data) {
    return apiRequest(`${BASE}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export function getSetsfilter({ page = 1, nombre = "", tipo = "", orden = "az" } = {}) {
    const params = new URLSearchParams();

    params.append("page", page);

    if (nombre) params.append("nombre", nombre);
    if (tipo) params.append("tipo", tipo);
    if (orden) params.append("orden", orden);

    return apiRequest(`${BASEs}?${params.toString()}`);
}