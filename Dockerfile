# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first (important for caching layers)
COPY package.json package-lock.json ./

# Clean install dependencies
RUN rm -rf node_modules package-lock.json && npm install

# Copy the rest of the application files
COPY . .

# Expose the port that Vite runs on
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
