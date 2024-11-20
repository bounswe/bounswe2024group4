from django.shortcuts import render
from django.http import JsonResponse
from user_auth_app.models import User
from posts_app.models import Comment, Post

def post(request):
    if request.method == 'POST':
        user = request.user
        content = request.POST.get('content')
        exerciseId = request.POST.get('exerciseId')
        mealId = request.POST.get('mealId')
        post = Post.objects.create(user=user, content=content, exerciseId=exerciseId, mealId=mealId)
        return JsonResponse({'message': 'Post created successfully', 'post_id': post.id}, status=201)
    return render(request, 'create_post.html')


def toggle_like(request):
    if request.method == 'POST':
        try:
            postId = request.POST.get('postId')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            
            try: 
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = User.objects.get(username=request.user.username)
            post = Post.objects.get(id=postId)

            if post in user.liked_posts.all():
                user.liked_posts.remove(post)
                post.likeCount -= 1
                post.save()
                return JsonResponse({'message': 'Post unliked successfully'}, status=200)
            else:
                user.liked_posts.add(post)
                post.likeCount += 1
                post.save()
                return JsonResponse({'message': 'Post liked successfully'}, status=200)
            
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
            
    return render(request, 'toggle_like.html')


def comment(request):
    if request.method == 'POST':
        try:
            postId = request.POST.get('postId')
            content = request.POST.get('content')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            if not content:
                return JsonResponse({'error': 'content is required'}, status=400)
            
            try:
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = User.objects.get(username=request.user.username)
            post = Post.objects.get(id=postId)

            comment = Comment.objects.create(user=user, post=post, content=content)
            return JsonResponse({'message': 'Comment created successfully', 'comment_id': comment.id}, status=201)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    return render(request, 'comment.html')


def toggle_bookmark(request):
    if request.method == 'POST':
        try:
            postId = request.POST.get('postId')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            
            try:
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = User.objects.get(username=request.user.username)
            post = Post.objects.get(id=postId)

            if post in user.bookmarked_posts.all():
                user.bookmarked_posts.remove(post)
                return JsonResponse({'message': 'Post unbookmarked successfully'}, status=200)
            else:
                user.bookmarked_posts.add(post)
                return JsonResponse({'message': 'Post bookmarked successfully'}, status=200)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    return render(request, 'toggle_bookmark.html')