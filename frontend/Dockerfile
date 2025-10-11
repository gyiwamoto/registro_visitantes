# Usa Nginx como servidor
FROM nginx:alpine

# Remove os arquivos default do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos do frontend para a pasta servida pelo Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]

