from django.contrib import admin
from django.urls import path
from .views import sign_up, log_in, log_out, csrf_token, session

urlpatterns = [
  path('sign_up/', sign_up, name='sign_up'),
  path('log_in/', log_in, name='log_in'),
  path('log_out/', log_out, name='log_out'),
  path('csrf_token/', csrf_token, name='csrf_token'),
  path('session/', session, name='session'),
]
