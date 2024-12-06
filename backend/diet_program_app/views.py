from django.shortcuts import render
import json
from views import Meal
# Create your views here.
def create_meal(request):
    if request.method == 'POST':
        # create a new meal
        user = request.user
        data = json.loads(request.body)
        meal_name = data['meal_name']
        foods = data['foods']
        # create a new meal
        # meal = Meal.objects.create(meal_name=meal_name, created_by=user)
