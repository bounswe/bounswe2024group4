from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .models import User, Post
import requests

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
            messages.error(request, "Passwords do not match")
            return redirect('signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already taken")
            return redirect('signup')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect('signup')
        
        # Create and save user
        user = User.objects.create_user(username=username, email=email, password=password)
        print("user created and saved: ", user)
        
        login(request, user)
        print("user_logged in: ", user)
        return redirect('feed')
        return HttpResponse("User created successfully", status=201)
            
    
    # Render the signup.html template for GET requests
    return render(request, 'signup.html')


def log_in(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            messages.error(request, "User does not exist.")
            return redirect('login')

        login(request, user)
       
        #redirect to feed
        return redirect('feed')
        return HttpResponse("Logged in successfully", status=200)


    return render(request, 'login.html')


#@login_required
def post(request):
    if request.method == "POST":
        
        user = request.user
        content = request.POST.get("content")
        post = Post.objects.create(user=user, content=content)
        #if username == "":
        #    # handle if the user is not logged in
        #    print("not logged in")
        #    # return redirect('signup')
        text = request.POST.get("post")

        print(text)
    return render(request, 'post.html')


@login_required
def feed(request):
    # Only authenticated users can access this view
    return render(request, 'feed.html')

def search(request):
    if request.method == "GET" and "query" in request.GET:
        query = request.GET.get("query")
        print(search_player(query))
        print(search_team(query))
    return render(request, 'search.html')

def search_player(query):
    # SPARQL query to retrieve all instances of teams
    sparql_query = '''
        SELECT DISTINCT ?item ?itemLabel WHERE {
            ?item (wdt:P3647) [].
            ?item rdfs:label ?itemLabel.
            FILTER(lang(?itemLabel) = "en" && contains(lcase(?itemLabel),''' + '"' + query.lower() + '''"))
        }
        LIMIT 1
    '''
    endpoint_url = "https://query.wikidata.org/sparql"

    response = requests.get(endpoint_url, params={'format': 'json', 'query': sparql_query})
    data = response.json()

    return data

def search_team(query):
    divisions = ["Q638908", "Q745984", "Q639928", "Q723639", "Q206201", "Q391166"]
    for id in divisions:
        sparql_query = '''
            SELECT ?item ?itemLabel
            WHERE {
                ?item wdt:P361 wd:''' + id + '''.
                ?item rdfs:label ?itemLabel.
                FILTER(lang(?itemLabel) = "en" && contains(lcase(?itemLabel),''' + '"' + query.lower() + '''")).
                SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
            }
            LIMIT 1
        '''

        endpoint_url = "https://query.wikidata.org/sparql"

        response = requests.get(endpoint_url, params={'format': 'json', 'query': sparql_query})
        data = response.json()
        return data
      
      
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
