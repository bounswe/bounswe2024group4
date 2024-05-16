from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.urls import reverse
from .models import User, Post, Comment, Follow, LikePost, LikeComment, Bookmark
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import requests
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import os

@swagger_auto_schema(
    method='post',
    operation_description="Register a new user",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email of the user'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password of the user'),
        },
        required=['username', 'email', 'password']
    ),
    responses={
        200: openapi.Response('User registered successfully'),
        400: 'Email or username already taken',
        500: 'Internal server error'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == "POST":
        # Access form data from POST request
        
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        #profile_picture = request.FILES.get("profile_picture")
        print("username: ", username, "email: ", email, "password: ", password)

        if User.objects.filter(email=email).exists():
            # Return an error httpresponse if email is already taken
            return HttpResponse("Email already taken.", status=400)

        if User.objects.filter(username=username).exists():
            # Return an error httpresponse if username is already taken
            return HttpResponse("Username already taken.", status=400)
        
        # Create and save user
        user = User.objects.create_user(username=username, email=email, password=password, profile_picture='profile_pictures/default_nba_app_pp.jpg')
        print("user created and saved: ", user)
        
        login(request, user)
        print("user_logged in: ", user)
        return JsonResponse({'username': username}, status=200)
            
    
    # Render the signup.html template for GET requests
    return render(request, 'signup.html')

@swagger_auto_schema(
    method='post',
    operation_description="Login a user with a username and password",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password of the user'),
        },
        required=['username', 'password'],
    ),
    responses={
        200: openapi.Response('Login successful', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        401: 'Invalid credentials',
        405: 'Method Not Allowed'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
@csrf_exempt
def log_in(request):
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return HttpResponse("Invalid credentials", status=401)

        login(request, user)
        return JsonResponse({'username': username}, status=200)

    return render(request, 'login.html')


@swagger_auto_schema(
    method='get',
    operation_description="Log out the current user",
    responses={
        200: openapi.Response('Logged out successfully'),
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def log_out(request):
    if request.method == "GET":
        logout(request)
        request.session.flush()
        return HttpResponse("Logged out successfully", status=200)


@swagger_auto_schema(
    method='post',
    operation_description="Create a new post with content and an optional image",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'content': openapi.Schema(type=openapi.TYPE_STRING, description='Content of the post'),
            'image': openapi.Schema(type=openapi.TYPE_FILE, description='Optional image for the post'),
        },
        required=['content'],
    ),
    responses={
        201: openapi.Response('Post created successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING),
            }
        )),
        400: 'Bad Request',
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
@login_required
def post(request):
    if request.method == 'POST':
        user = request.user
        content = request.data.get('content')
        image = request.FILES.get('image') if 'image' in request.FILES else None
        post = Post.objects.create(user=user, content=content, image=image)
        return Response({'message': f'Post created successfully with ID {post.post_id}'}, status=201)

    return render(request, 'post.html')

@swagger_auto_schema(
    method='post',
    operation_description="Create a comment on a specific post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'content': openapi.Schema(type=openapi.TYPE_STRING, description='Content of the comment'),
        },
        required=['content'],
    ),
    responses={
        201: openapi.Response('Comment created successfully'),
        404: 'Post not found'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_comment(request, post_id):
    if request.method == "POST":
        user = request.user
        content = request.data.get("content")
        
        try:
            post = Post.objects.get(post_id=post_id)
        except Post.DoesNotExist:
            return HttpResponse("Post not found", status=404)
        
        Comment.objects.create(user=user, content=content, post=post)
        
        return HttpResponseRedirect(f'/post_detail/{post_id}/')
        


    return render(request, 'comment.html', {'post_id': post_id})


#user like or unlike post
@swagger_auto_schema(
    method='post',
    operation_description="Like or unlike a specific post",
    responses={
        200: openapi.Response('Like/unlike status changed successfully'),
        404: 'Post not found',
        405: 'Only POST requests are allowed'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def like_or_unlike_post(request, post_id):
    if request.method == "POST":
        user = request.user
        post = Post.objects.get(post_id=post_id)

        like = LikePost.objects.filter(user=user, post=post).first()
        if like:
            like.delete()
            return JsonResponse({'message': 'Post unliked'}, status=200)
        else:
            LikePost.objects.create(user=user, post=post)
            return JsonResponse({'message': 'Post liked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)



#user like or unlike comment
# User like or unlike comment
@swagger_auto_schema(
    method='post',
    operation_description="Like or unlike a specific comment",
    responses={
        200: openapi.Response('Like/unlike status changed successfully'),
        404: 'Comment not found',
        405: 'Only POST requests are allowed'
    }
)
@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def like_or_unlike_comment(request, comment_id):
    if request.method == "POST":
        user = request.user
        comment = Comment.objects.get(comment_id=comment_id)

        like = LikeComment.objects.filter(user=user, comment=comment).first()
        if like:
            like.delete()
            return JsonResponse({'message': 'Comment unliked'}, status=200)
        else:
            LikeComment.objects.create(user=user, comment=comment)
            return JsonResponse({'message': 'Comment liked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)



#user bookmark or unbookmark post
@swagger_auto_schema(
    method='post',
    operation_description="Bookmark or unbookmark a post",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'message': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        405: openapi.Response('Method Not Allowed'),
        404: openapi.Response('Not Found'),
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def bookmark_or_unbookmark_post(request, post_id):
    if request.method == "POST":
        user = request.user
        post = Post.objects.get(post_id=post_id)

        bookmark = Bookmark.objects.filter(user=user, post=post).first()
        if bookmark:
            bookmark.delete()
            return JsonResponse({'message': 'Post unbookmarked'}, status=200)
        else:
            Bookmark.objects.create(user=user, post=post)
            return JsonResponse({'message': 'Post bookmarked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)




@swagger_auto_schema(
    method='get',
    operation_description="Retrieve details of a specific post including comments, likes, and bookmarks",
    responses={
        200: openapi.Response('Post details retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post': openapi.Schema(type=openapi.TYPE_STRING),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'image': openapi.Schema(type=openapi.TYPE_STRING, description='URL of the image'),
                'comments': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'content': openapi.Schema(type=openapi.TYPE_STRING),
                        'liked_by_user': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'likes_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )),
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'created_at': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                'user_has_liked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'likes_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'user_has_bookmarked': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, description='URL of the profile picture'),
            }
        )),
        404: 'Post not found',
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@login_required
def post_detail(request, post_id):
    post = get_object_or_404(Post, post_id=post_id)
    comments = post.comments.all()

    # Prepare comments list with like status
    comments_list = [{
        'id': comment.comment_id,
        'content': comment.content,
        'liked_by_user': LikeComment.objects.filter(user=request.user, comment=comment).exists(),
        'likes_count': LikeComment.objects.filter(comment=comment).count(),  # Count of likes for each comment
        'comment_username': comment.user.username,
        'comment_user_pp' : comment.user.profile_picture.url if comment.user.profile_picture else None
    } for comment in comments]

    # Prepare the image URL if the image exists
    image_url = post.image.url if hasattr(post, 'image') and post.image else None

    # Check if the current user has liked the post
    user_has_liked = LikePost.objects.filter(user=request.user, post=post).exists()

    # Count of likes on the post
    likes_count = LikePost.objects.filter(post=post).count()

    # Check if the current user has bookmarked the post
    user_has_bookmarked = Bookmark.objects.filter(user=request.user, post=post).exists()

    # Prepare the JSON data
    data = {
        'post': post.content,
        'post_id': post_id,
        'image': image_url,
        'comments': comments_list,
        'username': post.user.username,
        'created_at': post.created_at,
        'user_has_liked': user_has_liked,
        'likes_count': likes_count,  # Total likes for the post
        'user_has_bookmarked': user_has_bookmarked,
        'profile_picture': post.user.profile_picture.url if post.user.profile_picture else None
    }

    return JsonResponse(data, status=200)



@swagger_auto_schema(
    method='get',
    operation_description="Get the list of users the authenticated user is following",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'followings_info': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                ))
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_followings(request):
    user = request.user
    followings = user.following.all()
    followings_info = [{'user_id': following.user_id, 'username':following.username} for following in followings]
    return JsonResponse({'followings_info': followings_info}, status=200)




@swagger_auto_schema(
    method='post',
    operation_description="Get the list of users who are following the authenticated user",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'followers_info': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                ))
            }
        )),
        401: openapi.Response('Unauthorized'),
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def user_followers(request):
    user = request.user
    followers = user.followers.all()
    followers_info = [{'user_id': follower.user_id, 'username':follower.username} for follower in followers]
    return JsonResponse({'followers_info': followers_info}, status=200)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def get_users_like_post(request, post_id):
    post = Post.objects.get(post_id=post_id)
    likes = LikePost.objects.filter(post=post)
    user_info = [{'user_id' : like.user.user_id, 'username' : like.user.username} for like in likes]
    return JsonResponse({'user_info': user_info}, status=200)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def get_bookmarked_post_ids(request):
    user = request.user
    bookmarks = Bookmark.objects.filter(user=user)
    bookmarked_post_ids = [{'post_id' : bookmark.post.post_id} for bookmark in bookmarks]
    return JsonResponse({'posts': bookmarked_post_ids}, status=200)     

@swagger_auto_schema(
    method='post',
    operation_description="Update the authenticated user's profile information",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='New username'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='New email'),
            'profile_picture': openapi.Schema(type=openapi.TYPE_FILE, description='New profile picture'),
            'bio': openapi.Schema(type=openapi.TYPE_STRING, description='New bio'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='New password')
        },
        required=['username', 'email', 'bio', 'password'],
    ),
    responses={
        200: openapi.Response('Account information updated successfully.'),
        400: 'Bad request'
    }
)
@swagger_auto_schema(
    method='get',
    operation_description="Retrieve the authenticated user's profile information",
    responses={
        200: openapi.Response('Profile information retrieved successfully', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'bio': openapi.Schema(type=openapi.TYPE_STRING),
                'following_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'followers_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, description='URL of the profile picture'),
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'post_id': openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                ))
            }
        )),
        401: 'Unauthorized'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
