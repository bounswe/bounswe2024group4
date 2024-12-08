import os
import requests
import json
from django.http import JsonResponse

from .models import Meal, Food
from user_auth_app.models import User

from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes

def create_meal(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # user = request.user
        user = User.objects.get(username=data.get('username'))
        meal_name = data.get('meal_name')
        foods = data.get('foods', [])
        
        for food in foods:
            meal.foods.add(food)
        meal.save()
        meal = Meal.objects.create(meal_name=meal_name, created_by=user)

        return JsonResponse({'message': 'Meal created successfully'}, status=201)
    return JsonResponse({'message': 'Invalid request'}, status=400)


def create_food_all(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        food_name = data.get('food_name')
        ingredients = data.get('ingredients')
        recipe_url = data.get('recipe_url')

        try:       # if the food is in the database
            food = Food.objects.get(name=food_name)
            return JsonResponse({
                'message': 'Food for meal found in the database',
                'food_id': food.food_id
                }, status=200)
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=400)

        except:    # if the food is not in the database
            try:   # if the food is in the API
                url = "https://api.edamam.com/api/nutrition-data"
                params = {
                    'app_id': os.getenv('EDAMAM_APP_ID'),
                    'app_key': os.getenv('EDAMAM_APP_KEY'),
                    'ingr': ingredients,
                }
                response = requests.get(url, params=params)
                data = response.json()

                nutrients = data.get('totalNutrients')

                food = Food.objects.create(
                    name=food_name,
                    ingredients=ingredients,
                    energ_kcal=f'{nutrients.get("ENERC_KCAL").get("quantity")} {nutrients.get("ENERC_KCAL").get("unit")}' if nutrients.get("ENERC_KCAL") else 'N/A',
                    fat=f'{nutrients.get("FAT").get("quantity")} {nutrients.get("FAT").get("unit")}' if nutrients.get("FAT") else 'N/A',
                    fat_saturated=f'{nutrients.get("FASAT").get("quantity")} {nutrients.get("FASAT").get("unit")}' if nutrients.get("FASAT") else 'N/A',
                    fat_trans=f'{nutrients.get("FATRN").get("quantity")} {nutrients.get("FATRN").get("unit")}' if nutrients.get("FATRN") else 'N/A',
                    carbo=f'{nutrients.get("CHOCDF").get("quantity")} {nutrients.get("CHOCDF").get("unit")}' if nutrients.get("CHOCDF") else 'N/A',
                    fiber=f'{nutrients.get("FIBTG").get("quantity")} {nutrients.get("FIBTG").get("unit")}' if nutrients.get("FIBTG") else 'N/A',
                    sugar=f'{nutrients.get("SUGAR").get("quantity")} {nutrients.get("SUGAR").get("unit")}' if nutrients.get("SUGAR") else 'N/A',
                    protein=f'{nutrients.get("PROCNT").get("quantity")} {nutrients.get("PROCNT").get("unit")}' if nutrients.get("PROCNT") else 'N/A',
                    cholesterol=f'{nutrients.get("CHOLE").get("quantity")} {nutrients.get("CHOLE").get("unit")}' if nutrients.get("CHOLE") else 'N/A',
                    na=f'{nutrients.get("NA").get("quantity")} {nutrients.get("NA").get("unit")}' if nutrients.get("NA") else 'N/A',
                    ca=f'{nutrients.get("CA").get("quantity")} {nutrients.get("CA").get("unit")}' if nutrients.get("CA") else 'N/A',
                    k=f'{nutrients.get("K").get("quantity")} {nutrients.get("K").get("unit")}' if nutrients.get("K") else 'N/A',
                    vit_k=f'{nutrients.get("VITK1").get("quantity")} {nutrients.get("VITK1").get("unit")}' if nutrients.get("VITK1") else 'N/A',
                    vit_c = f'{nutrients.get("VITC").get("quantity")} {nutrients.get("VITC").get("unit")}' if nutrients.get("VITC") else 'N/A',
                    vit_a_rae = f'{nutrients.get("VITA_RAE").get("quantity")} {nutrients.get("VITA_RAE").get("unit")}' if nutrients.get("VITA_RAE") else 'N/A',
                    vit_d = f'{nutrients.get("VITD").get("quantity")} {nutrients.get("VITD").get("unit")}' if nutrients.get("VITD") else 'N/A',
                    vit_b12 = f'{nutrients.get("VITB12").get("quantity")} {nutrients.get("VITB12").get("unit")}' if nutrients.get("VITB12") else 'N/A',
                    vit_b6 = f'{nutrients.get("VITB6A").get("quantity")} {nutrients.get("VITB6A").get("unit")}' if nutrients.get("VITB6A") else 'N/A',
                    recipe_url=recipe_url,
                )
                food.save()

                return JsonResponse({
                    'message': 'Food for meal created successfully with Edamam Nutrition Analysis API',
                    'food_id': food.food_id
                    }, status=201)
                
            except :
                return JsonResponse({'message': 'Food not found'}, status=204)
    return JsonResponse({'message': 'Invalid request'}, status=400)


def create_food_superuser(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(username=data.get('username'))
        if user.is_superuser:
            food = Food.objects.create(
                food_name = data.get('food_name'),
                ingredients = data.get('ingredients'),

                energ_kcal = data.get('energ_kcal'),
                fat = data.get('fat'),
                fat_saturated = data.get('fat_saturated'),
                fat_trans = data.get('fat_trans'),

                carbo = data.get('carbo'),
                fiber = data.get('fiber'),
                sugar = data.get('sugar'),

                protein = data.get('protein'),
                cholesterol = data.get('cholesterol'),

                na = data.get('na'),
                ca = data.get('ca'),
                # mg = data.get('# mg'),
                k = data.get('k'),
                # fe = data.get('# fe'),
                
                vit_k = data.get('vit_k'),
                vit_c = data.get('vit_c'),
                vit_a_rae = data.get('vit_a_rae'),
                vit_d = data.get('vit_d'),
                vit_b12 = data.get('vit_b12'),
                vit_b6 = data.get('vit_b6'),

                recipe_url = data.get('recipe_url'),
            )
            food.save()
            return JsonResponse({'message': 'Food created successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Not a superuser'}, status=401)
    return JsonResponse({'message': 'Invalid request'}, status=400)
        

def get_meal_from_id(request):
    if request.method == 'GET':
        meal_id = request.GET.get('meal_id')
        meal = Meal.objects.get(id=meal_id)
        foods = meal.foods.all()
        food_list = []
        for food in foods:
            food_list.append({
                'food_name': food.food_name,
                'ingredients': [ingredient.split(' ') for ingredient in food.ingredients.split(',')],
                'energ_kcal': food.energ_kcal,
                'fat': food.fat,
                'fat_saturated': food.fat_saturated,
                'fat_trans': food.fat_trans,
                'carbo': food.carbo,
                'fiber': food.fiber,
                'sugar': food.sugar,
                'protein': food.protein,
                'cholesterol': food.cholesterol,
                'na': food.na,
                'ca': food.ca,
                # 'mg': food.mg,
                'k': food.k,
                # 'fe': food.fe,
                'vit_k': food.vit_k,
                'vit_c': food.vit_c,
                'vit_a_rae': food.vit_a_rae,
                'vit_d': food.vit_d,
                'vit_b12': food.vit_b12,
                'vit_b6': food.vit_b6,
                'recipe_url': food.recipe_url,
            })


def delete_meal_by_id(request, meal_id):
    if request.method == 'DELETE':
        try:
            # Get the username from the request body (or headers if preferred)
            data = json.loads(request.body)
            username = data.get('username')

            if not username:
                return JsonResponse({'error': 'username is required'}, status=400)

            user = User.objects.get(username=username)
            meal = Meal.objects.get(meal_id=meal_id)

            # Check if the user is the creator of the workout
            if meal.created_by != user:
                return JsonResponse({'error': 'You are not authorized to delete this workout'}, status=403)

            # Delete the workout
            meal.delete()
            return JsonResponse({'message': 'Workout deleted successfully'}, status=200)

        except Meal.DoesNotExist:
            return JsonResponse({'error': 'Meal not found'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_foodname_options(request):
    if request.method == 'GET':
        foods = Food.objects.all()
        return JsonResponse({'food_list': [food.name for food in foods]}, status=200)
    return JsonResponse({'message': 'Invalid request'}, status=400)


def rate_meal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            meal_id = data.get('meal_id')
            rating = data.get('rating')
            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)
            
            meal = Meal.objects.get(id=meal_id)
            meal.rating = (meal.rating * meal.rating_count + rating) / (meal.rating_count + 1)
            meal.save()

            user = meal.created_by
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)
            user.meal_rating = (user.meal_rating * user.meal_rating_count + rating) / (user.meal_rating_count + 1)
            user.meal_rating_count += 1

            user.score = (user.meal_rating * user.meal_rating_count + user.workout_rating * user.workout_rating_count) / (user.meal_rating_count + user.workout_rating_count)
            if user.score > 4.5 and (user.meal_rating_count + user.workout_rating_count) > 3:
                user.is_superuser = True
            user.save()

            return JsonResponse({'message': 'Meal rated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)


def get_meals_by_username(request):
    if request.method == 'GET':
        try:
            username = request.GET.get('username')
            user = User.objects.get(username=username)
            meals = Meal.objects.filter(created_by=user)
            meals_data = [{
                'meal_id': meal.id,
                'meal_name': meal.meal_name,
                'created_at': meal.created_at,
                'rating': meal.rating,
                'foods': list(meal.foods.values(
                    'food_name',
                    'ingredients', 
                    'energ_kcal', 
                    'fat', 
                    'fat_saturated', 
                    'fat_trans', 
                    'carbo',
                    'fiber',
                    'sugar',
                    'protein',
                    'cholesterol',
                    'na',
                    'ca',
                    # 'mg',
                    'k',
                    # 'fe',
                    'vit_k',
                    'vit_c',
                    'vit_a_rae',
                    'vit_d',
                    'vit_b12',
                    'vit_b6',
                    'recipe_url',
                )),
            } for meal in meals]
            return JsonResponse({'message': 'Meals found', 'meals': meals_data}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=400)


def toggle_bookmark_meal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            meal_id = data.get('meal_id')
            if not username or not user:
                return JsonResponse({'error': 'username and meal_id are required'}, status=400)
            
            user = User.objects.get(username=username)
            meal = Meal.objects.get(id=meal_id)

            if meal in user.bookmarked_meals.all():
                user.bookmarked_meals.remove(meal)
                return JsonResponse({'message': 'Meal bookmark removed successfully', 'username': username, 'meal_id': meal_id,}, status=200)
            else:
                user.bookmarked_meals.add(meal)
                return JsonResponse({'message': 'Meal bookmarked successfully', 'username': username, 'meal_id': meal_id,}, status=200)
            
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Meal.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


def get_bookmarked_meals_by_username(request):
    if request.method == 'GET':
        try:
            username = request.GET.get('username')
            user = User.objects.get(username=username)
            meals = user.bookmarked_meals.all()
            meals_data = [{
            'meal_id': meal.id,
            'meal_name': meal.meal_name,
            'created_at': meal.created_at,
            'rating': meal.rating,
            'foods': list(meal.foods.values(
                'food_name',
                'ingredients', 
                'energ_kcal', 
                'fat', 
                'fat_saturated', 
                'fat_trans', 
                'carbo',
                'fiber',
                'sugar',
                'protein',
                'cholesterol',
                'na',
                'ca',
                # 'mg',
                'k',
                # 'fe',
                'vit_k',
                'vit_c',
                'vit_a_rae',
                'vit_d',
                'vit_b12',
                'vit_b6',
                'recipe_url',
            )),
        } for meal in meals]
            return JsonResponse({'message': 'Meals found', 'meals': meals_data}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=400)

