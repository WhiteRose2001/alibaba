# ------------------------------------
# 1) Builder (install deps + build)
# ------------------------------------
FROM node:lts-bullseye AS builder
WORKDIR /alibaba-fiesta

# Copy only package files first
COPY package*.json ./

# Install all deps (including devDependencies)
RUN npm ci

# Copy the rest of the project
COPY . .

# Build frontend + backend
RUN npm run build


# ------------------------------------
# 2) Production image
# ------------------------------------
FROM node:lts-bullseye AS production
WORKDIR /alibaba-fiesta

# Copy only packages for installing production deps
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy ONLY the final build output (no TS, no src)
COPY --from=builder /alibaba-fiesta/dist ./dist

# Expose the port the alibaba-fiesta runs in
ENV DOCKER_PORT=9000
EXPOSE 9000

# Start command
CMD ["node", "dist/api/server/server.js"]
# or this
# CMD ["npm", "start"]
# or this (if you have PM2 as a dependency)
# CMD ["npx", "pm2-runtime", "dist/api/server/server.js"]
