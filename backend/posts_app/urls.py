# posts_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('post/', views.post, name='post'),
    path('toggle_like/', views.toggle_like, name='toggle_like'),
    path('comment/', views.comment, name='comment'),
    path('toggle_bookmark/', views.toggle_bookmark, name='toggle_bookmark'),
    path('liked_posts/', views.liked_posts, name='liked_posts'),
    path('bookmarked_posts/', views.bookmarked_posts, name='bookmarked_posts'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('comment/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
]
