import os
import requests
import json
from django.http import JsonResponse

from .models import Meal, Food
from user_auth_app.models import User

from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from swagger_docs.swagger import create_meal_schema, create_food_all_schema, create_food_superuser_schema, get_meal_from_id_schema, delete_meal_by_id_schema, get_foodname_options_schema, rate_meal_schema, get_meals_by_user_id_schema, toggle_bookmark_meal_schema, get_bookmarked_meals_by_user_id_schema, get_food_by_id_schema
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from firebase_admin import firestore
from fitness_project.firebase import db
from datetime import datetime


@swagger_auto_schema(method='post', **create_meal_schema)
@api_view(['POST'])
def create_meal(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        meal_name = data.get('meal_name')
        meal = Meal.objects.create(meal_name=meal_name, created_by=user)
        foods = data.get('foods', [])
        
        # Create the meal first
        meal = Meal.objects.create(
            meal_name=meal_name,
            created_by=user,
            rating=0,
            rating_count=0
        )
        
        meal.calories = 0
        meal.protein = 0
        meal.fat = 0
        meal.carbs = 0
        meal.fiber = 0
        # Then add foods to it
        for food in foods:
            meal.foods.add(food)
        for food in foods:
            try:
                meal.calories += float(food.energ_kcal.split(' ')[0])
            except:
                meal.calories = 0
        for food in foods:
            try:
                meal.protein += float(food.protein.split(' ')[0])
            except:
                meal.protein = 0
        for food in foods:
            try:
                meal.fat += float(food.fat.split(' ')[0])
            except:
                meal.fat = 0
        for food in foods:
            try:
                meal.carbs += float(food.carbo.split(' ')[0])
            except:
                meal.carbs = 0
        for food in foods:
            try:
                meal.fiber += float(food.fiber.split(' ')[0])
            except:
                meal.fiber = 0
        meal.save()

        try:
            # Log the activity
            activity_data = {
                "actor": {
                    "isSuperUser": user.is_superuser,
                    "id": user.user_id,
                    "name": user.username
                },
                "type": "Create",
                "object": {
                    "type": "Meal",
                    "id": meal.meal_id,
                    "name": meal.meal_name,
                    "foodCount": len(foods),
                    "foods": [{
                        "id": food.food_id,
                        "name": food.name,
                        "ingredients": food.ingredients,
                        "nutrients": {
                            "calories": food.energ_kcal,
                            "protein": food.protein,
                            "carbohydrates": food.carbo,
                            "fat": food.fat,
                            "fat_saturated": food.fat_saturated,
                            "fat_trans": food.fat_trans,
                            "fiber": food.fiber,
                            "sugar": food.sugar,
                            "cholesterol": food.cholesterol,
                            "sodium": food.na,
                            "calcium": food.ca,
                            "potassium": food.k,
                            "vitamins": {
                                "k": food.vit_k,
                                "c": food.vit_c,
                                "a_rae": food.vit_a_rae,
                                "d": food.vit_d,
                                "b12": food.vit_b12,
                                "b6": food.vit_b6
                            }
                        },
                        "recipe_url": food.recipe_url,
                        "image_url": food.image_url.url if food.image_url else ''
                    } for food in meal.foods.all()]
                },
                "summary": f"{user.username} created a new meal '{meal_name}'"
            }

            # Add to Firestore
            db = firestore.client()
            db.collection("mealActivities").add({
                **activity_data,
                "@context": "https://www.w3.org/ns/activitystreams",
                "published": datetime.utcnow().isoformat()
            })

            return JsonResponse({
                'message': 'Meal created successfully',
                'meal_id': meal.meal_id,
                'meal_name': meal.meal_name,
                'created_by': meal.created_by.username,
                'foods_count': len(foods)
            }, status=201)

        except Exception as e:
            # Log the error but don't fail the request
            print(f"Firebase logging failed: {str(e)}")
            return JsonResponse({
                'message': 'Meal created successfully (logging failed)',
                'meal_id': meal.meal_id,
                'meal_name': meal.meal_name,
                'created_by': meal.created_by.username,
                'foods_count': len(foods)
            }, status=201)

    return JsonResponse({'message': 'Invalid request'}, status=400)


@api_view(['GET'])
def get_meal_activities(request):
    try:
        # Start with base query
        activities_ref = db.collection('mealActivities')
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


@swagger_auto_schema(method='post', **create_food_all_schema)
@api_view(['POST'])
def create_food_all(request):
    if request.method == 'POST':
        food_name = request.POST.get('food_name')
        ingredients = request.POST.get('ingredients')
        recipe_url = request.POST.get('recipe_url') if request.POST.get('recipe_url') else ''
        image_url = request.FILES.get('image_url') if request.FILES.get('image_url') else ''

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

            if (nutrients == {}):
                return JsonResponse({'message': 'Food not found'}, status=404)

            energ_kcal = f'{nutrients["ENERC_KCAL"]["quantity"]} {nutrients["ENERC_KCAL"]["unit"]}' if nutrients["ENERC_KCAL"] else 'N/A'
            fat=f'{nutrients["FAT"]["quantity"]} {nutrients["FAT"]["unit"]}' if nutrients["FAT"] else 'N/A'
            fat_saturated=f'{nutrients["FASAT"]["quantity"]} {nutrients["FASAT"]["unit"]}' if nutrients["FASAT"] else 'N/A'
            fat_trans=f'{nutrients["FATRN"]["quantity"]} {nutrients["FATRN"]["unit"]}' if nutrients["FATRN"] else 'N/A'
            carbo=f'{nutrients["CHOCDF"]["quantity"]} {nutrients["CHOCDF"]["unit"]}' if nutrients["CHOCDF"] else 'N/A'
            fiber=f'{nutrients["FIBTG"]["quantity"]} {nutrients["FIBTG"]["unit"]}' if nutrients["FIBTG"] else 'N/A'
            sugar=f'{nutrients["SUGAR"]["quantity"]} {nutrients["SUGAR"]["unit"]}' if nutrients["SUGAR"] else 'N/A'
            protein=f'{nutrients["PROCNT"]["quantity"]} {nutrients["PROCNT"]["unit"]}' if nutrients["PROCNT"] else 'N/A'
            cholesterol=f'{nutrients["CHOLE"]["quantity"]} {nutrients["CHOLE"]["unit"]}' if nutrients["CHOLE"] else 'N/A'
            na=f'{nutrients["NA"]["quantity"]} {nutrients["NA"]["unit"]}' if nutrients["NA"] else 'N/A'
            ca=f'{nutrients["CA"]["quantity"]} {nutrients["CA"]["unit"]}' if nutrients["CA"] else 'N/A'
            k=f'{nutrients["K"]["quantity"]} {nutrients["K"]["unit"]}' if nutrients["K"] else 'N/A'
            vit_k=f'{nutrients["VITK1"]["quantity"]} {nutrients["VITK1"]["unit"]}' if nutrients["VITK1"] else 'N/A'
            vit_c=f'{nutrients["VITC"]["quantity"]} {nutrients["VITC"]["unit"]}' if nutrients["VITC"] else 'N/A'
            vit_a_rae=f'{nutrients["VITA_RAE"]["quantity"]} {nutrients["VITA_RAE"]["unit"]}' if nutrients["VITA_RAE"] else 'N/A'
            vit_d=f'{nutrients["VITD"]["quantity"]} {nutrients["VITD"]["unit"]}' if nutrients["VITD"] else 'N/A'
            vit_b12=f'{nutrients["VITB12"]["quantity"]} {nutrients["VITB12"]["unit"]}' if nutrients["VITB12"] else 'N/A'
            vit_b6=f'{nutrients["VITB6A"]["quantity"]} {nutrients["VITB6A"]["unit"]}' if nutrients["VITB6A"] else 'N/A'

            food = Food.objects.create(
                name=food_name, 
                ingredients=ingredients,
                energ_kcal=energ_kcal,
                fat=fat, fat_saturated=fat_saturated, fat_trans=fat_trans,
                carbo=carbo, fiber=fiber, sugar=sugar,
                protein=protein,
                cholesterol=cholesterol,
                na=na, ca=ca, k=k,
                vit_k=vit_k, vit_c=vit_c, vit_a_rae=vit_a_rae, vit_d=vit_d, vit_b12=vit_b12, vit_b6=vit_b6,
                recipe_url=recipe_url,
                image_url=image_url
            )
            food.save()

            return JsonResponse({
                'message': 'Food for meal created successfully with Edamam Nutrition Analysis API',
                'food_id': food.food_id,
                'food_name': food_name,
                'ingredients': ingredients,
                'recipe_url': recipe_url,
                'image_url': food.image_url.url if food.image_url else '',
                'calories': energ_kcal,
                'fat': fat,
                'fat_saturated': fat_saturated,
                'fat_trans': fat_trans,
                'carbo': carbo, 'fiber': fiber, 'sugar': sugar,
                'protein': protein,
                'cholesterol': cholesterol,
                'na': na, 'ca': ca, 'k': k,
                'vit_k': vit_k, 'vit_c': vit_c, 'vit_a_rae': vit_a_rae, 'vit_d': vit_d, 'vit_b12': vit_b12, 'vit_b6': vit_b6,
                }, status=201)
            
        except :
            return JsonResponse({'message': 'Food not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='post', **create_food_superuser_schema)
@api_view(['POST'])
def create_food_superuser(request):
    if request.method == 'POST':
        user = request.user
        if user.is_superuser:
            # Retrieve fields from request.POST
            food_name = request.POST.get('food_name')
            ingredients = request.POST.get('ingredients')
            recipe_url = request.POST.get('recipe_url', '')
            
            # If you previously had `image_url` as a URL field, but now it's an ImageField:
            # Retrieve the uploaded file from request.FILES
            image_url = request.FILES.get('image_url', '')

            # For nutritional values, use `get()` with a default of 'N/A'
            energ_kcal = request.POST.get('energ_kcal', 'N/A')
            fat = request.POST.get('fat', 'N/A')
            fat_saturated = request.POST.get('fat_saturated', 'N/A')
            fat_trans = request.POST.get('fat_trans', 'N/A')
            carbo = request.POST.get('carbo', 'N/A')
            fiber = request.POST.get('fiber', 'N/A')
            sugar = request.POST.get('sugar', 'N/A')
            protein = request.POST.get('protein', 'N/A')
            cholesterol = request.POST.get('cholesterol', 'N/A')
            na = request.POST.get('na', 'N/A')
            ca = request.POST.get('ca', 'N/A')
            k = request.POST.get('k', 'N/A')
            vit_k = request.POST.get('vit_k', 'N/A')
            vit_c = request.POST.get('vit_c', 'N/A')
            vit_a_rae = request.POST.get('vit_a_rae', 'N/A')
            vit_d = request.POST.get('vit_d', 'N/A')
            vit_b12 = request.POST.get('vit_b12', 'N/A')
            vit_b6 = request.POST.get('vit_b6', 'N/A')

            # Create the Food object
            food = Food.objects.create(
                name=food_name,
                ingredients=ingredients,
                image_url=image_url,        # Use the uploaded image file
                recipe_url=recipe_url,
                energ_kcal=energ_kcal,
                fat=fat,
                fat_saturated=fat_saturated,
                fat_trans=fat_trans,
                carbo=carbo,
                fiber=fiber,
                sugar=sugar,
                protein=protein,
                cholesterol=cholesterol,
                na=na,
                ca=ca,
                k=k,
                vit_k=vit_k,
                vit_c=vit_c,
                vit_a_rae=vit_a_rae,
                vit_d=vit_d,
                vit_b12=vit_b12,
                vit_b6=vit_b6
            )
            food.save()

            return JsonResponse({
                'message': 'Food created successfully', 
                'food_id': food.food_id,
                'food_name': food_name,
                'ingredients': ingredients,
                'recipe_url': recipe_url,
                'image_url': food.image_url if food.image_url else '',
                'calories': energ_kcal,
                'fat': fat,
                'fat_saturated': fat_saturated,
                'fat_trans': fat_trans,
                'carbo': carbo,
                'fiber': fiber,
                'sugar': sugar,
                'protein': protein,
                'cholesterol': cholesterol,
                'na': na,
                'ca': ca,
                'k': k,
                'vit_k': vit_k,
                'vit_c': vit_c,
                'vit_a_rae': vit_a_rae,
                'vit_d': vit_d,
                'vit_b12': vit_b12,
                'vit_b6': vit_b6,
            }, status=201)
        else:
            return JsonResponse({'message': 'Not a superuser'}, status=401)
    return JsonResponse({'message': 'Invalid request'}, status=400)



@swagger_auto_schema(method='get', **get_meal_from_id_schema)
@api_view(['GET'])
def get_meal_from_id(request):
    if request.method == 'GET':
        meal_id = request.GET.get('meal_id')
        try:
            meal = Meal.objects.get(meal_id=meal_id)
        except Meal.DoesNotExist:
            return JsonResponse({'message': 'Meal not found'}, status=404)
        
        foods = meal.foods.all()
        food_list = []
        for food in foods:
            food_list.append({
                'food_name': food.name,
                'ingredients': [ingredient.split('\n') for ingredient in food.ingredients.split(',')],
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
                'k': food.k,
                'vit_k': food.vit_k,
                'vit_c': food.vit_c,
                'vit_a_rae': food.vit_a_rae,
                'vit_d': food.vit_d,
                'vit_b12': food.vit_b12,
                'vit_b6': food.vit_b6,
                'recipe_url': food.recipe_url,
                'image_url': food.image_url.url if food.image_url else '',
            })
        return JsonResponse({
            'meal_name': meal.meal_name,
            'created_at': meal.created_at,
            'rating': meal.rating,
            'calories': meal.calories,
            'protein': meal.protein,
            'fat': meal.fat,
            'carbs': meal.carbs,
            'fiber': meal.fiber,
            'foods': food_list
            }, status=200)
    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='delete', **delete_meal_by_id_schema)
@api_view(['DELETE'])
def delete_meal_by_id(request, meal_id):
    if request.method == 'DELETE':
        try:
            user = request.user
            meal = Meal.objects.get(meal_id=meal_id)
            # Check if the user is the creator of the workout
            if meal.created_by != user:
                return JsonResponse({'error': 'You are not authorized to delete this meal'}, status=403)
            
            # delete the image from images folder
            for food in meal.foods.all():
                if food.image_url and os.path.exists(food.image_url.url) and food.image_url.url != '':
                    os.remove(food.image_url.url)

            # Delete the workout
            meal.delete()
            return JsonResponse({'message': 'Meal deleted successfully'}, status=200)

        except Meal.DoesNotExist:
            return JsonResponse({'error': 'Meal not found'}, status=404)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@swagger_auto_schema(method='get', **get_foodname_options_schema)
@api_view(['GET'])
def get_foodname_options(request):
    if request.method == 'GET':
        foods = Food.objects.all()
        return JsonResponse({'food_list': [{"food_id": food.food_id, "name": food.name, "calories": food.energ_kcal} for food in foods]}, status=200)
    return JsonResponse({'message': 'Invalid request'}, status=405)


@swagger_auto_schema(method='post', **rate_meal_schema)
@api_view(['POST'])
def rate_meal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            meal_id = data.get('meal_id')
            rating = data.get('rating')
            if rating < 0 or rating > 5:
                return JsonResponse({'error': 'Rating must be between 0 and 5'}, status=400)
            
            meal = Meal.objects.get(meal_id=meal_id)
            user = meal.created_by
            
            meal.rating = (meal.rating * meal.rating_count + rating) / (meal.rating_count + 1)
            meal.save()
            
            user.meal_rating = (user.meal_rating * user.meal_rating_count + rating) / (user.meal_rating_count + 1)
            user.meal_rating_count = user.meal_rating_count + 1

            user.score = (user.meal_rating * user.meal_rating_count + user.workout_rating * user.workout_rating_count) / (user.meal_rating_count + user.workout_rating_count)
            user.check_super_member()
            user.save()

            return JsonResponse({'message': 'Meal rated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='get', **get_meals_by_user_id_schema)
@api_view(['GET'])
def get_meals(request):
    if request.method == 'GET':
        try:
            user = request.user
            meals = Meal.objects.filter(created_by=user)
            meals_data = [{
                'meal_id': meal.meal_id,
                'meal_name': meal.meal_name,
                'created_at': meal.created_at,
                'rating': meal.rating,
                'calories': meal.calories,
                'protein': meal.protein,
                'fat': meal.fat,
                'carbs': meal.carbs,
                'fiber': meal.fiber,
                'foods': list(meal.foods.values(
                    'name',
                    'ingredients',
                    'recipe_url',
                    'image_url',
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
                    'k',
                    'vit_k',
                    'vit_c',
                    'vit_a_rae',
                    'vit_d',
                    'vit_b12',
                    'vit_b6',
                )),
            } for meal in meals]
            return JsonResponse({'message': 'Meals found', 'meals': meals_data}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=405)


@swagger_auto_schema(method='post', **toggle_bookmark_meal_schema)
@api_view(['POST'])
def toggle_bookmark_meal(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user            
            meal_id = data.get('meal_id')
            if not user or not meal_id:
                return JsonResponse({'error': 'meal_id is required'}, status=400)
            
            meal = Meal.objects.get(meal_id=meal_id)

            if meal in user.bookmarked_meals.all():
                user.bookmarked_meals.remove(meal)
                return JsonResponse({'message': 'Meal bookmark removed successfully', 'username': user.username, 'meal_id': meal_id,}, status=200)
            else:
                user.bookmarked_meals.add(meal)
                return JsonResponse({'message': 'Meal bookmarked successfully', 'username': user.username, 'meal_id': meal_id,}, status=200)
            
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Meal.DoesNotExist:
            return JsonResponse({'error': 'Workout not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'message': 'Invalid request'}, status=405)


@swagger_auto_schema(method='get', **get_bookmarked_meals_by_user_id_schema)
@api_view(['GET'])
def get_bookmarked_meals_by_user_id(request):
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            user = User.objects.get(user_id=user_id)
            meals = user.bookmarked_meals.all()
            meals_data = [{
            'meal_id': meal.meal_id,
            'meal_name': meal.meal_name,
            'created_at': meal.created_at,
            'rating': meal.rating,
            'foods': list(meal.foods.values(
                'name',
                'ingredients',
                'recipe_url',
                'image_url',
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
                'k',
                'vit_k',
                'vit_c',
                'vit_a_rae',
                'vit_d',
                'vit_b12',
                'vit_b6',
            )),
        } for meal in meals]
            return JsonResponse({'message': 'Meals found', 'meals': meals_data}, status=200)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=405)


@swagger_auto_schema(method='get', **get_food_by_id_schema)
@api_view(['GET'])
def get_food_by_id(request):
    if request.method == 'GET':
        try:
            food_id = request.GET.get('food_id')
            food = Food.objects.get(food_id=food_id)
            return JsonResponse({
                'food_name': food.name,
                'ingredients': [ingredient.split('\n') for ingredient in food.ingredients.split(',')],
                'recipe_url': food.recipe_url,
                'image_url': food.image_url.url,
                'calories': food.energ_kcal,
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
                'k': food.k,
                'vit_k': food.vit_k,
                'vit_c': food.vit_c,
                'vit_a_rae': food.vit_a_rae,
                'vit_d': food.vit_d,
                'vit_b12': food.vit_b12,
                'vit_b6': food.vit_b6,
            }, status=200)
        except Food.DoesNotExist:
            return JsonResponse({'error': 'Food not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=405)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_meal(request, meal_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user = request.user
            meal = Meal.objects.get(meal_id=meal_id)

            # Check if user is authorized to edit this meal
            if meal.created_by != user:
                return JsonResponse({'error': 'You are not authorized to edit this meal'}, status=403)

            # Update meal name if provided
            new_meal_name = data.get('meal_name')
            if new_meal_name:
                meal.meal_name = new_meal_name

            # Update foods if provided
            new_foods = data.get('foods')
            if new_foods is not None:
                # Clear existing foods and add new ones
                meal.foods.clear()
                for food_id in new_foods:
                    try:
                        food = Food.objects.get(food_id=food_id)
                        meal.foods.add(food)
                    except Food.DoesNotExist:
                        return JsonResponse({'error': f'Food with id {food_id} not found'}, status=404)

            meal.save()

            return JsonResponse({
                'message': 'Meal updated successfully',
                'meal_id': meal.meal_id,
                'meal_name': meal.meal_name,
                'foods': list(meal.foods.values('food_id', 'name'))
            }, status=200)

        except Meal.DoesNotExist:
            return JsonResponse({'error': 'Meal not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

        