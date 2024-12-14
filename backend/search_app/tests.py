from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from user_auth_app.models import User
from posts_app.models import Post
from exercise_program_app.models import Workout
from diet_program_app.models import Meal

class SearchTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            bio='Test user bio'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123',
            bio='Other user bio'
        )
        
        # Create token for authentication
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create test data
        self.post = Post.objects.create(
            user=self.user,
            content='Test post content'
        )
        self.workout = Workout.objects.create(
            workout_name='Test workout',
            created_by=self.user
        )
        self.meal = Meal.objects.create(
            meal_name='Test meal',
            created_by=self.user
        )
        
        # URL for search endpoint
        self.search_url = reverse('search')

    def test_search_unauthorized(self):
        """Test search without authentication"""
        self.client.credentials()  # Remove authentication
        response = self.client.get(f'{self.search_url}?search=test')
        self.assertEqual(response.status_code, 401)

    def test_search_missing_query(self):
        """Test search without query parameter"""
        response = self.client.get(self.search_url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Search query is required')

    def test_search_all(self):
        """Test search across all content types"""
        response = self.client.get(f'{self.search_url}?search=test')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('users', data)
        self.assertIn('posts', data)
        self.assertIn('meals', data)
        self.assertIn('workouts', data)
        
        # Verify each content type has results
        self.assertTrue(len(data['users']) > 0)
        self.assertTrue(len(data['posts']) > 0)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(len(data['workouts']) > 0)

    def test_search_users(self):
        """Test search users only"""
        response = self.client.get(f'{self.search_url}?search=user&type=users')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('users', data)
        self.assertTrue(len(data['users']) > 0)
        self.assertTrue(any(user['username'] == 'testuser' for user in data['users']))
        
        # Verify other content types are not included
        self.assertNotIn('posts', data)
        self.assertNotIn('meals', data)
        self.assertNotIn('workouts', data)

    def test_search_posts(self):
        """Test search posts only"""
        response = self.client.get(f'{self.search_url}?search=content&type=posts')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('posts', data)
        self.assertTrue(len(data['posts']) > 0)
        self.assertTrue(any(post['content'] == 'Test post content' for post in data['posts']))

    def test_search_meals(self):
        """Test search meals only"""
        response = self.client.get(f'{self.search_url}?search=meal&type=meals')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('meals', data)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(any(meal['meal_name'] == 'Test meal' for meal in data['meals']))

    def test_search_workouts(self):
        """Test search workouts only"""
        response = self.client.get(f'{self.search_url}?search=workout&type=workouts')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('workouts', data)
        self.assertTrue(len(data['workouts']) > 0)
        self.assertTrue(any(workout['workout_name'] == 'Test workout' for workout in data['workouts']))

    def test_search_no_results(self):
        """Test search with no matching results"""
        response = self.client.get(f'{self.search_url}?search=nonexistent')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(len(data['users']), 0)
        self.assertEqual(len(data['posts']), 0)
        self.assertEqual(len(data['meals']), 0)
        self.assertEqual(len(data['workouts']), 0)

    def test_search_case_insensitive(self):
        """Test case-insensitive search"""
        response = self.client.get(f'{self.search_url}?search=TEST')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertTrue(len(data['posts']) > 0)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(len(data['workouts']) > 0)

    def test_search_invalid_type(self):
        """Test search with invalid type parameter"""
        response = self.client.get(f'{self.search_url}?search=test&type=invalid')
        self.assertEqual(response.status_code, 200)
        # Should return empty results for invalid type
        self.assertEqual(response.json(), {})
