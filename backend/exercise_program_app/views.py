from django.shortcuts import render
import requests
from .models import Workout, Exercise, ExerciseInstance, WeeklyProgram, WorkoutDay
from django.http import JsonResponse
from dotenv import load_dotenv
import os
import json
from django.views.decorators.csrf import csrf_exempt


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



@csrf_exempt
def create_program(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        program = WeeklyProgram.objects.create(
            days_per_week=len(data['workouts'])
        )
        
        for day_num, workout_id in data['workouts'].items():
            WorkoutDay.objects.create(
                program=program,
                day_of_week=int(day_num),
                workout_id=workout_id
            )
            
        return JsonResponse({
            'status': 'success',
            'program_id': program.program_id,
            'days': [{
                'day': day.get_day_of_week_display(),
                'workout': day.workout.workout_name
            } for day in program.workout_days.all()]
        })
    else:
        workouts = Workout.objects.all()
        return render(request, 'create_program.html', {'workouts': workouts})