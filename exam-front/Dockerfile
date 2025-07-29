# Etapa 1: Compilar la aplicación Angular 18
FROM node:21-alpine AS builder

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli@18.0.0

WORKDIR /app

# Copiar los archivos del paquete para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Compilar la aplicación Angular para producción
RUN ng build --configuration=production

# Etapa 2: Serviremos Angular con NGINX
FROM nginx:alpine

# Copie la compilación de Angular desde la etapa de compilación a NGINX
COPY --from=builder /app/dist/exam-front/browser /usr/share/nginx/html

# Copie la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Exponga los puertos necesarios
EXPOSE 80

# Inicie NGINX y el servidor Node.js simultáneamente
CMD ["nginx", "-g", "daemon off;"]
