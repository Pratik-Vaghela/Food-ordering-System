from django.shortcuts import render
from rest_framework import generics  
from .models import Item, User, Restaurants, Menu,CartItems
from .serializers import ItemSerializer, UserSerializer, RestaurantsSerializer,MenuSerializer,CartSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import CartItems
from .serializers import CartSerializer


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class RestaurantsList(generics.ListAPIView):
    queryset = Restaurants.objects.all()
    serializer_class = RestaurantsSerializer


class MenuList(generics.ListAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer


class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class HistoryList(generics.ListAPIView):
    queryset = CartItems.objects.all()
    serializer_class = CartSerializer
    

class CartCreate(generics.CreateAPIView):
    serializer_class = CartSerializer

    def post(self, request, *args, **kwargs):
        user_name = request.data.get('user')
        items = request.data.get('items', [])

        print("Received user_name:", user_name)  # Debugging line
        print("Received items:", items)  # Debugging line

        if not user_name or not items:
            return Response({'error': 'User name and items are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Save each item to the Cart model
        for item in items:
            item_data = {
                'user_name': user_name,
                # 'item_id': item['item_id'],
                'item_name': item['item_name'],
                'item_price': item['item_price'],
                'quantity': item['quantity']
            }
            serializer = self.get_serializer(data=item_data)
            if serializer.is_valid():
                serializer.save()
            else:
                print("Validation error:", serializer.errors)  # Debugging line
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': 'Cart items saved successfully!'}, status=status.HTTP_201_CREATED)


class PurchaseHistoryList(generics.ListAPIView):
    serializer_class = CartSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return CartItems.objects.filter(user_name=username)