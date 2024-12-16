from rest_framework.test import APIClient, APITestCase
from user_auth_app.models import User
from diet_program_app.models import Meal, Food
from django.urls import reverse
import json

class TestCreateMealFood(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', email='testuser1@gmail.com', password='password', is_superuser=True)
        self.client = APIClient()

    def test_create_food_all_api(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
        }
        response = self.client.post('/create_food_all/', data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Food for meal created successfully with Edamam Nutrition Analysis API')
        self.assertEqual(response.json()['calories'], "52.0 kcal")

    def test_create_food_all_api_mulitple_ingrdients(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple Twist',
            'ingredients': '100 gr apple\n10 gr sugar\n5 gr cinnamon',
        }
        # Send data as form data (default), no JSON
        response = self.client.post('/create_food_all/', data)
    
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Food for meal created successfully with Edamam Nutrition Analysis API')
        self.assertTrue(float(response.json()['calories'].split(' ')[0]) > 52)

    def test_create_food_all_fail(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Sushi',
            'ingredients': '100 gr sushi',
        }
        response = self.client.post('/create_food_all/', data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Food not found')
        
    def test_create_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Meal created successfully')
        self.assertEqual(response.json()['meal_name'], 'Breakfast')
        self.assertEqual(response.json()['foods_count'], 1)

        meal_id = response.json()['meal_id']
        meal = Meal.objects.get(meal_id=meal_id)
        self.assertEqual(meal.calories, 52.0)

    def test_create_food_superuser(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_superuser/', data)

        self.assertEqual(response.status_code, 201)

    def test_create_food_superuser_use_in_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }

        response = self.client.post('/create_food_superuser/', data)
        self.assertEqual(response.status_code, 201)
        food_id = response.json()['food_id']

        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@gmail.com', password='password')
        data = {'username': 'testuser2', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')

        data = {'meal_name': 'Breakfast', 'foods': [food_id],}
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['message'], 'Meal created successfully')
        self.assertEqual(response.json()['meal_name'], 'Breakfast')
        self.assertEqual(response.json()['foods_count'], 1)

    def test_create_food_superuser_not_super(self):
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@gmail.com', password='password')
        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_superuser/', json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json()['message'], 'Not a superuser')


class TestMealFeatures(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', email='testuser1@gmail.com', password='password')
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@gmail.com', password='password')
        self.client = APIClient()

    def test_one_toggle_bookmark_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        response = self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal bookmarked successfully')
        self.assertEqual(response.json()['meal_id'], meal_id)

    def test_two_toggle_bookmark_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        response = self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
            
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal bookmark removed successfully')
        self.assertEqual(response.json()['meal_id'], meal_id)

    def test_three_toggle_bookmark_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        response = self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal bookmarked successfully')
        self.assertEqual(response.json()['meal_id'], meal_id)

    def test_four_toggle_bookmark_meal(self):
        data = {'username': 'testuser1', 'password': 'password'}
        response = self.client.post(reverse('log_in'), data)
        token = response.json()['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
        response = self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id}), content_type='application/json')
            
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal bookmark removed successfully')
        self.assertEqual(response.json()['meal_id'], meal_id)
        
    def test_rate_meal(self):        
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']

        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 5}), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal rated successfully')

    def test_rate_meal_become_super(self):
        self.user3 = User.objects.create_user(username='testuser3', email='testuser3@gmail.com', password='password')
        self.user4 = User.objects.create_user(username='testuser4', email='testuser4@gmail.com', password='password')
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']

        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 5}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal rated successfully')

        response = self.client.post(reverse('log_in'), {'username': 'testuser3', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 4.2}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal rated successfully')

        response = self.client.post(reverse('log_in'), {'username': 'testuser4', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 4.5}), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal rated successfully')

        self.user1.refresh_from_db()
        self.assertTrue(self.user1.is_superuser)

    def test_rate_meal_with_score(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']

        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 5}), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal rated successfully')

        meal = Meal.objects.get(meal_id=meal_id)
        self.assertEqual(meal.rating, 5)
        self.assertEqual(meal.rating_count, 1)

        response = self.client.post('/rate_meal/', json.dumps({'meal_id': meal_id, 'rating': 4}), content_type='application/json')
        meal.refresh_from_db()
        self.assertEqual(meal.rating, 4.5)
        self.assertEqual(meal.rating_count, 2)

        self.user1.refresh_from_db()
        self.assertTrue(self.user1.score, 4.5)


class TestMealFoodGettersAndDelete(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', email='testuser1@fitnessapp.com', password='password', is_superuser=True)
        self.client = APIClient()

    def test_get_meal_from_id(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        response = self.client.get('/get_meal_from_id/', {'meal_id': meal_id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['meal_name'], 'Apple Breakfast')

    def test_delete_meal_by_id(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id = response.json()['meal_id']
        response = self.client.delete(reverse('delete_meal_by_id', kwargs={'meal_id': meal_id}))
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Meal deleted successfully')

        response = self.client.get('/get_meal_from_id/', {'meal_id': meal_id})
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Meal not found')

    def test_get_foodname_options(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id1 = response.json()['food_id']
        data = {
            'food_name': 'Banana',
            'ingredients': '100 gr banana',
            'energ_kcal': '89.0',
            'fat': '0.3',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id2 = response.json()['food_id']
        response = self.client.get('/get_foodname_options/')
    
        self.assertEqual(response.status_code, 200)
        self.assertTrue(food_id1 in [item['food_id'] for item in response.json()['food_list']])
        self.assertTrue(food_id2 in [item['food_id'] for item in response.json()['food_list']])

    def test_get_meals(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)
        food_id1 = response.json()['food_id']
        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [food_id1],
        }
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id1 = response.json()['meal_id']

        self.user2 = User.objects.create_user(username='testuser2', email="test2@gmail.com", password="password")
        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')
        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id2 = response.json()['meal_id']

        response = self.client.get('/get_meals/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(meal_id2 in [item['meal_id'] for item in response.json()['meals']])
        self.assertFalse(meal_id1 in [item['meal_id'] for item in response.json()['meals']])

    def test_get_bookmarked_meals(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)

        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [response.json()['food_id']],
        }

        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id1 = response.json()['meal_id']
        
        self.user2 = User.objects.create_user(username='testuser2', email="test2@gmail.com", password="password")
        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id1}), content_type='application/json')
        response = self.client.get('/get_bookmarked_meals/')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(meal_id1 in [item['meal_id'] for item in response.json()['meals']])
        self.assertEqual(len(response.json()['meals']), 1)

    def test_double_bookmark_test_get_bookmarked_meals(self):
        response = self.client.post(reverse('log_in'), {'username': 'testuser1', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        data = {
            'food_name': 'Apple',
            'ingredients': '100 gr apple',
            'energ_kcal': '52.0',
            'fat': '0.2',
            'fat_saturated': '0.1'
        }
        response = self.client.post('/create_food_all/', data)

        data = {
            'meal_name': 'Apple Breakfast',
            'foods': [response.json()['food_id']],
        }

        response = self.client.post('/create_meal/', json.dumps(data), content_type='application/json')
        meal_id1 = response.json()['meal_id']

        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@gmail.com', password='password')
        response = self.client.post(reverse('log_in'), {'username': 'testuser2', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {response.json()["token"]}')

        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id1}), content_type='application/json')
        self.client.post('/toggle_bookmark_meal/', json.dumps({'meal_id': meal_id1}), content_type='application/json')
        response = self.client.get('/get_bookmarked_meals/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['meals'], [])


