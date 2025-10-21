export function fetchFactory({ url, data = null, token = null, contentType = "json", method = "POST" }) {
    const headers = {};

    // Configurar tipo de contenido
    if (contentType === "json") {
        headers["Content-Type"] = "application/json";
    } else if (contentType === "text") {
        headers["Content-Type"] = "text/plain";
    } else if (contentType === "image") {
        // No se define Content-Type para FormData (lo hace el navegador)
    }

    // Agregar token si existe
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Preparar cuerpo
    let body = null;
    if (data) {
        if (contentType === "json") {
            body = JSON.stringify(data);
        } else if (contentType === "text") {
            body = data;
        } else if (contentType === "image") {
            body = new FormData();
            for (const key in data) {
                body.append(key, data[key]);
            }
        }
    }

    return fetch(url, {
        method: method,
        headers: contentType === "image" ? { ...headers } : headers,
        body,
    });
}
