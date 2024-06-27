# Usar la imagen oficial de Node.js como imagen base
FROM node:16

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar los archivos del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto en el que la aplicación estará escuchando
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]