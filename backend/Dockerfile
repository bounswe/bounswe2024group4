# Use an official Python runtime as a parent image
FROM python:3.12-slim-bullseye

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /backend_code

# Copy the requirements file into the container
COPY requirements.txt /backend_code/

# Install system-level dependencies for mysqlclient and other required packages
RUN apt-get update && apt-get install -y pkg-config python3-dev default-libmysqlclient-dev build-essential

# Install Python dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files into the container
COPY . /backend_code/

# Expose port 8000 to allow communication to/from server
EXPOSE 8000

# Command to run the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
