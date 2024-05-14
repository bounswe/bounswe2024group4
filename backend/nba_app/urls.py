from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('signup/', views.sign_up, name='signup'),
    path('login/', views.log_in, name='login'),
    path('feed/', views.feed, name='feed'),
    
    path('user_followings/', views.user_followings, name='user_followings'),
    path('user_followers/', views.user_followers, name='user_followers'),
    
    path('follow_user/<str:user_id>', views.follow_user, name='follow_user'),
    path('unfollow_user/<str:user_id>', views.unfollow_user, name='unfollow_user'),
    
    path('profile_view_edit_auth', views.profile_view_edit_auth, name='profile_view_edit_auth'),
    path('profile_view_edit_others/<str:username>', views.profile_view_edit_others, name='profile_view_edit_others'),
    
    path('reset_password/', views.reset_password, name='reset_password'),
    
    path('post/', views.post, name='post'),
    
    path('like_or_unlike_post/<int:post_id>', views.like_or_unlike_post, name='like_or_unlike_post'),
    path('like_or_unlike_comment/<int:comment_id>', views.like_or_unlike_comment, name='like_or_unlike_comment'),
    path('bookmark_or_unbookmark_post/<int:post_id>', views.bookmark_or_unbookmark_post, name='bookmark_or_unbookmark_post'),
    
    path('search/', views.search, name='search'),
    path('team/', views.team, name='team'),
    path('player/', views.player, name='player'),
    path('csrf_token/', views.csrf_token, name='csrf_token'),
    path('session/', views.session, name='session'),
    path('log_out/', views.log_out, name='log_out'),
    path('post_detail/', views.post_detail, name='post_detail'),
    path('post/<int:post_id>/comment/', views.create_comment, name='create_comment')
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
