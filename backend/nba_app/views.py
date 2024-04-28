from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from .models import User, Post
import requests

def sign_up(request):
    if request.method == "POST":
        # Access form data from POST request
        
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        
        print("username: ", username, "email: ", email, "password: ", password)

        if User.objects.filter(email=email).exists():
            # Return an error httpresponse if email is already taken
            return HttpResponse("Email already taken.", status=400)

        if User.objects.filter(username=username).exists():
            # Return an error httpresponse if username is already taken
            return HttpResponse("Username already taken.", status=400)
        
        # Create and save user
        user = User.objects.create_user(username=username, email=email, password=password)
        print("user created and saved: ", user)
        
        login(request, user)
        print("user_logged in: ", user)
        return HttpResponse("User created successfully", status=200)
            
    
    # Render the signup.html template for GET requests
    return render(request, 'signup.html')


def log_in(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return HttpResponse("Invalid credentials", status=401)

        login(request, user)
       
        return HttpResponse("Logged in successfully", status=200)


    return render(request, 'login.html')


@login_required
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
        team = search_team(query)
        player = search_player(query)
        return JsonResponse({'team': team, 'player': player})
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
    print('player:', data)
    if response.status_code == 500:
        return {"response:": "error, please try a different query"}
    elif data['results']['bindings'] == []:
        return None
    
    url_lst = data['results']['bindings'][0]['item']['value'].split('/')
    for item in url_lst:
        if 'Q' in item:
            player_id = item
    return {'player': data['results']['bindings'][0]['itemLabel']['value'], 'id': player_id} 

def search_team(query):
    teams = [ ["atlanta", "hawks"], 
             ["boston", "celtics"], 
             ["brooklyn", "nets"], 
             ["charlotte", "hornets"], 
             ["chicago", "bulls"], 
             ["cleveland","cavaliers"], 
             ["dallas", "mavericks"], 
             ["denver", "nuggets"], 
             ["detroit", "pistons"], 
             ["golden", "state", "warriors"], 
             ["houston", "rockets"],
             ["indiana", "pacers"],
             ["los", "angeles", "clippers"],
             ["los", "angeles", "lakers"],
             ["memphis", "grizzlies"],
             ["miami", "heat"],
             ["milwaukee", "bucks"],
             ["minnesota", "timberwolves"],
             ["new", "orleans", "pelicans"],
             ["new", "york",    "knicks"],
             ["oklahoma", "city", "thunder"],
             ["orlando", "magic"],
             ["philadelphia", "76ers"],
             ["phoenix", "suns"],
             ["portland", "trail", "blazers"],
             ["sacramento", "kings"],
             ["san", "antonio", "spurs"],
             ["toronto", "raptors"],
             ["utah", "jazz"],
             ["washington", "wizards"]]
    
    query_team = ''
    for team in teams:
        for word in team:
            if query.lower() == word:
                query_team = team

    if query_team == '':
        return None
    
    team_name = " ".join(query_team)
    url = 'https://www.wikidata.org/w/api.php'
    try:
        response1 = requests.get(url, params = {'action': 'wbsearchentities', 'format': 'json', 'search': team_name, 'language': 'en'})
        data1 = response1.json()
        id = data1['search'][0]['id']
        return {'team': team_name, 'id': id}
    except:
        return {"error:": "error, please try again"}

def team(request):
    if request.method == "GET" and "id" in request.GET:
        id = request.GET.get("id")
        try:
            url = 'https://www.wikidata.org/w/api.php'
            response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
            data = response.json()
            name = data['entities'][id]['labels']['en']['value']
            venue_temp = data['entities'][id]['claims']['P115']
            venue_id = venue_temp[len(venue_temp)-1]['mainsnak']['datavalue']['value']['id']
            coach_id = data['entities'][id]['claims']['P286'][0]['mainsnak']['datavalue']['value']['id']
            division_id = data['entities'][id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
            venue = get_label(venue_id)
            coach = get_label(coach_id)
            response_div = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': division_id, 'language': 'en'})
            data_div = response_div.json()
            division = data_div['entities'][division_id]['labels']['en']['value']
            conference_id = data_div['entities'][division_id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
            conference = get_label(conference_id)
            return JsonResponse({'name': name, 'conference': conference, 'coach': coach, 'division': division, 'venue': venue})
        except:
            return JsonResponse({"error:": "error, please try again"})

def get_label(id):
    url = 'https://www.wikidata.org/w/api.php'
    response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
    data = response.json()
    return data['entities'][id]['labels']['en']['value'] 
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
