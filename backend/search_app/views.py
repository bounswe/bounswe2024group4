from django.shortcuts import render
from django.http import JsonResponse
from user_auth_app.models import User
from posts_app.models import Post
from exercise_program_app.models import Workout
from diet_program_app.models import Meal
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import json
from django.db.models import Sum, FloatField, Case, When, Value
from django.db.models.functions import Cast
from swagger_docs.swagger import search_schema

@swagger_auto_schema(method='get', **search_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search(request):
    search_query = request.GET.get('search', '').strip()  # 'meals' or 'workouts' or 'posts' or 'users' or 'all' or 'super_member'
    categories = request.GET.get('categories', 'all')
    muscles = request.GET.get('muscles', '').split(',')
    min_calories = float(request.GET.get('min_calories', 0))
    max_calories = float(request.GET.get('max_calories', int(1e9)))
    min_protein = float(request.GET.get('min_protein', 0))
    max_protein = float(request.GET.get('max_protein', int(1e9)))
    min_fat = float(request.GET.get('min_fat', 0))
    max_fat = float(request.GET.get('max_fat', int(1e9)))
    min_carbs = float(request.GET.get('min_carbs', 0))
    max_carbs = float(request.GET.get('max_carbs', int(1e9)))
    min_fiber = float(request.GET.get('min_fiber', 0))
    max_fiber = float(request.GET.get('max_fiber', int(1e9)))

    if not search_query or search_query == '':
        return JsonResponse({'error': 'Search query is required'}, status=400)

    response = {}

    if 'users' in categories or 'all' in categories:
        user_queryset = User.objects.filter(
            Q(username__icontains=search_query) |
            Q(bio__icontains=search_query)
        )
        if 'super_member' in categories:
            user_queryset = user_queryset.filter(user_type='super_member')
        
        users = user_queryset.values(
            'username',
            'profile_picture',
            'score',
            'user_type',
            'workout_rating',
            'meal_rating'
        ).order_by('-user_id')
        response['users'] = list(users)

    if 'posts' in categories or 'all' in categories:
        posts = Post.objects.filter(
            Q(content__icontains=search_query) |
            Q(user__username__icontains=search_query)
        ).select_related('user').order_by('-created_at')
        
        response['posts'] = [{
            'id': post.id,
            'content': post.content,
            'created_at': post.created_at,
            'like_count': post.likeCount,
            'user': {
                'username': post.user.username,
                'profile_picture': post.user.profile_picture.url if post.user.profile_picture else None,
                'score': post.user.score,
                'user_type': post.user.user_type,
                'workout_rating': post.user.workout_rating,
                'meal_rating':post.user.meal_rating
            },
            'workout_id': post.workout.workout_id if post.workout else None,
            'meal_id': post.mealId
        } for post in posts]

    if 'meals' in categories or 'all' in categories:
        # Base query: search by meal name or creator's username
        meal_queryset = Meal.objects.filter(
            Q(meal_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')

        # if 'meals' in categories:            
        meal_queryset = meal_queryset.filter(
            calories__lte=float(max_calories),
            calories__gte=float(min_calories),
            protein__gte=float(min_protein),
            protein__lte=float(max_protein),
            fat__lte=float(max_fat),
            fat__gte=float(min_fat),
            carbs__lte=float(max_carbs),
            carbs__gte=float(min_carbs),
            fiber__lte=float(max_fiber),
            fiber__gte=float(min_fiber)
        )

        response['meals'] = [{
            'meal_id': meal.meal_id,
            'meal_name': meal.meal_name,
            'created_at': meal.created_at,
            'rating': meal.rating,
            'rating_count': meal.rating_count,
            # 'total_calories': meal.total_calories,  # Include total calories in the response
            'created_by': {
                'username': meal.created_by.username,
                'profile_picture': meal.created_by.profile_picture.url if meal.created_by.profile_picture else None
            }
        } for meal in meal_queryset]

    if 'workouts' in categories or 'all' in categories:
        workout_queryset = Workout.objects.filter(
            Q(workout_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')
        
        if not muscles == ['']:
            for muscle in muscles:
                workout_queryset = workout_queryset.filter(
                    exercise__muscle__icontains=muscle
                ).distinct()

        response['workouts'] = [{
            'workout_id': workout.workout_id,
            'workout_name': workout.workout_name,
            'rating': workout.rating,
            'rating_count': workout.rating_count,
            'created_by': {
                'username': workout.created_by.username,
                'profile_picture': workout.created_by.profile_picture.url if workout.created_by.profile_picture else None
            }
        } for workout in workout_queryset]

    return JsonResponse(response)

# Create your views here.
