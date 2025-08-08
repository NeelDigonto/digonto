ARG NODE_VERSION=22.13.1
ARG NPM_TOKEN

FROM node:${NODE_VERSION}-bookworm as base
WORKDIR /app

# Build shared-schemas package
FROM base as shared-schemas
WORKDIR /packages/shared-schemas
COPY packages/shared-schemas/package*.json ./
RUN npm ci
COPY packages/shared-schemas/ ./
RUN npm run build

FROM base as dev
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN npm ci --include=dev
# USER node
COPY gateway/ ./
CMD ["npm", "run", "dev"]

FROM base as lintcheck
ENV NODE_ENV ci
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN npm ci --include=dev
#USER node
COPY gateway/ ./
RUN ["npm", "run", "lint:check"]

FROM base as formatcheck
ENV NODE_ENV ci
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN npm ci --include=dev
#USER node
COPY gateway/ ./
RUN ["npm", "run", "format:check"]

FROM base as devtest
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN npm ci --include=dev
#USER node
COPY gateway/ ./
CMD ["npm", "run", "dev:test"]

FROM base as citest
ENV NODE_ENV ci
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN echo $NPM_TOKEN && npm ci --include=dev
#USER node
COPY gateway/ ./
CMD ["npm", "run", "test"]


FROM base as proddeps
ENV NODE_ENV production
# Copy shared-schemas first
COPY --from=shared-schemas /packages/shared-schemas /packages/shared-schemas
# Install gateway dependencies
COPY gateway/package*.json ./
RUN npm ci --include=dev

FROM proddeps as prodbuild
COPY --from=proddeps /app/node_modules ./node_modules
COPY --from=proddeps /packages /packages
COPY gateway/ ./
RUN npm run build
RUN npm prune --production

FROM base as prod
ENV NODE_ENV production
USER node
# Copy shared-schemas for runtime
COPY --from=prodbuild /packages/shared-schemas /packages/shared-schemas
COPY --from=prodbuild /app/node_modules ./node_modules
COPY --from=prodbuild /app/package.json ./package.json
COPY --from=prodbuild /app/package-lock.json ./package-lock.json
COPY --from=prodbuild /app/dist ./dist
CMD ["npm", "run", "start"]