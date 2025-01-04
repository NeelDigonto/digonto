ARG working_env

FROM nginx:latest AS base
# ADD nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d /etc/nginx/conf.d


FROM base AS test
# Testing all configuration files
RUN nginx -t -c /etc/nginx/nginx.conf

FROM base AS prod
# EXPOSE 80 443
# CMD nginx -t -c /etc/nginx/nginx.conf
CMD ["nginx", "-c", "/etc/nginx/nginx.conf", "-g", "daemon off;"]
