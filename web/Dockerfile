ARG NODE_VERSION=20.11.0
ARG NPM_TOKEN

FROM node:${NODE_VERSION}-bookworm AS base
WORKDIR /app


FROM base AS dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
# USER node
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS lintcheck
ENV NODE_ENV ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
#USER node
COPY . .
RUN ["npm", "run", "lint"]

FROM base AS devtest
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
#USER node
COPY . .
CMD ["npm", "run", "dev:test"]

FROM base AS citest
ENV NODE_ENV ci
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    echo $NPM_TOKEN && npm ci --include=dev
#USER node
COPY . .
CMD ["npm", "run", "test"]


FROM base AS proddeps
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

FROM base AS prodbuild
COPY --from=proddeps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

FROM base AS prod
USER node
COPY --from=prodbuild /app/node_modules ./node_modules
COPY --from=prodbuild /app/package.json ./package.json
COPY --from=prodbuild /app/package-lock.json ./package-lock.json
COPY --from=prodbuild /app/next.config.ts ./next.config.ts
COPY --from=prodbuild /app/.next ./.next
CMD ["npm", "run", "start"]