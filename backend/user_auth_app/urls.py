# user_auth_app/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
   # path('login/', auth_views.LoginView.as_view(template_name='user_auth_app/login.html'), name='login'),
  #  path('signup/', views.signup_view, name='signup'),
    #path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    # Add other auth-related URLs...
]
