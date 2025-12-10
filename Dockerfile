# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy local packages first so npm install can find them
COPY local_packages ./local_packages
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Need to copy this because the package is a symlink!
COPY --from=build /app/local_packages ./local_packages

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/shared ./shared

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"]
