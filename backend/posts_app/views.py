from django.shortcuts import render
from django.http import JsonResponse
from posts_app.models import Post

def post(request):
    if request.method == 'POST':
        user = request.user
        content = request.POST.get('content')
        exerciseId = request.POST.get('exerciseId')
        mealId = request.POST.get('mealId')
        post = Post.objects.create(user=user, content=content, exerciseId=exerciseId, mealId=mealId)
        return JsonResponse({'message': 'Post created successfully', 'post_id': post.id}, status=201)
    return render(request, 'create_post.html')
