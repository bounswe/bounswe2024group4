from django.shortcuts import render
from django.http import JsonResponse
from user_auth_app.models import User, Follow
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from swagger_docs.swagger import get_leaderboard_schema, follow_schema, unfollow_schema, get_workout_leaderboard_schema, get_meal_leaderboard_schema
from django.db.models import F
from rest_framework.permissions import AllowAny

@swagger_auto_schema(method='get', **get_leaderboard_schema)
@api_view(['GET'])
# @permission_classes([AllowAny])
def get_leaderboard(request):
    if request.method == 'GET':
        ordered_user_list = (
            User.objects.annotate(
                rating= ( 
                    (F('workout_rating') * F('workout_rating_count') +
                        F('meal_rating') * F('meal_rating_count')) / 
                    (F('workout_rating_count') + F('meal_rating_count'))
                ) 
            )
            .order_by('-rating')  # Order by the combined rating in descending order
            .values('username', 'profile_picture', 'rating')
        )
        return JsonResponse({'leaderboard': list(ordered_user_list)})
        

@swagger_auto_schema(method='get', **get_workout_leaderboard_schema)
@api_view(['GET'])
# @permission_classes([AllowAny])
def get_workout_leaderboard(request):
    if request.method == 'GET':
        ordered_user_list = User.objects.order_by('-workout_rating').values('username', 'profile_picture', 'workout_rating')
        return JsonResponse({'workout_leaderboard': list(ordered_user_list)})


@swagger_auto_schema(method='get', **get_meal_leaderboard_schema)
@api_view(['GET'])
# @permission_classes([AllowAny])
def get_meal_leaderboard(request):
    if request.method == 'GET':
        ordered_user_list = User.objects.order_by('-meal_rating').values('username', 'profile_picture', 'meal_rating')
        return JsonResponse({'meal_leaderboard': list(ordered_user_list)})


@swagger_auto_schema(method='post', **follow_schema)
@api_view(['POST'])
@permission_classes([AllowAny])
def follow(request):
    if request.method == 'POST':
        follower = User.objects.get(username=request.POST.get('follower'))
        # follower = User.objects.get(username=request.user.username)
        try:
            following = User.objects.get(username=request.POST.get('following'))
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        
        if follower.username == following.username:
            return JsonResponse({'message': 'You cannot follow yourself'}, status=400)
        
        already_following = follower.following_set.filter(following=following).exists()
        if already_following:
            return JsonResponse({'message': 'You are already following this user'}, status=400)
        
        Follow.objects.create(follower=follower, following=following)
        return JsonResponse({'message': 'User followed successfully'}, status=200)
    return render(request, 'follow.html')


@swagger_auto_schema(method='post', **unfollow_schema)
@api_view(['POST'])
@permission_classes([AllowAny])
def unfollow(request):
    if request.method == 'POST':
        follower = User.objects.get(username=request.POST.get('username'))
        # follower = User.objects.get(username=request.user.username)
        try:
            following = User.objects.get(username=request.POST.get('following'))
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        
        follow_instance = Follow.objects.filter(follower=follower, following=following).first()
        # follow_instance = Follow.objects.filter(follower=request.user, following=following).first()
        if not follow_instance:
            return JsonResponse({'message': 'You are not following this user'}, status=400)
        
        follow_instance.delete()
        return JsonResponse({'message': 'User unfollowed successfully'}, status=200)
    return render(request, 'unfollow.html')

