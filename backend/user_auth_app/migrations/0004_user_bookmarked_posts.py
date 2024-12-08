# Generated by Django 5.1.2 on 2024-11-23 14:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts_app', '0004_remove_post_exercise_post_workout'),
        ('user_auth_app', '0003_user_liked_posts'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bookmarked_posts',
            field=models.ManyToManyField(blank=True, related_name='bookmarked_by', to='posts_app.post'),
        ),
    ]
