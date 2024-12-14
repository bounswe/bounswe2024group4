# posts_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
#    path('create/', views.create_post, name='create_post'),
 #   path('delete/<int:id>/', views.delete_post, name='delete_post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('comment/<int:comment_id>/delete/', views.delete_comment, name='delete_comment'),
    # Add more post-related URLs
]
