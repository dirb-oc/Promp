export const copyToClipboard = async (text) => {
    if (!text) return false;

    try {
        // Método moderno
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            document.execCommand("copy");
            document.body.removeChild(textarea);
        }

        return true;
    } catch (err) {
        console.error("Error al copiar", err);
        return false;
    }
};