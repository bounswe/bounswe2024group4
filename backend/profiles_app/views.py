from django.shortcuts import render
from user_auth_app.models import User, Weight, Follow
from django.http import JsonResponse, HttpResponse
from swagger_docs.swagger import edit_profile_schema, view_profile_schema, user_programs_schema, user_workout_logs_schema
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.decorators import login_required
from exercise_program_app.models import Workout
from posts_app.models import Post
from diet_program_app.models import Meal
from rest_framework.authentication import TokenAuthentication


@swagger_auto_schema(method='post', **edit_profile_schema)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_profile(request):
    if request.method == 'POST':
        try:
            new_username = request.POST.get('username')
            new_email = request.POST.get('email')
            new_bio = request.POST.get('bio')
            new_profile_picture = request.FILES.get('profile_picture')
            new_weight = request.POST.get('weight')
            new_height = request.POST.get('height')
            new_password = request.POST.get('password')

            user = request.user  # Get user from token authentication

            if new_username:
                user.username = new_username
            if new_email:
                user.email = new_email
            if new_bio:
                user.bio = new_bio
            if new_profile_picture:
                user.profile_picture = new_profile_picture
            if new_weight:
                user.weight = new_weight
                Weight.objects.create(user=user, weight=new_weight)
            if new_height:
                user.height = new_height
            if new_password:
                user.set_password(new_password)

            user.save()
            return JsonResponse({'message': 'Profile updated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)
    return JsonResponse({'message': 'Invalid request method'}, status=405)



@swagger_auto_schema(method='get', **view_profile_schema)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def view_profile(request):
    if request.method == 'GET':
        viewing_user = request.user  # Get viewing user from token authentication
        viewed_username = request.GET.get('viewed_username')
        try:
            viewed_user = User.objects.get(username=viewed_username)
        except:
            return JsonResponse({'message': 'User not found'}, status=404)
        bio = viewed_user.bio
        profile_picture = viewed_user.profile_picture.url if viewed_user.profile_picture else ''
        score = viewed_user.score
        user_type = viewed_user.user_type

        following_count = Follow.objects.filter(follower=viewed_user).count()
        followers_count = Follow.objects.filter(following=viewed_user).count()

        # is_following = user.following.filter(username=user.username).exists()
        is_following = Follow.objects.filter(follower=viewing_user, following=viewed_user).exists()
        email = viewed_user.email
        weight_history = Weight.objects.filter(user=viewed_user)
        height = viewed_user.height

        posts = Post.objects.filter(user=viewed_user)
        workouts = Workout.objects.filter(created_by=viewed_user)
        meals = Meal.objects.filter(created_by=viewed_user)

        context = {
            'username': viewed_username,
            'email': email,
            'bio': bio,
            'profile_picture': profile_picture,
            'score': score,
            'weight_history': [{'weight': weight.weight, 'date': weight.created_at} for weight in weight_history],
            'height': height,
            'following_count': following_count,
            'followers_count': followers_count,
            'is_following': is_following,
            'user_type': user_type,
            'posts': list(reversed([{
                'post_id': post.id,
                'user': post.user.username,
                'content': post.content,
                'workout_id': post.workout.workout_id if post.workout else None,
                'meal_id': post.mealId,
                'like_count': post.likeCount,
                'created_at': post.created_at,
                'liked': viewing_user in post.liked_by.all(),
                } for post in posts])),
            'workouts': list(reversed([{'workout_id': workout.workout_id} for workout in workouts])),
            'meals': list(reversed([{'meal_id': meal.meal_id} for meal in meals])),
        }

        return JsonResponse(context, status=200)



