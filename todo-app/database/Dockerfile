# Usar la imagen oficial de MongoDB
FROM mongo:7.0

# Crear directorio para scripts de inicialización
RUN mkdir -p /docker-entrypoint-initdb.d

# Copiar script de inicialización (opcional)
COPY init-mongo.js /docker-entrypoint-initdb.d/

# Exponer el puerto de MongoDB
EXPOSE 27017

# MongoDB se inicia automáticamente con la imagen base
