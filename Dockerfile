FROM node:18-alpine
WORKDIR /app

# 1. Copiamos los manifiestos de dependencias
COPY package*.json ./

# 2. Instalamos todas las dependencias
RUN npm install

# 3. Copiamos todo el código de tu proyecto (frontend y backend)
COPY . .

# 4. Construimos el frontend de React/Vite para producción
RUN npm run build

# 5. Exponemos el puerto donde corre tu servidor Express
EXPOSE 8080

# 6. Comando de producción: Ejecutamos el backend en TypeScript
# (Asegúrate de que la ruta apunte al archivo donde pegaste el código del Paso 1)
CMD ["npx", "tsx", "backend/index.ts"]
