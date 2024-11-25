from posts_app.models import Post
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user_auth_app.models import User
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import feed_schema, following_feed_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@swagger_auto_schema(method='get', **feed_schema)
@api_view(['GET'])
# @permission_classes([AllowAny])
@csrf_exempt
def feed(request):
    if request.method == 'GET':
        posts = Post.objects.all().values()
        return JsonResponse({'posts': list(posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=405)


@swagger_auto_schema(method='get', **following_feed_schema)
@api_view(['GET'])
# @permission_classes([AllowAny])
@csrf_exempt
def following_feed(request):
    if request.method == 'GET':
        # user = request.user
        user = User.objects.get(username=request.GET.get('username'))
        following = user.following.all()
        posts = Post.objects.filter(user__in=following).values()
        return JsonResponse({'posts': list(posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=405)