# profiles_app/urls.py
from django.urls import path
from .views import view_profile, edit_profile

urlpatterns = [
    path('view_profile/', view_profile, name='view_profile'),
    path('edit_profile/', edit_profile, name='edit_profile'),
]
