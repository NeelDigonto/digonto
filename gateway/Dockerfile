ARG NODE_VERSION=20.11.0
ARG NPM_TOKEN

FROM node:${NODE_VERSION}-bookworm as base
WORKDIR /app


FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
# USER node
COPY . .
CMD ["npm", "run", "dev"]

FROM base as lintcheck
ENV NODE_ENV ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
#USER node
COPY . .
RUN ["npm", "run", "lint:check"]

FROM base as formatcheck
ENV NODE_ENV ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
#USER node
COPY . .
RUN ["npm", "run", "format:check"]

FROM base as devtest
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
#USER node
COPY . .
CMD ["npm", "run", "dev:test"]

FROM base as citest
ENV NODE_ENV ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    echo $NPM_TOKEN && npm ci --include=dev
#USER node
COPY . .
CMD ["npm", "run", "test"]


FROM dev as proddeps
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

FROM base as prodbuild
COPY --from=proddeps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

FROM base as prod
USER node
COPY --from=prodbuild /app/node_modules ./node_modules
COPY --from=prodbuild /app/package.json ./package.json
COPY --from=prodbuild /app/package-lock.json ./package-lock.json
COPY --from=prodbuild /app/dist ./dist
CMD ["npm", "run", "start"]