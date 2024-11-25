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
from swagger_docs.swagger import create_program_schema, log_workout_schema, get_exercises_schema, workout_program_schema, rate_workout_schema, get_workout_by_id_schema
from rest_framework.decorators import api_view
from user_auth_app.models import User
from datetime import datetime
from django.utils import timezone


@swagger_auto_schema(method='get', **get_exercises_schema)
@api_view(['GET'])
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



#@swagger_auto_schema(method='post', **workout_program_schema)
#@api_view(['POST'])
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
            # user = User.objects.first()
            # user = request.user
            user = User.objects.get(username=data.get('username'))
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
                    instruction=exercise_data['instruction'],
                    sets=exercise_data['sets'],
                    reps=exercise_data['reps'],
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


@csrf_exempt
def delete_workout_by_id(request, workout_id):
    if request.method == 'DELETE':
        try:
            # Get the username from the request body (or headers if preferred)
            data = json.loads(request.body)
            username = data.get('username')

            if not username:
                return JsonResponse({'error': 'username is required'}, status=400)

            user = User.objects.get(username=username)
            workout = Workout.objects.get(workout_id=workout_id)

            # Check if the user is the creator of the workout
            if workout.created_by != user:
                return JsonResponse({'error': 'You are not authorized to delete this workout'}, status=403)

            # Delete the workout
            workout.delete()
            return JsonResponse({'message': 'Workout deleted successfully'}, status=200)

        except Workout.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@swagger_auto_schema(method='post', **rate_workout_schema)
@api_view(['POST'])
@csrf_exempt
def rate_workout(request):
    if request.method == 'POST':
        try:
            workout_id = request.data.get('workout_id')
            rating = float(request.data.get('rating'))
            username = request.GET.get('username')
            user = User.objects.get(username=username)
 
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)

            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)

            workout = Workout.objects.get(workout_id=workout_id)
            workout.rating = (workout.rating * workout.rating_count + rating) / (workout.rating_count + 1)
            workout.rating_count += 1
            workout.save()

            user.workout_rating = (user.workout_rating * user.workout_rating_count + rating) / (user.workout_rating_count + 1)
            user.workout_rating_count += 1
            user.save()

            return JsonResponse({'message': 'Rating submitted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='get', **get_workout_by_id_schema)
@api_view(['GET'])
@csrf_exempt
def get_workout_by_id(request, workout_id):
    if request.method == 'GET':
        try:
            workout = Workout.objects.get(workout_id=workout_id)
            workout_data = {
                'id': workout.workout_id,
                'workout_name': workout.workout_name,
                'created_by': workout.created_by.username,  # This should work now
                'rating': workout.rating,
                'rating_count': workout.rating_count,
                'exercises': list(workout.exercise_set.values('type', 'name', 'muscle', 'equipment', 'instruction', 'sets', 'reps', 'exercise_id'))
            }
            return JsonResponse(workout_data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='get', **get_workout_by_id_schema)
@api_view(['GET'])
@csrf_exempt
def get_workouts_by_username(request):
    if request.method == 'GET':
        try:
            # Get the username from query parameters
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'username query parameter is required'}, status=400)

            # Get the user by username
            user = User.objects.get(username=username)

            # Get all workouts created by this user
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
                        'type', 'name', 'muscle', 'equipment', 'instruction', 'sets', 'reps'
                    ))
                }
                for workout in workouts
            ]
            return JsonResponse(workouts_data, safe=False, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            print(f'Exception: {str(e)}')
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)




@csrf_exempt
def toggle_bookmark_workout(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            workout_id = data.get('workout_id')

            if not username or not workout_id:
                return JsonResponse({'error': 'username and workout_id are required'}, status=400)

            user = User.objects.get(username=username)
            workout = Workout.objects.get(workout_id=workout_id)

            # Toggle bookmark
            if workout in user.bookmarked_workouts.all():
                user.bookmarked_workouts.remove(workout)  # Remove bookmark
                message = 'Bookmark removed'
            else:
                user.bookmarked_workouts.add(workout)  # Add bookmark
                message = 'Bookmark added'

            return JsonResponse({'message': message, 'workout_id': workout_id, 'username': username}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Workout.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



def get_bookmarked_workouts(request):
    if request.method == 'GET':
        try:
            # Get the username from query parameters
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'username query parameter is required'}, status=400)

            # Get the user by username
            user = User.objects.get(username=username)

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
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



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
# def get_programs_by_user_id(request, user_id):
def get_programs_by_username(request):
    if request.method == 'GET':
        try:
            # Get the username from query parameters
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'username query parameter is required'}, status=400)

            # Get the user by username
            user = User.objects.get(username=username)
            
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
                                'instruction': exercise.instruction,
                                'sets': exercise.sets,
                                'reps': exercise.reps
                            } for exercise in Exercise.objects.filter(workout=day.workout)]
                        }
                    } for day in workout_days]
                }
                programs_data.append(program_data)
            
            return JsonResponse(programs_data, safe=False, status=200)
            
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)


#Log a workout and exercises and their statuses inside it
@csrf_exempt
#@login_required
def workout_log(request, workout_id):
    #Get method is unnecessary, but it's here for testing purposes
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
                    'sets': exercise.sets,
                    'reps': exercise.reps,
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


def get_workout_logs_by_username(request):
    if request.method == 'GET':
        try:
            # Get the username from query parameters
            username = request.GET.get('username')
            if not username:
                return JsonResponse({'error': 'username query parameter is required'}, status=400)

            # Get the user by username
            user = User.objects.get(username=username)
            
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
                        'instruction': ex_log.exercise.instruction,
                        'sets': ex_log.exercise.sets,
                        'reps': ex_log.exercise.reps,
                        'is_completed': ex_log.is_completed
                    } for ex_log in exercise_logs]
                }
                logs_data.append(log_data)
            
            return JsonResponse(logs_data, safe=False, status=200)
            
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
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
