from django.urls import path
from . import views


urlpatterns = [
    path('signup/', views.sign_up, name='signup'),
    path('login/', views.log_in, name='login'),
    path('feed/', views.feed, name='feed'),
    path('post/', views.post, name='post'),
    path('search/', views.search, name='search'),
    path('csrf_token/', views.csrf_token, name='csrf_token'),
    path('session/', views.session, name='session'),
]