from django.urls import path
from . import views


urlpatterns = [
    path('signup/', views.sign_up, name='signup'),
    path('login/', views.log_in, name='login'),
    path('feed/', views.feed, name='feed'),
    path('profile_info/', views.profile_info, name='profile_info'),
    path('follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('unfollow/<int:user_id>/', views.unfollow_user, name='unfollow_user'),
    path('post/', views.post, name='post'),
    path('search/', views.search, name='search'),
    path('team/', views.team, name='team'),
    path('player/', views.player, name='player'),
    path('csrf_token/', views.csrf_token, name='csrf_token'),
    path('session/', views.session, name='session'),
    path('log_out/', views.log_out, name='log_out')
]