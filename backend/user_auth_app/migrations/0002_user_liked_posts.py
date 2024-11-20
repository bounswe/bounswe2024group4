# Generated by Django 5.1.2 on 2024-11-20 04:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts_app', '0002_post_likecount'),
        ('user_auth_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='liked_posts',
            field=models.ManyToManyField(blank=True, related_name='liked_by', to='posts_app.post'),
        ),
    ]