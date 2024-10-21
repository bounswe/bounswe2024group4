## Prerequisites:
Before you begin, ensure the following software is installed on your system:

Python 3.9+
MySQL Server / MySQL Workbench (Ensure it's running)
pip (Python package installer)
virtualenv (Python virtual environment manager)
Homebrew (for macOS users) to install dependencies if needed.
Backend Setup Instructions

## Step 1: Clone the Repository
First, clone the project repository to your local machine.

git clone <your-repository-url>
cd <your-project-folder>/backend

## Step 2: Create a Virtual Environment
It’s a good practice to use a virtual environment to manage dependencies.


python3 -m venv venv
Activate the virtual environment:

macOS/Linux:

source venv/bin/activate
Windows:


venv\Scripts\activate

## Step 3: Install Dependencies
Ensure you are inside the backend directory and install the required packages from requirements.txt.


pip install -r requirements.txt
If you encounter any issues with mysqlclient, ensure MySQL libraries are installed and linked. Use the following commands if needed:


brew install mysql
brew link mysql --force

## Step 4: Set Up the Database
Open MySQL:


mysql -u root -p
Create the Database:


CREATE DATABASE fitness_app;
Grant Privileges (Optional):


GRANT ALL PRIVILEGES ON fitness_app.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

## Step 5: Create a .env File
Create a .env file inside the backend directory with the following content:


DB_NAME=fitness_app
DB_USER=root
DB_PASSWORD=<your_mysql_password>
DB_HOST=localhost
DB_PORT=3306
This file will store your database credentials and other sensitive information.

## Step 6: Configure Django Settings
Ensure your settings.py in the project folder is configured to use MySQL.

Add the following to DATABASES in settings.py:


import os
from dotenv import load_dotenv

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}

## Step 7: Apply Migrations
Run the following commands to create the necessary database tables:

python manage.py makemigrations
python manage.py migrate

## Step 8: Create a Superuser (Optional)
Create a superuser to access the Django admin interface:

python manage.py createsuperuser
Provide a username, email, and password when prompted.

## Step 9: Run the Development Server
Start the Django development server:


python manage.py runserver
Visit the following URL in your browser to verify the server is running:


http://127.0.0.1:8000/
Access the Django admin interface at:


http://127.0.0.1:8000/admin/

## Step 10: Troubleshooting
If mysqlclient fails to install:

Ensure MySQL libraries are installed:

brew install mysql
If needed, export environment variables:

export MYSQLCLIENT_CFLAGS="-I/usr/local/mysql/include"
export MYSQLCLIENT_LDFLAGS="-L/usr/local/mysql/lib"
If migrations are inconsistent:

Reset migrations:
python manage.py migrate <app_name> zero
python manage.py migrate