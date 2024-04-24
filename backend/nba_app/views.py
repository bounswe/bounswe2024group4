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
        
        print("username: ", username, "email: ", email, "password: ", password)

        if User.objects.filter(email=email).exists():
            return HttpResponse("Email already taken", status=400)
        elif User.objects.filter(username=username).exists():
            return HttpResponse("Username already taken", status=400)
        else:
            # Create and save user
            user = User.objects.create_user(username=username, email=email, password=password)
            print("user created: ", user)
            user.save()

            # Authenticate and login user
            user_login = authenticate(username=username, password=password)
            if user_login:
                login(request, user_login)
                print("user_logged in: ", user_login)
                return HttpResponse("User created successfully", status=201)
            else:
                return HttpResponse("Failed to authenticate user", status=500)
    
    # Render the signup.html template for GET requests
    return render(request, 'signup.html')
