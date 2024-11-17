from django.shortcuts import render
from django.http import JsonResponse
from user_auth_app.models import User, Follow
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from swagger_docs.swagger import get_leaderboard_schema, follow_schema, unfollow_schema


@swagger_auto_schema(method='get', **get_leaderboard_schema)
@api_view(['GET'])
def get_leaderboard(request):
    if request.method == 'GET':
        ordered_user_list = User.objects.order_by('score').values('username', 'score')
        return JsonResponse({'leaderboard': list(ordered_user_list)})
    

@swagger_auto_schema(method='post', **follow_schema)
@api_view(['POST'])
def follow(request):
    if request.method == 'POST':
        follower = User.objects.get(username=request.user.username)
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
def unfollow(request):
    if request.method == 'POST':
        follower = User.objects.get(username=request.user.username)
        try:
            following = User.objects.get(username=request.POST.get('following'))
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        
        follow_instance = Follow.objects.filter(follower=request.user, following=following).first()
        if not follow_instance:
            return JsonResponse({'message': 'You are not following this user'}, status=400)
        
        follow_instance.delete()
        return JsonResponse({'message': 'User unfollowed successfully'}, status=200)
    return render(request, 'unfollow.html')

