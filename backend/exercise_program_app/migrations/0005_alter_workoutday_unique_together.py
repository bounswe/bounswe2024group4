# Generated by Django 4.2.16 on 2024-11-18 13:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('exercise_program_app', '0004_alter_weeklyprogram_created_by'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='workoutday',
            unique_together={('program', 'day_of_week')},
        ),
    ]