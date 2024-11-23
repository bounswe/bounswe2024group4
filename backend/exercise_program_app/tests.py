from django.test import TestCase, Client
from user_auth_app.models import User
from .models import Workout
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
        # Log in the user to simulate an authenticated request
        self.client.login(username='testuser', password='password')

        # Simulate a GET request to the rate_workout endpoint
        url = reverse('rate_workout')
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Invalid request method')