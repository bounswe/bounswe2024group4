from django.urls import path
from . import views
from .views import log_in


urlpatterns = [
    path('signup/', views.sign_up, name='signup'),
    path('login/', log_in, name='login'),

]