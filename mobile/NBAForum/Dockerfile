# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package*.json yarn.lock ./

# Install dependencies including expo-cli
RUN npm install -g expo-cli && npm install -g npm@latest

# Copy the entire app directory to the working directory
COPY . .

# Expose the necessary ports for Expo
EXPOSE 8081

# Run the app with Expo start
CMD ["expo", "start"]
