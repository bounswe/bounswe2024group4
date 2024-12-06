from django.db import models
from user_auth_app.models import User


class Food(models.Model):
    food_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    # calories = models.FloatField()
    # protein = models.FloatField()
    # carbs = models.FloatField()
    # fat = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return self.food_name

class Meal(models.Model):
    meal_id = models.AutoField(primary_key=True)
    meal_name = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.FloatField(default=0)
    rating_count = models.IntegerField(default=0)
    foods = models.ManyToManyField(Food)

    def _str_(self):
        return self.meal_name