@login_required
def profile_view_edit_auth(request):
    if request.method == 'POST':
        new_username = request.POST.get('username')
        new_email = request.POST.get('email')
        new_profile_picture = request.FILES.get('profile_picture')
        new_bio = request.POST.get('bio')
        new_password = request.POST.get('password')
        
        user = request.user
        
        # Update username if provided
        if new_username:
            user.username = new_username
        
        # Update email if provided
        if new_email:
            user.email = new_email
        
        # Update profile picture if provided
        if new_profile_picture:
            if user.profile_picture.url != '/media/profile_pictures/default_nba_app_pp.jpg':
                os.remove(user.profile_picture.path)
            user.profile_picture = new_profile_picture
        
        # Update bio if provided
        if new_bio:
            user.bio = new_bio

        # Update password if provided
        if new_password:
            user.set_password(new_password)
        
        user.save()
        
        return JsonResponse({'message': 'Account information updated successfully.'}, status=200)

    if request.method == 'GET':
        user = request.user
        following_count = user.following.count()
        followers_count = user.followers.count()
        posts = Post.objects.filter(user=user)
        data = {
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'following_count': following_count,
            'followers_count': followers_count,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'posts': list(reversed([{'post_id': post.post_id} for post in posts]))
        }
        return JsonResponse(data, status=200)
    

