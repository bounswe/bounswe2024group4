# Generated by Django 4.2.16 on 2024-12-12 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercise_program_app', '0002_exercise_reps_exercise_sets'),
    ]

    operations = [
        migrations.AddField(
            model_name='exerciseinstance',
            name='difficulty',
            field=models.CharField(default='Beginner', max_length=50),
        ),
        migrations.AlterField(
            model_name='exerciseinstance',
            name='type',
            field=models.CharField(default='exercise', max_length=50),
        ),
    ]