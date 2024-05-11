from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from .models import User, Post, Comment, Follow
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
        return JsonResponse({'username': username}, status=200)
            
    
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
        print("user_logged in: ", user) 
        return JsonResponse({'username': username}, status=200)

    return render(request, 'login.html')

def log_out(request):
    if request.method == "GET":
        logout(request)
        request.session.flush()
        return HttpResponse("Logged out successfully", status=200)

"""
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
"""
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
        return HttpResponseRedirect(f'/post/{post.post_id}/')
    return render(request, 'post.html')

@login_required
def create_comment(request, post_id):
    if request.method == "POST":
        user = request.user
        content = request.POST.get("content")
        post = Post.objects.get(post_id=post_id)

        if post:
            Comment.objects.create(user=user, content=content, post=post)
            return HttpResponseRedirect(f'/post/{post_id}/')
        else:
            return HttpResponse("Post not found", status=404)

    return render(request, 'comment.html', {'post_id': post_id})



def post_detail(request, post_id):
    post = Post.objects.get(post_id=post_id)
    comments = Comment.objects.get(post = post) #post.comments.all()
    return render(request, 'post_detail.html', {'post': post, 'comments': comments})    


def profile_view_edit(request):
    if request.method == 'POST':
        new_username = request.POST.get('username')
        new_email = request.POST.get('email')
        new_profile_picture = request.FILES.get('profile_picture')
        new_bio = request.POST.get('bio')
        new_password = request.POST.get('password')
        
        user = request.user
        
        # Update username if provided
        if new_username:
            user.username = new_username
        
        # Update email if provided
        if new_email:
            user.email = new_email
        
        # Update profile picture if provided
        if new_profile_picture:
            user.profile_picture = new_profile_picture
        
        # Update bio if provided
        if new_bio:
            user.bio = new_bio

        # Update password if provided
        if new_password:
            user.set_password(new_password)
        
        user.save()
        
        return JsonResponse({'message': 'Account information updated successfully.'}, status=200)

    # if request.method == 'GET':
    user = request.user
    following_count = user.following.count()
    followers_count = user.followers.count()
    posts = Post.objects.filter(user=user)
    #post_contents = [post.content for post in posts]
    data = {
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        #'profile_picture': user.profile_picture.url if user.profile_picture else None,
        # Add any other fields you want to include in the response
        'following_count': following_count,
        'followers_count': followers_count,
        'posts': [{'content': post.content, 'created_at': post.created_at} for post in posts]
    }
    return JsonResponse(data, status=200)




