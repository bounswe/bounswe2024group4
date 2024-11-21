# profiles_app/urls.py
from django.urls import path
from .views import get_leaderboard, follow

urlpatterns = [
    path('get_leaderboard/', get_leaderboard, name='get_leaderboard'),
    path('follow/', follow, name='follow'),
    path('unfollow/', unfollow, name='unfollow'),
]
