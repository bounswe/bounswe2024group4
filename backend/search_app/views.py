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

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def search(request):
    search_query = request.GET.get('search', '').strip()
    search_type = request.GET.get('type', 'all').lower()

    if not search_query:
        return JsonResponse({'error': 'Search query is required'}, status=400)

    response = {}

    if search_type in ['all', 'users']:
        users = User.objects.filter(
            Q(username__icontains=search_query) |
            Q(bio__icontains=search_query)
        ).values(
            'username',
            'profile_picture',
            'score',
            'user_type',
            'workout_rating',
            'meal_rating'
        ).order_by('-user_id')
        response['users'] = list(users)

    if search_type in ['all', 'posts']:
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

    if search_type in ['all', 'meals']:
        meals = Meal.objects.filter(
            Q(meal_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')
        
        response['meals'] = [{
            'meal_id': meal.meal_id,
            'meal_name': meal.meal_name,
            'created_at': meal.created_at,
            'rating': meal.rating,
            'rating_count': meal.rating_count,
            'created_by': {
                'username': meal.created_by.username,
                'profile_picture': meal.created_by.profile_picture.url if meal.created_by.profile_picture else None
            }
        } for meal in meals]

    if search_type in ['all', 'workouts']:
        workouts = Workout.objects.filter(
            Q(workout_name__icontains=search_query) |
            Q(created_by__username__icontains=search_query)
        ).select_related('created_by').order_by('-created_at')
        
        response['workouts'] = [{
            'workout_id': workout.workout_id,
            'workout_name': workout.workout_name,
            'rating': workout.rating,
            'rating_count': workout.rating_count,
            'created_by': {
                'username': workout.created_by.username,
                'profile_picture': workout.created_by.profile_picture.url if workout.created_by.profile_picture else None
            }
        } for workout in workouts]

    return JsonResponse(response)

# Create your views here.
