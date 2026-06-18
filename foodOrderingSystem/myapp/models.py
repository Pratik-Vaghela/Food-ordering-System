from django.db import models
from django.contrib.auth.models import User


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
    restaurant = models.ForeignKey(Restaurants, on_delete=models.CASCADE, related_name='menu_items', null=True, blank=True)


class CartItems(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    # item_id = models.FloatField(default=0)
    item_name = models.CharField(max_length=255)
    item_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.item_name} (x{self.quantity})"

class Review(models.Model):
    restaurant = models.ForeignKey(Restaurants, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField()  # 1 to 5 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.restaurant.name} ({self.rating} stars)"