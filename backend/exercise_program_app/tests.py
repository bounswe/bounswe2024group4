from django.test import TestCase
from user_auth_app.models import User
from .models import Workout
import json

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
