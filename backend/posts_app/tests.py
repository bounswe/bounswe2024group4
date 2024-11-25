from django.test import TestCase, Client
from django.urls import reverse
from user_auth_app.models import User
from posts_app.models import Post, Comment
from exercise_program_app.models import Workout

class PostViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.workout = Workout.objects.create(workout_id=1, workout_name='Test Workout', created_by=self.user)
        self.client.login(username='testuser', password='password')

    def test_post_success(self):
        # Simulate a POST request to create a post with valid data
        url = reverse('post')
        data = {
            'content': 'Test content',
            'workoutId': self.workout.workout_id,
            'mealId': 1
        }
        response = self.client.post(url, data)

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Post created successfully')

        # Check that the post is created in the database
        self.assertTrue(Post.objects.filter(content='Test content', workout=self.workout, mealId=1).exists())

    def test_post_workout_not_found(self):
        # Simulate a POST request to create a post with a non-existent workout
        url = reverse('post')
        data = {
            'content': 'Test content',
            'workoutId': 999,  # Non-existent workout ID
            'mealId': 1
        }
        response = self.client.post(url, data)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Workout not found')

    def test_post_invalid_method(self):
        # Simulate a GET request to the post endpoint
        url = reverse('post')
        response = self.client.get(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "GET" not allowed.')


class ToggleLikeViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')
        self.client.login(username='testuser', password='password')

    def test_toggle_like_success(self):
        # Simulate a POST request to like the post
        url = reverse('toggle_like')
        data = {'postId': self.post.id}
        response = self.client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Post liked successfully')

        # Check that the post is liked by the user
        self.assertTrue(self.user.liked_posts.filter(id=self.post.id).exists())
        self.post.refresh_from_db()
        self.assertEqual(self.post.likeCount, 1)

        # Simulate a POST request to unlike the post
        response = self.client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Post unliked successfully')

        # Check that the post is unliked by the user
        self.assertFalse(self.user.liked_posts.filter(id=self.post.id).exists())
        self.post.refresh_from_db()
        self.assertEqual(self.post.likeCount, 0)

    def test_toggle_like_post_not_found(self):
        # Simulate a POST request to like a non-existent post
        url = reverse('toggle_like')
        data = {'postId': 999}  # Non-existent post ID
        response = self.client.post(url, data)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Post not found')

    def test_toggle_like_invalid_post_id(self):
        # Simulate a POST request to like a post with an invalid post ID
        url = reverse('toggle_like')
        data = {'postId': 'invalid'}  # Invalid post ID
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId must be an integer')

    def test_toggle_like_post_id_required(self):
        # Simulate a POST request to like a post without providing post ID
        url = reverse('toggle_like')
        response = self.client.post(url, {})

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId is required')

    def test_toggle_like_invalid_method(self):
        # Simulate a GET request to the toggle_like endpoint
        url = reverse('toggle_like')
        response = self.client.get(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "GET" not allowed.')


class CommentViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')
        self.client.login(username='testuser', password='password')

    def test_comment_success(self):
        # Simulate a POST request to create a comment with valid data
        url = reverse('comment')
        data = {
            'postId': self.post.id,
            'content': 'Test comment content'
        }
        response = self.client.post(url, data)

        # Check that the response status code is 201 Created
        self.assertEqual(response.status_code, 201)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Comment created successfully')

        # Check that the comment is created in the database
        self.assertTrue(Comment.objects.filter(content='Test comment content', post=self.post, user=self.user).exists())

    def test_comment_post_not_found(self):
        # Simulate a POST request to create a comment with a non-existent post
        url = reverse('comment')
        data = {
            'postId': 999,  # Non-existent post ID
            'content': 'Test comment content'
        }
        response = self.client.post(url, data)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Post not found')

    def test_comment_invalid_post_id(self):
        # Simulate a POST request to create a comment with an invalid post ID
        url = reverse('comment')
        data = {
            'postId': 'invalid',  # Invalid post ID
            'content': 'Test comment content'
        }
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId must be an integer')

    def test_comment_post_id_required(self):
        # Simulate a POST request to create a comment without providing post ID
        url = reverse('comment')
        data = {
            'content': 'Test comment content'
        }
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId is required')

    def test_comment_content_required(self):
        # Simulate a POST request to create a comment without providing content
        url = reverse('comment')
        data = {
            'postId': self.post.id
        }
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'content is required')

    def test_comment_invalid_method(self):
        # Simulate a GET request to the comment endpoint
        url = reverse('comment')
        response = self.client.get(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "GET" not allowed.')


class ToggleBookmarkViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')
        self.client.login(username='testuser', password='password')

    def test_toggle_bookmark_success(self):
        # Simulate a POST request to bookmark the post
        url = reverse('toggle_bookmark')
        data = {'postId': self.post.id}
        response = self.client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Post bookmarked successfully')

        # Check that the post is bookmarked by the user
        self.assertTrue(self.user.bookmarked_posts.filter(id=self.post.id).exists())

        # Simulate a POST request to unbookmark the post
        response = self.client.post(url, data)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the success message
        json_data = response.json()
        self.assertIn('message', json_data)
        self.assertEqual(json_data['message'], 'Post unbookmarked successfully')

        # Check that the post is unbookmarked by the user
        self.assertFalse(self.user.bookmarked_posts.filter(id=self.post.id).exists())

    def test_toggle_bookmark_post_not_found(self):
        # Simulate a POST request to bookmark a non-existent post
        url = reverse('toggle_bookmark')
        data = {'postId': 999}  # Non-existent post ID
        response = self.client.post(url, data)

        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'Post not found')

    def test_toggle_bookmark_invalid_post_id(self):
        # Simulate a POST request to bookmark a post with an invalid post ID
        url = reverse('toggle_bookmark')
        data = {'postId': 'invalid'}  # Invalid post ID
        response = self.client.post(url, data)

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId must be an integer')

    def test_toggle_bookmark_post_id_required(self):
        # Simulate a POST request to bookmark a post without providing post ID
        url = reverse('toggle_bookmark')
        response = self.client.post(url, {})

        # Check that the response status code is 400 Bad Request
        self.assertEqual(response.status_code, 400)

        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('error', json_data)
        self.assertEqual(json_data['error'], 'postId is required')

    def test_bookmarked_posts_invalid_method(self):
        # Simulate a POST request to the bookmarked_posts endpoint
        url = reverse('bookmarked_posts')
        response = self.client.post(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "POST" not allowed.')


class LikedPostsViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post1 = Post.objects.create(user=self.user, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.user, content='Test post content 2')
        self.user.liked_posts.add(self.post1, self.post2)
        self.client.login(username='testuser', password='password')

    def test_liked_posts_success(self):
        # Simulate a GET request to retrieve liked posts
        url = reverse('liked_posts')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the liked posts
        json_data = response.json()
        self.assertIn('liked_posts', json_data)
        self.assertEqual(len(json_data['liked_posts']), 2)
        self.assertEqual(json_data['liked_posts'][0]['content'], 'Test post content 1')
        self.assertEqual(json_data['liked_posts'][1]['content'], 'Test post content 2')

    def test_liked_posts_invalid_method(self):
        # Simulate a POST request to the liked_posts endpoint
        url = reverse('liked_posts')
        response = self.client.post(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "POST" not allowed.')


class BookmarkedPostsViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post1 = Post.objects.create(user=self.user, content='Test post content 1')
        self.post2 = Post.objects.create(user=self.user, content='Test post content 2')
        self.user.bookmarked_posts.add(self.post1, self.post2)
        self.client.login(username='testuser', password='password')

    def test_bookmarked_posts_success(self):
        # Simulate a GET request to retrieve bookmarked posts
        url = reverse('bookmarked_posts')
        response = self.client.get(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)

        # Check the JSON response data for the bookmarked posts
        json_data = response.json()
        self.assertIn('bookmarked_posts', json_data)
        self.assertEqual(len(json_data['bookmarked_posts']), 2)
        self.assertEqual(json_data['bookmarked_posts'][0]['content'], 'Test post content 1')
        self.assertEqual(json_data['bookmarked_posts'][1]['content'], 'Test post content 2')

    def test_bookmarked_posts_invalid_method(self):
        # Simulate a POST request to the bookmarked_posts endpoint
        url = reverse('bookmarked_posts')
        response = self.client.post(url)
    
        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
    
        # Check the JSON response data for the error message
        json_data = response.json()
        self.assertIn('detail', json_data)
        self.assertEqual(json_data['detail'], 'Method "POST" not allowed.')