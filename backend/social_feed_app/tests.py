from django.test import TestCase, Client
from django.urls import reverse
from user_auth_app.models import User, Follow
from posts_app.models import Post
from rest_framework.authtoken.models import Token

class FeedViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        # Create test user and token
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password'
        )
        self.token = Token.objects.create(user=self.user)
        
        # Create test posts
        self.post1 = Post.objects.create(user=self.user, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.user, content='Test post content 2')

    def test_feed_success(self):
        # Set up authorization header with token
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        
        # Simulate a GET request to retrieve all posts
        url = reverse('feed')
        response = self.client.get(url, **headers)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the posts
        json_data = response.json()
        self.assertIn('posts', json_data)
        posts = json_data['posts']
        self.assertEqual(len(posts), 2)
        
        # Verify post contents are present and in correct order
        self.assertTrue(any(post['content'] == 'Test post content 1' for post in posts))
        self.assertTrue(any(post['content'] == 'Test post content 2' for post in posts))

    def test_feed_unauthorized(self):
        # Try to access feed without token
        url = reverse('feed')
        response = self.client.get(url)
        
        # Check that the response status code is 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_feed_invalid_method(self):
        # Set up authorization header with token
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        
        # Simulate a POST request to the feed endpoint
        url = reverse('feed')
        response = self.client.post(url, **headers)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)


class FollowingFeedViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        # Create test users and tokens
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password'
        )
        self.token = Token.objects.create(user=self.user)
        
        self.followed_user1 = User.objects.create_user(
            username='followeduser1',
            email='followed1@example.com',
            password='password'
        )
        self.followed_user2 = User.objects.create_user(
            username='followeduser2',
            email='followed2@example.com',
            password='password'
        )
        
        # Create follow relationships
        Follow.objects.create(follower=self.user, following=self.followed_user1)
        Follow.objects.create(follower=self.user, following=self.followed_user2)
        
        # Create test posts
        self.post1 = Post.objects.create(user=self.followed_user1, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.followed_user2, content='Test post content 2')

    def test_following_feed_success(self):
        # Set up authorization header with token
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        
        # Simulate a GET request to retrieve posts from followed users
        url = reverse('following_feed')
        response = self.client.get(url, **headers)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the posts
        json_data = response.json()
        self.assertIn('posts', json_data)
        posts = json_data['posts']
        self.assertEqual(len(posts), 2)
        
        # Verify post contents are present and in correct order
        self.assertTrue(any(post['content'] == 'Test post content 1' for post in posts))
        self.assertTrue(any(post['content'] == 'Test post content 2' for post in posts))

    def test_following_feed_unauthorized(self):
        # Try to access following feed without token
        url = reverse('following_feed')
        response = self.client.get(url)
        
        # Check that the response status code is 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_following_feed_invalid_method(self):
        # Set up authorization header with token
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        
        # Simulate a POST request to the following_feed endpoint
        url = reverse('following_feed')
        response = self.client.post(url, **headers)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)