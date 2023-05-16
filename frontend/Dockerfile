# Frontend - React
FROM node:16-alpine as frontend

# Set the working directory in the container
WORKDIR /app/frontend

# Install frontend dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend app
RUN npm run build

# Move build directory to a safe location
RUN mv build ../

# Install serve and run it on the build directory
RUN npm install -g serve
CMD ["serve", "-s", "../build", "-l", "3000"]

# Expose the frontend port
EXPOSE 3000