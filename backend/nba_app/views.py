from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import User

def sign_up(request):
    if request.method == "POST":
        # Access form data from POST request
        
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")


        
        print("username: ", username, "email: ", email, "password: ", password, "confirm_password: ", confirm_password)

        # Check if passwords match
        if password != confirm_password:
            return HttpResponse("Passwords do not match", status=400)
        if User.objects.filter(email=email).exists():
            return HttpResponse("Email already taken", status=400)
        elif User.objects.filter(username=username).exists():
            return HttpResponse("Username already taken", status=400)
        else:
            # Create and save user
            user = User.objects.create_user(username=username, email=email, password=password)
            print("user created and saved: ", user)
            
            login(request, user)
            print("user_logged in: ", user)
            return HttpResponse("User created successfully", status=201)
            
    
    # Render the signup.html template for GET requests
    return render(request, 'signup.html')

def log_in(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse("Logged in successfully", status=200)
        else:
            return HttpResponse("Login not successful", status=401)

    return render(request, 'login.html')