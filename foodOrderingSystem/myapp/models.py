from django.db import models


class Item(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Restaurants(models.Model):
    name = models.CharField(max_length=50)
    image = models.URLField()
    rating = models.FloatField()
    duration = models.CharField(max_length=20)
    location = models.CharField(max_length=50)
    
    
class Menu(models.Model):
    name = models.CharField(max_length=50)
    price = models.IntegerField()
    image = models.URLField()
    id = models.IntegerField(primary_key=True)


class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Store hashed password


class CartItems(models.Model):
    user_name = models.CharField(max_length=50)
    # item_id = models.FloatField(default=0)
    item_name = models.CharField(max_length=255)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.item_name} (x{self.quantity})"