@swagger_auto_schema(
    method='get',
    operation_description="View or edit profile information of other users",
    responses={
        200: openapi.Response('Success', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'bio': openapi.Schema(type=openapi.TYPE_STRING),
                'following_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'followers_count': openapi.Schema(type=openapi.TYPE_INTEGER),
                'profile_picture': openapi.Schema(type=openapi.TYPE_STRING, format='url', description='URL of the profile picture'),
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                    }
                )),
                'is_following': openapi.Schema(type=openapi.TYPE_BOOLEAN, description='True if the authenticated user is following the user, False otherwise, None if the authenticated user is the user'),
            }
        )),
        401: openapi.Response('Unauthorized'),
        404: openapi.Response('Not Found'),
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view_edit_others(request, username):
    user = User.objects.get(username=username)
    following_count = user.following.count()
    followers_count = user.followers.count()

    if request.user == user:
        is_following = None
    else:
        is_following = Follow.objects.filter(follower=request.user, followed=user).exists()
    
    posts = Post.objects.filter(user=user)

    data = {
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'following_count': following_count,
        'followers_count': followers_count,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'posts': list(reversed([{'post_id': post.post_id} for post in posts])),
        'is_following': is_following, # True if the authenticated user is following the user, False otherwise, None if the authenticated user is the user
    }

    return JsonResponse(data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    email = request.POST.get('email')
    username = request.POST.get('username')
    new_password = request.POST.get('new_password')
    
    # Check if either email or username is provided
    if not email and not username:
        return JsonResponse({'error': 'Email address or username is required in the request.'}, status=400)
    
    # Retrieve the user by email or username
    user = None
    if email:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            pass
    elif username:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            pass
    
    if not user:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if new password is provided
    if not new_password:
        return JsonResponse({'error': 'New password is required.'}, status=400)
    
    # Set the new password
    user.set_password(new_password)
    user.save()
    
    return JsonResponse({'message': 'Password reset successful.'}, status = 200)


@swagger_auto_schema(
    method='post',
    operation_description="Follow a user",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user to follow'),
        },
        required=['username']
    ),
    responses={
        200: 'Success response',
        400: 'Bad Request',
        404: 'Not Found',
        405: 'Method Not Allowed'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    

    if request.user.username == username:
        return JsonResponse({'error': 'You cannot follow yourself.'}, status=400)
    
    # Retrieve the user to follow
    try:
        followed_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if the user is already following the given user
    already_following = Follow.objects.filter(follower=request.user, followed=followed_user).exists()
    if already_following:
        return JsonResponse({'message': 'You are already following this user.'}, status = 400)
    
    # Create a new follow instance
    Follow.objects.create(follower=request.user, followed=followed_user)
    return JsonResponse({'message': 'You have successfully followed the user.'}, status=200)


@swagger_auto_schema(
    method='post',
    operation_description="Unfollow a user",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Username of the user to unfollow'),
        },
        required=['username']
    ),
    responses={
        200: 'Success response',
        400: 'Bad Request',
        404: 'Not Found',
        405: 'Method Not Allowed'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    
    # Retrieve the user to unfollow
    try:
        followed_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if the user is already not following the given user
    follow_instance = Follow.objects.filter(follower=request.user, followed=followed_user).first()
    if not follow_instance:
        return HttpResponse('You are not following this user.', status=400)
    
    # Delete the follow instance
    follow_instance.delete()
    return JsonResponse({'message': 'You have successfully unfollowed the user.'}, status=200)


@swagger_auto_schema(
    method='post',
    operation_description="Get the list of posts from users the authenticated user is following",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'post_ids': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_INTEGER))
            }
        )),
        401: 'Unauthorized'
    }
)
@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
@login_required
def feed(request):
    # Only authenticated users can access this view
    user = request.user
    following = user.following.all()
    post_ids = []
    for follow in following:
        posts = Post.objects.filter(user=follow)
        for post in posts:
            post_ids.append(post.post_id)
    post_ids += [post.post_id for post in Post.objects.filter(user=user)]
    #post_ids = list(post_ids.sort())
    #post_ids = post_ids.sort(reverse=True)
    post_ids.sort(reverse=True)
    return JsonResponse({'post_ids': post_ids}, status=200)

    #all_feed_posts = [Post.objects.filter(user=follow.user) for follow in following]
    #return info of the posts
    #is_like = LikePost.objects.filter(user=user, post=post).exists()
    #return JsonResponse({'all_feed_posts': [{'post_id':post.post_id, 'content': post.content, 'created_at': post.created_at, 'image':post.image} for post in all_feed_posts]}, status=200)


