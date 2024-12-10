from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from fitness_project.firebase import db

@csrf_exempt
def log_activity(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            data["@context"] = "https://www.w3.org/ns/activitystreams"
            data["published"] = datetime.utcnow().isoformat()

            # Save to Firestore
            db.collection("activities").add(data)

            return JsonResponse({"message": "Activity logged successfully"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

def get_activities(request):
    """
    Retrieve activities from Firestore with optional filters: 'type' and 'actor_id'.
    """
    if request.method == 'GET':
        try:
            # Extract query parameters
            activity_type = request.GET.get("type")
            actor_id = request.GET.get("actor_id")

            # Build Firestore query dynamically
            query = db.collection("activities")

            # Add filters if they are provided
            if activity_type:
                query = query.where("type", "==", activity_type)
            if actor_id:
                query = query.where("actor.id", "==", actor_id)

            # Execute query and convert documents to dictionaries
            activities = []
            for doc in query.stream():
                activities.append(doc.to_dict())

            # Return the list of activities
            return JsonResponse(activities, safe=False, status=200)

        except firestore.FirestoreError as e:
            # Handle Firestore-specific errors
            return JsonResponse({"error": f"Firestore error: {str(e)}"}, status=500)
        except Exception as e:
            # Handle general errors
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=400)

    # Return error if the method is not GET
    return JsonResponse({"error": "Invalid request method"}, status=405)


def test_firestore_connection(request):
    try:
        # Add a test document to Firestore
        db.collection("test_collection").add({
            "message": "Firestore initialized successfully!",
            "status": "working"
        })
        return JsonResponse({"message": "Firestore connection successful!"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)