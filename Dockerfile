FROM node:18-alpine

WORKDIR /app

# Copiamos archivos de configuración
COPY package*.json ./
COPY backend/package.json ./backend/package.json

# Instalamos dependencias de forma sencilla y confiable
RUN npm install
RUN cd backend && npm install

# Copiamos el código fuente
COPY . .

# Construimos el frontend
RUN npm run build

EXPOSE 8080

# Arrancamos el servidor
CMD ["npx", "tsx", "backend/index.ts"]
