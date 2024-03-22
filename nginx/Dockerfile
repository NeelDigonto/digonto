FROM nginx:latest

ARG working_env

# ADD nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d

# Testing all configuration files
# RUN nginx -t -c /etc/nginx/nginx.conf

EXPOSE 80 443 8080
# CMD nginx -t -c /etc/nginx/nginx.conf
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]