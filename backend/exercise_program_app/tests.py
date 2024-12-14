from django.test import TestCase, Client
from rest_framework.test import APIClient, APITestCase
from user_auth_app.models import User
from .models import Workout, Exercise
from django.urls import reverse
from user_auth_app.models import User
from .models import Workout, Exercise, WorkoutLog, ExerciseLog
import json
from unittest.mock import patch, MagicMock
from datetime import datetime, date
from django.utils import timezone
from rest_framework.authtoken.models import Token
from firebase_admin import firestore


class WorkoutProgramTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='user1', email='user1@kaanmail.com', password='password')

    def test_get_exercises(self):
        self.client.force_login(User.objects.get(username='user1'))
        response = self.client.get('/get_exercises/', {'muscle': 'biceps'})
        self.assertEqual(response.status_code, 200)

    def test_workout_program(self):
        url = reverse('log_in')
        data = {
            'username': 'user1',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

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

        response = self.client.post('/workout_program/', json.dumps(data), content_type='application/json')
        # print(response.json())
        self.assertEqual(response.status_code, 201)
    
    def test_missing_exercises(self):
        url = reverse('log_in')
        data = {
            'username': 'user1',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        data = {'workout_name': 'Leg Day'}
        response = self.client.post('/workout_program/', data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'error': 'exercises are required'})


class WorkoutLogTestCase(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create token for authentication
        self.token = Token.objects.create(user=self.user)
        
        # Create test workout
        self.workout = Workout.objects.create(
            workout_name='Test Workout',
            created_by=self.user
        )
        
        # Create test exercises
        self.exercise1 = Exercise.objects.create(
            workout=self.workout,
            type='strength',
            name='Push-ups',
            muscle='chest',
            equipment='bodyweight',
            instruction='Do push-ups',
            sets=3,
            reps=10
        )
        
        self.exercise2 = Exercise.objects.create(
            workout=self.workout,
            type='strength',
            name='Pull-ups',
            muscle='back',
            equipment='bar',
            instruction='Do pull-ups',
            sets=3,
            reps=8
        )
        
        # Set up the client
        self.client = Client()
        
        # Test data
        self.log_data = {
            'date': '2024-03-21',
            'workout_completed': True,
            'exercises': [
                {
                    'exercise_id': self.exercise1.exercise_id,
                    'is_completed': True,
                    'actual_sets': 3,
                    'actual_reps': 10,
                    'weight': 0.0
                },
                {
                    'exercise_id': self.exercise2.exercise_id,
                    'is_completed': True,
                    'actual_sets': 3,
                    'actual_reps': 8,
                    'weight': 0.0
                }
            ]
        }

    def send_request(self, url, data=None, method='post'):
        headers = {'HTTP_AUTHORIZATION': f'Token {self.token.key}'}
        if method.lower() == 'post':
            return self.client.post(
                url,
                data=json.dumps(data) if data else None,
                content_type='application/json',
                **headers
            )
        return self.client.get(url, **headers)

    @patch('exercise_program_app.views.db')
    def test_workout_log_success(self, mock_db):
        # Set up Firebase mock
        mock_collection = MagicMock()
        mock_db.collection.return_value = mock_collection
        mock_collection.add.return_value = None

        # Make the request
        url = reverse('workout_log', args=[self.workout.workout_id])
        response = self.send_request(url, self.log_data)

        # Check response status and content
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data['workout_id'], self.workout.workout_id)
        self.assertEqual(response_data['workout_name'], 'Test Workout')
        self.assertEqual(response_data['is_completed'], True)
        self.assertEqual(len(response_data['exercises']), 2)

        # Check database entries
        workout_log = WorkoutLog.objects.get(
            workout=self.workout,
            user=self.user,
            date=datetime.strptime(self.log_data['date'], '%Y-%m-%d').date()
        )
        self.assertTrue(workout_log.is_completed)

        # Check exercise logs
        exercise_logs = ExerciseLog.objects.filter(workout_log=workout_log)
        self.assertEqual(exercise_logs.count(), 2)
        
        # Verify Firebase was called correctly
        mock_db.collection.assert_called_once_with('workoutLogActivities')
        mock_collection.add.assert_called_once()
        
        # Get the data that was passed to Firebase
        firebase_call_args = mock_collection.add.call_args[0][0]
        
        # Verify Firebase data structure
        self.assertEqual(firebase_call_args['type'], 'Log')
        self.assertEqual(firebase_call_args['actor']['name'], 'testuser')
        self.assertEqual(firebase_call_args['object']['type'], 'WorkoutLog')
        self.assertEqual(len(firebase_call_args['object']['exercises']), 2)


    def test_workout_log_invalid_exercise(self):
        # Modify data to include invalid exercise ID
        modified_data = self.log_data.copy()
        modified_data['exercises'][0]['exercise_id'] = 999

        url = reverse('workout_log', args=[self.workout.workout_id])
        response = self.send_request(url, modified_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()['error'],
            'Some exercises do not belong to this workout'
        )

    def test_workout_log_invalid_date(self):
        # Modify data to include invalid date
        modified_data = self.log_data.copy()
        modified_data['date'] = '2024-13-45'

        url = reverse('workout_log', args=[self.workout.workout_id])
        response = self.send_request(url, modified_data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()['error'],
            'Invalid date format. Use YYYY-MM-DD'
        )

    def test_workout_log_no_exercises(self):
        # Remove exercises from data
        modified_data = self.log_data.copy()
        modified_data.pop('exercises')

        url = reverse('workout_log', args=[self.workout.workout_id])
        response = self.send_request(url, modified_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['exercises']), 0)
                         
                         
class CreateExerciseSuperUserTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            password='password',
            is_superuser=True,
            workout_rating=5,
            workout_rating_count=11
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='password',
        )

    # Create an exercise as superuser and use it in a workout program as normal user
    def test_create_exercise_superuser(self):
        # Log in the superuser to create an exercise
        url = reverse('log_in')
        data = {
            'username': 'testuser1',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # Simulate a POST request to create an exercise with valid data
        data = {
            'type': 'Cardio',
            'name': 'Running',
            'muscle': 'Cardio',
            'difficulty': 'Beginner',
            'equipment': 'None',
            'instruction': 'Run for 30 minutes'
        }
        response = self.client.post('/create-exercise/', json.dumps(data), content_type='application/json')

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertEqual(json_data['message'], 'Exercise created successfully')
        self.client.logout()
        
        # Log in the normal user to use the exercise in a workout
        url = reverse('log_in')
        data = {
            'username': 'testuser2',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        data = {
            'workout_name': 'Cardio Workout',
            'exercises': [{
                'type': 'Cardio',
                'name': 'Running',
                'muscle': 'Cardio',
                'equipment': 'None',
                'difficulty': 'Beginner',
                'instruction': 'Run for 30 minutes',
                'sets': 1,
                'reps': 10
            }]
        }
        response = self.client.post('/workout_program/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Workout program created successfully')
        self.assertEqual(response.json()['workout_name'], 'Cardio Workout')

    def test_create_exercise_normal_user(self):
        # Log in the normal user to create an exercise
        url = reverse('log_in')
        data = {
            'username': 'testuser2',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # Simulate a POST request to create an exercise with valid data
        data = {
            'type': 'Strength',
            'name': 'Push-ups',
            'muscle': 'Chest',
            'difficulty': 'Intermediate',
            'equipment': 'Bodyweight',
            'instruction': 'Lay straight to the ground on your face and push yourself off the ground'
        }
        response = self.client.post('/create-exercise/', json.dumps(data), content_type='application/json')
  
        # Check that the response status code is 403 Forbidden
        self.assertEqual(response.status_code, 403)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertEqual(json_data['error'], 'You are not authorized to create exercises')

    def test_create_exercise_invalid_data(self):
        # Log in the superuser to create an exercise
        url = reverse('log_in')
        data = {
            'username': 'testuser1',
            'password': 'password'
        }
        response = self.client.post(url, data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        # Simulate a POST request to create an exercise with invalid data
        data = {
            'type': 'Invalid',
            'name': 'Invalid Exercise',
            'muscle': 'Invalid',
            'difficulty': 'Beginner',
            'equipment': 'Bodyweight',
            'instruction': 'Invalid'
        }
        response = self.client.post('/create-exercise/', json.dumps(data), content_type='application/json')

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertEqual(json_data['error'], 'Invalid muscle type')


class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test users
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        
        # Create token for authentication
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        
        # Create test workouts
        self.workout = Workout.objects.create(
            workout_name='Test Workout',
            created_by=self.user,
            rating=0,
            rating_count=0
        )
        self.other_workout = Workout.objects.create(
            workout_name='Other Workout',
            created_by=self.other_user
        )
        
        # Create test exercises
        self.exercise = Exercise.objects.create(
            workout=self.workout,
            type='strength',
            name='Push-ups',
            muscle='chest',
            equipment='bodyweight',
            instruction='Do push-ups',
            sets=3,
            reps=10
        )

    def test_rate_workout_success(self):
        """Test successful workout rating"""
        initial_rating = self.workout.rating
        initial_count = self.workout.rating_count
        
        data = {
            'workout_id': self.workout.workout_id,
            'rating': 4.5
        }
        response = self.client.post(
            reverse('rate_workout'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Rating submitted successfully')
        
        # Verify workout rating updated
        self.workout.refresh_from_db()
        self.assertEqual(self.workout.rating_count, initial_count + 1)
        
        # Verify user rating updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.workout_rating_count, 1)
        self.assertAlmostEqual(self.user.workout_rating, 4.5, places=2)

    def test_get_workout_by_id_not_found(self):
        """Test getting nonexistent workout"""
        response = self.client.get(
            reverse('get_workout_by_id', args=[99999])
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    def test_get_workouts_success(self):
        """Test getting user's workouts"""
        response = self.client.get(reverse('get_workouts'))
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)  # Should only get own workouts
        self.assertEqual(data[0]['workout_name'], 'Test Workout')
        self.assertEqual(len(data[0]['exercises']), 1)

    def test_toggle_bookmark_workout_success(self):
        """Test bookmarking and unbookmarking workout"""
        data = {'workout_id': self.workout.workout_id}
        
        # Test bookmarking
        response = self.client.post(
            reverse('toggle_bookmark_workout'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Bookmark added')
        self.assertTrue(self.user.bookmarked_workouts.filter(workout_id=self.workout.workout_id).exists())
        
        # Test unbookmarking
        response = self.client.post(
            reverse('toggle_bookmark_workout'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Bookmark removed')
        self.assertFalse(self.user.bookmarked_workouts.filter(workout_id=self.workout.workout_id).exists())

    def test_toggle_bookmark_nonexistent_workout(self):
        """Test bookmarking nonexistent workout"""
        data = {'workout_id': 99999}
        response = self.client.post(
            reverse('toggle_bookmark_workout'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Workout not found')

    def test_get_bookmarked_workouts_success(self):
        """Test getting bookmarked workouts"""
        # Bookmark a workout first
        self.user.bookmarked_workouts.add(self.workout)
        
        response = self.client.get(reverse('get_bookmarked_workouts'))
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['workout_name'], 'Test Workout')

    def test_unauthorized_requests(self):
        """Test endpoints without authentication"""
        self.client.credentials()  # Remove authentication
        
        # Test each endpoint
        self.assertEqual(
            self.client.post(reverse('rate_workout'), {}).status_code,
            401
        )
        self.assertEqual(
            self.client.get(reverse('get_workout_by_id', args=[1])).status_code,
            401
        )
        self.assertEqual(
            self.client.get(reverse('get_workouts')).status_code,
            401
        )
        self.assertEqual(
            self.client.post(reverse('toggle_bookmark_workout'), {}).status_code,
            401
        )
        self.assertEqual(
            self.client.get(reverse('get_bookmarked_workouts')).status_code,
            401
        )
