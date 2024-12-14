from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from user_auth_app.models import User
from posts_app.models import Post, Comment
from exercise_program_app.models import Workout
from diet_program_app.models import Meal
import json

class PostsTests(TestCase):
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
        
        # Create test data
        self.post = Post.objects.create(
            user=self.user,
            content='Test post content'
        )
        self.other_post = Post.objects.create(
            user=self.other_user,
            content='Other user post'
        )
        self.comment = Comment.objects.create(
            user=self.user,
            post=self.post,
            content='Test comment'
        )

    def test_create_post_success(self):
        """Test successful post creation"""
        data = {
            'content': 'New post content'
        }
        response = self.client.post(
            reverse('post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Post.objects.count(), 3)
        latest_post = Post.objects.latest('id')
        self.assertEqual(latest_post.content, 'New post content')
        self.assertIsNone(latest_post.workout)
        self.assertIsNone(latest_post.mealId)

    def test_create_post_with_workout(self):
        """Test creating post with workout reference"""
        workout = Workout.objects.create(
            workout_name='Test workout',
            created_by=self.user
        )
        data = {
            'content': 'Workout post',
            'workoutId': workout.workout_id
        }
        response = self.client.post(
            reverse('post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        latest_post = Post.objects.latest('id')
        self.assertEqual(latest_post.workout, workout)
        self.assertEqual(latest_post.content, 'Workout post')
        self.assertIsNone(latest_post.mealId)

    def test_create_post_with_meal(self):
        """Test creating post with meal reference"""
        meal = Meal.objects.create(
            meal_name='Test meal',
            created_by=self.user
        )
        data = {
            'content': 'Meal post',
            'mealId': meal.meal_id
        }
        response = self.client.post(
            reverse('post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        latest_post = Post.objects.latest('id')
        self.assertEqual(latest_post.mealId, meal.meal_id)
        self.assertEqual(latest_post.content, 'Meal post')
        self.assertIsNone(latest_post.workout)

    def test_create_post_with_invalid_workout(self):
        """Test creating post with nonexistent workout"""
        data = {
            'content': 'Invalid workout post',
            'workoutId': 99999
        }
        response = self.client.post(
            reverse('post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'Workout not found')

    def test_create_post_missing_content(self):
        """Test post creation without content"""
        response = self.client.post(reverse('post'), {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Content is required')

    def test_toggle_like_success(self):
        """Test successful like toggle"""
        initial_like_count = self.post.likeCount
        data = {'postId': self.post.id}
        
        # Test liking
        response = self.client.post(reverse('toggle_like'), data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Post liked successfully')
        self.post.refresh_from_db()
        self.assertEqual(self.post.likeCount, initial_like_count + 1)
        self.assertTrue(self.user.liked_posts.filter(id=self.post.id).exists())
        
        # Test unliking
        response = self.client.post(reverse('toggle_like'), data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Post unliked successfully')
        self.post.refresh_from_db()
        self.assertEqual(self.post.likeCount, initial_like_count)
        self.assertFalse(self.user.liked_posts.filter(id=self.post.id).exists())

    def test_toggle_like_nonexistent_post(self):
        """Test liking nonexistent post"""
        data = {'postId': 99999}
        response = self.client.post(reverse('toggle_like'), data)
        self.assertEqual(response.status_code, 404)

    def test_comment_success(self):
        """Test successful comment creation"""
        data = {
            'postId': self.post.id,
            'content': 'New comment'
        }
        response = self.client.post(reverse('comment'), data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Comment.objects.filter(content='New comment').exists())

    def test_comment_missing_content(self):
        """Test comment creation without content"""
        data = {'postId': self.post.id}
        response = self.client.post(reverse('comment'), data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'content is required')

    def test_toggle_bookmark_success(self):
        """Test successful bookmark toggle"""
        data = {'postId': self.post.id}
        response = self.client.post(reverse('toggle_bookmark'), data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(self.user.bookmarked_posts.filter(id=self.post.id).exists())
        
        # Test unbookmarking
        response = self.client.post(reverse('toggle_bookmark'), data)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.user.bookmarked_posts.filter(id=self.post.id).exists())

    def test_liked_posts(self):
        """Test getting liked posts"""
        # Like a post first
        self.user.liked_posts.add(self.post)
        
        response = self.client.get(reverse('liked_posts'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['liked_posts']), 1)

    def test_bookmarked_posts(self):
        """Test getting bookmarked posts"""
        # Bookmark a post first
        self.user.bookmarked_posts.add(self.post)
        
        response = self.client.get(reverse('bookmarked_posts'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['bookmarked_posts']), 1)

    def test_unauthorized_requests(self):
        """Test endpoints without authentication"""
        self.client.credentials()  # Remove authentication
        
        # Test each endpoint
        self.assertEqual(self.client.post(reverse('post'), {}).status_code, 401)
        self.assertEqual(self.client.post(reverse('toggle_like'), {}).status_code, 401)
        self.assertEqual(self.client.post(reverse('comment'), {}).status_code, 401)
        self.assertEqual(self.client.post(reverse('toggle_bookmark'), {}).status_code, 401)
        self.assertEqual(self.client.get(reverse('liked_posts')).status_code, 401)
        self.assertEqual(self.client.get(reverse('bookmarked_posts')).status_code, 401)
