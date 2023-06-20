# Backend - Python Flask
FROM python:3.9-slim-buster as backend

# Set the working directory in the container
WORKDIR /app/backend

# Install backend dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend server with a production WSGI server
CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5000", "--timeout", "600"]