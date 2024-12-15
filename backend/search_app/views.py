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

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search(request):
    # search_query = request.GET.get('search', '').strip()
    # search_type = request.GET.get('type', 'all').lower()
    data = json.loads(request.body)
    search_query = data.get('search', '').strip()
    filters = data.get('filters', {})

    if not search_query:
        return JsonResponse({'error': 'Search query is required'}, status=400)

    response = {}

    if 'users' in filters or filters == {}:
        user_queryset = User.objects.filter(
            Q(username__icontains=search_query) |
            Q(bio__icontains=search_query)
        )
        if 'super_member' in filters:
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

    if 'posts' in filters or filters == {}:
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
                'profile_picture': post.user.profile_picture.url if post.user.profile_picture else None
            },
            'workout_id': post.workout.workout_id if post.workout else None,
            'meal_id': post.mealId
        } for post in posts]

    if 'meals' in filters or not filters:
        # Base query: search by meal name or creator's username
        meal_queryset = Meal.objects.filter(
            Q(meal_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')

        if 'meals' in filters:
            min_calories = filters['meals']['min_calories'] if 'min_calories' in filters['meals'] else 0
            max_calories = filters['meals']['max_calories'] if 'max_calories' in filters['meals'] else int(1e9)
            min_protein = filters['meals']['min_protein'] if 'min_protein' in filters['meals'] else 0
            max_protein = filters['meals']['max_protein'] if 'max_protein' in filters['meals'] else int(1e9)
            min_fat = filters['meals']['min_fat'] if 'min_fat' in filters['meals'] else 0
            max_fat = filters['meals']['max_fat'] if 'max_fat' in filters['meals'] else int(1e9)
            min_carbs = filters['meals']['min_carbs'] if 'min_carbs' in filters['meals'] else 0
            max_carbs = filters['meals']['max_carbs'] if 'max_carbs' in filters['meals'] else int(1e9)
            min_fiber = filters['meals']['min_fiber'] if 'min_fiber' in filters['meals'] else 0
            max_fiber = filters['meals']['max_fiber'] if 'max_fiber' in filters['meals'] else int(1e9)
            
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

    if 'workouts' in filters or filters == {}:
        workout_queryset = Workout.objects.filter(
            Q(workout_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')
        
        if 'workouts' in filters: 
            for muscle in filters['workouts']:
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

