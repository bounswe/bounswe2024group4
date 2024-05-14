from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.urls import reverse
from .models import User, Post, Comment, Follow, LikePost, LikeComment, Bookmark
import requests
import os

def sign_up(request):
    if request.method == "POST":
        # Access form data from POST request
        
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        #profile_picture = request.FILES.get("profile_picture")
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


@login_required
def post(request):
    if request.method == "POST":        
        user = request.user
        content = request.POST.get("content")
        image = request.FILES.get("image")
        #image_binary = image.read()
        post = Post.objects.create(user=user, content=content, image=image)
        #text = request.POST.get("post")
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


#user like or unlike post
def like_or_unlike_post(request, post_id):
    if request.method == "POST":
        user = request.user
        post = Post.objects.get(post_id=post_id)

        like = LikePost.objects.filter(user=user, post=post).first()
        if like:
            like.delete()
            return JsonResponse({'message': 'Post unliked'}, status=200)
        else:
            LikePost.objects.create(user=user, post=post)
            return JsonResponse({'message': 'Post liked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)



#user like or unlike comment
def like_or_unlike_comment(request, comment_id):
    if request.method == "POST":
        user = request.user
        comment = Comment.objects.get(comment_id=comment_id)

        like = LikeComment.objects.filter(user=user, comment=comment).first()
        if like:
            like.delete()
            return JsonResponse({'message': 'Comment unliked'}, status=200)
        else:
            LikeComment.objects.create(user=user, comment=comment)
            return JsonResponse({'message': 'Comment liked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)



#user bookmark or unbookmark post
def bookmark_or_unbookmark_post(request, post_id):
    if request.method == "POST":
        user = request.user
        post = Post.objects.get(post_id=post_id)

        bookmark = Bookmark.objects.filter(user=user, post=post).first()
        if bookmark:
            bookmark.delete()
            return JsonResponse({'message': 'Post unbookmarked'}, status=200)
        else:
            Bookmark.objects.create(user=user, post=post)
            return JsonResponse({'message': 'Post bookmarked'}, status=200)
    
    return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)


# post atan user
#TODO : if the authenticated user likes the post, is_like = True, otherwise is_like = False
# if the authenticated user bookmarks the post, is_bookmarked = True, otherwise is_bookmarked = False
# if the user likes the comment for each comment of the post, is_comment_like = True, otherwise is_comment_like = False 
def post_detail(request, post_id):
    post = Post.objects.get(post_id=post_id)
    comments = Comment.objects.filter(post = post) #post.comments.all()
    print({'post': post, 'image': post.image, 'comments': comments})
    return render(request, 'post_detail.html', {'post': post, 'image': post.image, 'comments': comments})

def post_detail(request): 
    if request.method == "GET" and "post_id" in request.GET:
        post_id = request.GET.get("post_id")
        post = Post.objects.get(post_id=post_id)
        comments = post.comments.all()
        return JsonResponse({
            'id': post_id,
            'post': post.content, 
            'image': post.image.url if hasattr(post, 'image') and post.image else None,
            'comments': [comment.content for comment in list(comments)]
            }, status=200)
    return JsonResponse({'error': 'Only GET requests are allowed.'}, status=405)

def user_followings(request):
    user = request.user
    followings = user.following.all()
    followings_info = [{'user_id': following.user_id, 'username':following.username} for following in followings]
    return JsonResponse({'followings_info': followings_info}, status=200)


def user_followers(request):
    user = request.user
    followers = user.followers.all()
    followers_info = [{'user_id': follower.user_id, 'username':follower.username} for follower in followers]
    return JsonResponse({'followers_info': followers_info}, status=200)


def profile_view_edit_auth(request):
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
            if user.profile_picture != 'default_nba_app_pp.jpg':
                os.remove(user.profile_picture.path)
            user.profile_picture = new_profile_picture
        
        # Update bio if provided
        if new_bio:
            user.bio = new_bio

        # Update password if provided
        if new_password:
            user.set_password(new_password)
        
        user.save()
        
        return JsonResponse({'message': 'Account information updated successfully.'}, status=200)

    if request.method == 'GET':
        user = request.user
        following_count = user.following.count()
        followers_count = user.followers.count()
        posts = Post.objects.filter(user=user)
        bookmarks = Bookmark.objects.filter(user=user)
        bookmarked_posts = [bookmark.post for bookmark in bookmarks]
        data = {
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'following_count': following_count,
            'followers_count': followers_count,
            'profile_picture': user.profile_picture.url if user.profile_picture else None,
            'posts': [{'post_id': post.post_id, 'content': post.content, 'created_at': post.created_at, 'image':post.image} for post in posts],
            'bookmarked_posts': [{'post_id': bookmarked_post.post_id, 'content': bookmarked_post.content, 'created_at': bookmarked_post.created_at, 'image':bookmarked_post.image} for bookmarked_post in bookmarked_posts]
        }
        return JsonResponse(data, status=200)
    

def profile_view_edit_others(request, username):
    user = User.objects.get(username=username)
    following_count = user.following.count()
    followers_count = user.followers.count()

    if request.user == user:
        is_following = None
    else:
        is_following = Follow.objects.filter(follower=request.user, followed=user).exists()
    
    posts = Post.objects.filter(user=user)
    bookmarks = Bookmark.objects.filter(user=user)
    bookmarked_posts = [bookmark.post for bookmark in bookmarks]

    data = {
        'username': user.username,
        'email': user.email,
        'bio': user.bio,
        'following_count': following_count,
        'followers_count': followers_count,
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'posts': [{'post_id':post.post_id, 'content': post.content, 'created_at': post.created_at, 'image':post.image} for post in posts],
        'is_following': is_following, # True if the authenticated user is following the user, False otherwise, None if the authenticated user is the user
        'bookmarked_posts': [{'post_id': bookmarked_post.post_id, 'content': bookmarked_post.content, 'created_at': bookmarked_post.created_at, 'image':bookmarked_post.image} for bookmarked_post in bookmarked_posts]
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




def follow_user(request, username):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    

    if request.user.username == username:
        return JsonResponse({'error': 'You cannot follow yourself.'}, status=400)
    
    # Retrieve the user to follow
    try:
        followed_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    # Check if the user is already following the given user
    already_following = Follow.objects.filter(follower=request.user, followed=followed_user).exists()
    if already_following:
        return JsonResponse({'message': 'You are already following this user.'}, status = 400)
    
    # Create a new follow instance
    Follow.objects.create(follower=request.user, followed=followed_user)
    return JsonResponse({'message': 'You have successfully followed the user.'}, status=200)




def unfollow_user(request, username):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST requests are allowed.'}, status=405)
    
    
    # Retrieve the user to unfollow
    try:
        followed_user = User.objects.get(username=username)
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
    user = request.user
    following = user.following.all()
    post_ids = []
    for follow in following:
        posts = Post.objects.filter(user=follow.user)
        for post in posts:
            post_ids.append(post.post_id)

    return JsonResponse({'post_ids': post_ids}, status=200)

    #all_feed_posts = [Post.objects.filter(user=follow.user) for follow in following]
    #return info of the posts
    #is_like = LikePost.objects.filter(user=user, post=post).exists()
    #return JsonResponse({'all_feed_posts': [{'post_id':post.post_id, 'content': post.content, 'created_at': post.created_at, 'image':post.image} for post in all_feed_posts]}, status=200)


def search(request):
    if request.method == "GET" and "query" in request.GET:
        query = request.GET.get("query")
        try:
            team = search_team(query)
            player = search_player(query)
            print("team:", team, "player:", player)
            posts = Post.objects.filter(content__icontains=query)
            return JsonResponse({'team': team, 'player': player, 'posts': [{'id': post.post_id, 'content': post.content, 'created_at': post.created_at} for post in posts]})
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
            data_entitites_id = data['entities'][id]
            try:
                name = data_entitites_id['labels']['en']['value']
            except:
                name = None
            try:
                venue_temp = data_entitites_id['claims']['P115']
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
                coach_id = data_entitites_id['claims']['P286'][0]['mainsnak']['datavalue']['value']['id']
                coach = get_label(coach_id)
            except: 
                coach = None
            try:
                division_id = data_entitites_id['claims']['P361'][0]['mainsnak']['datavalue']['value']['id']
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
                image_name = data_entitites_id['claims']['P154'][0]['mainsnak']['datavalue']['value']
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
            data_entitites_id = data['entities'][id]
            try:
                name = data_entitites_id['labels']['en']['value']
            except:
                name = None
            try:
                height = data_entitites_id['claims']['P2048'][0]['mainsnak']['datavalue']['value']['amount']
            except:
                height = None
            try:
                date_of_birth = data_entitites_id['claims']['P569'][0]['mainsnak']['datavalue']['value']['time']
            except:
                date_of_birth = None
            try:
                insta = data_entitites_id['claims']['P2003'][0]['mainsnak']['datavalue']['value']
            except:
                insta = None
            try:
                position_lst = data_entitites_id['claims']['P413']
                positions = list_wikidata_property(position_lst)
            except:
                positions = []
            try:
                team_lst = data_entitites_id['claims']['P54']
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
                award_lst = data_entitites_id['claims']['P166']
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
                image_name = data_entitites_id['claims']['P18'][0]['mainsnak']['datavalue']['value']
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