@swagger_auto_schema(
    method='get',
    operation_description="Search for a team, player, or post",
    manual_parameters=[
        openapi.Parameter('query', openapi.IN_QUERY, description='Search query', type=openapi.TYPE_STRING)
    ],
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'team': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'team': openapi.Schema(type=openapi.TYPE_STRING),
                    'id': openapi.Schema(type=openapi.TYPE_STRING)
                }),
                'player': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'player': openapi.Schema(type=openapi.TYPE_STRING),
                    'id': openapi.Schema(type=openapi.TYPE_STRING)
                }),
                'posts': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(type=openapi.TYPE_INTEGER)
                    }
                ))
            }
        )),
        500: 'Internal server error'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    if request.method == "GET" and "query" in request.GET:
        query = request.GET.get("query")
        print("query:", query)
        try:
            team = search_team(query)
            print("team:", team)
            player = search_player(query)
            print("player:", player)
            posts = Post.objects.filter(content__icontains=query)
            return JsonResponse({'team': team, 'players': player, 'posts': list(reversed([{'id': post.post_id} for post in posts]))}, status=200)

        except:
            return JsonResponse({"error:": "error in search, please try again"})
        
   
        

    #return render(request, 'search.html')


def search_player(query):
    # SPARQL query to retrieve all instances of teams
    sparql_query = '''
        SELECT DISTINCT ?item ?itemLabel ?image ?height ?date_of_birth WHERE {
            ?item (wdt:P3647) [].
            ?item rdfs:label ?itemLabel.
            ?item (wdt:P18) ?image.
            ?item (wdt:P2048) ?height.
            ?item (wdt:P569) ?date_of_birth                    
            FILTER(lang(?itemLabel) = "en" && contains(lcase(?itemLabel), "''' + query.lower() + '''")).
        }
    '''
    endpoint_url = "https://query.wikidata.org/sparql"
    #print(sparql_query)
    response = requests.get(endpoint_url, params={'format': 'json', 'query': sparql_query})
    data = response.json()
    print("data:", data)
    players = []
    if response.status_code == 500:
        return {"response:": "error, please try a different query"}
    elif data['results']['bindings'] == []:
        return players
    
    for player_bindings in data['results']['bindings']:
        image = player_bindings['image']['value']
        height = player_bindings['height']['value']
        date_of_birth = player_bindings['date_of_birth']['value']
        url_lst = player_bindings['item']['value'].split('/')
        for item in url_lst:
            if 'Q' in item:
                player_id = item
                players.append([player_bindings['itemLabel']['value'], player_id, image, height, date_of_birth])
    return players


