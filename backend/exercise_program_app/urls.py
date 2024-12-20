"""
URL configuration for fitness_project project.

The ⁠ urlpatterns ⁠ list routes URLs to views. For more information please see:
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
from django.urls import path
from exercise_program_app import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('workout_program/', views.workout_program, name='workout_program'),
    path('create-program/', views.create_program, name='create_program'),
    path('rate_workout/', views.rate_workout, name='rate_workout'),
    path('workout/<int:workout_id>/', views.get_workout_by_id, name='get_workout_by_id'),
    path('workouts/user/<int:user_id>/', views.get_workouts_by_user_id, name='get_workouts_by_user_id'),
    
]