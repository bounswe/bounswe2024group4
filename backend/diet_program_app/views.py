import os
import requests
import json
from django.http import JsonResponse

from .models import Meal, Food
from user_auth_app.models import User

from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from swagger_docs.swagger import create_meal_schema, create_food_all_schema, create_food_superuser_schema, get_meal_from_id_schema, delete_meal_by_id_schema, get_foodname_options_schema, rate_meal_schema, get_meals_by_user_id_schema, toggle_bookmark_meal_schema, get_bookmarked_meals_by_user_id_schema
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
        
        # Then add foods to it
        for food in foods:
            meal.foods.add(food)
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
                        "creator_level": food.creator_level
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
        data = json.loads(request.body)
        food_name = data.get('food_name')
        ingredients = data.get('ingredients')
        recipe_url = data.get('recipe_url')

        # try:       # if the food is in the database
        #     food = Food.objects.get(name=food_name)
        #     return JsonResponse({
        #         'message': 'Food for meal found in the database',
        #         'food_id': food.food_id
        #         }, status=200)
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=400)

        # except:    # if the food is not in the database
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

            # return JsonResponse({'message': response.json()}, status=200)

            energ_kcal = f'{nutrients.get("ENERC_KCAL").get("quantity")} {nutrients.get("ENERC_KCAL").get("unit")}' if nutrients.get("ENERC_KCAL") else 'N/A'
            fat=f'{nutrients.get("FAT").get("quantity")} {nutrients.get("FAT").get("unit")}' if nutrients.get("FAT") else 'N/A'
            fat_saturated=f'{nutrients.get("FASAT").get("quantity")} {nutrients.get("FASAT").get("unit")}' if nutrients.get("FASAT") else 'N/A'
            fat_trans=f'{nutrients.get("FATRN").get("quantity")} {nutrients.get("FATRN").get("unit")}' if nutrients.get("FATRN") else 'N/A'
            carbo=f'{nutrients.get("CHOCDF").get("quantity")} {nutrients.get("CHOCDF").get("unit")}' if nutrients.get("CHOCDF") else 'N/A'
            fiber=f'{nutrients.get("FIBTG").get("quantity")} {nutrients.get("FIBTG").get("unit")}' if nutrients.get("FIBTG") else 'N/A'
            sugar=f'{nutrients.get("SUGAR").get("quantity")} {nutrients.get("SUGAR").get("unit")}' if nutrients.get("SUGAR") else 'N/A'
            protein=f'{nutrients.get("PROCNT").get("quantity")} {nutrients.get("PROCNT").get("unit")}' if nutrients.get("PROCNT") else 'N/A'
            cholesterol=f'{nutrients.get("CHOLE").get("quantity")} {nutrients.get("CHOLE").get("unit")}' if nutrients.get("CHOLE") else 'N/A'
            na=f'{nutrients.get("NA").get("quantity")} {nutrients.get("NA").get("unit")}' if nutrients.get("NA") else 'N/A'
            ca=f'{nutrients.get("CA").get("quantity")} {nutrients.get("CA").get("unit")}' if nutrients.get("CA") else 'N/A'
            k=f'{nutrients.get("K").get("quantity")} {nutrients.get("K").get("unit")}' if nutrients.get("K") else 'N/A'
            vit_k=f'{nutrients.get("VITK1").get("quantity")} {nutrients.get("VITK1").get("unit")}' if nutrients.get("VITK1") else 'N/A'
            vit_c = f'{nutrients.get("VITC").get("quantity")} {nutrients.get("VITC").get("unit")}' if nutrients.get("VITC") else 'N/A'
            vit_a_rae = f'{nutrients.get("VITA_RAE").get("quantity")} {nutrients.get("VITA_RAE").get("unit")}' if nutrients.get("VITA_RAE") else 'N/A'
            vit_d = f'{nutrients.get("VITD").get("quantity")} {nutrients.get("VITD").get("unit")}' if nutrients.get("VITD") else 'N/A'
            vit_b12 = f'{nutrients.get("VITB12").get("quantity")} {nutrients.get("VITB12").get("unit")}' if nutrients.get("VITB12") else 'N/A'
            vit_b6 = f'{nutrients.get("VITB6A").get("quantity")} {nutrients.get("VITB6A").get("unit")}' if nutrients.get("VITB6A") else 'N/A'


            food = Food.objects.create(
                name=food_name, ingredients=ingredients,
                energ_kcal=energ_kcal,
                fat=fat, fat_saturated=fat_saturated, fat_trans=fat_trans,
                carbo=carbo, fiber=fiber, sugar=sugar,
                protein=protein,
                cholesterol=cholesterol,
                na=na, ca=ca, k=k,
                vit_k=vit_k, vit_c=vit_c, vit_a_rae=vit_a_rae, vit_d=vit_d, vit_b12=vit_b12, vit_b6=vit_b6,
                recipe_url=recipe_url,
            )
            food.save()

            return JsonResponse({
                'message': 'Food for meal created successfully with Edamam Nutrition Analysis API',
                'food_id': food.food_id
                }, status=201)
            
        except :
            return JsonResponse({'message': 'Food not found'}, status=404)
    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='post', **create_food_superuser_schema)
