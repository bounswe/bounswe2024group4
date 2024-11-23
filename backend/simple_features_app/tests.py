from django.test import TestCase, Client
from user_auth_app.models import User, Follow

class TestLeaderboard(TestCase):
    def setUp(self):
        # Create mock users
        User.objects.create(
            username='user1',
            email='user1@kaanmail.com',
            workout_rating=10,
            workout_rating_count=1,
            meal_rating=40,
            meal_rating_count=2
            )
        User.objects.create(
            username='user2',
            email='user2@kaanmail.com',
            workout_rating=20,
            workout_rating_count=2,
            meal_rating=5,
            meal_rating_count=1
            )
        User.objects.create(
            username = 'user3', 
            email='user3@kaanmail.com',
            workout_rating=30, 
            workout_rating_count=3,
            meal_rating=10,
            meal_rating_count=3
            )

        self.client = Client()

    def test_get_leaderboard(self):
        response = self.client.get('/get_leaderboard/')

        self.assertEqual(response.status_code, 200)

        expected_data = [
            {'username': 'user1', 'profile_picture': '', 'rating': 30},
            {'username': 'user3', 'profile_picture': '', 'rating': 20},
            {'username': 'user2', 'profile_picture': '', 'rating': 15},
        ]

        self.assertEqual(response.json(), {'leaderboard': expected_data})

    def test_get_workout_leaderboard(self):
        response = self.client.get('/get_workout_leaderboard/')
        self.assertEqual(response.status_code, 200)

        expected_data = [
            {'username': 'user3', 'profile_picture': '', 'workout_rating': 30},
            {'username': 'user2', 'profile_picture': '', 'workout_rating': 20},
            {'username': 'user1', 'profile_picture': '', 'workout_rating': 10},
        ]

        self.assertEqual(response.json(), {'workout_leaderboard': expected_data})

    def test_get_meal_leaderboard(self):
        response = self.client.get('/get_meal_leaderboard/')
        self.assertEqual(response.status_code, 200)

        expected_data = [
            {'username': 'user1', 'profile_picture': '', 'meal_rating': 40},
            {'username': 'user3', 'profile_picture': '', 'meal_rating': 10},
            {'username': 'user2', 'profile_picture': '', 'meal_rating': 5},
        ]

        self.assertEqual(response.json(), {'meal_leaderboard': expected_data})


class TestFollowUnfollow(TestCase):
    def setUp(self):
        # Create mock users
        User.objects.create(username='user1', email='user1@kaanmail.com')
        User.objects.create(username='user2', email='user2@kaanmail.com')
        
        self.client = Client()
    
    def test_follow(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/follow/', {'following': 'user2'})

        self.assertEqual(response.status_code, 200)
        self.assertTrue(Follow.objects.filter(follower__username='user1', following__username='user2').exists())

    def test_follow_nonexistent_user(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/follow/', {'following': 'user3'})

        self.assertEqual(response.status_code, 404)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user3').exists())

    def test_follow_yourself(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/follow/', {'following': 'user1'})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user1').exists())

    def test_follow_already_following(self):
        self.client.force_login(User.objects.get(username='user1'))
        Follow.objects.create(follower=User.objects.get(username='user1'), following=User.objects.get(username='user2'))
        response = self.client.post('/follow/', {'following': 'user2'})

        self.assertEqual(response.status_code, 400)
        self.assertTrue(Follow.objects.filter(follower__username='user1', following__username='user2').exists())

    def test_unfollow(self):
        self.client.force_login(User.objects.get(username='user1'))
        Follow.objects.create(follower=User.objects.get(username='user1'), following=User.objects.get(username='user2'))
        response = self.client.post('/unfollow/', {'following': 'user2'})

        self.assertEqual(response.status_code, 200)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user2').exists())

    def test_unfollow_nonexistent_user(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/unfollow/', {'following': 'user3'})

        self.assertEqual(response.status_code, 404)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user3').exists())

    def test_unfollow_yourself(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/unfollow/', {'following': 'user1'})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user1').exists())
    
    def test_unfollow_not_following(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.post('/unfollow/', {'following': 'user2'})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Follow.objects.filter(follower__username='user1', following__username='user2').exists())