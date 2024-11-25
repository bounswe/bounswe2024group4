from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
from your_project.firebase import db  # Import Firestore client

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
    if request.method == 'GET':
        try:
            activity_type = request.GET.get("type")
            actor_id = request.GET.get("actor_id")

            # Build Firestore query
            query = db.collection("activities")
            if activity_type:
                query = query.where("type", "==", activity_type)
            if actor_id:
                query = query.where("actor.id", "==", actor_id)

            activities = [doc.to_dict() for doc in query.stream()]

            return JsonResponse(activities, safe=False, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)
