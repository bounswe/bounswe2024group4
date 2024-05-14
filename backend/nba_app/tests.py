from django.test import TestCase, Client
from django.urls import reverse
from .models import User, Post

from django.test import RequestFactory
from .views import *

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