from django.urls import path, include
from .views import ItemList, UserCreate, RestaurantsList,MenuList,UserList,CartCreate,HistoryList

urlpatterns = [
    path('User/', UserCreate.as_view(), name='user-create'),
    path('items/', ItemList.as_view(), name='item-list'),
    path('restaurants/', RestaurantsList.as_view(), name='restaurants-create'),
    path('menu/', MenuList.as_view(), name='menu-list'),
    path('UserList/', UserList.as_view(), name='menu-list'),
    path('cart/', CartCreate.as_view(), name='cart-create'),
    path('HistoryList/', HistoryList.as_view(), name='purchase-history'),
      
]