def search_team(query):
    teams = [ ["atlanta", "hawks", "atlanta hawks"], 
             ["boston", "celtics", "boston celtics"], 
             ["brooklyn", "nets", "brooklyn nets"], 
             ["charlotte", "hornets", "charlotte hornets"], 
             ["chicago", "bulls", "chicago bulls"], 
             ["cleveland", "cavaliers", "cleveland cavaliers"], 
             ["dallas", "mavericks", "dallas mavericks"], 
             ["denver", "nuggets", "denver nuggets"], 
             ["detroit", "pistons", "detroit pistons"], 
             ["golden state", "warriors", "golden state warriors"], 
             ["houston", "rockets", "houston rockets"],
             ["indiana", "pacers", "indiana pacers"],
             ["angeles", "clippers", "los angeles clippers"],
             ["angeles", "lakers", "los angeles lakers"],
             ["memphis", "grizzlies", "memphis grizzlies"],
             ["miami", "heat", "miami heat"],
             ["milwaukee", "bucks", "milwaukee bucks"],
             ["minnesota", "timberwolves", "minnesota timberwolves"],
             ["new orleans", "pelicans", "new orleans pelicans"],
             ["new york", "knicks", "new york knicks"],
             ["oklahoma", "city", "thunder", "oklahoma city thunder"],
             ["orlando", "magic", "orlando magic"],
             ["philadelphia", "76ers", "philadelphia 76ers"],
             ["phoenix", "suns", "phoenix suns"],
             ["portland", "trail", "blazers", "portland trail blazers"],
             ["sacramento", "kings", "sacramento kings"],
             ["san antonio", "spurs", "san antonio spurs"],
             ["toronto", "raptors", "toronto raptors"],
             ["utah", "jazz", "utah jazz"],
             ["washington", "wizards", "washington wizards"]]
    
    team_lst = []
    if query == 'los angeles' or query == 'los':
        team_lst = ['los angeles lakers', 'los angeles clippers']
    else:
        for team in teams:
            for word in team:
                if query.lower() == word:
                    team_lst = [team[2]]
                    break
    if team_lst == []:
        return team_lst
    
    url = 'https://www.wikidata.org/w/api.php'
    try:
        teams = []
        for team_name in team_lst:
            response1 = requests.get(url, params = {'action': 'wbsearchentities', 'format': 'json', 'search': team_name, 'language': 'en'})
            data1 = response1.json()
            id = data1['search'][0]['id']
            teams.append([team_name, id])
        return teams
    except:
        return {"error:": "error, please try again"}


