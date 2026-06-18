from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ItemList, UserCreate, RestaurantsList, RestaurantDetail, MenuList,
    CartCreate, HistoryList, MyTokenObtainPairView
)

urlpatterns = [
    path('register/', UserCreate.as_view(), name='user-register'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('items/', ItemList.as_view(), name='item-list'),
    path('restaurants/', RestaurantsList.as_view(), name='restaurants-create'),
    path('restaurants/<int:pk>/', RestaurantDetail.as_view(), name='restaurant-detail'),
    path('menu/', MenuList.as_view(), name='menu-list'),
    path('cart/', CartCreate.as_view(), name='cart-create'),
    path('HistoryList/', HistoryList.as_view(), name='purchase-history'),
]
