FROM node:18-alpine
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de tu proyecto
COPY . .

# Exponemos el puerto 8080 que usa tu servidor
EXPOSE 8080

# Comando para encender el sistema
CMD ["npm", "start"]
