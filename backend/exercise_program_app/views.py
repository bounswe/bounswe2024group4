import requests

from .models import Workout, Exercise, ExerciseInstance, WeeklyProgram, WorkoutDay, WorkoutLog, ExerciseLog
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime  # Add this import
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import create_program_schema, log_workout_schema
from rest_framework.decorators import api_view
from user_auth_app.models import User
from datetime import datetime
from django.utils import timezone


def get_exercises(request):
    if request.method == 'GET':
        try:
            muscle = request.GET.get('muscle')
            url = f'https://api.api-ninjas.com/v1/exercises?muscle={muscle}'
            response = requests.get(url, headers={'X-Api-Key': os.getenv('EXERCISES_API_KEY')})
            if response.status_code == 200:
                data = response.json()
                return JsonResponse(data, safe=False, status=200)
            else:
                return JsonResponse({'error': 'Could not retrieve exercises'}, status=response.status_code)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=response.status_code)


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

            # Get the first user for testing (you should use authenticated user in production)
            user = User.objects.first()
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)

            workout = Workout(
                workout_name=workout_name,
                created_by=user  # Add the user here
            )
            workout.save()

            for exercise_data in exercises:
                exercise = Exercise(
                    workout=workout,
                    type=exercise_data['type'],
                    name=exercise_data['name'],
                    muscle=exercise_data['muscle'],
                    equipment=exercise_data['equipment'],
                    instruction=exercise_data['instruction']
                )
                exercise.save()

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



@csrf_exempt
#@login_required
def create_program(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            if not data.get('workouts'):
                return error_response('No workouts provided')

            # Get the first user for testing
            user = User.objects.first()
            if not user:
                return error_response('No user found')

            program = WeeklyProgram.objects.create(
                days_per_week=len(data['workouts']),
                created_by=user  # Use the test user
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

@csrf_exempt
#@login_required
def get_programs_by_user_id(request, user_id):
    if request.method == 'GET':
        try:
            # Get all programs for this user
            programs = WeeklyProgram.objects.filter(created_by__user_id=user_id)
            
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
                                'instruction': exercise.instruction
                            } for exercise in Exercise.objects.filter(workout=day.workout)]
                        }
                    } for day in workout_days]
                }
                programs_data.append(program_data)
            
            return JsonResponse(programs_data, safe=False)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
#@login_required
def workout_log(request, workout_id):
    if request.method == 'GET':
        try:
            user = User.objects.first()
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)
            workout = get_object_or_404(Workout, workout_id=workout_id)
            workout_log = get_object_or_404(WorkoutLog, workout=workout)
            workout_exercises = Exercise.objects.filter(workout=workout)
            exercise_statuses = []
            for exercise in workout_exercises:
                exercise_log, _ = ExerciseLog.objects.get_or_create(
                    workout_log=workout_log,
                    exercise=exercise
                )
                exercise_statuses.append({
                    'exercise_id': exercise.exercise_id,
                    'name': exercise.name,
                    'type': exercise.type,
                    'muscle': exercise.muscle,
                    'equipment': exercise.equipment,
                    'instruction': exercise.instruction,
                    'is_completed': exercise_log.is_completed
                })
            return JsonResponse({
                'workout_id': workout.workout_id,
                'workout_name': workout.workout_name,
                'is_completed': workout_log.is_completed,
                'date': workout_log.date.strftime('%Y-%m-%d'),
                'exercises': exercise_statuses
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = User.objects.first()
            workout = get_object_or_404(Workout, workout_id=workout_id)
            date_str = data.get('date')
            if date_str:
                try:
                    log_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                except ValueError:
                    return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
            else:
                log_date = timezone.now().date()
            workout_log, created = WorkoutLog.objects.get_or_create(
                workout=workout,
                user=user,
                date=log_date
            )
            if 'workout_completed' in data:
                workout_log.is_completed = data['workout_completed']
                workout_log.save()
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
                    exercise_log.is_completed = exercise_data['is_completed']
                    exercise_log.save()
            return JsonResponse({
                'message': 'Workout log updated successfully',
                'workout_id': workout.workout_id,
                'workout_name': workout.workout_name,
                'is_completed': workout_log.is_completed,
                'exercises': [{
                    'exercise_id': log.exercise.exercise_id,
                    'name': log.exercise.name,
                    'is_completed': log.is_completed
                } for log in workout_log.exercise_logs.all()]
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
#@login_required        
def rate_workout(request):
    if request.method == 'POST':
        try:
            workout_id = request.POST.get('workout_id')
            rating = float(request.POST.get('rating'))
            
            # Get the first user for testing (remove this in production)
            user = User.objects.first()
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)

            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)

            workout = get_object_or_404(Workout, workout_id=workout_id)  # Changed from id to workout_id
            workout.rating = (workout.rating * workout.rating_count + rating) / (workout.rating_count + 1)
            workout.rating_count += 1
            workout.save()

            user.rating = (user.rating * user.rating_count + rating) / (user.rating_count + 1)
            user.rating_count += 1
            user.save()

            return JsonResponse({'message': 'Rating submitted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
#@login_required
def get_workout_by_id(request, workout_id):
    if request.method == 'GET':
        try:
            workout = get_object_or_404(Workout, workout_id=workout_id)
            workout_data = {
                'id': workout.workout_id,
                'workout_name': workout.workout_name,
                'created_by': workout.created_by.username,  # This should work now
                'rating': workout.rating,
                'rating_count': workout.rating_count,
                'exercises': list(workout.exercise_set.values('type', 'name', 'muscle', 'equipment', 'instruction', 'exercise_id'))
            }
            return JsonResponse(workout_data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
#@login_required
def get_workouts_by_user_id(request, user_id):
    if request.method == 'GET':
        try:
            workouts = Workout.objects.filter(created_by__user_id=user_id)
            workouts_data = [
                {
                    'id': workout.workout_id,
                    'workout_name': workout.workout_name,
                    'created_by': workout.created_by.username,
                    'rating': workout.rating,
                    'rating_count': workout.rating_count,
                    'exercises': list(workout.exercise_set.values('type', 'name', 'muscle', 'equipment', 'instruction'))
                }
                for workout in workouts
            ]
            return JsonResponse(workouts_data, safe=False, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

