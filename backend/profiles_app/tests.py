from django.test import TestCase
from user_auth_app.models import User, Weight
from posts_app.models import Post
from exercise_program_app.models import Workout

class TestProfile(TestCase):
    def setUp(self):
        # Create mock users
        self.user1 = User.objects.create(
            username='user1', 
            email='user1@kaanmail.com', 
            bio='Lorem ipsum',
            height=200,
            )
        self.user2 = User.objects.create(
            username='user2', 
            email='user2@kaanmail.com',
            bio='Lorem ipsum',
            )

        self.post1 = Post.objects.create(user=self.user1, content='Hello, world!')
        self.post2 = Post.objects.create(user=self.user2, content='Hello, world!')
        self.workout1 = Workout.objects.create(created_by=self.user1, workout_name='Leg Day')
        self.workout2 = Workout.objects.create(created_by=self.user2, workout_name='Push Day')
        # self.meal1 = Meal.objects.create(user=self.user1, meal_name='Breakfast')
        self.weight1_1 = Weight.objects.create(user=self.user1, weight=80)
        self.weight1_2 = Weight.objects.create(user=self.user1, weight=78)
        self.weight2_1 = Weight.objects.create(user=self.user2, weight=110)


    def test_view_profile_yourself(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.get('/view_profile/', {'username': 'user1'})

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
        self.assertEqual(response.json()['is_following'], None)
        self.assertEqual(response.json()['posts'], [{'post_id': self.post1.id}])
        self.assertEqual(response.json()['workouts'], [{'workout_id': self.workout1.workout_id}])
        # self.assertEqual(response.json()['meals'], [{'meal_id': self.meal1.meal_id}])

    def test_view_profile_other_user(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.get('/view_profile/', {'username': 'user2'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['username'], 'user2')
        self.assertEqual(response.json()['bio'], 'Lorem ipsum')
        self.assertEqual(response.json()['profile_picture'], '')
        self.assertEqual(response.json()['score'], 0)
        self.assertEqual(response.json()['weight_history'], [])
        self.assertEqual(response.json()['height'], None)
        self.assertEqual(response.json()['following_count'], 0)
        self.assertEqual(response.json()['followers_count'], 0)
        self.assertEqual(response.json()['is_following'], False)
        self.assertEqual(response.json()['posts'], [{'post_id': self.post2.id}])
        self.assertEqual(response.json()['workouts'], [{'workout_id': self.workout2.workout_id}])
        # self.assertEqual(response.json()['meals'], [{'meal_id': self.meal2.meal_id}])

    def test_view_profile_not_found(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.get('/view_profile/', {'username': 'user3'})

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'message': 'User not found'})

    def test_edit_profile(self):
        self.client.force_login(User.objects.get(username='user1'))
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