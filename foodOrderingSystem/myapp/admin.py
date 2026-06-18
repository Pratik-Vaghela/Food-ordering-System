from django.contrib import admin
from .models import Item, Restaurants, Menu, CartItems
# Register your models here.

admin.site.register(Item)
admin.site.register(Restaurants)
admin.site.register(Menu)
admin.site.register(CartItems)


