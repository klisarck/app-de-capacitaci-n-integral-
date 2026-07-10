FROM node:18-alpine

WORKDIR /app

# Copiamos archivos de configuración
COPY package*.json ./
COPY backend/package.json ./backend/package.json

# Instalamos dependencias usando --legacy-peer-deps para evitar conflictos de versiones
RUN npm install --legacy-peer-deps
RUN cd backend && npm install --legacy-peer-deps

# Copiamos el código fuente
COPY . .

# 1. Declaramos que Docker recibirá estas variables desde Render
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# 2. Las pasamos como variables de entorno para que Vite las lea al compilar
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Construimos el frontend
RUN npm run build

EXPOSE 8080

# Arrancamos el servidor
CMD ["npx", "tsx", "backend/index.ts"]
