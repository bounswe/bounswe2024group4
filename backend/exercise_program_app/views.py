import requests
from .models import Workout, Exercise, ExerciseInstance, WeeklyProgram, WorkoutDay, WorkoutLog, ExerciseLog
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime  # Add this import
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import create_program_schema, log_workout_schema, get_exercises_schema, workout_program_schema, rate_workout_schema, get_workout_by_id_schema, create_exercise_superuser_schema
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from user_auth_app.models import User
from datetime import datetime
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from datetime import datetime
from fitness_project.firebase import db
from firebase_admin import firestore



@swagger_auto_schema(method='get', **get_exercises_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def get_exercises(request):
    if request.method == 'GET':
        try:
            muscle = request.GET.get('muscle')
            url = f'https://api.api-ninjas.com/v1/exercises?muscle={muscle}'
            response = requests.get(url, headers={'X-Api-Key': os.getenv('EXERCISES_API_KEY')})
            # if response.status_code == 200:
            exercises = response.json()      # response is a list of exercises

            database_exercises = ExerciseInstance.objects.all()

            exercises = exercises + list(database_exercises.values())
            return JsonResponse(exercises, safe=False, status=response.status_code)

            # else:
                # return JsonResponse({'error': 'Could not retrieve exercises'}, status=response.status_code)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=response.status_code)


@swagger_auto_schema(method='post', **workout_program_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def workout_program(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            workout_name = data.get('workout_name')
            exercises = data.get('exercises', [])

            if not workout_name:
                return JsonResponse({'error': 'workout_name is required'}, status=400)
            if not exercises:
                return JsonResponse({'error': 'exercises are required'}, status=400)

            user = request.user  # Get user from token authentication

            workout = Workout(
                workout_name=workout_name,
                created_by=user
            )
            workout.save()
            
            for exercise_data in exercises:
                exercise = Exercise(
                    workout=workout,
                    type=exercise_data['type'],
                    name=exercise_data['name'],
                    muscle=exercise_data['muscle'],
                    equipment=exercise_data['equipment'],
                    difficulty=exercise_data['difficulty'],
                    instruction=exercise_data['instruction'],
                    sets=int(exercise_data['sets']),
                    reps=int(exercise_data['reps']),
                )
                exercise.save()

            # Log the activity
            activity_data = {
                "actor": {
                    "isSuperUser": user.is_superuser,
                    "id": user.user_id,
                    "name": user.username
                },
                "type": "Create",
                "object": {
                    "type": "Workout",
                    "id": workout.workout_id,
                    "name": workout.workout_name,
                    "exerciseCount": len(exercises),
                    "exercises": [{
                        "type": ex['type'],
                        "name": ex['name'],
                        "muscle": ex['muscle'],
                        "sets": ex['sets'],
                        "reps": ex['reps']
                    } for ex in exercises]
                },
                "summary": f"{user.username} created a new workout program '{workout_name}'"
            }

            # Add to Firestore
            db.collection("workoutActivities").add({
                **activity_data,
                "@context": "https://www.w3.org/ns/activitystreams",
                "published": datetime.utcnow().isoformat()
            })

            return JsonResponse({
                'message': 'Workout program created successfully',
                'workout_id': workout.workout_id,
                'workout_name': workout.workout_name,
                'created_by': workout.created_by.username,
                'exercises_count': len(exercises)
            }, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return render(request, 'workout_program.html')


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_workout_activities(request):
    try:
  
        # Start with base query
        activities_ref = db.collection('workoutActivities')
        query = activities_ref
            
        # Order by published date descending (newest first)
        query = query.order_by('published', direction=firestore.Query.DESCENDING)
        
  
        # Execute query
        activities = []
        for doc in query.stream():
            activity_data = doc.to_dict()
            # Add document ID to the response
            activity_data['id'] = doc.id
            activities.append(activity_data)
        
        return JsonResponse({
            'count': len(activities),
            'activities': activities
        }, safe=False, status=200)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def delete_workout_by_id(request, workout_id):
    if request.method == 'DELETE':
        try:
            user = request.user  # Get user from token authentication
            workout = Workout.objects.get(workout_id=workout_id)

            # Check if the user is the creator of the workout
            if workout.created_by != user:
                return JsonResponse({'error': 'You are not authorized to delete this workout'}, status=403)

            # Delete the workout
            workout_name = workout.workout_name  # Store name for activity log before deletion
            workout.delete()


            return JsonResponse({'message': 'Workout deleted successfully'}, status=200)

        except Workout.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='post', **rate_workout_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def rate_workout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            workout_id = data.get('workout_id')
            rating = float(data.get('rating'))
            workout = Workout.objects.get(workout_id=workout_id)
            user = workout.created_by
 
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)

            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)

            # Update workout rating
            workout.rating = (workout.rating * workout.rating_count + rating) / (workout.rating_count + 1)
            workout.rating_count += 1
            workout.save()

            # Update user rating
            if user.workout_rating_count == 0:
                user.workout_rating = rating
            else:
                user.workout_rating = (user.workout_rating * user.workout_rating_count + rating) / (user.workout_rating_count + 1)
            user.workout_rating_count += 1

            # Update user score
            if user.workout_rating_count + user.meal_rating_count > 0:
                user.score = (user.meal_rating * user.meal_rating_count + user.workout_rating * user.workout_rating_count) / (user.meal_rating_count + user.workout_rating_count)
                user.save()
            user.check_super_member()
            user.save()

            return JsonResponse({'message': 'Rating submitted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='get', **get_workout_by_id_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_workout_by_id(request, workout_id):
    try:
        workout = Workout.objects.get(workout_id=workout_id)
        return JsonResponse({
            'id': workout.workout_id,
            'workout_name': workout.workout_name,
            'created_by': workout.created_by.username,
            'rating': workout.rating,
            'rating_count': workout.rating_count,
            'exercises': list(workout.exercise_set.values(
                'type', 'name', 'muscle', 'equipment', 
                'instruction', 'sets', 'reps'
            ))
        }, status=200)
    except Workout.DoesNotExist:
        return JsonResponse({'error': 'Workout not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@swagger_auto_schema(method='get', **get_workout_by_id_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_workouts(request):
    if request.method == 'GET':
        try:
            # Get user from token authentication
            user = request.user

            # Get all workouts created by this userx
            workouts = Workout.objects.filter(created_by=user)

            # Format the response
            workouts_data = [
                {
                    'id': workout.workout_id,
                    'workout_name': workout.workout_name,
                    'created_by': workout.created_by.username,
                    'rating': workout.rating,
                    'rating_count': workout.rating_count,
                    'exercises': list(workout.exercise_set.values(
                        'type', 'name', 'muscle', 'equipment', 'difficulty', 'instruction', 'sets', 'reps'
                    ))
                }
                for workout in workouts
            ]
            return JsonResponse(workouts_data, safe=False, status=200)
        except Exception as e:
            print(f'Exception: {str(e)}')
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def toggle_bookmark_workout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            workout_id = data.get('workout_id')

            if not workout_id:
                return JsonResponse({'error': 'workout_id is required'}, status=400)

            user = request.user  # Get user from token authentication
            workout = Workout.objects.get(workout_id=workout_id)

            # Toggle bookmark
            if workout in user.bookmarked_workouts.all():
                user.bookmarked_workouts.remove(workout)  # Remove bookmark
                message = 'Bookmark removed'
            else:
                user.bookmarked_workouts.add(workout)  # Add bookmark
                message = 'Bookmark added'

            return JsonResponse({'message': message, 'workout_id': workout_id, 'username': user.username}, status=200)
        except Workout.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_bookmarked_workouts(request):
    if request.method == 'GET':
        try:
            # Get user from token authentication
            user = request.user

            # Get all bookmarked workouts for this user
            bookmarked_workouts = user.bookmarked_workouts.all()

            # Format the response
            workouts_data = [
                {
                    'id': workout.workout_id,
                    'workout_name': workout.workout_name,
                    'created_by': workout.created_by.username,
                    'rating': workout.rating,
                    'rating_count': workout.rating_count
                }
                for workout in bookmarked_workouts
            ]
            return JsonResponse(workouts_data, safe=False, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='post', **create_program_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_program(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            if not data.get('workouts'):
                return error_response('No workouts provided')

            # Get user from token authentication
            user = request.user
            if not user:
                return error_response('No user found')

            program = WeeklyProgram.objects.create(
                days_per_week=len(data['workouts']),
                created_by=user
            )
            
            try:
                for day_num, workout_id in data['workouts'].items():
                    workout = validate_workout(workout_id)
                    WorkoutDay.objects.create(
                        program=program,
                        day_of_week=int(day_num),
                        workout=workout
                    )
            except Exception as e:
                program.delete()
                return error_response(str(e))
            
            return success_response({
                'program_id': program.program_id,
                'user': get_user_data(user),
                'days': [{
                    'day': day.get_day_of_week_display(),
                    'workout': {
                        'id': day.workout.workout_id,
                        'name': day.workout.workout_name
                    }
                } for day in program.workout_days.all().order_by('day_of_week')]
            })
            
        except Exception as e:
            return error_response(str(e))
    else:
        workouts = Workout.objects.all()
        return render(request, 'create_program.html', {'workouts': workouts})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_programs(request):
    if request.method == 'GET':
        try:
            # Get user from token authentication
            user = request.user
            
            # Get all programs created by this user
            programs = WeeklyProgram.objects.filter(created_by=user)
            
            # Format the response
            programs_data = []
            for program in programs:
                workout_days = WorkoutDay.objects.filter(program=program).order_by('day_of_week')
                
                program_data = {
                    'program_id': program.program_id,
                    'days_per_week': program.days_per_week,
                    'created_by': {
                        'user_id': program.created_by.user_id,
                        'username': program.created_by.username
                    },
                    'workouts': [{
                        'day': day.get_day_of_week_display(),
                        'day_number': day.day_of_week,
                        'workout': {
                            'workout_id': day.workout.workout_id,
                            'workout_name': day.workout.workout_name,
                            'exercises': [{
                                'exercise_id': exercise.exercise_id,
                                'name': exercise.name,
                                'type': exercise.type,
                                'muscle': exercise.muscle,
                                'equipment': exercise.equipment,
                                'difficulty': exercise.difficulty,
                                'instruction': exercise.instruction,
                                'sets': exercise.sets,
                                'reps': exercise.reps
                            } for exercise in Exercise.objects.filter(workout=day.workout)]
                        }
                    } for day in workout_days]
                }
                programs_data.append(program_data)
            
            return JsonResponse(programs_data, safe=False, status=200)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)


#Log a workout and exercises and their statuses inside it
@swagger_auto_schema(method='post', **log_workout_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def workout_log(request, workout_id):
    try:
        data = json.loads(request.body)
        user = request.user
        workout = get_object_or_404(Workout, workout_id=workout_id)
        
        # Handle date
        date_str = data.get('date')
        if date_str:
            try:
                log_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
        else:
            log_date = timezone.now().date()
            
        # Create or get workout log
        workout_log, created = WorkoutLog.objects.get_or_create(
            workout=workout,
            user=user,
            date=log_date
        )
        
        # Update workout completion status
        if 'workout_completed' in data:
            workout_log.is_completed = data['workout_completed']
            workout_log.save()
            
        # Handle exercise logs
        if 'exercises' in data:
            exercise_ids = [ex['exercise_id'] for ex in data['exercises']]
            workout_exercises = Exercise.objects.filter(
                workout=workout, 
                exercise_id__in=exercise_ids
            )
            
            if len(workout_exercises) != len(exercise_ids):
                return JsonResponse({'error': 'Some exercises do not belong to this workout'}, status=400)
                
            for exercise_data in data['exercises']:
                exercise = workout_exercises.get(exercise_id=exercise_data['exercise_id'])
                exercise_log, _ = ExerciseLog.objects.get_or_create(
                    workout_log=workout_log,
                    exercise=exercise
                )
                
                # Update exercise log with new fields
                exercise_log.is_completed = exercise_data.get('is_completed', False)
                exercise_log.actual_sets = exercise_data.get('actual_sets', 0)
                exercise_log.actual_reps = exercise_data.get('actual_reps', 0)
                exercise_log.weight = exercise_data.get('weight', 0.0)
                exercise_log.save()

        # Prepare response data
        response_data = {
            'message': 'Workout log updated successfully',
            'workout_id': workout.workout_id,
            'workout_name': workout.workout_name,
            'date': log_date.strftime('%Y-%m-%d'),
            'is_completed': workout_log.is_completed,
            'exercises': [{
                'exercise_id': log.exercise.exercise_id,
                'name': log.exercise.name,
                'is_completed': log.is_completed,
                'actual_sets': log.actual_sets,
                'actual_reps': log.actual_reps,
                'weight': log.weight,
                'target_sets': log.exercise.sets,
                'target_reps': log.exercise.reps
            } for log in workout_log.exercise_logs.all()]
        }

        # Log the activity to Firebase
        try:
            activity_data = {
                "actor": {
                    "isSuperUser": user.is_superuser,
                    "id": user.user_id,
                    "name": user.username
                },
                "type": "Log",
                "object": {
                    "type": "WorkoutLog",
                    "id": workout_log.log_id,
                    "workout": {
                        "id": workout.workout_id,
                        "name": workout.workout_name
                    },
                    "date": log_date.strftime('%Y-%m-%d'),
                    "is_completed": workout_log.is_completed,
                    "exercises": [{
                        "id": log.exercise.exercise_id,
                        "name": log.exercise.name,
                        "type": log.exercise.type,
                        "muscle": log.exercise.muscle,
                        "is_completed": log.is_completed,
                        "performance": {
                            "actual_sets": log.actual_sets,
                            "actual_reps": log.actual_reps,
                            "weight": log.weight,
                            "target_sets": log.exercise.sets,
                            "target_reps": log.exercise.reps
                        }
                    } for log in workout_log.exercise_logs.all()]
                },
                "summary": f"{user.username} logged their '{workout.workout_name}' workout"
            }

            # Add to Firestore
            db.collection("workoutLogActivities").add({
                **activity_data,
                "@context": "https://www.w3.org/ns/activitystreams",
                "published": datetime.utcnow().isoformat()
            })

        except Exception as e:
            # Log the error but don't fail the request
            print(f"Firebase logging failed: {str(e)}")

        return JsonResponse(response_data)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_workout_log_activities(request):
    try:
        # Start with base query
        activities_ref = db.collection('workoutLogActivities')
        query = activities_ref
            
        # Order by published date descending (newest first)
        query = query.order_by('published', direction=firestore.Query.DESCENDING)
        
        # Execute query
        activities = []
        for doc in query.stream():
            activity_data = doc.to_dict()
            # Add document ID to the response
            activity_data['id'] = doc.id
            activities.append(activity_data)
        
        return JsonResponse({
            'count': len(activities),
            'activities': activities
        }, safe=False, status=200)
        
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_workout_logs(request):
    if request.method == 'GET':
        try:
            # Get user from token authentication
            user = request.user
            
            # Get all workout logs for this user
            workout_logs = WorkoutLog.objects.filter(user=user).order_by('-date')
            
            # Format the response
            logs_data = []
            for log in workout_logs:
                # Get all exercise logs for this workout log
                exercise_logs = ExerciseLog.objects.filter(workout_log=log)
                
                log_data = {
                    'log_id': log.log_id,
                    'date': log.date.strftime('%Y-%m-%d'),
                    'is_completed': log.is_completed,
                    'workout': {
                        'workout_id': log.workout.workout_id,
                        'workout_name': log.workout.workout_name
                    },
                    'exercises': [{
                        'exercise_id': ex_log.exercise.exercise_id,
                        'name': ex_log.exercise.name,
                        'type': ex_log.exercise.type,
                        'muscle': ex_log.exercise.muscle,
                        'equipment': ex_log.exercise.equipment,
                        'difficulty': ex_log.exercise.difficulty,
                        'instruction': ex_log.exercise.instruction,
                        # Target values from original workout
                        'target_sets': ex_log.exercise.sets,
                        'target_reps': ex_log.exercise.reps,
                        # Actual performed values
                        'actual_sets': ex_log.actual_sets,
                        'actual_reps': ex_log.actual_reps,
                        'weight': ex_log.weight,
                        'is_completed': ex_log.is_completed,
                        'last_updated': ex_log.updated_at.strftime('%Y-%m-%d %H:%M:%S') if ex_log.updated_at else None
                    } for ex_log in exercise_logs]
                }
                logs_data.append(log_data)
            
            return JsonResponse(logs_data, safe=False, status=200)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='post', **create_exercise_superuser_schema)
@api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
def create_exercise_superuser(request):
    if request.method == 'POST':
        user = request.user
        data = json.loads(request.body)
        type = data['type']
        name = data['name']
        muscle = data['muscle']
        equipment = data['equipment']
        difficulty = data['difficulty']
        instruction = data['instruction']
        
        muscle_options = [
            'abdominals',
            # 'abductors',
            # 'adductors',
            'biceps',
            'calves',
            'chest',
            # 'forearms',
            'glutes',
            'hamstrings',
            'lats',
            'lower_back',
            # 'middle_back',
            # 'neck',
            'quadriceps',
            'traps',
            'triceps',
            'shoulders',
            'cardio'
        ]

        difficulty_options = ['beginner', 'intermediate', 'expert']

        type_options = ['cardio', 'olympic_weightlifting', 'plyometrics', 'powerlifting', 'strength', 'stretching', 'strongman']
        
        if not user.is_superuser:
            return JsonResponse({'error': 'You are not authorized to create exercises'}, status=403)
        elif muscle.lower() not in muscle_options:
            return JsonResponse({'error': 'Invalid muscle type'}, status=400)
        elif difficulty.lower() not in difficulty_options:
            return JsonResponse({'error': 'Invalid difficulty level'}, status=400)
        elif type.lower() not in type_options:
            return JsonResponse({'error': 'Invalid exercise type'}, status=400)
        else:
            exercise = ExerciseInstance(
                type=type,
                name=name,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instruction=instruction,
            )
            exercise.save()
            return JsonResponse({'message': 'Exercise created successfully'}, status=201)            
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


#Other functions

def error_response(message, status=400):
    return JsonResponse({
        'status': 'error',
        'message': message
    }, status=status)

def success_response(data):
    return JsonResponse({
        'status': 'success',
        **data
    })

def get_user_data(user):
    return {
        'id': user.user_id,
        'username': user.username,
        'email': user.email
    }

def validate_workout(workout_id):
    if not workout_id:
        raise ValueError('Workout ID is required')
    
    try:
        return Workout.objects.get(workout_id=workout_id)
    except Workout.DoesNotExist:
        raise ValueError(f'Workout with ID {workout_id} not found')

def validate_date(date_str):
    if not date_str:
        raise ValueError('Date is required')
    
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        raise ValueError('Invalid date format. Use YYYY-MM-DD')