@swagger_auto_schema(
    method='get',
    operation_description="Get the details of a team",
    manual_parameters=[
        openapi.Parameter('id', openapi.IN_QUERY, description='ID of the team', type=openapi.TYPE_STRING)
    ],
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'conference': openapi.Schema(type=openapi.TYPE_STRING),
                'coach': openapi.Schema(type=openapi.TYPE_STRING),
                'division': openapi.Schema(type=openapi.TYPE_STRING),
                'venue': openapi.Schema(type=openapi.TYPE_STRING),
                'venue_latitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'venue_longitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'image': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        500: 'Internal server error'
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def team(request):
    if request.method == "GET" and "id" in request.GET:
        """
        id = request.GET.get("id")
        sparql_query = '''
            SELECT DISTINCT ?item ?itemLabel ?image ?coachLabel ?divisionLabel ?conferenceLabel ?venueLabel ?venue_location 
            WHERE {
                ?item (wdt:P31) [].
                ?item rdfs:label ?itemLabel.
                OPTIONAL {
                    ?item (wdt:P286) ?coach.
                    ?coach rdfs:label ?coachLabel. FILTER(LANG(?coachLabel) = "en").
                }
                OPTIONAL {
                    ?item (wdt:P361) ?division.
                    ?division rdfs:label ?divisionLabel. FILTER(LANG(?divisionLabel) = "en").
                }
                ?item (wdt:P154) ?image.
                OPTIONAL {
                    ?division (wdt:P361) ?conference.
                    ?conference rdfs:label ?conferenceLabel. FILTER(LANG(?conferenceLabel) = "en").
                }
                OPTIONAL {
                    ?item (wdt:P115) ?venue.
                    ?venue rdfs:label ?venueLabel. FILTER(LANG(?venueLabel) = "en").
                }
                ?venue (wdt:P625) ?venue_location.
                FILTER(lang(?itemLabel) = "en" && ?item = wd:'''+ id +''')
            }
            LIMIT 1
        '''
        endpoint_url = "https://query.wikidata.org/sparql"
        try:
            response = requests.get(endpoint_url, params={'format': 'json', 'query': sparql_query})
            data = response.json()
            #print("data:", data)   
            bindings = data['results']['bindings'][0]
            if 'venue_location' in bindings:
                venue_location = bindings['venue_location']['value']
                venue_longitude = venue_location.split(' ')[0].replace('Point(', '')
                venue_latitude = venue_location.split(' ')[1].replace(')', '')
            else:
                venue_latitude = None
                venue_longitude = None
            return JsonResponse({'name': bindings['itemLabel']['value'],
                                'image': bindings['image']['value'] if 'image' in bindings else None,
                                'coach': bindings['coachLabel']['value'] if 'coachLabel' in bindings else None,
                                'division': bindings['divisionLabel']['value'] if 'divisionLabel' in bindings else None,
                                'conference': bindings['conferenceLabel']['value'] if 'conferenceLabel' in bindings else None,
                                'venue': bindings['venueLabel']['value'] if 'venueLabel' in bindings else None,
                                'venue_latitude': venue_latitude,
                                'venue_longitude': venue_longitude}, status=200)
                            
        except:
            return JsonResponse({"error:": "error, please try again"}, status=500)
        """
        
        id = request.GET.get("id")
        try:
            url = 'https://www.wikidata.org/w/api.php'
            response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
            data = response.json()
            data_entitites_id = data['entities'][id]
            try:
                name = data_entitites_id['labels']['en']['value']
            except:
                name = None
            try:
                venue_temp = data_entitites_id['claims']['P115']
                venue_id = venue_temp[len(venue_temp)-1]['mainsnak']['datavalue']['value']['id']
                response_ven = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': venue_id, 'language': 'en'})
                data_ven = response_ven.json()
                venue = data_ven['entities'][venue_id]['labels']['en']['value']
                try:
                    venue_loc = data_ven['entities'][venue_id]['claims']['P625'][0]['mainsnak']['datavalue']['value']
                    venue_latitude = venue_loc['latitude']
                    venue_longitude = venue_loc['longitude']
                except:
                    venue_latitude = None
                    venue_longitude = None
            except:
                venue = None
            try:
                coach_id = data_entitites_id['claims']['P286'][0]['mainsnak']['datavalue']['value']['id']
                coach = get_label(coach_id)
            except: 
                coach = None
            try:
                division_id = data_entitites_id['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
                response_div = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': division_id, 'language': 'en'})
                data_div = response_div.json()
                division = data_div['entities'][division_id]['labels']['en']['value']
                try:
                    conference_id = data_div['entities'][division_id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
                    conference = get_label(conference_id)
                except:
                    conference = None
            except: 
                division = None
                conference = None
            try:
                image_name = data_entitites_id['claims']['P154'][0]['mainsnak']['datavalue']['value']
                image_url = f'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/{image_name}&width=300'
            except:
                image_url = None
            return JsonResponse({'name': name,
                                 'conference': conference, 
                                 'coach': coach, 
                                 'division': division, 
                                 'venue': venue,
                                 'venue_latitude': venue_latitude,
                                 'venue_longitude': venue_longitude,
                                 'image': image_url}, status=200)
        except:
            return JsonResponse({"error:": "error, please try again"}, status=500)


def get_label(id):
    url = 'https://www.wikidata.org/w/api.php'
    response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
    data = response.json()
    try:
        return data['entities'][id]['labels']['en']['value'] 
    except:
        return None


@swagger_auto_schema(
    method='get',
    operation_description="Get the details of a player",
    manual_parameters=[
        openapi.Parameter('id', openapi.IN_QUERY, description='ID of the player', type=openapi.TYPE_STRING)
    ],
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'height': openapi.Schema(type=openapi.TYPE_STRING),
                'date_of_birth': openapi.Schema(type=openapi.TYPE_STRING),
                'instagram': openapi.Schema(type=openapi.TYPE_STRING),
                'teams': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'team_name': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                        'start': openapi.Schema(type=openapi.TYPE_STRING),
                        'end': openapi.Schema(type=openapi.TYPE_STRING)
                    })
                }),
                'positions': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                'awards': openapi.Schema(type=openapi.TYPE_OBJECT, properties={
                    'award_name': openapi.Schema(type=openapi.TYPE_STRING)
                }),
                'image': openapi.Schema(type=openapi.TYPE_STRING)
            }
        )),
        500: 'Internal server error'
    }
)    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def player(request):

    if request.method == "GET" and "id" in request.GET:
        """
        id = request.GET.get("id")
        sparql_query = '''
            SELECT DISTINCT ?item ?itemLabel ?image ?height ?date_of_birth ?insta
                (GROUP_CONCAT(DISTINCT ?teamLabel; separator=", ") AS ?teams) 
                (GROUP_CONCAT(DISTINCT ?positionLabel; separator=", ") AS ?positions)
                (GROUP_CONCAT(DISTINCT ?awardLabel ?awardDate; separator=", ") AS ?awards)
            WHERE {
                ?item (wdt:P3647) [].
                ?item rdfs:label ?itemLabel.
                OPTIONAL { ?item (wdt:P18) ?image. }
                OPTIONAL { ?item (wdt:P2048) ?height. }
                OPTIONAL { ?item (wdt:P569) ?date_of_birth. }
                OPTIONAL { ?item (wdt:P2003) ?insta. }
                OPTIONAL { 
                    ?item (wdt:P166) ?award.
                    ?award rdfs:label ?awardLabel.
                    ?award (wdt:P585) ?awardDate.
                    FILTER(lang(?awardLabel) = "en") 
                }

                OPTIONAL { 
                    ?item (wdt:P54) ?team.
                    ?team rdfs:label ?teamLabel. 
                    FILTER(lang(?teamLabel) = "en") 
                }
                OPTIONAL { 
                    ?item (wdt:P413) ?position.
                    ?position rdfs:label ?positionLabel. 
                    FILTER(lang(?positionLabel) = "en") 
                }

                FILTER(lang(?itemLabel) = "en" && ?item = wd:''' + id + ''')
            }
            GROUP BY ?item ?itemLabel ?image ?height ?date_of_birth ?insta
            LIMIT 1
            '''

 

        endpoint_url = "https://query.wikidata.org/sparql"
        try:
            response = requests.get(endpoint_url, params={'format': 'json', 'query': sparql_query})
            data = response.json()
            bindings = data['results']['bindings'][0]
            try:
                team_lst = bindings['teams']['value'].split(', ') if bindings['teams']['value'] != "" else [],
                teams = {}
                for item in team_lst:
                    if bindings['teams']['value'] != "":
                    
                    team = get_label(team_id)
                    try:
                        start = item['qualifiers']['P580'][0]['datavalue']['value']['time']
                    except:
                        start = None
                    try:
                        end = item['qualifiers']['P582'][0]['datavalue']['value']['time']
                    except:
                        end = None
                    teams[team] = {'start': start, 'end': end}
            except:
                teams = []
            return JsonResponse({'name': bindings['itemLabel']['value'] if 'itemLabel' in bindings else None,
                                'image': bindings['image']['value'] if 'image' in bindings else None,
                                'height': bindings['height']['value'] if 'height' in bindings else None,
                                'date_of_birth': bindings['date_of_birth']['value'] if 'date_of_birth' in bindings else None,
                                'instagram': bindings['insta']['value'] if 'insta' in bindings else None,
                                'teams': bindings['teams']['value'].split(', ')  else [],
                                'positions': bindings['positions']['value'].split(', ') if bindings['positions']['value'] != "" else [],
                                'awards': awards
                                }, status=200)
        except:
            return JsonResponse({"error:": "error, please try again"}, status=500)
        """    

        id = request.GET.get("id")
        try:
            url = 'https://www.wikidata.org/w/api.php'
            response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
            data = response.json()
            data_entitites_id = data['entities'][id]
            try:
                name = data_entitites_id['labels']['en']['value']
            except:
                name = None
            try:
                height = data_entitites_id['claims']['P2048'][0]['mainsnak']['datavalue']['value']['amount']
            except:
                height = None
            try:
                date_of_birth = data_entitites_id['claims']['P569'][0]['mainsnak']['datavalue']['value']['time']
            except:
                date_of_birth = None
            try:
                insta = data_entitites_id['claims']['P2003'][0]['mainsnak']['datavalue']['value']
            except:
                insta = None
            try:
                position_lst = data_entitites_id['claims']['P413']
                positions = list_wikidata_property(position_lst)
            except:
                positions = []
            try:
                team_lst = data_entitites_id['claims']['P54']
                teams = {}
                for item in team_lst:
                    team_id = item['mainsnak']['datavalue']['value']['id']
                    team = get_label(team_id)
                    try:
                        start = item['qualifiers']['P580'][0]['datavalue']['value']['time']
                    except:
                        start = None
                    try:
                        end = item['qualifiers']['P582'][0]['datavalue']['value']['time']
                    except:
                        end = None
                    teams[team] = {'start': start, 'end': end}
            except:
                teams = []
            try:
                award_lst = data_entitites_id['claims']['P166']
                awards = {}
                for item in award_lst:
                    award_id = item['mainsnak']['datavalue']['value']['id']
                    award = get_label(award_id)
                    try:
                        year = item['qualifiers']['P585'][0]['datavalue']['value']['time']
                    except:
                        year = None
                    awards[award] = year
            except:
                awards = []
            try:
                image_name = data_entitites_id['claims']['P18'][0]['mainsnak']['datavalue']['value']
                image_url = f'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/{image_name}&width=300'
            except:
                image_url = None
            return JsonResponse({'name': name, 
                                 'height': height, 
                                 'date_of_birth': date_of_birth, 
                                 'instagram': insta, 
                                 'teams': teams, 
                                 'positions': positions,
                                 'awards': awards,
                                 'image': image_url}, status=200)
                                 
        except:
            return JsonResponse({"error:": "error, please try again"}, status=500)


def list_wikidata_property(lst):
    names = []
    for item in lst:
        item_id = item['mainsnak']['datavalue']['value']['id']
        name = get_label(item_id)
        names.append(name)
    return names


@swagger_auto_schema(
    method='get',
    operation_description="Get the CSRF token",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'csrf_token': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ))
    }
)
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token}, status=200)


@swagger_auto_schema(
    method='get',
    operation_description="Get the session status",
    responses={
        200: openapi.Response('Success response', openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'session': openapi.Schema(type=openapi.TYPE_BOOLEAN)
            }
        ))
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session(request):
    if request.method == "GET":
        session = request.session
        return JsonResponse({'session': session.session_key != None }, status=200)

