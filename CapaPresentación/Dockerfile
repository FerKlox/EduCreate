# Usa la imagen base de Nginx

FROM nginx:alpine

# Copia los archivos de tu página web al directorio de Nginx
COPY . /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

# Inicia Nginx en el foreground
CMD ["nginx", "-g", "daemon off;"]

#Instrucciones:
#docker build -t mi-pagina-web .
#docker run -d -p 80:80 mi-pagina-web

#Para ver la pagina localmente
#npm install -g http-server
#http-server .
