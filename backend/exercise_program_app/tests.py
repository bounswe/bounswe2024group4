from django.test import TestCase, Client
from user_auth_app.models import User
from .models import Workout, Exercise
from django.urls import reverse

class WorkoutProgramTestCase(TestCase):
    def setUp(self):
        User.objects.create(username='user1', email='user1@kaanmail.com')

    def test_get_exercises(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.get('/get_exercises/', {'muscle': 'biceps'})
        self.assertEqual(response.status_code, 200)

    # def test_workout_program(self):
    #     self.client.force_login(User.objects.get(username='user1'))
    #     response = self.client.post(
    #         '/workout_program/',
    #         json.dumps({'workout_name': 'workout1',
    #          'exercises': [{
    #                 'type': 'type1',
    #                 'name': 'name1',
    #                 'muscle': 'muscle1', 
    #                 'equipment': 'equipment1', 
    #                 'instruction': 'instruction1'
    #              }]
    #         }), content_type='application/json')
    #     self.assertEqual(response, 201)


class RateWorkoutTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.workout = Workout.objects.create(workout_id=1, workout_name='Test Workout', created_by=self.user)

    def test_rate_workout_success(self):
        # Log in the user to simulate an authenticated request
        self.client.login(username='testuser', password='password')

        # Simulate a POST request to rate the workout with valid data
        url = reverse('rate_workout')
        data = {
            'workout_id': self.workout.workout_id,
            'rating': 4.5
        }
        response = self.client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Rating submitted successfully')

        # Check that the workout rating and rating count are updated
        self.workout.refresh_from_db()
        self.assertEqual(self.workout.rating, 4.5)
        self.assertEqual(self.workout.rating_count, 1)

        # Check that the user rating and rating count are updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.workout_rating, 4.5)
        self.assertEqual(self.user.workout_rating_count, 1)

    def test_rate_workout_invalid_rating(self):
        # Log in the user to simulate an authenticated request
        self.client.login(username='testuser', password='password')

        # Simulate a POST request to rate the workout with an invalid rating
        url = reverse('rate_workout')
        data = {
            'workout_id': self.workout.workout_id,
            'rating': 6  # Invalid rating (greater than 5)
        }
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Rating must be between 0 and 5')

    def test_rate_workout_no_user(self):
        # Delete the user to simulate no user found
        self.user.delete()

        # Simulate a POST request to rate the workout
        url = reverse('rate_workout')
        data = {
            'workout_id': self.workout.workout_id,
            'rating': 4.5
        }
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'No user found')

    def test_rate_workout_invalid_method(self):
        # Simulate a GET request to the rate_workout endpoint
        url = reverse('rate_workout')
        response = self.client.get(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "GET" not allowed.')


class GetWorkoutByIdTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.workout = Workout.objects.create(workout_id=1, workout_name='Test Workout', created_by=self.user)
        self.exercise = Exercise.objects.create(
            workout=self.workout,
            type='Cardio',
            name='Running',
            muscle='Legs',
            equipment='None',
            instruction='Run for 30 minutes'
        )

    def test_get_workout_by_id_success(self):
        # Simulate a GET request to retrieve the workout by ID
        url = reverse('get_workout_by_id', args=[self.workout.workout_id])
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the workout details
        json_data = response.json()
        self.assertEqual(json_data['id'], self.workout.workout_id)
        self.assertEqual(json_data['workout_name'], self.workout.workout_name)
        self.assertEqual(json_data['created_by'], self.user.username)
        self.assertEqual(json_data['rating'], self.workout.rating)
        self.assertEqual(json_data['rating_count'], self.workout.rating_count)
        self.assertEqual(len(json_data['exercises']), 1)
        self.assertEqual(json_data['exercises'][0]['name'], self.exercise.name)

    def test_get_workout_by_id_not_found(self):
        # Simulate a GET request to retrieve a non-existent workout by ID
        url = reverse('get_workout_by_id', args=[999])
        response = self.client.get(url)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)

    def test_get_workout_by_id_invalid_method(self):
        # Simulate a POST request to the get_workout_by_id endpoint
        url = reverse('get_workout_by_id', args=[self.workout.workout_id])
        response = self.client.post(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "POST" not allowed.')


class GetWorkoutsByUserIdTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.other_user = User.objects.create_user(username='otheruser', email='other@example.com', password='password')
        self.workout1 = Workout.objects.create(workout_id=1, workout_name='Workout 1', created_by=self.user)
        self.workout2 = Workout.objects.create(workout_id=2, workout_name='Workout 2', created_by=self.user)
        self.exercise1 = Exercise.objects.create(
            workout=self.workout1,
            type='Cardio',
            name='Running',
            muscle='Legs',
            equipment='None',
            instruction='Run for 30 minutes'
        )
        self.exercise2 = Exercise.objects.create(
            workout=self.workout2,
            type='Strength',
            name='Push-ups',
            muscle='Chest',
            equipment='None',
            instruction='Do 20 push-ups'
        )

    def test_get_workouts_by_user_id_success(self):
        # Simulate a GET request to retrieve workouts by user ID
        url = reverse('get_workouts_by_user_id', args=[self.user.user_id])
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the workouts details
        json_data = response.json()
        self.assertEqual(len(json_data), 2)
        self.assertEqual(json_data[0]['id'], self.workout1.workout_id)
        self.assertEqual(json_data[0]['workout_name'], self.workout1.workout_name)
        self.assertEqual(json_data[0]['created_by'], self.user.username)
        self.assertEqual(len(json_data[0]['exercises']), 1)
        self.assertEqual(json_data[0]['exercises'][0]['name'], self.exercise1.name)
        self.assertEqual(json_data[1]['id'], self.workout2.workout_id)
        self.assertEqual(json_data[1]['workout_name'], self.workout2.workout_name)
        self.assertEqual(json_data[1]['created_by'], self.user.username)
        self.assertEqual(len(json_data[1]['exercises']), 1)
        self.assertEqual(json_data[1]['exercises'][0]['name'], self.exercise2.name)

    def test_get_workouts_by_user_id_no_workouts(self):
        # Simulate a GET request to retrieve workouts by user ID with no workouts
        url = reverse('get_workouts_by_user_id', args=[self.other_user.user_id])
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the workouts details
        json_data = response.json()
        self.assertEqual(len(json_data), 0)

    def test_get_workouts_by_user_id_invalid_method(self):
        # Simulate a POST request to the get_workouts_by_user_id endpoint
        url = reverse('get_workouts_by_user_id', args=[self.user.user_id])
        response = self.client.post(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "POST" not allowed.')