# Generated by Django 5.0.4 on 2024-05-09 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nba_app', '0002_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.BinaryField(blank=True, null=True),
        ),
    ]
