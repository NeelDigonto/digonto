ARG NODE_VERSION=20.11.0

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


FROM base as test
ENV NODE_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
RUN npm run test


FROM base as proddeps
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

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
COPY --from=prodbuild /app/next.config.mjs ./next.config.mjs
COPY --from=prodbuild /app/.next ./.next
CMD ["npm", "run", "start"]

