# Backend Development

## How to Run Manually

After cloning the repo to our local, we need to create a virtual environment and do all backend-related jobs inside that virtual environment.
The manual running process has five steps: Cloning the repository, creating virtual environment, installing requirements, localizing the database and running.

### Cloning the repository

First you can choose where you want to clone the repository to (cd desktop/../..). Afterwards, on the terminal, you can use the following commands:

```bash
# Clone with SSH
git clone git@github.com:bounswe/bounswe2024group4.git

# Clone with HTTPS
git clone https://github.com/bounswe/bounswe2024group4.git

# Clone with GitHub CLI
gh repo clone bounswe/bounswe2024group4
```

For simplicity, you can also choose to open it with GitHub Desktop


### Creating virtual environment

This step is cruical for holding the required installations in a proper environment and use them:

```bash
# Choose a directory for creating the virtual environment
# You can choose to put it anywhere you want

# create a virtual environment

## On macOS and Linux
python3 -m venv venv

## On Windows
python -m venv venv

# Activate the virtual environment

## On macOS and Linux
source ./venv/bin/activate

## On Windows
venv\Scripts\Activate.ps1 (Powershell)
venv\Scripts\activate.bat (cmd)
```


### Installing requirements

After the activation of the virtual environment, you are ready for installing the required installations. From the requirements.txt file, you can check all the required installations for the project.
While your virtual environment is activated:

```bash
#Change directory to the project's backend directory
cd ./bounswe2024group4/backend

# Install requirements
pip install -r requirements.txt

# Install Django
pip install Django

# Install Django REST Framework
pip install djangorestframework
```
### Localizing the database
For the backend to work, you need to give your current information of your local mySQL database in the .env file:
```bash
DB_NAME=mydatabase
DB_USER=myuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=3306
```

### Running

To check if everything is okay, try to run the project. While you are still in the `./backend` directory:

```bash
# Run the Django project server
python manage.py runserver
```

If you see the url on the terminal without any error, it means the server works properly. You can visit `http://127.0.0.1:8000` to check the app!

