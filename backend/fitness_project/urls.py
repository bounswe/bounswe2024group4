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
from exercise_program_app import views as exercise_program_views
from user_auth_app import views as auth_views
from profiles_app import views as profile_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('workout_program/', exercise_program_views.workout_program, name='workout_program'),
    path('get_exercises/', exercise_program_views.get_exercises, name='get_exercises'),
    path('create-program/', exercise_program_views.create_program, name='create_program'),
    path('log-workout/', exercise_program_views.log_workout, name='log_workout'),
    path('sign_up/', auth_views.sign_up, name='sign_up'),
    path('log_in/', auth_views.log_in, name='log_in'),
    path('log_out/', auth_views.log_out, name='log_out'),
    path('edit_profile/', profile_views.edit_profile, name='edit_profile'),
    path('view_profile/', profile_views.view_profile, name='view_profile'),
    path('my-programs/', profile_views.get_user_programs, name='get_user_programs'),
    path('my-workout-logs/', profile_views.get_user_workout_logs, name='get_user_workout_logs'),

]

