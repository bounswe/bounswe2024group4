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

FIREBASE_TYPE="service_account"
FIREBASE_PROJECT_ID="cmpe451-group4-2024"
FIREBASE_PRIVATE_KEY_ID="02acb029325a07297ea2431ccf4e44fd36ed8da8"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCPMIIdQNo8KlJO\n/+Cd99lxD2tcs7i396+wqy9zQn/CrlGZxXkWwvJ8cWmZKE4PLUGUFDrSZKR3z8tL\nY/HPywfXycQ8oXQHrj2Hx73DG2YJoj73lwSYyXT+G8uXvDQL8V6fUyTJ5g9yfp8h\nI3upGz76NHgVQYyyRAJrascgqN3zENc8MfDSwJwuOtAne7offsJXafrN7+kQw8uR\n0hRdG25CwDERIrfOAgKbJsiDX9jqNkwY9OItsRzfdjPAXNToZ4mvjwXCHZaWZKqA\n/ADeeD14smn/74yVmGc5XL4gwFHcrjV8P0Jh9AUO/+sxBSRRYcXbEHffOtUiC0To\nblVuHO/nAgMBAAECggEAB2yIIOGNaLD32B4ewVUp4j/etnPTZnQCZgiiHhNuRPCj\nzQy2uAFLvQiZfulFKGoVkqQv3o7jeU2XqHHnBizsXBOBrkESuOYF5t9qZwGP9ONQ\nHEDDHY07mLcyz/9GiL373j5B072VXHLUzk0k94IXOrXz6eo4ByaAJGo1wJ6j9bR8\ndjg34JdVXZFFzam2iBJVQ0p36s24NTzTRqDdU+59qp3ttqDMiSgHuwyEhx2YUYft\n7qmuU2kMo8HqoHBiEiOH8N5zsooMUGTYWNx13RLHOoKueuFH9v7dOlXMr4+ZZmye\ntoA17x6pdUMvkhqb4hSVudZLxV54BBlChoMyrRWmEQKBgQDE9BENenl2GgbGxrcn\nn6IxM6UufgE7QIDAN87oQwyHEWCkLiGxyW02y3xrgVCtVJR6f0hxEM1a1a1njTTt\nIqeMd6rNXNWNOIYObK5ms/Qg2S3n9y5h8laopHr7ZVOHnZmzCbhh/9UA4q3nU7ug\nao1PqVfXJwv6alWXwPVbYbEQ0QKBgQC6HiCnnTLguk+76udZlKxgYKBmgatiQfLM\nSZXH6+7p4ca2Rk1S3mTEd5DmYbXEujyMchid500/BTMNQJagD8O0eCpGSgMeVLBJ\ng1UDjM9TAT2/rFwWDnEYI5j80LHblJzjbowOq5f6NhTKcMaLRVMYAlxEYIdZwmzI\nUQs0ztnjNwKBgB/uNcmKnqCADbMySkVZQxFY/yGvegGiLn17Tscm/6PyNEnJ1Nqe\n/l7Q1KYVPAAt4ziM5DC4eaKNW+Sa5wa/BIzoZb+Pmmufy1QRWKD78ctVinS+BT4J\n7PTAXdPeFJG7Ak0deVAiCuVu2qTTVWrne2t71+rgwLdjf+bveJfNGcjRAoGBAKb3\nKiJUIvV6DtetV1iEyNM5PAxZnY9rTE66YNVWMiG9OxAAJ5QFEO8zuFkFJRTUYkc4\ngB8ABstXdcIYxEfZfJ8lAf/Gm9+U6AU6/YROyRtUzLlr/byHviuCm9eJvVUYkFpz\nrM/oXlHIPISUAXmlenLagz2QPzxl8EMQeXYpb0ynAoGBAIvkFg4MwjcoXP1F9UsY\nOBBAuRtSIMgdPtMHbs0YMSvRoiHIRV5glbUy2Jk8wiepgtWWZ7AuFHqdXOZ/iwcI\naANuC8uP735wFsB9mM8aLBcXgTuPSoKE0H8STpRNkT02tyqEuzfrojfHJXgDh4Wz\na2gqJlcVq0Fe/kTaELQLz33v\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-dzl72@cmpe451-group4-2024.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="116753199169492863161"
FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dzl72%40cmpe451-group4-2024.iam.gserviceaccount.com"
FIREBASE_UNIVERSE_DOMAIN="googleapis.com"


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