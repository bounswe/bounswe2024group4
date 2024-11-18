from django.shortcuts import render
import requests
from .models import Workout, Exercise, ExerciseInstance, WeeklyProgram, WorkoutDay, WorkoutLog
from django.http import JsonResponse
from dotenv import load_dotenv
import os
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime  # Add this import





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


def workout_program(request):
    if request.method == 'POST':
        try:
            workout_name = request.POST.get('workout_name')
            exercises = request.POST.get('exercises')
            workout = Workout(workout_name=workout_name)
            workout.save()
            for exercise in exercises:
                exercise = Exercise(workout=workout, type=exercise.type, name=exercise.name, muscle=exercise.muscle, equipment=exercise.equipment, instruction=exercise.instruction)
                exercise.save()
            # return render(request, 'workout_program.html')
            return JsonResponse({'message': 'Workout program created successfully'}, status=201)
        
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

@login_required
@csrf_exempt
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

@login_required
@csrf_exempt
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