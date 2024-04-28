# Backend Development

## How to Run with Docker

### Prerequisites

- Docker
  
### Steps

- 1. Clone the repository

```bash
git clone
```

- 2. Change directory to the project's backend directory

```bash
cd ./bounswe2024group4/backend
```

- 3. Create a `.env` file in the `./backend` directory and add the following environment variables

```bash
cp .env.example .env
```

- 4. Enter the values for the environment variables in the `.env` file:


You can use local credentials for development purposes.

- 4.b If you want to use local credentials, migrate the database

Run your MySQL server.

Then run the following commands to migrate the database

```bash
python manage.py makemigrations
python manage.py migrate
```

- 5. Install Docker and Docker Compose

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

- 6. Run the following command to start the backend server

```bash
docker-compose up
```

## How to Run Manually

We need to create a virtual environment and do all backend-related jobs inside that virtual environment.

```bash
# Change directory to the project's backend directory
cd ./bounswe2024group4/backend

# create a virtual environment

## On bash/zsh shells (i.e., on macOS and the most of the Linux-based distros)
python3 -m venv venv

## On Windows
python -m venv venv

# Activate the virtual environment

## On bash/zsh shells (i.e., on macOS and the most of the Linux-based distros)
source ./venv/bin/activate

## On Windows
venv\Scripts\Activate.ps1 (Powershell)
venv\Scripts\activate.bat (cmd)
```

While initializing our project, we decided to use Python 3.12. So create your virtual environments accordingly.
You may want to take a look at [Python Documentation](https://docs.python.org/3/library/venv.html).

### Installations

Before starting development, we need to install all the requirements. Inside the `./backend` directory:

```bash
# Install requirements
pip install -r requirements.txt
```


```bash
# Install Django
pip install Django

# Install Django REST Framework
pip install djangorestframework
```

### Run the app

To check if everything is okay, try to run the Django project. Inside the `./backend` directory:

```bash
# Run the Django project server
python manage.py runserver
```

If you see a page without an error when you visit the URL in the terminal, which is similar to `http://127.0.0.1:8000`, your server works properly.

