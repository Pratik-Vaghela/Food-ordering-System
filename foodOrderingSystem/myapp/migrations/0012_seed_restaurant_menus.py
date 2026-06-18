from django.db import migrations

def link_and_seed_menus(apps, schema_editor):
    Restaurants = apps.get_model('myapp', 'Restaurants')
    Menu = apps.get_model('myapp', 'Menu')

    # Get restaurant 20 (Jay Bhavani Vadapav)
    try:
        jay_bhavani = Restaurants.objects.get(id=20)
    except Restaurants.DoesNotExist:
        jay_bhavani = None

    # Link existing Vadapav menus (IDs 1-11) to Restaurant 20
    if jay_bhavani:
        Menu.objects.filter(id__gte=1, id__lte=11).update(restaurant=jay_bhavani)

    # Seed other menus
    other_menus_data = [
        # Burger King (ID 2)
        {'id': 12, 'name': 'Veg Whopper', 'price': 149, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/e0839ff574213e6f35b3899ebf1fc597', 'restaurant_id': 2},
        {'id': 13, 'name': 'Crispy Chicken Burger', 'price': 179, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/56c9b7754c0e1887ab50130d55e6911c', 'restaurant_id': 2},
        {'id': 14, 'name': 'Crispy Veg Burger', 'price': 99, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/e0839ff574213e6f35b3899ebf1fc597', 'restaurant_id': 2},
        {'id': 15, 'name': 'King Fries', 'price': 119, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/e33zsf7c1m4nqajtwsx3', 'restaurant_id': 2},
        
        # Pizza Hut (ID 3)
        {'id': 16, 'name': 'Margherita Pizza', 'price': 249, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/2b4f62d606d1b2bfba9ba9e5386fabb7', 'restaurant_id': 3},
        {'id': 17, 'name': 'Pepperoni Pizza', 'price': 399, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/2b4f62d606d1b2bfba9ba9e5386fabb7', 'restaurant_id': 3},
        {'id': 18, 'name': 'Garlic Breadsticks', 'price': 129, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/1dcd52b343b9c6d639497a3aefa153ea', 'restaurant_id': 3},
        
        # KFC (ID 4)
        {'id': 19, 'name': '8 Pc Hot & Crispy Chicken', 'price': 599, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/6/a3cc7799-b974-4a47-932b-8ae7003f8c5b_953480.jpg', 'restaurant_id': 4},
        {'id': 20, 'name': 'Chicken Zinger Burger', 'price': 199, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/4fe8d129-44fd-469e-9eda-a1416a6dffcd_40831.JPG', 'restaurant_id': 4},
        {'id': 21, 'name': 'Popcorn Chicken', 'price': 169, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/6/a3cc7799-b974-4a47-932b-8ae7003f8c5b_953480.jpg', 'restaurant_id': 4},
        
        # Chinese Wok (ID 1)
        {'id': 22, 'name': 'Veg Hakka Noodles', 'price': 199, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e0839ff574213e6f35b3899ebf1fc597', 'restaurant_id': 1},
        {'id': 23, 'name': 'Schezwan Fried Rice', 'price': 219, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e0839ff574213e6f35b3899ebf1fc597', 'restaurant_id': 1},
        {'id': 24, 'name': 'Veg Manchurian', 'price': 189, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e0839ff574213e6f35b3899ebf1fc597', 'restaurant_id': 1},
    ]

    for item in other_menus_data:
        try:
            r = Restaurants.objects.get(id=item['restaurant_id'])
        except Restaurants.DoesNotExist:
            continue
        
        Menu.objects.update_or_create(
            id=item['id'],
            defaults={
                'name': item['name'],
                'price': item['price'],
                'image': item['image'],
                'restaurant': r
            }
        )

def rollback_link_and_seed_menus(apps, schema_editor):
    Menu = apps.get_model('myapp', 'Menu')
    Menu.objects.filter(id__gte=12).delete()
    Menu.objects.filter(id__gte=1, id__lte=11).update(restaurant=None)

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0011_menu_restaurant'),
    ]

    operations = [
        migrations.RunPython(link_and_seed_menus, rollback_link_and_seed_menus),
    ]
