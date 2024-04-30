# Use an official Python runtime as a parent image
FROM python:3.12-slim-bullseye

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /backend_code

# Copy the requirements file into the container at /code
COPY backend/requirements.txt /backend_code/

# install dependencies for mysqlclient
RUN apt-get update && apt-get install -y pkg-config python3-dev default-libmysqlclient-dev build-essential

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /backend_code
COPY . /backend_code/

# Expose port 8000 to allow communication to/from server
EXPOSE 8000

# start server  
# CMD python manage.py runserver