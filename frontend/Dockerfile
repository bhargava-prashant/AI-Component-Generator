# Stage 1: Build the React app
FROM node:18 as builder
WORKDIR /app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install dependencies (this will cache layers)
RUN npm install

# Copy the rest of the app files
COPY . .

# Build the React app (creates the production build)
RUN npm run build

# Stage 2: Serve the React app
FROM nginx:alpine as production

# Copy the built React app from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (nginx default port)
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
