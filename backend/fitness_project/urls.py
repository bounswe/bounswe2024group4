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
from django.urls import path, include
from exercise_program_app import views
from user_auth_app import views as auth_views


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('posts/', include('posts_app.urls')),
    path('profiles/', include('profiles_app.urls')),
    #path('programs/', include('programs_app.urls')),
    path('feed/', include('social_feed_app.urls')),
    path('messages/', include('messaging_app.urls')),
    path('search/', include('search_app.urls')),
    path('auth/', include('user_auth_app.urls')),
    path('diet-program/', include('diet_program_app.urls')),
    path('exercise-program/', include('exercise_program_app.urls')),

    path('workout_program/', views.workout_program, name='workout_program'),
    path('get_exercises/', views.get_exercises, name='get_exercises'),
    path('sign_up/', auth_views.sign_up, name='sign_up'),
    path('log_in/', auth_views.log_in, name='log_in'),
    path('log_out/', auth_views.log_out, name='log_out'),
]

