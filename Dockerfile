FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite (por defecto 5173)
EXPOSE 5173

# Comando para desarrollo (hot reload habilitado)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]