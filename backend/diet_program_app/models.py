from django.db import models

# Create your models here.
class Meal(models.Model):
    meal_id = models.AutoField(primary_key=True)
    meal_name = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.FloatField(default=0)
    rating_count = models.IntegerField(default=0)

    def _str_(self):
        return self.meal_name