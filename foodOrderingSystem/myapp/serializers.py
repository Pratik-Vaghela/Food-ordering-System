from rest_framework import serializers
from .models import Item,Restaurants,Menu,CartItems
from .models import User

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        
        
class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'
    

    
class RestaurantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurants
        fields = '__all__'
        
class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItems
        fields = ['user_name', 'item_name', 'item_price', 'quantity']        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
