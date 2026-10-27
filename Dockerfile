# Multi-stage Dockerfile for HR Pulse Analytics

# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/Frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

# Install Backend dependencies
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm install --omit=dev

# Copy backend source
COPY Backend/ ./Backend/

# Copy built frontend from Stage 1 into Frontend/dist
COPY --from=frontend-builder /app/Frontend/dist ./Frontend/dist

WORKDIR /app/Backend
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
