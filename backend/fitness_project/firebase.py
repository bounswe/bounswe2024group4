import os
import firebase_admin
from firebase_admin import credentials, firestore


# Path to the Service Account Key file
SERVICE_ACCOUNT_KEY = os.path.join(os.path.dirname(__file__), '../secrets/serviceAccountKey.json')

# Initialize Firebase Admin SDK (only initialize if not already initialized)
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY)
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()
