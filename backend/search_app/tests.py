from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from user_auth_app.models import User
from posts_app.models import Post
from exercise_program_app.models import Workout
from diet_program_app.models import Meal
import json

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
        self.client.credentials()  # This clears any previously set credentials
        response = self.client.get(f'{self.search_url}?search=test')
        self.assertEqual(response.status_code, 401)

    def test_search_missing_query(self):
        """Test search without query parameter"""
        response = self.client.get(self.search_url)  # No 'search' param provided
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Search query is required')

    def test_search_all(self):
        """Test search across all content types"""
        # Explicitly request all categories
        response = self.client.get(f'{self.search_url}?search=test&categories=all')
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
        # Use categories=users to ensure the 'users' category is selected
        response = self.client.get(f'{self.search_url}?search=user&categories=users')
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
        response = self.client.get(f'{self.search_url}?search=content&categories=posts')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('posts', data)
        self.assertTrue(len(data['posts']) > 0)
        self.assertTrue(any(post['content'] == 'Test post content' for post in data['posts']))
        
        # Ensure that no other content types are included
        self.assertNotIn('users', data)
        self.assertNotIn('meals', data)
        self.assertNotIn('workouts', data)

    def test_search_meals(self):
        """Test search meals only"""
        response = self.client.get(f'{self.search_url}?search=meal&categories=meals')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('meals', data)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(any(meal['meal_name'] == 'Test meal' for meal in data['meals']))
        
        # Ensure that no other content types are included
        self.assertNotIn('users', data)
        self.assertNotIn('posts', data)
        self.assertNotIn('workouts', data)

    def test_search_workouts(self):
        """Test search workouts only"""
        response = self.client.get(f'{self.search_url}?search=workout&categories=workouts')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('workouts', data)
        self.assertTrue(len(data['workouts']) > 0)
        self.assertTrue(any(workout['workout_name'] == 'Test workout' for workout in data['workouts']))

        # Ensure that no other content types are included
        self.assertNotIn('users', data)
        self.assertNotIn('posts', data)
        self.assertNotIn('meals', data)

    def test_search_no_results(self):
        """Test search with no matching results"""
        # 'search=nonexistent' should find no matches in any category
        response = self.client.get(f'{self.search_url}?search=nonexistent')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertEqual(len(data.get('users', [])), 0)
        self.assertEqual(len(data.get('posts', [])), 0)
        self.assertEqual(len(data.get('meals', [])), 0)
        self.assertEqual(len(data.get('workouts', [])), 0)

    def test_search_case_insensitive(self):
        """Test case-insensitive search"""
        response = self.client.get(f'{self.search_url}?search=TEST')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertTrue(len(data['posts']) > 0)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(len(data['workouts']) > 0)

    def test_search_invalid_type(self):
        """Test search with invalid category parameter"""
        response = self.client.get(f'{self.search_url}?search=test&categories=invalid')
        self.assertEqual(response.status_code, 200)
        # Should return empty results for invalid category
        self.assertEqual(response.json(), {})


