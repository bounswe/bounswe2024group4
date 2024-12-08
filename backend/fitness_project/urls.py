"""
URL configuration for fitness_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from exercise_program_app import views as exercise_program_views
from user_auth_app import views as auth_views
from profiles_app import views as profile_views
from simple_features_app import views as simple_features_views
from posts_app import views as post_views
from social_feed_app import views as social_feed_views
from diet_program_app import views as diet_program_views

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Fitness Forum",
        default_version="v1",
        description="API documentation for Fitness and Diet Forum with Swagger",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@fitnessforum.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    # Workout related endpoints
    path('workout_program/', exercise_program_views.workout_program, name='workout_program'), # Create a workout programs with exercises
    path('workouts/delete/<int:workout_id>/', exercise_program_views.delete_workout_by_id, name='delete_workout_by_id'),
    path('get_exercises/', exercise_program_views.get_exercises, name='get_exercises'), #Get exercises from api
    path('get-workout/<int:workout_id>/', exercise_program_views.get_workout_by_id, name='get_workout_by_id'), #Get a workout by id
    path('get-workouts/', exercise_program_views.get_workouts_by_username, name='get_workouts_by_username'),
    path('workout-log/<int:workout_id>/', exercise_program_views.workout_log, name='workout_log'), #Log a workout and exercises inside it
    path('workout-logs/', exercise_program_views.get_workout_logs_by_username, name='get_workout_logs_by_user_id'), #Get workout logs by username
    path('rate-workout/', exercise_program_views.rate_workout, name='rate_workout'), # Rate a workout
    path('create-program/', exercise_program_views.create_program, name='create_program'), # Create a weekly program
    path('get-programs/', exercise_program_views.get_programs_by_username, name='get_programs_by_user_id'), # Get weekly programs by username
    path('workouts/toggle-bookmark/', exercise_program_views.toggle_bookmark_workout, name='toggle_bookmark_workout'), # Bookmark a workout
    path('get-bookmarked-workouts/', exercise_program_views.get_bookmarked_workouts, name='get_bookmarked_workouts'), # Get bookmarked workouts by username
    # User auth related endpoints
    path('sign_up/', auth_views.sign_up, name='sign_up'),
    path('log_in/', auth_views.log_in, name='log_in'),
    path('log_out/', auth_views.log_out, name='log_out'),
    path('csrf_token/', auth_views.csrf_token, name='csrf_token'),
    path('session/', auth_views.session, name='session'),
    # Profile related endpoints
    path('edit_profile/', profile_views.edit_profile, name='edit_profile'),
    path('view_profile/', profile_views.view_profile, name='view_profile'),
    path('liked_posts/', post_views.liked_posts, name='liked_posts'),
    path('bookmarked_posts/', post_views.bookmarked_posts, name='bookmarked_posts'),
    # Feed related endpoints
    path('get_leaderboard/', simple_features_views.get_leaderboard, name='get_leaderboard'),
    path('get_workout_leaderboard/', simple_features_views.get_workout_leaderboard, name='get_workout_leaderboard'),
    path('get_meal_leaderboard/', simple_features_views.get_meal_leaderboard, name='get_meal_leaderboard'),
    path('post/', post_views.post, name='post'),
    path('toggle_like/', post_views.toggle_like, name='toggle_like'),
    path('comment/', post_views.comment, name='comment'),
    path('toggle_bookmark/', post_views.toggle_bookmark, name='toggle_bookmark'),
    path('feed/', social_feed_views.feed, name='feed'),
    path('following_feed/', social_feed_views.following_feed, name='following_feed'),
    path('follow/', simple_features_views.follow, name='follow'),
    path('unfollow/', simple_features_views.unfollow, name='unfollow'),
    # Meal related endpoints
    path('create_meal/', diet_program_views.create_meal, name='create_meal'),
    path('create_food_all/', diet_program_views.create_food_all, name='create_food_all'),
    path('create_food_superuser/', diet_program_views.create_food_superuser, name='create_food_superuser'),
    path('get_meal_from_id/', diet_program_views.get_meal_from_id, name='get_meal_from_id'),
    path('meals/delete/<int:workout_id>/', diet_program_views.delete_meal_by_id, name='delete_meal_by_id'),
    path('get_foodname_options/', diet_program_views.get_foodname_options, name='get_foodname_options'),
    path('rate_meal/', diet_program_views.rate_meal, name='rate_meal'),
    path('get_meals_by_username/', diet_program_views.get_meals_by_username, name='get_meals_by_username'),
    path('toggle_bookmark_meal/', diet_program_views.toggle_bookmark_meal, name='toggle_bookmark_meal'),
    path('get_bookmarked_meals_by_username/', diet_program_views.get_bookmarked_meals_by_username, name='get_bookmarked_meals_by_username'),
    # Swagger endpoints
    # re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    # path('my-programs/', profile_views.get_user_programs, name='get_user_programs'),
    # path('my-workout-logs/', profile_views.get_user_workout_logs, name='get_user_workout_logs'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)