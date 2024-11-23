from django.shortcuts import render
from posts_app.models import Post
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user_auth_app.models import User

@csrf_exempt
def feed(request):
    if request.method == 'GET':
        posts = Post.objects.all().values()
        return JsonResponse({'posts': list(posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=405)


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