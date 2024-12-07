from posts_app.models import Post
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user_auth_app.models import User
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import feed_schema, following_feed_schema
from rest_framework.decorators import api_view

@swagger_auto_schema(method='get', **feed_schema)
@api_view(['GET'])
@csrf_exempt
def feed(request):
    if request.method == 'GET':
        posts = Post.objects.all().values()
        return JsonResponse({'posts': list(posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=405)


@swagger_auto_schema(method='get', **following_feed_schema)
@api_view(['GET'])
@csrf_exempt
def following_feed(request):
    if request.method == 'GET':
        # user = request.user
        user = User.objects.get(username=request.GET.get('username'))
        following = user.following.all()
        posts = Post.objects.filter(user__in=following)
        
        return JsonResponse({'posts': list(reversed([{
                'post_id': post.id,
                'content': post.content,
                'workout_id': post.workout.workout_id if post.workout else None,
                'meal_id': post.mealId,
                'like_count': post.likeCount,
                'created_at': post.created_at,
                'user': {
                    'username': post.user.username,
                    'profile_picture': post.user.profile_picture.url if post.user.profile_picture else None,
                    'score': post.user.score
                }
                } for post in posts]))}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=405)