export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-AAKQTSiws9SfpEYi3wwvRu"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && npm install @supabase/supabase-js && mkdir -p src/config src/services src/pages/dashboards src/components/ui
source /home/ubuntu/.user_env && cd . && 
echo '<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TopMEI - Cadastro</title>
    <link rel="stylesheet" href="./src/styles/index.css">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
</body>
</html>' > index.html
# Criar o index.js
mkdir -p src/styles
echo "import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);" > src/index.js
# Criar o index.css com as diretivas do Tailwind
echo '@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilo para simular o modal do DaisyUI que foi usado no DashboardCliente */
.modal {
  display: none;
}
.modal-backdrop {
  display: none;
}
.modal-box {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
}
.modal-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: background-color 0.15s ease-in-out;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background-color: #0d9488;
  color: white;
}
.btn-primary:hover {
  background-color: #0f766e;
}
' > src/styles/index.css
# Criar o package.json
echo '{
  "name": "topmei-frontend",
  "version": "1.0.0",
  "description": "Frontend para o sistema de cadastro TopMEI com React e Supabase",
  "main": "src/index.js",
  "scripts": {
    "start": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.44.4",
    "lucide-react": "^0.408.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "vite": "^5.3.4"
  }
}' > package.json
# Criar o tailwind.config.js
echo '/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
      },
    },
  },
  plugins: [],
}' > tailwind.config.js
# Instalar as dependências de desenvolvimento (Vite, Tailwind, etc.)
pnpm install --no-lockfile
'

source /home/ubuntu/.user_env && cd . && pnpm install --no-lockfile


