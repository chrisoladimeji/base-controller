# Use official Node.js image
FROM node:lts-slim AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn run build

# Use a smaller base image for the final production build
FROM node:lts-slim AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy only the production dependencies and compiled app from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
RUN yarn install --only=production
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the NestJS app
CMD ["node", "dist/main"]