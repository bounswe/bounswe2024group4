from django.http import JsonResponse
from django.contrib.auth import authenticate
from .models import User
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from drf_yasg.utils import swagger_auto_schema
from swagger_docs.swagger import sign_up_schema, log_in_schema, log_out_schema, csrf_token_schema, session_schema
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

@csrf_exempt
@swagger_auto_schema(method='post', **sign_up_schema)
@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == "POST":
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        user_type = request.data.get("user_type", "member")

        # Validate required fields
        if not all([username, email, password]):
            return JsonResponse({
                "error": "Missing required fields",
                "details": {
                    "username": "Required" if not username else None,
                    "email": "Required" if not email else None,
                    "password": "Required" if not password else None
                }
            }, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email already taken"}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken"}, status=400)

        user = User.objects.create_user(username=username, email=email, password=password)
        user.user_type = user_type
        user.save()

        # Create auth token
        token, _ = Token.objects.get_or_create(user=user)
        
        return JsonResponse({
            'user': {
                'username': username,
                'email': email,
                'user_type': user_type,
                'id': user.pk
            },
            'token': token.key
        }, status=201)

@csrf_exempt
@swagger_auto_schema(method='post', **log_in_schema)
@api_view(['POST'])
@permission_classes([AllowAny])
def log_in(request):    
    if request.method == "POST":
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        if user is None:
            return JsonResponse({"error": "Invalid credentials"}, status=401)

        # Create or get auth token
        token, _ = Token.objects.get_or_create(user=user)
        
        return JsonResponse({
            'user': {
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type,
                'id': user.pk
            },
            'token': token.key
        }, status=200)

@csrf_exempt
@swagger_auto_schema(method='post', **log_out_schema)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_out(request):
    if request.method == "POST":
        # Delete the auth token
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        return JsonResponse({"message": "Logged out successfully"}, status=200)

@swagger_auto_schema(method='get', **csrf_token_schema)
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    if request.method == "GET":
        csrf_token = get_token(request)
        return JsonResponse({'csrf_token': csrf_token}, status=200)
