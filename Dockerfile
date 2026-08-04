# --- Build stage ---
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Apero CMS credentials are inlined into the client bundle at build time
# (this is a static SPA — there is no server to keep them secret behind).
# Pass them as build args, e.g.:
#   docker build \
#     --build-arg VITE_APERO_API_URL=https://aperocms.com/graphql \
#     --build-arg VITE_APERO_API_KEY=apero_xxx \
#     --build-arg VITE_APERO_PROJECT_ID=328c0c59-16eb-4c47-bcdb-5d5f6bfb0e92 \
#     -t portfolio .
ARG VITE_APERO_API_URL
ARG VITE_APERO_API_KEY
ARG VITE_APERO_PROJECT_ID
ENV VITE_APERO_API_URL=$VITE_APERO_API_URL
ENV VITE_APERO_API_KEY=$VITE_APERO_API_KEY
ENV VITE_APERO_PROJECT_ID=$VITE_APERO_PROJECT_ID

RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
