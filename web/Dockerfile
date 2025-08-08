ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-bookworm-slim as base
WORKDIR /usr/src/app

# Build shared-schemas package
FROM base as shared-schemas
WORKDIR /usr/src/packages/shared-schemas
COPY packages/shared-schemas/package*.json ./
RUN npm ci
COPY packages/shared-schemas/ ./
RUN npm run build

FROM base as dev
# Copy shared-schemas first
COPY --from=shared-schemas /usr/src/packages/shared-schemas /usr/src/packages/shared-schemas
# Install web dependencies
COPY web/package*.json ./
RUN npm ci --include=dev
USER node
COPY web/ ./
CMD ["npm", "run", "dev"]


FROM base as citest
ENV NODE_ENV test
# Copy shared-schemas first
COPY --from=shared-schemas /usr/src/packages/shared-schemas /usr/src/packages/shared-schemas
# Install web dependencies
COPY web/package*.json ./
RUN npm ci --include=dev
USER node
COPY web/ ./
RUN npm run test

FROM base as lintcheck
ENV NODE_ENV ci
# Copy shared-schemas first
COPY --from=shared-schemas /usr/src/packages/shared-schemas /usr/src/packages/shared-schemas
# Install web dependencies
COPY web/package*.json ./
RUN npm ci --include=dev
#USER node
COPY web/ ./
RUN npm run lint


FROM base as proddeps
ENV NODE_ENV production
# Copy shared-schemas first
COPY --from=shared-schemas /usr/src/packages/shared-schemas /usr/src/packages/shared-schemas
# Install web dependencies
COPY web/package*.json ./
RUN npm ci --include=dev

FROM proddeps as prodbuild
COPY --from=proddeps /usr/src/app/node_modules ./node_modules
COPY --from=proddeps /usr/src/packages /usr/src/packages
COPY web/ ./
RUN npm run build
RUN npm prune --production

FROM base as prod
ENV NODE_ENV production
USER node
# Copy shared-schemas for runtime
COPY --from=prodbuild /usr/src/packages/shared-schemas /usr/src/packages/shared-schemas
COPY --from=prodbuild /usr/src/app/node_modules ./node_modules
COPY --from=prodbuild /usr/src/app/package.json ./package.json
COPY --from=prodbuild /usr/src/app/package-lock.json ./package-lock.json
COPY --from=prodbuild /usr/src/app/next.config.ts ./next.config.ts
COPY --from=prodbuild /usr/src/app/.next ./.next
COPY --from=prodbuild /usr/src/app/public ./public
CMD ["npm", "run", "start"]

