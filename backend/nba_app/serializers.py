from rest_framework import serializers
from .models import User, Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User                                     #
        fields = ['user_id', 'username', 'email', 'bio', 'image']
                                                         #

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['user_id', 'content', 'created_at', 'image']