"""
URL configuration for fitness_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
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
from django.urls import path, include, re_path
from exercise_program_app import views as exercise_program_views
from user_auth_app import views as auth_views
from profiles_app import views as profile_views
from simple_features_app import views as simple_features_views
from posts_app import views as post_views
from social_feed_app import views as social_feed_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Fitness Forum",
        default_version="v1",
        description="API documentation with Swagger",
        # terms_of_service="https://www.example.com/terms/",
        # contact=openapi.Contact(email="contact@example.com"),
        # license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('workout_program/', exercise_program_views.workout_program, name='workout_program'),
    path('get_exercises/', exercise_program_views.get_exercises, name='get_exercises'),
    path('create-program/', exercise_program_views.create_program, name='create_program'),
    path('log-workout/', exercise_program_views.log_workout, name='log_workout'),
    path('sign_up/', auth_views.sign_up, name='sign_up'),
    path('log_in/', auth_views.log_in, name='log_in'),
    path('log_out/', auth_views.log_out, name='log_out'),
    path('edit_profile/', profile_views.edit_profile, name='edit_profile'),
    path('view_profile/', profile_views.view_profile, name='view_profile'),
    path('my-programs/', profile_views.get_user_programs, name='get_user_programs'),
    path('my-workout-logs/', profile_views.get_user_workout_logs, name='get_user_workout_logs'),
    path('get_leaderboard/', simple_features_views.get_leaderboard, name='get_leaderboard'),
    path('follow/', simple_features_views.follow, name='follow'),
    path('unfollow/', simple_features_views.unfollow, name='unfollow'),
    path('post/', post_views.post, name='post'),
    path('toggle_like/', post_views.toggle_like, name='toggle_like'),
    path('comment/', post_views.comment, name='comment'),
    path('toggle_bookmark/', post_views.toggle_bookmark, name='toggle_bookmark'),
    path('feed/', social_feed_views.feed, name='feed'),
    path('following_feed/', social_feed_views.following_feed, name='following_feed'),
    path('liked_posts/', post_views.liked_posts, name='liked_posts'),
    path('bookmarked_posts/', post_views.bookmarked_posts, name='bookmarked_posts'),
    # re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]