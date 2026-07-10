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

# Construimos el frontend
RUN npm run build

EXPOSE 8080

# Arrancamos el servidor
CMD ["npx", "tsx", "backend/index.ts"]