class AdvancedSearchTests(TestCase):
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

    def test_search_super_member_users(self):
        """Test search for super_member users only"""
        # Create a super_member user
        super_user = User.objects.create_user(
            username='superuser',
            email='super@example.com',
            password='testpass123',
            bio='Super member user bio',
            user_type='super_member'
        )
        
        # The code checks if 'super_member' is in categories. So we provide categories='users,super_member'
        response = self.client.get(f'{self.search_url}?search=super&categories=users,super_member')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        # Ensure that users are returned
        self.assertIn('users', data)
        self.assertTrue(len(data['users']) > 0)

        # Check that our super_member user is included
        self.assertTrue(any(user['username'] == 'superuser' for user in data['users']))

        # Ensure that no other categories (posts, meals, workouts) are included
        self.assertNotIn('posts', data)
        self.assertNotIn('meals', data)
        self.assertNotIn('workouts', data)

        # If you had other regular users that match 'super' in their username/bio, they should not appear
        # because 'super_member' is in the categories filter. Ensure only super_member type is returned:
        for user in data['users']:
            # Validate that each user has user_type='super_member'
            self.assertEqual(user.get('user_type'), 'super_member')

    def test_search_meals_with_calorie_filter(self):
        """Test searching meals with specific calorie range filters"""
        # Assume in setUp() we created a meal as:
        self.meal1 = Meal.objects.create(
            meal_name='Test meal 1',
            created_by=self.user,
            calories=500,
            protein=30,
            fat=20,
            carbs=50,
            fiber=10
        )
        self.meal2 = Meal.objects.create(
            meal_name='Test meal 2',
            created_by=self.user,
            calories=200,
            protein=30,
            fat=20,
            carbs=50,
            fiber=10
        )

        # We'll search for 'meal' and filter categories to 'meals' only,
        # and set min_calories and max_calories to capture the meal above.
        response = self.client.get(
            f'{self.search_url}?search=meal&categories=meals&min_calories=400&max_calories=600'
        )
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('meals', data)
        self.assertTrue(len(data['meals']) > 0)

        # Check that our test meal is included since it falls within the calorie range.
        self.assertTrue(any(meal['meal_name'] == 'Test meal 1' for meal in data['meals']))
        self.assertFalse(any(meal['meal_name'] == 'Test meal 2' for meal in data['meals']))
        
    def test_search_workouts_with_muscle_filter(self):
        """Test searching workouts filtered by muscle"""
        # Assume we have an Exercise model related to Workout via a foreign key or many-to-many.
        # We'll create two workouts with different exercises:
        
        # Create a workout with exercises targeting 'legs' and 'back'
        data = {"workout_name": "Full Body Workout",
             "exercises": [{
                    "type": "strength",
                    "name": "Barbell Squat",
                    "muscle": "legs",
                    "equipment": "barbell",
                    "difficulty": "Intermediate",
                    "sets": 1,
                    "reps": 12,
                    "instruction": "Stand with feet shoulder-width apart, barbell on upper back. Squat down until thighs are parallel to ground. Return to starting position."
                },{
                    "type": "strength",
                    "name": "Bench Press",
                    "muscle": "chest",
                    "equipment": "barbell",
                    "difficulty": "Beginner",
                    "sets": 3,
                    "reps": 10,
                    "instruction": "Lie on bench, grip barbell slightly wider than shoulders. Lower bar to chest, then press up to starting position."
                },{
                    "type": "compound",
                    "name": "Deadlift",
                    "muscle": "back",
                    "equipment": "barbell",
                    "difficulty": "Expert",
                    "sets": 4,
                    "reps": 8,
                    "instruction": "Stand with feet hip-width apart, bend at hips and knees to grip barbell. Keep back straight, lift bar by extending hips and knees."
                }
            ]
        }

        self.client.post('/workout_program/', json.dumps(data), content_type='application/json')

        # search for workouts targeting 'legs'
        response = self.client.get(f'{self.search_url}?search=full&categories=workouts&muscles=legs')
        self.assertEqual(response.status_code, 200)
        self.assertIn('workouts', response.json())
        self.assertTrue(len(response.json()['workouts']) > 0)
        self.assertNotIn('users', response.json())
        self.assertNotIn('posts', response.json())
        self.assertNotIn('meals', response.json())

    def test_search_users_filter(self):
        """Test searching specifically for users with a given query"""
        # Assuming 'testuser' was created in setUp(), searching for "test" should match "testuser".
        response = self.client.get(f'{self.search_url}?search=test&categories=users')
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        # Verify that only 'users' category is returned
        self.assertIn('users', data)
        self.assertTrue(len(data['users']) > 0)
        # Check if 'testuser' is in the returned users
        self.assertTrue(any(user['username'] == 'testuser' for user in data['users']))
        
        # Ensure no other categories are included
        self.assertNotIn('posts', data)
        self.assertNotIn('meals', data)
        self.assertNotIn('workouts', data)

    def test_search_multiple_filters(self):
        """Test searching with multiple filters"""
        # Assuming we have a meal with 300 calories and 20g protein
        self.meal1 = Meal.objects.create(
            meal_name='Protein Shake Test',
            created_by=self.user,
            calories=300,
            protein=20,
            fat=5,
            carbs=10,
            fiber=0
        )
        self.meal2 = Meal.objects.create(
            meal_name='Salad Test',
            created_by=self.user,
            calories=250,
            protein=5,
            fat=10,
            carbs=20,
            fiber=5
        )
        
        # Search for meals with 200-400 calories and 15-25g protein
        response = self.client.get(
            f'{self.search_url}?search=protein&categories=meals&min_calories=200&max_calories=400&min_protein=15&max_protein=25'
        )
        self.assertEqual(response.status_code, 200)
        
        data = response.json()
        self.assertIn('meals', data)
        self.assertTrue(len(data['meals']) > 0)
        self.assertTrue(any(meal['meal_name'] == 'Protein Shake Test' for meal in data['meals']))
        self.assertFalse(any(meal['meal_name'] == 'Salad Test' for meal in data['meals']))

    def test_search_multiple_muscles(self):
        """Test searching workouts filtered by muscle"""
        # Assume we have an Exercise model related to Workout via a foreign key or many-to-many.
        # We'll create two workouts with different exercises:
        
        # Create a workout with exercises targeting 'legs' and 'back'
        data = {"workout_name": "Full Body Workout",
             "exercises": [{
                    "type": "strength",
                    "name": "Barbell Squat",
                    "muscle": "legs",
                    "equipment": "barbell",
                    "difficulty": "Intermediate",
                    "sets": 1,
                    "reps": 12,
                    "instruction": "Stand with feet shoulder-width apart, barbell on upper back. Squat down until thighs are parallel to ground. Return to starting position."
                },{
                    "type": "strength",
                    "name": "Bench Press",
                    "muscle": "chest",
                    "equipment": "barbell",
                    "difficulty": "Beginner",
                    "sets": 3,
                    "reps": 10,
                    "instruction": "Lie on bench, grip barbell slightly wider than shoulders. Lower bar to chest, then press up to starting position."
                },{
                    "type": "compound",
                    "name": "Deadlift",
                    "muscle": "back",
                    "equipment": "barbell",
                    "difficulty": "Expert",
                    "sets": 4,
                    "reps": 8,
                    "instruction": "Stand with feet hip-width apart, bend at hips and knees to grip barbell. Keep back straight, lift bar by extending hips and knees."
                }
            ]
        }

        self.client.post('/workout_program/', json.dumps(data), content_type='application/json')

        response = self.client.get(f'{self.search_url}?search=full&categories=workouts&muscles=legs,chest')
        self.assertEqual(response.status_code, 200)
        self.assertIn('workouts', response.json())
        self.assertTrue(len(response.json()['workouts']) > 0)
        self.assertNotIn('users', response.json())
        self.assertNotIn('posts', response.json())
        self.assertNotIn('meals', response.json())

    def test_search_multiple_categories(self):
        """Search for multiple categories: users, posts, and meals only."""
        response = self.client.get(f'{self.search_url}?search=test&categories=users,meals')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn('users', data)
        self.assertNotIn('posts', data)
        self.assertIn('meals', data)
        self.assertNotIn('workouts', data)



