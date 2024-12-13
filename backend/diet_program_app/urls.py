# diet_program_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('create_meal/', views.create_meal, name='create_meal'),
    path('create_food_all/', views.create_food_all, name='create_food_all'),
    path('create_food_superuser/', views.create_food_superuser, name='create_food_superuser'),
    path('get_meal_from_id/', views.get_meal_from_id, name='get_meal_from_id'),
    path('meals/delete/<int:workout_id>/', views.delete_meal_by_id, name='delete_meal_by_id'),
    path('get_foodname_options/', views.get_foodname_options, name='get_foodname_options'),
    path('rate_meal/', views.rate_meal, name='rate_meal'),
    path('get_meals_by_user_id/', views.get_meals_by_user_id, name='get_meals_by_user_id'),
    path('toggle_bookmark_meal/', views.toggle_bookmark_meal, name='toggle_bookmark_meal'),
    path('get_bookmarked_meals_by_user_id/', views.get_bookmarked_meals_by_user_id, name='get_bookmarked_meals_by_user_id'),
]
