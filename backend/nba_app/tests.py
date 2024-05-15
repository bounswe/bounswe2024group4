from django.test import TestCase, Client
from django.urls import reverse
from .models import User, Post

from django.test import RequestFactory
from .views import *



class SignUpViewTestCase(TestCase):
    def test_sign_up_success(self):
        # Create a client to simulate POST request
        client = Client()

        # Simulate a POST request to the sign_up endpoint with valid data
        url = reverse('signup')
        data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'test_password'
        }
        response = client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the expected username
        json_data = response.json()
        self.assertIn('username', json_data)
        self.assertEqual(json_data['username'], 'test_user')

        # Check that the user is created in the database
        self.assertTrue(User.objects.filter(username='test_user').exists())

    def test_sign_up_email_taken(self):
        # Create a user with the same email as in the test data
        User.objects.create_user(username='existing_user', email='test@example.com', password='test_password')

        # Create a client to simulate POST request
        client = Client()

        # Simulate a POST request to the sign_up endpoint with the same email
        url = reverse('signup')
        data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'test_password'
        }
        response = client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

    def test_sign_up_username_taken(self):
        # Create a user with the same username as in the test data
        User.objects.create_user(username='test_user', email='existing@example.com', password='test_password')

        # Create a client to simulate POST request
        client = Client()

        # Simulate a POST request to the sign_up endpoint with the same username
        url = reverse('signup')
        data = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'test_password'
        }
        response = client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)


class UserLoginTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')

    def test_login_view(self):
        # Send a POST request to the login view with valid credentials
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'password'})
        
        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains the username in JSON format
        self.assertIn('username', response.json())

    def test_login_view_invalid_credentials(self):
        # Send a POST request to the login view with invalid credentials
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpassword'})
        
        # Check that the response status code is 401 Unauthorized
        self.assertEqual(response.status_code, 401)
        
        # Check that the response contains the error message
        self.assertEqual(response.content, b'Invalid credentials')


class PostsTestCase(TestCase):
    def setUp(self):
        # Set up any necessary objects, such as users or posts, for the tests
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_post_view(self):
        # Test the post view
        url = reverse('post')
        request = self.factory.post(url, {'content': 'Test content'})
        request.user = self.user
        response = post(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Post created successfully', response.content.decode())


class CreateCommentTestCase(TestCase):

    def setUp(self):
        # Set up any necessary objects, such as users or posts, for the tests
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_create_comment_view(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')
        
        # Send a POST request to the create_comment view with valid data
        url = reverse('create_comment', kwargs={'post_id': self.post.post_id})
        response = self.client.post(url, {'content': 'Test comment content'})
        
        # Check that the comment is created successfully
        self.assertEqual(response.status_code, 302)  # Redirect status code
        self.assertEqual(Comment.objects.count(), 1)  # Check that a comment object is created

        # Optionally, you can check that the comment is associated with the correct post
        comment = Comment.objects.first()
        self.assertEqual(comment.post, self.post)

    def test_create_comment_view_post_not_found(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')
        
        # Send a POST request to the create_comment view with an invalid post_id
        invalid_post_id = self.post.post_id + 1  # Assuming post_id is incremental
        url = reverse('create_comment', kwargs={'post_id': invalid_post_id})
        response = self.client.post(url, {'content': 'Test comment content'})
        
        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)


class LikeOrUnlikePostTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_like_post(self):
        # Send a POST request to like a post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was liked
        self.assertEqual(response.json(), {'message': 'Post liked'})

        # Check that the post is actually liked
        self.assertTrue(LikePost.objects.filter(user=self.user, post=self.post).exists())

    def test_unlike_post(self):
        # Like the post first
        LikePost.objects.create(user=self.user, post=self.post)

        # Send a POST request to unlike the post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was unliked
        self.assertEqual(response.json(), {'message': 'Post unliked'})

        # Check that the post is actually unliked
        self.assertFalse(LikePost.objects.filter(user=self.user, post=self.post).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the like_or_unlike_post view
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})


class LikeOrUnlikeCommentTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')
        self.comment = Comment.objects.create(user=self.user, post=self.post, content='Test comment content')

    def test_like_comment(self):
        # Send a POST request to like a comment
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the comment was liked
        self.assertEqual(response.json(), {'message': 'Comment liked'})

        # Check that the comment is actually liked
        self.assertTrue(LikeComment.objects.filter(user=self.user, comment=self.comment).exists())

    def test_unlike_comment(self):
        # Like the comment first
        LikeComment.objects.create(user=self.user, comment=self.comment)

        # Send a POST request to unlike the comment
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the comment was unliked
        self.assertEqual(response.json(), {'message': 'Comment unliked'})

        # Check that the comment is actually unliked
        self.assertFalse(LikeComment.objects.filter(user=self.user, comment=self.comment).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the like_or_unlike_comment view
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})


class BookmarkOrUnbookmarkPostTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_bookmark_post(self):
        # Send a POST request to bookmark a post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was bookmarked
        self.assertEqual(response.json(), {'message': 'Post bookmarked'})

        # Check that the post is actually bookmarked
        self.assertTrue(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_unbookmark_post(self):
        # Bookmark the post first
        Bookmark.objects.create(user=self.user, post=self.post)

        # Send a POST request to unbookmark the post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was unbookmarked
        self.assertEqual(response.json(), {'message': 'Post unbookmarked'})

        # Check that the post is actually unbookmarked
        self.assertFalse(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the bookmark_or_unbookmark_post view
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})


class PostDetailTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_post_detail(self):
        # Like the post
        LikePost.objects.create(user=self.user, post=self.post)

        # Bookmark the post
        Bookmark.objects.create(user=self.user, post=self.post)

        # Add comments to the post
        comment1 = Comment.objects.create(user=self.user, post=self.post, content='Comment 1')
        LikeComment.objects.create(user=self.user, comment=comment1)
        comment2 = Comment.objects.create(user=self.user, post=self.post, content='Comment 2')

        # Log in the user and send a GET request to post_detail
        self.client.force_login(self.user)
        url = reverse('post_detail', args=[self.post.post_id])
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertEqual(json_data['post'], 'Test post content')
        self.assertEqual(json_data['post_id'], self.post.post_id)
        self.assertIsNotNone(json_data['created_at'])
        self.assertEqual(json_data['username'], 'testuser')
        self.assertTrue(json_data['user_has_liked'])
        self.assertEqual(json_data['likes_count'], 1)
        self.assertTrue(json_data['user_has_bookmarked'])

        # Check the comments data
        self.assertEqual(len(json_data['comments']), 2)
        self.assertEqual(json_data['comments'][0]['content'], 'Comment 1')
        self.assertTrue(json_data['comments'][0]['liked_by_user'])
        self.assertEqual(json_data['comments'][0]['likes_count'], 1)
        self.assertEqual(json_data['comments'][1]['content'], 'Comment 2')
        self.assertFalse(json_data['comments'][1]['liked_by_user'])
        self.assertEqual(json_data['comments'][1]['likes_count'], 0)


class UserFollowingsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.followed_user1 = User.objects.create_user(username='followeduser1', email='followeduser1@example.com', password='password')
        self.followed_user2 = User.objects.create_user(username='followeduser2', email='followeduser2@example.com', password='password')

        Follow.objects.create(follower=self.user, followed=self.followed_user1)
        Follow.objects.create(follower=self.user, followed=self.followed_user2)

    def test_user_followings(self):
        # Log in the user and send a GET request to user_followings
        self.client.force_login(self.user)
        url = reverse('user_followings')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertIn('followings_info', json_data)

        # Check the followings info
        followings_info = json_data['followings_info']
        self.assertEqual(len(followings_info), 2)
        self.assertIn({'user_id': self.followed_user1.user_id, 'username': 'followeduser1'}, followings_info)
        self.assertIn({'user_id': self.followed_user2.user_id, 'username': 'followeduser2'}, followings_info)


class UserFollowersTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.follower1 = User.objects.create_user(username='follower1', email='follower1@example.com', password='password')
        self.follower2 = User.objects.create_user(username='follower2', email='follower2@example.com', password='password')

        Follow.objects.create(follower=self.follower1, followed=self.user)
        Follow.objects.create(follower=self.follower2, followed=self.user)

    def test_user_followers(self):
        # Log in the user and send a GET request to user_followers
        self.client.force_login(self.user)
        url = reverse('user_followers')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertIn('followers_info', json_data)

        # Check the followers info
        followers_info = json_data['followers_info']
        self.assertEqual(len(followers_info), 2)
        self.assertIn({'user_id': self.follower1.user_id, 'username': 'follower1'}, followers_info)
        self.assertIn({'user_id': self.follower2.user_id, 'username': 'follower2'}, followers_info)


class GetBookmarkedPostIdsTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post1 = Post.objects.create(user=self.user, content='Post 1 content')
        self.post2 = Post.objects.create(user=self.user, content='Post 2 content')
        self.post3 = Post.objects.create(user=self.user, content='Post 3 content')

        Bookmark.objects.create(user=self.user, post=self.post1)
        Bookmark.objects.create(user=self.user, post=self.post3)

    def test_get_bookmarked_post_ids(self):
        # Log in the user and send a GET request to get_bookmarked_post_ids
        self.client.force_login(self.user)
        url = reverse('get_bookmarked_post_ids')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertIn('posts', json_data)

        # Check the bookmarked post ids
        bookmarked_post_ids = json_data['posts']
        self.assertEqual(len(bookmarked_post_ids), 2)
        self.assertIn({'post_id': self.post1.post_id}, bookmarked_post_ids)
        self.assertNotIn({'post_id': self.post2.post_id}, bookmarked_post_ids)  # Post 2 is not bookmarked
        self.assertIn({'post_id': self.post3.post_id}, bookmarked_post_ids)


class ProfileViewEditAuthTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_profile_edit_post(self):
        # Log in the user and send a POST request to edit the profile
        self.client.force_login(self.user)
        url = reverse('profile_view_edit_auth')
        response = self.client.post(url, {'username': 'new_username', 'email': 'new_email@example.com', 'bio': 'new_bio', 'password': 'new_password'})

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Refresh the user instance from the database
        self.user.refresh_from_db()

        # Check that the user information is updated
        self.assertEqual(self.user.username, 'new_username')
        self.assertEqual(self.user.email, 'new_email@example.com')
        self.assertEqual(self.user.bio, 'new_bio')
        self.assertTrue(self.user.check_password('new_password'))



    
    def test_profile_view_get(self):
        # Log in the user and send a GET request to view the profile
        self.client.force_login(self.user)
        url = reverse('profile_view_edit_auth')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertEqual(json_data['username'], self.user.username)
        self.assertEqual(json_data['email'], self.user.email)
        self.assertEqual(json_data['bio'], self.user.bio)
        self.assertEqual(json_data['following_count'], self.user.following.count())
        self.assertEqual(json_data['followers_count'], self.user.followers.count())
        self.assertEqual(len(json_data['posts']), 1)
        self.assertEqual(json_data['posts'][0]['post_id'], self.post.post_id)


class ProfileViewEditOthersTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password1', bio='User 1 bio')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password2', bio='User 2 bio')
        self.post1 = Post.objects.create(user=self.user1, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.user2, content='Test post content 2')
        self.follow = Follow.objects.create(follower=self.user1, followed=self.user2)

    def test_profile_view_edit_others(self):
        # Log in user1 and send a GET request to view the profile of user2
        self.client.force_login(self.user1)
        url = reverse('profile_view_edit_others', args=[self.user2.username])
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON data returned
        json_data = response.json()
        self.assertEqual(json_data['username'], self.user2.username)
        self.assertEqual(json_data['email'], self.user2.email)
        self.assertEqual(json_data['bio'], self.user2.bio)
        self.assertEqual(json_data['following_count'], self.user2.following.count())
        self.assertEqual(json_data['followers_count'], self.user2.followers.count())
        self.assertEqual(json_data['profile_picture'], None)  # Assuming profile picture is not set for user2
        self.assertEqual(len(json_data['posts']), 1)
        self.assertEqual(json_data['posts'][0]['post_id'], self.post2.post_id)
        self.assertTrue(json_data['is_following'])  # user1 is following user2


class ResetPasswordTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')

    def test_reset_password_email(self):
        # Send a POST request to reset password using email
        url = reverse('reset_password')
        data = {'email': 'test@example.com', 'new_password': 'new_password'}
        response = self.client.post(url, data=data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the password is reset
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password'))

    def test_reset_password_username(self):
        # Send a POST request to reset password using username
        url = reverse('reset_password')
        data = {'username': 'testuser', 'new_password': 'new_password'}
        response = self.client.post(url, data=data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the password is reset
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password'))

    def test_reset_password_invalid_user(self):
        # Send a POST request to reset password with invalid user
        url = reverse('reset_password')
        data = {'email': 'invalid@example.com', 'new_password': 'new_password'}
        response = self.client.post(url, data=data)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

    def test_reset_password_no_email_username(self):
        # Send a POST request to reset password without email or username
        url = reverse('reset_password')
        data = {'new_password': 'new_password'}
        response = self.client.post(url, data=data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

    def test_reset_password_no_new_password(self):
        # Send a POST request to reset password without new password
        url = reverse('reset_password')
        data = {'email': 'test@example.com'}
        response = self.client.post(url, data=data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)


class FollowUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.followed_user = User.objects.create_user(username='followeduser', email='followed@example.com', password='password')

    def test_follow_user(self):
        # Log in the user and send a POST request to follow another user
        self.client.force_login(self.user)
        url = reverse('follow_user', args=['followeduser'])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the user is now following the followed user
        self.assertTrue(Follow.objects.filter(follower=self.user, followed=self.followed_user).exists())

    def test_follow_user_self(self):
        # Log in the user and send a POST request to follow oneself
        self.client.force_login(self.user)
        url = reverse('follow_user', args=['testuser'])
        response = self.client.post(url)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

    def test_follow_user_invalid_user(self):
        # Log in the user and send a POST request to follow an invalid user
        self.client.force_login(self.user)
        url = reverse('follow_user', args=['invaliduser'])
        response = self.client.post(url)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

    def test_follow_user_already_following(self):
        # Follow the user first
        Follow.objects.create(follower=self.user, followed=self.followed_user)

        # Log in the user and send a POST request to follow the same user again
        self.client.force_login(self.user)
        url = reverse('follow_user', args=['followeduser'])
        response = self.client.post(url)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)


class UnfollowUserTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.followed_user = User.objects.create_user(username='followeduser', email='followed@example.com', password='password')

    def test_unfollow_user(self):
        # Follow the user first
        Follow.objects.create(follower=self.user, followed=self.followed_user)

        # Log in the user and send a POST request to unfollow the user
        self.client.force_login(self.user)
        url = reverse('unfollow_user', args=['followeduser'])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the user is now not following the followed user
        self.assertFalse(Follow.objects.filter(follower=self.user, followed=self.followed_user).exists())

    def test_unfollow_user_not_following(self):
        # Log in the user and send a POST request to unfollow a user that is not being followed
        self.client.force_login(self.user)
        url = reverse('unfollow_user', args=['followeduser'])
        response = self.client.post(url)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

    def test_unfollow_user_invalid_user(self):
        # Log in the user and send a POST request to unfollow an invalid user
        self.client.force_login(self.user)
        url = reverse('unfollow_user', args=['invaliduser'])
        response = self.client.post(url)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)


class FeedTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.followed_user = User.objects.create_user(username='followeduser', email='followed@example.com', password='password')
        self.post1 = Post.objects.create(user=self.followed_user, content='Test post 1')
        self.post2 = Post.objects.create(user=self.followed_user, content='Test post 2')
        self.post3 = Post.objects.create(user=self.followed_user, content='Test post 3')

    def test_feed_authenticated_user(self):
        # Follow the user first
        Follow.objects.create(follower=self.user, followed=self.followed_user)

        # Log in the user and send a GET request to view the feed
        self.client.force_login(self.user)
        url = reverse('feed')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check that the response contains the post ids in reverse order
        expected_post_ids = [self.post3.post_id, self.post2.post_id, self.post1.post_id]
        self.assertEqual(response.json()['post_ids'], expected_post_ids)

    def test_feed_unauthenticated_user(self):
        # Send a GET request to view the feed without logging in
        url = reverse('feed')
        response = self.client.get(url)

        # Check that the response status code is 403 Forbidden (since it's only accessible to authenticated users)
        self.assertEqual(response.status_code, 302)


class SearchTestCase(TestCase):
    def test_search(self):
        # Create a client to simulate GET request
        client = Client()

        # Simulate a GET request to the search endpoint with a query parameter
        url = reverse('search')
        query = 'LeBron James'  # Example query
        response = client.get(url, {'query': query})

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the expected keys
        json_data = response.json()
        self.assertIn('player', json_data)


class PlayerViewTestCase(TestCase):
    def test_player_view(self):
        # Create a client to simulate GET request
        client = Client()

        # Simulate a GET request to the player endpoint with an 'id' parameter
        player_id = 'Q42'  # Example player ID
        url = reverse('player')
        response = client.get(url, {'id': player_id})

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the expected keys and structure
        json_data = response.json()
        self.assertIn('name', json_data)
        self.assertIn('height', json_data)
        self.assertIn('date_of_birth', json_data)
        self.assertIn('instagram', json_data)
        self.assertIn('teams', json_data)
        self.assertIn('positions', json_data)
        self.assertIn('awards', json_data)
        self.assertIn('image', json_data)


class SessionViewTestCase(TestCase):
    def test_session_view(self):
        # Create a client to simulate GET request
        client = Client()

        # Simulate a GET request to the session endpoint
        url = reverse('session')
        response = client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the expected keys and structure
        json_data = response.json()
        self.assertIn('session', json_data)

        # Ensure that the session key is not None
        self.assertIsNotNone(json_data['session'])

