import requests
from .models import Workout, Exercise
from django.http import JsonResponse
import os

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
        
def rate_workout(request):
    if request.method == 'POST':
        try:
            workout_id = request.POST.get('workout_id')
            rating = float(request.POST.get('rating'))
            user = request.user

            workout = Workout.objects.get(id=workout_id)
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