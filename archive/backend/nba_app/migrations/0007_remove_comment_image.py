# Generated by Django 5.0.4 on 2024-05-11 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nba_app', '0006_comment_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='image',
        ),
    ]