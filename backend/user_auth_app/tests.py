from django.test import TestCase
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from .models import User
import json

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Create test user
        self.test_user = User.objects.create_user(
            username='existinguser',
            email='existing@test.com',
            password='testpass123'
        )
        # Create URLs
        self.signup_url = reverse('sign_up')
        self.login_url = reverse('log_in')
        self.logout_url = reverse('log_out')
        self.csrf_url = reverse('csrf_token')

    def test_signup_success(self):
        """Test successful user registration"""
        data = {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': 'newpass123',
            'user_type': 'member'
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        self.assertIn('user', response_data)
        self.assertIn('token', response_data)
        self.assertEqual(response_data['user']['username'], 'newuser')
        self.assertEqual(response_data['user']['email'], 'newuser@test.com')
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_signup_duplicate_username(self):
        """Test signup with existing username"""
        data = {
            'username': 'existinguser',  # Already exists
            'email': 'new@test.com',
            'password': 'newpass123'
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Username already taken')

    def test_signup_duplicate_email(self):
        """Test signup with existing email"""
        data = {
            'username': 'newuser',
            'email': 'existing@test.com',  # Already exists
            'password': 'newpass123'
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Email already taken')

    def test_signup_missing_fields(self):
        """Test signup with missing required fields"""
        data = {
            'username': 'newuser',
            # Missing email and password
        }
        response = self.client.post(
            self.signup_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertIn('details', response.json())

    def test_login_success(self):
        """Test successful login"""
        data = {
            'username': 'existinguser',
            'password': 'testpass123'
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn('user', response_data)
        self.assertIn('token', response_data)
        self.assertEqual(response_data['user']['username'], 'existinguser')

    def test_login_wrong_password(self):
        """Test login with wrong password"""
        data = {
            'username': 'existinguser',
            'password': 'wrongpass'
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid credentials')

    def test_login_nonexistent_user(self):
        """Test login with non-existent user"""
        data = {
            'username': 'nonexistentuser',
            'password': 'testpass123'
        }
        response = self.client.post(
            self.login_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['error'], 'Invalid credentials')

    def test_logout_success(self):
        """Test successful logout"""
        # First create a token for the test user
        token = Token.objects.create(user=self.test_user)
        
        # Add token to authorization header
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
        
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Logged out successfully')
        
        # Verify token was deleted
        self.assertFalse(Token.objects.filter(user=self.test_user).exists())

    def test_logout_unauthorized(self):
        """Test logout without authentication"""
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 401)

    def test_csrf_token(self):
        """Test CSRF token endpoint"""
        response = self.client.get(self.csrf_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('csrf_token', response.json())
        self.assertTrue(response.json()['csrf_token'])  # Verify token is not empty

    def test_csrf_token_wrong_method(self):
        """Test CSRF token endpoint with wrong HTTP method"""
        response = self.client.post(self.csrf_url)
        self.assertEqual(response.status_code, 405)
