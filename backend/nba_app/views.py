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
    return data['results']['bindings'][0]['item']['value']

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
    
    for team in teams:
        for word in team:
            if query.lower() == word:
                query_team = team

    team_name = " ".join(query_team)
    url = 'https://www.wikidata.org/w/api.php'
    try:
        response1 = requests.get(url, params = {'action': 'wbsearchentities', 'format': 'json', 'search': team_name, 'language': 'en'})
        data1 = response1.json()
        #print('team:', data)
        id = data1['search'][0]['id']
        response2 = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
        data2 = response2.json()
        return data2['entities'][id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
    except:
        return {"error:": "error, please try again"}
#    divisions = {"Atlantic":   "Q638908",
#                  "Central":   "Q745984", 
#                  "Southeast": "Q639928", 
#                  "Northwest": "Q723639", 
#                  "Pacific":   "Q206201", 
#                  "Southwest": "Q391166"
#                  }
    
#    for id in divisions.values():
 #       sparql_query = '''
  #          SELECT ?item ?itemLabel
   #         WHERE {
    #            ?item wdt:P361 wd:''' + id + '''.
     #           ?item rdfs:label ?itemLabel.
      #          FILTER(lang(?itemLabel) = "en" && contains(lcase(?itemLabel),''' + '"' + query.lower() + '''")).
       #         SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        #    }
         #   LIMIT 1
        #'''

        #sparql_url = "https://query.wikidata.org/sparql"

        #sparql_response = requests.get(sparql_url, params={'format': 'json', 'query': sparql_query})
#        sparql_data = sparql_response.json()
 #       if sparql_response.status_code == 500:
  #          return {"response:": "error, please try a different query"}
   #     elif sparql_data['results']['bindings'] != []:
    #        break
    
    #print('team:', sparql_data)
    
    #if sparql_data['results']['bindings'] == []:
    #    return None
    
#    page_url = sparql_data['results']['bindings'][0]['item']['value']
#    page_response = requests.get(page_url)
#    page_url_lst = page_url.split('/')
#    if page_response.status_code == 200:
#        data = page_response.json()
#        entity_data = data.get("entities", {}).get(page_url_lst[3], {}) # BURASI ŞÜPHELİ, ID'YE DÖNMEK GEREKEBİLİR
#        print('data:', page_url_lst[3])
#        coach = entity_data.get("head coach", {})
#        venue = entity_data.get("home venue", {})
#        return {"coach": coach, "venue": venue}
#    else:
#        return {"response:": "error, please try again"}
      
      
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})
