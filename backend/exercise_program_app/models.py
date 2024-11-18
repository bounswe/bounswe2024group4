from django.db import models

# Create your models here.


# unique. holds the exercises created by super-members and maybe caches the api data 
class ExerciseInstance(models.Model):
    exercise_instance_id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    muscle = models.CharField(max_length=50)
    equipment = models.CharField(max_length=50)
    instruction = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.exercise_name
    

# workout program created by members
class Workout(models.Model):
    workout_id = models.AutoField(primary_key=True)
    workout_name = models.CharField(max_length=50)
    # created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.workout_name
   
    
# exercises added to the workout program
class Exercise(models.Model):
    exercise_id = models.AutoField(primary_key=True)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    # exercise_instance = models.ForeignKey(ExerciseInstance, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    muscle = models.CharField(max_length=50)
    equipment = models.CharField(max_length=50)
    instruction = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.exercise_name



# ... existing Workout model ...

class WeeklyProgram(models.Model):
    program_id = models.AutoField(primary_key=True)
    # created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    days_per_week = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

class WorkoutDay(models.Model):
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    program = models.ForeignKey(WeeklyProgram, on_delete=models.CASCADE, related_name='workout_days')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)