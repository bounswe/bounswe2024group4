import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
load_dotenv()

# Get service account credentials from environment variables
service_account_info = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
}

# Initialize Firebase Admin SDK (only initialize if not already initialized)
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_info)
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()