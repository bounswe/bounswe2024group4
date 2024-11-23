from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from .models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from rest_framework.permissions import IsAuthenticated

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == "POST":
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        user_type = request.data.get("user_type", "member")

        if User.objects.filter(email=email).exists():
            return HttpResponse("Email already taken.", status=400)
        if User.objects.filter(username=username).exists():
            return HttpResponse("Username already taken.", status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.user_type = user_type
        user.save()

        login(request, user)
        return JsonResponse({'username': username}, status=200)

    return render(request, 'sign_up.html')


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
@csrf_exempt
def log_in(request):
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")
        print(password)
        user = authenticate(request, username=username, password=password)
        if user is None:
            return HttpResponse("Invalid credentials", status=401)

        login(request, user)
        return JsonResponse({'username': username}, status=200)

    return render(request, 'log_in.html')


@api_view(['GET'])
@permission_classes([AllowAny])
def log_out(request):
    if request.method == "GET":
        logout(request)
        request.session.flush()
        return HttpResponse("Logged out successfully", status=200)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session(request):
    session = request.session
    return JsonResponse({'session': session.session_key != None }, status=200)