@api_view(['POST'])
def create_food_superuser(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        if user.is_superuser:
            food = Food.objects.create(
                food_name = data.get('food_name'),
                ingredients = data.get('ingredients') ,

                energ_kcal = data.get('energ_kcal') if data.get('energ_kcal') else 'N/A',
                fat = data.get('fat') if data.get('fat') else 'N/A',
                fat_saturated = data.get('fat_saturated') if data.get('fat_saturated') else 'N/A',
                fat_trans = data.get('fat_trans') if data.get('fat_trans') else 'N/A',

                carbo = data.get('carbo') if data.get('carbo') else 'N/A',
                fiber = data.get('fiber') if data.get('fiber') else 'N/A',
                sugar = data.get('sugar') if data.get('sugar') else 'N/A',

                protein = data.get('protein') if data.get('protein') else 'N/A',
                cholesterol = data.get('cholesterol') if data.get('cholesterol') else 'N/A',

                na = data.get('na') if data.get('na') else 'N/A',
                ca = data.get('ca') if data.get('ca') else 'N/A',
                k = data.get('k') if data.get('k') else 'N/A',
                
                vit_k = data.get('vit_k') if data.get('vit_k') else 'N/A',
                vit_c = data.get('vit_c') if data.get('vit_c') else 'N/A',
                vit_a_rae = data.get('vit_a_rae') if data.get('vit_a_rae') else 'N/A',
                vit_d = data.get('vit_d') if data.get('vit_d') else 'N/A',
                vit_b12 = data.get('vit_b12') if data.get('vit_b12') else 'N/A',
                vit_b6 = data.get('vit_b6') if data.get('vit_b6') else 'N/A',

                recipe_url = data.get('recipe_url'),
            )
            food.save()
            return JsonResponse({'message': 'Food created successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Not a superuser'}, status=401)
    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='get', **get_meal_from_id_schema)
@api_view(['GET'])
def get_meal_from_id(request):
    if request.method == 'GET':
        meal_id = request.GET.get('meal_id')
        meal = Meal.objects.get(id=meal_id)
        foods = meal.foods.all()
        food_list = []
        for food in foods:
            food_list.append({
                'food_name': food.name,
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
                'k': food.k,
                'vit_k': food.vit_k,
                'vit_c': food.vit_c,
                'vit_a_rae': food.vit_a_rae,
                'vit_d': food.vit_d,
                'vit_b12': food.vit_b12,
                'vit_b6': food.vit_b6,
                'recipe_url': food.recipe_url,
            })
        return JsonResponse({'meal_name': meal.meal_name, 'foods': food_list}, status=200)
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
            
            meal = Meal.objects.get(id=meal_id)
            meal.rating = (meal.rating * meal.rating_count + rating) / (meal.rating_count + 1)
            meal.save()

            user = meal.created_by
            if not user:
                return JsonResponse({'error': 'No user found'}, status=400)
            user.meal_rating = (user.meal_rating * user.meal_rating_count + rating) / (user.meal_rating_count + 1)
            user.meal_rating_count += 1

            user.score = (user.meal_rating * user.meal_rating_count + user.workout_rating * user.workout_rating_count) / (user.meal_rating_count + user.workout_rating_count)
            user.check_super_member()

            return JsonResponse({'message': 'Meal rated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)


@swagger_auto_schema(method='get', **get_meals_by_user_id_schema)
@api_view(['GET'])
def get_meals_by_user_id(request):
    if request.method == 'GET':
        try:
            user_id = request.GET.get('user_id')
            user = User.objects.get(user_id=user_id)
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
                    'k',
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
            
            meal = Meal.objects.get(id=meal_id)

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
                'k',
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
    return JsonResponse({'message': 'Invalid request'}, status=405)


#@swagger_auto_schema(method='get', **get_food_by_id_schema)
@api_view(['GET'])
def get_food_by_id(request):
    if request.method == 'GET':
        try:
            food_id = request.GET.get('food_id')
            food = Food.objects.get(food_id=food_id)
            return JsonResponse({
                'food_name': food.name,
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
                'k': food.k,
                'vit_k': food.vit_k,
                'vit_c': food.vit_c,
                'vit_a_rae': food.vit_a_rae,
                'vit_d': food.vit_d,
                'vit_b12': food.vit_b12,
                'vit_b6': food.vit_b6,
                'recipe_url': food.recipe_url,
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

        