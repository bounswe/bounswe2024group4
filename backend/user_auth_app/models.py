from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=128)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    user_type = models.CharField(max_length=20, choices=[('guest', 'Guest'), ('member', 'Member'), ('super_member', 'Super Member')], default='guest')
    score = models.IntegerField(default=0)  # For leaderboard ranking
    height = models.FloatField(default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    rating = models.FloatField(default=0)
    rating_count = models.IntegerField(default=0)
    liked_posts = models.ManyToManyField('posts_app.Post', related_name='liked_by', blank=True)
    following = models.ManyToManyField('self', symmetrical=False, through='Follow', related_name='followers')
    
    # Adding related_name to avoid clashes with Django's built-in auth.User
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Avoids clash with auth.User
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Avoids clash with auth.User
        blank=True,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
    
class Follow(models.Model):
    follower = models.ForeignKey('User', related_name='following_set', on_delete=models.CASCADE)
    following = models.ForeignKey('User', related_name='follower_set', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')

    def __str__(self):
        return f"{self.follower} follows {self.following}"
    

class Weight(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    weight = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} weighed {self.weight} at {self.created_at}"