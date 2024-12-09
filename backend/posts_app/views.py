from django.shortcuts import render
from django.http import JsonResponse
from user_auth_app.models import User
from posts_app.models import Comment, Post
from exercise_program_app.models import Workout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import post_schema, toggle_like_schema, comment_schema, liked_posts_schema, bookmarked_posts_schema
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@swagger_auto_schema(method='post', **post_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def post(request):
    if request.method == 'POST':
        user = request.user
        content = request.data.get('content')
        workoutId = request.data.get('workoutId')
        mealId = request.data.get('mealId')

        if not content:
            return JsonResponse({'error': 'Content is required'}, status=400)
        
        if workoutId:
            try:
                workout = Workout.objects.get(workout_id=workoutId)
                post.workout = workout
            except Workout.DoesNotExist:
                return JsonResponse({'error': 'Workout not found'}, status=404)
        
        if mealId:
            try:
                post.mealId = mealId
            except ValueError:
                return JsonResponse({'error': 'mealId must be an integer'}, status=400)
                
        post = Post.objects.create(user=user, content=content)
        post.save()

        return JsonResponse({'message': 'Post created successfully', 'post_id': post.id}, status=201)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)
        # return render(request, 'create_post.html')


@swagger_auto_schema(method='post', **toggle_like_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def toggle_like(request):
    if request.method == 'POST':
        try:
            postId = request.data.get('postId')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            
            try: 
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = request.user  # Get user from token authentication
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
            print(e)
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)
        # return render(request, 'toggle_like.html')


@swagger_auto_schema(method='post', **comment_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def comment(request):
    if request.method == 'POST':
        try:
            postId = request.data.get('postId')
            content = request.data.get('content')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            if not content:
                return JsonResponse({'error': 'content is required'}, status=400)
            
            try:
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = request.user  # Get user from token authentication
            post = Post.objects.get(id=postId)

            comment = Comment.objects.create(user=user, post=post, content=content)
            return JsonResponse({'message': 'Comment created successfully', 'comment_id': comment.id}, status=201)
        except Post.DoesNotExist:
            return JsonResponse({'error': 'Post not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)
        # return render(request, 'comment.html')


@swagger_auto_schema(method='post', **toggle_like_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def toggle_bookmark(request):
    if request.method == 'POST':
        try:
            postId = request.data.get('postId')

            if not postId:
                return JsonResponse({'error': 'postId is required'}, status=400)
            
            try:
                postId = int(postId)
            except ValueError:
                return JsonResponse({'error': 'postId must be an integer'}, status=400)
            
            user = request.user  # Get user from token authentication
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
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)
        # return render(request, 'toggle_bookmark.html')


@swagger_auto_schema(method='get', **liked_posts_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def liked_posts(request):
    if request.method == 'GET':
        user = request.user  # Get user from token authentication
        liked_posts = user.liked_posts.all().values()
        return JsonResponse({'liked_posts': list(liked_posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)
    

@swagger_auto_schema(method='get', **bookmarked_posts_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def bookmarked_posts(request):
    if request.method == 'GET':
        user = request.user  # Get user from token authentication
        bookmarked_posts = user.bookmarked_posts.all().values()
        return JsonResponse({'bookmarked_posts': list(bookmarked_posts)}, status=200)
    else:
        return JsonResponse({'error': 'Invalid method'}, status=405)