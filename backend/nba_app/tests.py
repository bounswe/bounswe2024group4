from django.test import TestCase, Client
from django.urls import reverse
from .models import User, Post

from django.test import RequestFactory
from .views import *

class UserLoginTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')

    def test_login_view(self):
        # Send a POST request to the login view with valid credentials
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'password'})
        
        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the response contains the username in JSON format
        self.assertIn('username', response.json())

    def test_login_view_invalid_credentials(self):
        # Send a POST request to the login view with invalid credentials
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': 'wrongpassword'})
        
        # Check that the response status code is 401 Unauthorized
        self.assertEqual(response.status_code, 401)
        
        # Check that the response contains the error message
        self.assertEqual(response.content, b'Invalid credentials')


class PostsTestCase(TestCase):
    def setUp(self):
        # Set up any necessary objects, such as users or posts, for the tests
        self.factory = RequestFactory()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_post_view(self):
        # Test the post view
        url = reverse('post')
        request = self.factory.post(url, {'content': 'Test content'})
        request.user = self.user
        response = post(request)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Post created successfully', response.content.decode())


class CreateCommentTestCase(TestCase):

    def setUp(self):
        # Set up any necessary objects, such as users or posts, for the tests
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='testpassword')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_create_comment_view(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')
        
        # Send a POST request to the create_comment view with valid data
        url = reverse('create_comment', kwargs={'post_id': self.post.post_id})
        response = self.client.post(url, {'content': 'Test comment content'})
        
        # Check that the comment is created successfully
        self.assertEqual(response.status_code, 302)  # Redirect status code
        self.assertEqual(Comment.objects.count(), 1)  # Check that a comment object is created

        # Optionally, you can check that the comment is associated with the correct post
        comment = Comment.objects.first()
        self.assertEqual(comment.post, self.post)

    def test_create_comment_view_post_not_found(self):
        # Log in the user
        self.client.login(username='testuser', password='testpassword')
        
        # Send a POST request to the create_comment view with an invalid post_id
        invalid_post_id = self.post.post_id + 1  # Assuming post_id is incremental
        url = reverse('create_comment', kwargs={'post_id': invalid_post_id})
        response = self.client.post(url, {'content': 'Test comment content'})
        
        # Check that the response status code is 404 Not Found
        self.assertEqual(response.status_code, 404)


class LikeOrUnlikePostTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_like_post(self):
        # Send a POST request to like a post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was liked
        self.assertEqual(response.json(), {'message': 'Post liked'})

        # Check that the post is actually liked
        self.assertTrue(LikePost.objects.filter(user=self.user, post=self.post).exists())

    def test_unlike_post(self):
        # Like the post first
        LikePost.objects.create(user=self.user, post=self.post)

        # Send a POST request to unlike the post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was unliked
        self.assertEqual(response.json(), {'message': 'Post unliked'})

        # Check that the post is actually unliked
        self.assertFalse(LikePost.objects.filter(user=self.user, post=self.post).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the like_or_unlike_post view
        url = reverse('like_or_unlike_post', args=[self.post.post_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})



class LikeOrUnlikeCommentTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')
        self.comment = Comment.objects.create(user=self.user, post=self.post, content='Test comment content')

    def test_like_comment(self):
        # Send a POST request to like a comment
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the comment was liked
        self.assertEqual(response.json(), {'message': 'Comment liked'})

        # Check that the comment is actually liked
        self.assertTrue(LikeComment.objects.filter(user=self.user, comment=self.comment).exists())

    def test_unlike_comment(self):
        # Like the comment first
        LikeComment.objects.create(user=self.user, comment=self.comment)

        # Send a POST request to unlike the comment
        self.client.force_login(self.user)  # Log in the user
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the comment was unliked
        self.assertEqual(response.json(), {'message': 'Comment unliked'})

        # Check that the comment is actually unliked
        self.assertFalse(LikeComment.objects.filter(user=self.user, comment=self.comment).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the like_or_unlike_comment view
        url = reverse('like_or_unlike_comment', args=[self.comment.comment_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})


class BookmarkOrUnbookmarkPostTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')
        self.post = Post.objects.create(user=self.user, content='Test post content')

    def test_bookmark_post(self):
        # Send a POST request to bookmark a post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was bookmarked
        self.assertEqual(response.json(), {'message': 'Post bookmarked'})

        # Check that the post is actually bookmarked
        self.assertTrue(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_unbookmark_post(self):
        # Bookmark the post first
        Bookmark.objects.create(user=self.user, post=self.post)

        # Send a POST request to unbookmark the post
        self.client.force_login(self.user)  # Log in the user
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.post(url)

        # Check that the response status code is 200 OK
        self.assertEqual(response.status_code, 200)
        
        # Check that the post was unbookmarked
        self.assertEqual(response.json(), {'message': 'Post unbookmarked'})

        # Check that the post is actually unbookmarked
        self.assertFalse(Bookmark.objects.filter(user=self.user, post=self.post).exists())

    def test_only_post_requests_allowed(self):
        # Send a GET request to the bookmark_or_unbookmark_post view
        url = reverse('bookmark_or_unbookmark_post', args=[self.post.post_id])
        response = self.client.get(url)

        # Check that the response status code is 405 Method Not Allowed
        self.assertEqual(response.status_code, 405)
        
        # Check that the error message is returned
        self.assertEqual(response.json(), {'error': 'Only POST requests are allowed.'})