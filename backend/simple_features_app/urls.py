# profiles_app/urls.py
from django.urls import path
from .views import get_leaderboard, follow, unfollow, get_workout_leaderboard, get_meal_leaderboard

urlpatterns = [
    path('get_leaderboard/', get_leaderboard, name='get_leaderboard'),
    path('get_workout_leaderboard/', get_workout_leaderboard, name='get_workout_leaderboard'),
    path('get_meal_leaderboard/', get_meal_leaderboard, name='get_meal_leaderboard'),
    path('follow/', follow, name='follow'),
    path('unfollow/', unfollow, name='unfollow'),
]
