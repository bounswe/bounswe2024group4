import requests
from user_auth_app.models import User
from .models import Workout, Exercise, ExerciseInstance, WeeklyProgram, WorkoutDay, WorkoutLog
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime  # Add this import
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import create_program_schema, log_workout_schema, get_exercises_schema
from rest_framework.decorators import api_view

@api_view(['GET'])
@swagger_auto_schema(**get_exercises_schema)
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
            workout_name = request.POST.get('workout_name')
            exercises = request.POST.get('exercises')
            data = json.loads(request.body)
            workout_name = data.get('workout_name')
            exercises = data.get('exercises', [])
            workout = Workout(workout_name=workout_name)

            if not workout_name:
                return JsonResponse({'error': 'workout_name is required'}, status=400)
            if not exercises:
                return JsonResponse({'error': 'exercises are required'}, status=400)

            # Get the first user for testing (you should use authenticated user in production)
            user = User.objects.first()
            # user = request.user
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)

            workout = Workout(
                workout_name=workout_name,
                created_by=user  # Add the user here
            )
            workout.save()
            for exercise in exercises:
                exercise = Exercise(workout=workout, type=exercise.type, name=exercise.name, muscle=exercise.muscle, equipment=exercise.equipment, instruction=exercise.instruction)

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
            # return render(request, 'workout_program.html')
            return JsonResponse({'message': 'Workout program created successfully'}, status=201)

            # return JsonResponse({
            #     'message': 'Workout program created successfully',
            #     'workout_id': workout.workout_id,
            #     'workout_name': workout.workout_name,
            #     'created_by': workout.created_by.username,
            #     'exercises_count': len(exercises)
            # }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)



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
@login_required
def create_program(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            if not data.get('workouts'):
                return error_response('No workouts provided')

            program = WeeklyProgram.objects.create(
                days_per_week=len(data['workouts']),
                created_by=request.user
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
                'user': get_user_data(request.user),
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
@login_required
def log_workout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Validate inputs
            workout = validate_workout(data.get('workout_id'))
            date_completed = validate_date(data.get('date'))
            
            # Check for existing log
            if WorkoutLog.objects.filter(
                user=request.user,
                date_completed=date_completed
            ).exists():
                return error_response(f'You already logged a workout for {date_completed}')
            
            # Create log
            log = WorkoutLog.objects.create(
                user=request.user,
                workout=workout,
                date_completed=date_completed
            )
            
            return success_response({
                'log_id': log.log_id,
                'user': get_user_data(request.user),
                'workout': {
                    'id': workout.workout_id,
                    'name': workout.workout_name
                },
                'date': date_completed.strftime('%Y-%m-%d')
            })
            
        except Exception as e:
            return error_response(str(e))
    else:
        workouts = Workout.objects.all()
        return render(request, 'log_workout.html', {'workouts': workouts})

        
@csrf_exempt
@login_required        
def rate_workout(request):
    if request.method == 'POST':
        try:
            workout_id = request.POST.get('workout_id')
            rating = float(request.POST.get('rating'))
            user = request.user

            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)

            workout = get_object_or_404(Workout, id=workout_id)
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
@login_required
def get_workout_by_id(request, workout_id):
    if request.method == 'GET':
        try:
            workout = get_object_or_404(Workout, id=workout_id)
            workout_data = {
                'id': workout.id,
                'workout_name': workout.workout_name,
                'created_by': workout.created_by.username,
                'rating': workout.rating,
                'rating_count': workout.rating_count,
                'exercises': list(workout.exercise_set.values('type', 'name', 'muscle', 'equipment', 'instruction'))
            }
            return JsonResponse(workout_data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@login_required
def get_workouts_by_user_id(request, user_id):
    if request.method == 'GET':
        try:
            workouts = Workout.objects.filter(created_by__id=user_id)
            workouts_data = [
                {
                    'id': workout.id,
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

