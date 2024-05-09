from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('signup/', views.sign_up, name='signup'),
    path('login/', views.log_in, name='login'),
    path('feed/', views.feed, name='feed'),
    path('post/', views.post, name='post'),
    path('search/', views.search, name='search'),
    path('team/', views.team, name='team'),
    path('player/', views.player, name='player'),
    path('csrf_token/', views.csrf_token, name='csrf_token'),
    path('session/', views.session, name='session'),
    path('log_out/', views.log_out, name='log_out')
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)