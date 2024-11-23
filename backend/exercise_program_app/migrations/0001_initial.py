import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
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
            name='WeeklyProgram',
            fields=[
                ('program_id', models.AutoField(primary_key=True, serialize=False)),
                ('days_per_week', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
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
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
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
                ('workout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercise_program_app.workout')),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutLog',
            fields=[
                ('log_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateField()),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('workout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercise_program_app.workout')),
            ],
            options={
                'unique_together': {('user', 'workout', 'date')},
            },
        ),
        migrations.CreateModel(
            name='WorkoutDay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day_of_week', models.IntegerField(choices=[(0, 'Monday'), (1, 'Tuesday'), (2, 'Wednesday'), (3, 'Thursday'), (4, 'Friday'), (5, 'Saturday'), (6, 'Sunday')])),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workout_days', to='exercise_program_app.weeklyprogram')),
                ('workout', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercise_program_app.workout')),
            ],
            options={
                'unique_together': {('program', 'day_of_week')},
            },
        ),
        migrations.CreateModel(
            name='ExerciseLog',
            fields=[
                ('exercise_log_id', models.AutoField(primary_key=True, serialize=False)),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercise_program_app.exercise')),
                ('workout_log', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_logs', to='exercise_program_app.workoutlog')),
            ],
            options={
                'unique_together': {('workout_log', 'exercise')},
            },
        ),
    ]
