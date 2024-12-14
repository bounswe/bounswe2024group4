from rest_framework.test import APIClient, APITestCase
from user_auth_app.models import User, Weight
from posts_app.models import Post
from exercise_program_app.models import Workout
from diet_program_app.models import Meal
from django.urls import reverse

class TestProfile(APITestCase):
    def setUp(self):
        # Create mock users
        self.user1 = User.objects.create_user(username='user1', email='user1@kaanmail.com', bio='Lorem ipsum', height=200, password='password')
        self.user2 = User.objects.create_user(username='user2', email='user2@kaanmail.com', bio='Lorem ipsum', password='password')

        self.post1 = Post.objects.create(user=self.user1, content='Hi there, I am user1')
        self.post2 = Post.objects.create(user=self.user2, content='Hi there, I am user2')

        self.workout1 = Workout.objects.create(created_by=self.user1, workout_name='Leg Day')
        self.workout2 = Workout.objects.create(created_by=self.user2, workout_name='Push Day')

        self.meal1 = Meal.objects.create(created_by=self.user1, meal_name='Breakfast')
        self.meal2 = Meal.objects.create(created_by=self.user2, meal_name='Breakfast')

        self.weight1_1 = Weight.objects.create(user=self.user1, weight=80)
        self.weight1_2 = Weight.objects.create(user=self.user1, weight=78)
        self.weight2_1 = Weight.objects.create(user=self.user2, weight=110)

        self.client = APIClient()

    def test_view_profile_yourself(self):
        data = {'username': 'user1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.get('/view_profile/', {'viewed_username': 'user1'})
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], 'user1')
        self.assertEqual(response.json()['bio'], 'Lorem ipsum')
        self.assertEqual(response.json()['profile_picture'], '')
        self.assertEqual(response.json()['score'], 0)
        self.assertEqual(
            [item['weight'] for item in response.json()['weight_history']],
            [80, 78])
        self.assertEqual(response.json()['height'], 200)
        self.assertEqual(response.json()['following_count'], 0)
        self.assertEqual(response.json()['followers_count'], 0)
        self.assertEqual(response.json()['is_following'], False)
        self.assertEqual(response.json()['posts'][0]['content'], 'Hi there, I am user1')
        self.assertEqual(response.json()['workouts'], [{'workout_id': self.workout1.workout_id}])
        self.assertEqual(response.json()['meals'], [{'meal_id': self.meal1.meal_id}])


    def test_view_profile_other_user(self):
        data = {'username': 'user1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.get('/view_profile/', {'viewed_username': 'user2'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], 'user2')
        self.assertEqual(response.json()['bio'], 'Lorem ipsum')
        self.assertEqual(response.json()['profile_picture'], '')
        self.assertEqual(response.json()['score'], 0)
        self.assertEqual(response.json()['weight_history'][0]['weight'], 110.0)
        self.assertEqual(response.json()['height'], 0.0)
        self.assertEqual(response.json()['following_count'], 0)
        self.assertEqual(response.json()['followers_count'], 0)
        self.assertEqual(response.json()['is_following'], False)
        self.assertEqual(response.json()['posts'][0]['content'], 'Hi there, I am user2')
        self.assertEqual(response.json()['workouts'], [{'workout_id': self.workout2.workout_id}])
        self.assertEqual(response.json()['meals'], [{'meal_id': self.meal2.meal_id}])

    def test_view_profile_not_found(self):
        data = {'username': 'user1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.get('/view_profile/', {'viewed_username': 'user3'})

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'message': 'User not found'})

    def test_edit_profile(self):
        data = {'username': 'user1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        response = self.client.post('/edit_profile/', {
            'bio': 'New bio',
            'height': 190,
            'password': '1234',
        })

        self.assertEqual(response.status_code, 200)
        self.user1.refresh_from_db()
        self.assertEqual(self.user1.username, 'user1')
        self.assertEqual(self.user1.email, 'user1@kaanmail.com')
        self.assertEqual(self.user1.bio, 'New bio')
        self.assertEqual(self.user1.height, 190)
        self.assertTrue(self.user1.check_password('1234'))