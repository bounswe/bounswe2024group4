# Generated by Django 4.2.16 on 2024-12-14 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('diet_program_app', '0003_alter_food_recipe_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='image_url',
            field=models.ImageField(blank=True, default='', upload_to='food_images/'),
        ),
    ]