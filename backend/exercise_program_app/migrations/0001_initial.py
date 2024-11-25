# Generated by Django 4.2.16 on 2024-11-25 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('exercise_id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('muscle', models.CharField(max_length=50)),
                ('equipment', models.CharField(max_length=50)),
                ('instruction', models.TextField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('sets', models.IntegerField(default=0)),
                ('reps', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseInstance',
            fields=[
                ('exercise_instance_id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=50)),
                ('muscle', models.CharField(max_length=50)),
                ('equipment', models.CharField(max_length=50)),
                ('instruction', models.TextField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ExerciseLog',
            fields=[
                ('exercise_log_id', models.AutoField(primary_key=True, serialize=False)),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='WeeklyProgram',
            fields=[
                ('program_id', models.AutoField(primary_key=True, serialize=False)),
                ('days_per_week', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Workout',
            fields=[
                ('workout_id', models.AutoField(primary_key=True, serialize=False)),
                ('workout_name', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('rating', models.FloatField(default=0)),
                ('rating_count', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_of_week', models.IntegerField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday')])),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutLog',
            fields=[
                ('log_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