def reset_password(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    email = request.POST.get('email')
    username = request.POST.get('username')
    new_password = request.POST.get('new_password')
    
    # Check if either email or username is provided
    if not email and not username:
        return JsonResponse({'error': 'Email address or username is required in the request.'}, status=400)
    
    # Retrieve the user by email or username
    user = None
    if email:
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            pass
    elif username:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            pass
    
    if not user:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if new password is provided
    if not new_password:
        return JsonResponse({'error': 'New password is required.'}, status=400)
    
    # Set the new password
    user.set_password(new_password)
    user.save()
    
    return JsonResponse({'message': 'Password reset successful.'}, status = 200)




def follow_user(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    # user_id = request.POST.get('user_id')

    if request.user.user_id == user_id:
        return JsonResponse({'error': 'You cannot follow yourself.'}, status=400)
    
    # Retrieve the user to follow
    try:
        followed_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if the user is already following the given user
    already_following = Follow.objects.filter(follower=request.user, followed=followed_user).exists()
    if already_following:
        return JsonResponse({'message': 'You are already following this user.'}, status = 400)
    
    # Create a new follow instance
    Follow.objects.create(follower=request.user, followed=followed_user)
    return JsonResponse({'message': 'You have successfully followed the user.'}, status=200)




def unfollow_user(request, user_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    # user_id = request.POST.get('user_id')
    
    # Retrieve the user to unfollow
    try:
        followed_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if the user is already not following the given user
    follow_instance = Follow.objects.filter(follower=request.user, followed=followed_user).first()
    if not follow_instance:
        return HttpResponse('You are not following this user.', status=400)
    
    # Delete the follow instance
    follow_instance.delete()
    return JsonResponse({'message': 'You have successfully unfollowed the user.'}, status=200)


@login_required
def feed(request):
    # Only authenticated users can access this view
    return render(request, 'feed.html')

def search(request):
    if request.method == "GET" and "query" in request.GET:
        query = request.GET.get("query")
        try:
            team = search_team(query)
            player = search_player(query)
            return JsonResponse({'team': team, 'player': player})
        except:
            return JsonResponse({"error:": "error, please try again"})
    #return render(request, 'search.html')

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
             ["cleveland", "cavaliers"], 
             ["dallas", "mavericks"], 
             ["denver", "nuggets"], 
             ["detroit", "pistons"], 
             ["golden state", "warriors"], 
             ["houston", "rockets"],
             ["indiana", "pacers"],
             ["los angeles", "clippers"],
             ["los angeles", "lakers"],
             ["memphis", "grizzlies"],
             ["miami", "heat"],
             ["milwaukee", "bucks"],
             ["minnesota", "timberwolves"],
             ["new orleans", "pelicans"],
             ["new york", "knicks"],
             ["oklahoma", "city", "thunder"],
             ["orlando", "magic"],
             ["philadelphia", "76ers"],
             ["phoenix", "suns"],
             ["portland", "trail", "blazers"],
             ["sacramento", "kings"],
             ["san antonio", "spurs"],
             ["toronto", "raptors"],
             ["utah", "jazz"],
             ["washington", "wizards"]]
    
    query_team = ''
    for team in teams:
        print('query_team:', query_team)
        if query_team != '':
            break
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
            try:
                name = data['entities'][id]['labels']['en']['value']
            except:
                name = None
            try:
                venue_temp = data['entities'][id]['claims']['P115']
                venue_id = venue_temp[len(venue_temp)-1]['mainsnak']['datavalue']['value']['id']
                response_ven = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': venue_id, 'language': 'en'})
                data_ven = response_ven.json()
                venue = data_ven['entities'][venue_id]['labels']['en']['value']
                try:
                    venue_loc = data_ven['entities'][venue_id]['claims']['P625'][0]['mainsnak']['datavalue']['value']
                    venue_latitude = venue_loc['latitude']
                    venue_longitude = venue_loc['longitude']
                except:
                    venue_latitude = None
                    venue_longitude = None
            except:
                venue = None
            try:
                coach_id = data['entities'][id]['claims']['P286'][0]['mainsnak']['datavalue']['value']['id']
                coach = get_label(coach_id)
            except: 
                coach = None
            try:
                division_id = data['entities'][id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
                response_div = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': division_id, 'language': 'en'})
                data_div = response_div.json()
                division = data_div['entities'][division_id]['labels']['en']['value']
                try:
                    conference_id = data_div['entities'][division_id]['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
                    conference = get_label(conference_id)
                except:
                    conference = None
            except: 
                division = None
                conference = None
            try:
                image_name = data['entities'][id]['claims']['P154'][0]['mainsnak']['datavalue']['value']
                image_url = f'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/{image_name}&width=300'
            except:
                image_url = None
            return JsonResponse({'name': name,
                                 'conference': conference, 
                                 'coach': coach, 
                                 'division': division, 
                                 'venue': venue,
                                 'venue_latitude': venue_latitude,
                                 'venue_longitude': venue_longitude,
                                 'image': image_url})
        except:
            return JsonResponse({"error:": "error, please try again"})

def get_label(id):
    url = 'https://www.wikidata.org/w/api.php'
    response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
    data = response.json()
    try:
        return data['entities'][id]['labels']['en']['value'] 
    except:
        return None
    
def player(request):
    if request.method == "GET" and "id" in request.GET:
        id = request.GET.get("id")
        try:
            url = 'https://www.wikidata.org/w/api.php'
            response = requests.get(url, params = {'action': 'wbgetentities', 'format': 'json', 'ids': id, 'language': 'en'})
            data = response.json()
            try:
                name = data['entities'][id]['labels']['en']['value']
            except:
                name = None
            try:
                height = data['entities'][id]['claims']['P2048'][0]['mainsnak']['datavalue']['value']['amount']
            except:
                height = None
            try:
                date_of_birth = data['entities'][id]['claims']['P569'][0]['mainsnak']['datavalue']['value']['time']
            except:
                date_of_birth = None
            try:
                insta = data['entities'][id]['claims']['P2003'][0]['mainsnak']['datavalue']['value']
            except:
                insta = None
            try:
                position_lst = data['entities'][id]['claims']['P413']
                positions = list_wikidata_property(position_lst)
            except:
                positions = []
            try:
                team_lst = data['entities'][id]['claims']['P54']
                teams = {}
                for item in team_lst:
                    team_id = item['mainsnak']['datavalue']['value']['id']
                    team = get_label(team_id)
                    try:
                        start = item['qualifiers']['P580'][0]['datavalue']['value']['time']
                    except:
                        start = None
                    try:
                        end = item['qualifiers']['P582'][0]['datavalue']['value']['time']
                    except:
                        end = None
                    teams[team] = {'start': start, 'end': end}
            except:
                teams = []
            try:
                award_lst = data['entities'][id]['claims']['P166']
                awards = {}
                for item in award_lst:
                    award_id = item['mainsnak']['datavalue']['value']['id']
                    award = get_label(award_id)
                    try:
                        year = item['qualifiers']['P585'][0]['datavalue']['value']['time']
                    except:
                        year = None
                    awards[award] = year
            except:
                awards = []
            try:
                image_name = data['entities'][id]['claims']['P18'][0]['mainsnak']['datavalue']['value']
                image_url = f'https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/{image_name}&width=300'
            except:
                image_url = None
            return JsonResponse({'name': name, 
                                 'height': height, 
                                 'date_of_birth': date_of_birth, 
                                 'instagram': insta, 
                                 'teams': teams, 
                                 'positions': positions,
                                 'awards': awards,
                                 'image': image_url})
                                 
        except:
            return JsonResponse({"error:": "error, please try again"})

def list_wikidata_property(lst):
    names = []
    for item in lst:
        item_id = item['mainsnak']['datavalue']['value']['id']
        name = get_label(item_id)
        names.append(name)
    return names

def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

def session(request):
    if request.method == "GET":
        session = request.session
        return JsonResponse({'session': session.session_key != None })
