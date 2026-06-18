from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Item, Restaurants, Menu, CartItems
from .serializers import (
    ItemSerializer, UserSerializer, UserRegisterSerializer,
    RestaurantsSerializer, MenuSerializer, CartSerializer
)


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


class RestaurantsList(generics.ListAPIView):
    queryset = Restaurants.objects.all()
    serializer_class = RestaurantsSerializer

class RestaurantDetail(generics.RetrieveAPIView):
    queryset = Restaurants.objects.all()
    serializer_class = RestaurantsSerializer


class MenuList(generics.ListAPIView):
    serializer_class = MenuSerializer

    def get_queryset(self):
        queryset = Menu.objects.all()
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id is not None:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        return queryset


class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class HistoryList(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return CartItems.objects.filter(user=self.request.user)
    

class CartCreate(generics.CreateAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        items = request.data.get('items', [])

        print("Creating cart for user:", request.user.username)  # Debugging line
        print("Received items:", items)  # Debugging line

        if not items:
            return Response({'error': 'Items are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save each item linked to the authenticated user
        for item in items:
            item_data = {
                'item_name': item['item_name'],
                'item_price': item['item_price'],
                'quantity': item['quantity']
            }
            serializer = self.get_serializer(data=item_data)
            if serializer.is_valid():
                serializer.save(user=request.user)
            else:
                print("Validation error:", serializer.errors)  # Debugging line
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Cart items saved successfully!'}, status=status.HTTP_201_CREATED)


class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = CartSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return CartItems.objects.filter(user_name=username)

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserProfileSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user