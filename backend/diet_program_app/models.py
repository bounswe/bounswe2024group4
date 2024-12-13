from django.db import models
from user_auth_app.models import User


class Food(models.Model):
    food_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    ingredients = models.TextField(default='')
    created_at = models.DateTimeField(auto_now_add=True)

    energ_kcal = models.TextField(default='N/A')

    fat = models.TextField(default='N/A')
    fat_saturated = models.TextField(default='N/A')
    fat_trans = models.TextField(default='N/A')

    carbo = models.TextField(default='N/A')
    fiber = models.TextField(default='N/A')
    sugar = models.TextField(default='N/A')

    protein = models.TextField(default='N/A')
    cholesterol = models.TextField(default='N/A')
    na = models.TextField(default='N/A')
    ca = models.TextField(default='N/A')
    k = models.TextField(default='N/A')
    vit_k = models.TextField(default='N/A')
    vit_c = models.TextField(default='N/A')
    vit_a_rae = models.TextField(default='N/A')
    vit_d = models.TextField(default='N/A')
    vit_b12 = models.TextField(default='N/A')
    vit_b6 = models.TextField(default='N/A')

    recipe_url = models.URLField(default='', blank=True)

    # creator_level = models.IntegerField(default=0) # 0: User, 1: Superuser, 2: API

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