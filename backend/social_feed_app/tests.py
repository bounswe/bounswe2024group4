from django.test import TestCase, Client
from django.urls import reverse
from user_auth_app.models import User, Follow
from posts_app.models import Post

class FeedViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post1 = Post.objects.create(user=self.user, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.user, content='Test post content 2')
        self.client.login(username='testuser', password='password')

    def test_feed_success(self):
        # Simulate a GET request to retrieve all posts
        url = reverse('feed')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the posts
        json_data = response.json()
        self.assertIn('posts', json_data)
        self.assertEqual(len(json_data['posts']), 2)
        self.assertEqual(json_data['posts'][0]['content'], 'Test post content 1')
        self.assertEqual(json_data['posts'][1]['content'], 'Test post content 2')

    def test_feed_invalid_method(self):
        # Simulate a POST request to the feed endpoint
        url = reverse('feed')
        response = self.client.post(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Invalid request')


class FollowingFeedViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.followed_user1 = User.objects.create_user(username='followeduser1', email='followed1@example.com', password='password')
        self.followed_user2 = User.objects.create_user(username='followeduser2', email='followed2@example.com', password='password')
        Follow.objects.create(follower=self.user, following=self.followed_user1)
        Follow.objects.create(follower=self.user, following=self.followed_user2)
        self.post1 = Post.objects.create(user=self.followed_user1, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.followed_user2, content='Test post content 2')
        self.client.login(username='testuser', password='password')

    def test_following_feed_success(self):
        # Simulate a GET request to retrieve posts from followed users
        url = reverse('following_feed')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the posts
        json_data = response.json()
        self.assertIn('posts', json_data)
        self.assertEqual(len(json_data['posts']), 2)
        self.assertEqual(json_data['posts'][0]['content'], 'Test post content 1')
        self.assertEqual(json_data['posts'][1]['content'], 'Test post content 2')

    def test_following_feed_invalid_method(self):
        # Simulate a POST request to the following_feed endpoint
        url = reverse('following_feed')
        response = self.client.post(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Invalid request')