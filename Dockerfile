FROM node:18-alpine
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el caché
COPY package.json package-lock.json* bun.lock* ./

# Instalamos dependencias usando npm (asegurando compatibilidad)
RUN npm install --frozen-lockfile || npm install

# Ahora copiamos el resto del código
COPY . .

# Construimos el frontend
RUN npm run build

EXPOSE 8080

# Usamos npx para asegurar que tsx esté disponible
CMD ["npx", "tsx", "backend/index.ts"]
