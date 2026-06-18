from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.db import models
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from .models import Item, Restaurants, Menu, CartItems, Review
from .serializers import (
    ItemSerializer, UserSerializer, UserRegisterSerializer,
    RestaurantsSerializer, MenuSerializer, CartSerializer, ReviewSerializer
)


class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class RestaurantsList(generics.ListAPIView):
    serializer_class = RestaurantsSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Restaurants.objects.all()
        
        # 1. Search Param (matching restaurant name or menu items served)
        search_query = self.request.query_params.get('search', '').strip()
        if search_query:
            queryset = queryset.filter(
                models.Q(name__icontains=search_query) |
                models.Q(menu_items__name__icontains=search_query)
            ).distinct()
            
        # 2. Filter Param
        filter_param = self.request.query_params.get('filter', '').strip()
        if filter_param == 'rating':
            queryset = queryset.filter(rating__gte=4.5)
        elif filter_param == 'fast':
            queryset = queryset.filter(
                models.Q(duration__icontains='15') |
                models.Q(duration__icontains='20') |
                models.Q(duration__icontains='25') |
                models.Q(duration__icontains='30')
            )
        elif filter_param == 'quick':
            keywords = ['burger', 'pizza', 'bakery', 'snacks', 'vadapav', 'kfc', 'sandwich', 'cafe', 'fries', 'bite']
            q_objects = models.Q()
            for kw in keywords:
                q_objects |= models.Q(name__icontains=kw)
            queryset = queryset.filter(q_objects)
            
        return queryset


class SearchSuggestionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])

        # 1. Match Cuisines
        cuisines_list = ['Chinese', 'Burgers', 'Pizzas', 'Bakery', 'Sandwiches', 'Snacks', 'South Indian', 'Mexican', 'North Indian', 'Gujarati']
        matched_cuisines = [{'type': 'cuisine', 'name': c} for c in cuisines_list if query.lower() in c.lower()][:2]

        # 2. Match Restaurants
        matched_restaurants = Restaurants.objects.filter(name__icontains=query)[:3]
        restaurant_results = [{'type': 'restaurant', 'name': r.name, 'id': r.id} for r in matched_restaurants]

        # 3. Match Dishes
        matched_dishes = Menu.objects.filter(name__icontains=query)[:5]
        dish_results = [{'type': 'dish', 'name': item.name, 'restaurantId': item.restaurant_id} for item in matched_dishes]

        # Combine
        combined = matched_cuisines + restaurant_results + dish_results
        return Response(combined)


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

class RestaurantReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Review.objects.filter(restaurant_id=self.kwargs['restaurant_id']).order_by('-created_at')

    def perform_create(self, serializer):
        restaurant = get_object_or_404(Restaurants, id=self.kwargs['restaurant_id'])
        serializer.save(user=self.request.user, restaurant=restaurant)