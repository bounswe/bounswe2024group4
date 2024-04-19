from django.shortcuts import render

# Create your views here.

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .models import Profile
from django.http import HttpResponse
#class SignUpView(APIView):
#    def post(self, request):
def sign_up(request):
    
    if request.method == "POST":
        # Access form data from POST request
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        bio = request.POST.get("bio")
    

        print("username: ", username, "email: ", email, "password: ", password, "bio: ", bio)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already taken"}, status=status.HTTP_400_BAD_REQUEST)
        elif User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Create user
            user = User.objects.create_user(username=username, email=email, password=password)

            print("user created: ", user)
            # Create profile
            profile = Profile.objects.create(user=user, bio=bio)

            print("profile created: ", profile)

            # Authenticate and login user
            user_login = authenticate(username=username, password=password)

            
            if user_login:
                login(request, user_login)

                print("user_logged in: ", user_login)
                return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "Failed to authenticate user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({"error": "Request method must be POST"}, status=status.HTTP_400_BAD_REQUEST)