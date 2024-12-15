# Generated by Django 4.2.16 on 2024-12-14 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diet_program_app', '0004_food_image_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='meal',
            name='calories',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='meal',
            name='carbs',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='meal',
            name='fat',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='meal',
            name='fiber',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='meal',
            name='protein',
            field=models.FloatField(default=0),
        ),
    ]
