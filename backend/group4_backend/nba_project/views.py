from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import Profile

class SignUpView(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        password2 = data.get("password2")
        bio = request.data.get("bio")

        if password == password2:
            if User.objects.filter(email=email).exists():
                return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)
            elif User.objects.filter(username=username).exists():
                return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                # Create user
                user = User.objects.create_user(username=username, email=email, password=password)

                # Create profile
                profile = Profile.objects.create(user=user, bio=bio)

                # Authenticate and login user
                user_login = authenticate(username=username, password=password)
                if user_login:
                    login(request, user_login)
                    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"error": "Failed to authenticate user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": "Passwords not matching"}, status=status.HTTP_400_BAD_REQUEST)

