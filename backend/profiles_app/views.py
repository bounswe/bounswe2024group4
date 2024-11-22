from django.shortcuts import render
from user_auth_app.models import User, Weight
from django.http import JsonResponse, HttpResponse
from swagger_docs.swagger import edit_profile_schema, view_profile_schema, user_programs_schema, user_workout_logs_schema
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view, permission_classes
from exercise_program_app.models import WeeklyProgram
from django.contrib.auth.decorators import login_required



@api_view(['POST'])
@swagger_auto_schema(**edit_profile_schema)
def edit_profile(request):
    if request.method == 'POST':
        try:
            new_username = request.POST.get('username')
            new_email = request.POST.get('email')
            new_bio = request.POST.get('bio')
            new_profile_picture = request.POST.get('profile_picture')
            new_weight = request.POST.get('weight')
            new_height = request.POST.get('height')
            new_password = request.POST.get('password')

            user = request.user

            if new_username:
                user.username = new_username
            if new_email:
                user.email = new_email
            if new_bio:
                user.bio = new_bio
            if new_profile_picture:
                # customla aynı değilse ögeyi silmeyi ekle
                user.profile_picture = new_profile_picture
            if new_weight:
                user.weight = new_weight
                print(user.weight)
                Weight.objects.create(user=user, weight=new_weight)
            if new_height:
                user.height = new_height
            if new_password:
                user.set_password(new_password)

            user.save()
            return render(request, 'edit_profile.html')
            # return JsonResponse({'message': 'Profile updated successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=400)
    return render(request, 'edit_profile.html')    
    # return JsonResponse({'message': 'Invalid request method'}, status=405)


@api_view(['GET'])
@swagger_auto_schema(**view_profile_schema)
def view_profile(request):
    if request.method == 'GET':
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        bio = user.bio
        profile_picture = user.profile_picture.url if user.profile_picture else None
        score = user.score
        following_count = user.following.count()
        followers_count = user.followers.count()

        if request.user == user: # If user is viewing their own profile
            is_following = None
            email = user.email
            weight_history = Weight.objects.filter(user=user)
            height = user.height
        else:
            is_following = user.followers.filter(username=request.user.username).exists()
            email = None
            weight_history = []
            height = None

        # posts = Post.objects.filter(user=user)
        # workouts = Workout.objects.filter(user=user)
        # meals = Diet.objects.filter(user=user)

        context = {
            'username': username,
            'email': email,
            'bio': bio,
            'profile_picture': profile_picture,
            'score': score,
            'weight_history': [{'weight': weight.weight, 'date': weight.created_at} for weight in weight_history],
            'height': height,
            'following_count': following_count,
            'followers_count': followers_count,
            'is_following': is_following,
            # 'posts': list(reversed([{'post_id': post.post_id} for post in posts])),
            # 'workouts': list(reversed([{'workout_id': workout.workout_id} for workout in workouts])),
            # 'meals': list(reversed([{'meal_id': meal.meal_id} for meal in meals])),
        }

    return JsonResponse(context, status=200)



@api_view(['GET'])
@swagger_auto_schema(**user_programs_schema)
@login_required
def get_user_programs(request):
    try:
        programs = WeeklyProgram.objects.filter(created_by=request.user)
        
        programs_data = []
        for program in programs:
            workout_days = []
            for day in program.workout_days.all().order_by('day_of_week'):
                workout_days.append({
                    'day': day.get_day_of_week_display(),
                    'workout': {
                        'id': day.workout.workout_id,
                        'name': day.workout.workout_name
                    }
                })
                
            programs_data.append({
                'program_id': program.program_id,
                'days_per_week': program.days_per_week,
                'created_at': program.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'workout_days': workout_days
            })
        
        return JsonResponse({
            'status': 'success',
            'user': {
                'id': request.user.user_id,
                'username': request.user.username,
                'email': request.user.email
            },
            'programs': programs_data
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)

