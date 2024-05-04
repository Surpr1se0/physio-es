from django.db import models
from django.utils import timezone

class User(models.Model):
    name= models.TextField(max_length=50, blank=False)
    username= models.TextField(max_length=50, blank=False, unique=True)
    email= models.EmailField()
    password=models.CharField(max_length=15, blank=False)
    def __str__(self):
        return f'{self.username}'
   