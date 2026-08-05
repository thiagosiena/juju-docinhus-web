import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv lê os arquivos .env* e também as vars VITE_* já presentes em
  // process.env (é assim que as variáveis da Vercel chegam aqui).
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiUrl = env.VITE_API_URL || process.env.VITE_API_URL

  // Fail-fast: build de produção sem VITE_API_URL gerava um bundle que apontava
  // para o 127.0.0.1 do visitante. O deploy ficava verde e o site quebrava só no
  // navegador do cliente. Melhor quebrar aqui, onde alguém está olhando.
  if (mode === 'production' && !apiUrl) {
    throw new Error(
      'VITE_API_URL não está definida neste build de produção.\n' +
      'Defina em Vercel > Settings > Environment Variables para os ambientes\n' +
      'Production E Preview (ex.: https://api.thiagosiena.com), e refaça o deploy.'
    )
  }

  return {
    plugins: [react()],
  }
})
