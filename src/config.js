// Fonte única da URL da API.
//
// Antes cada página tinha `import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"`.
// O problema: se a env var faltasse no build da Vercel, o bundle de produção saía
// apontando para o 127.0.0.1 DO VISITANTE. Nada quebrava no build, o deploy ficava
// verde, e todo fetch morria no navegador do cliente — falha silenciosa.
//
// Agora: o fallback local só existe em dev. Em produção, a ausência da env var
// derruba o build (ver vite.config.js), então isso nunca chega no ar.

const raw = import.meta.env.VITE_API_URL;

// Remove barra(s) no fim para não gerar "https://api.exemplo.com//api/pedidos".
export const API_URL = (raw || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "")).replace(
    /\/+$/,
    ""
);

if (!API_URL) {
    // Rede de segurança: se algum build escapar da checagem do vite.config.js,
    // ao menos deixa o motivo explícito no console em vez de erro de CORS/rede.
    console.error(
        "[config] VITE_API_URL não foi definida no build. Todas as chamadas à API vão falhar."
    );
}
