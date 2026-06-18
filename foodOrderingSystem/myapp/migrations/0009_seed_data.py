# Generated dynamically to seed database and create superuser
from django.db import migrations

def create_superuser(apps, schema_editor):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'AdminPassword123')

def seed_data(apps, schema_editor):
    Restaurants = apps.get_model('myapp', 'Restaurants')
    Menu = apps.get_model('myapp', 'Menu')
    
    # Seed Restaurants
    restaurants_data = [{'id': 1, 'name': 'Chinese Wok', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e0839ff574213e6f35b3899ebf1fc597', 'rating': 4.3, 'duration': '20-25 min', 'location': 'CG Road'}, {'id': 2, 'name': 'Burger King', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/11/4ee8bc77-ca9f-41bd-a0f3-511c70902b91_81814.JPG', 'rating': 4.3, 'duration': '20-25 min', 'location': 'CG Road'}, {'id': 3, 'name': 'Pizza Hut', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/2b4f62d606d1b2bfba9ba9e5386fabb7', 'rating': 4.1, 'duration': '25-30 min', 'location': 'Navrangpura'}, {'id': 4, 'name': 'KFC', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/6/a3cc7799-b974-4a47-932b-8ae7003f8c5b_953480.jpg', 'rating': 4.0, 'duration': '25-30 min', 'location': 'Maninagar'}, {'id': 5, 'name': 'Theobroma', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/7/22/bb229a24-2065-4008-a6f4-42e4f8d0b291_791609.jpg', 'rating': 4.7, 'duration': '14-20 min', 'location': 'CG Road'}, {'id': 6, 'name': "McDonald's", 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/18/b64829e4-c1ab-4899-88cd-6cd2f11520b3_70279.jpg', 'rating': 4.4, 'duration': '20-25 mins', 'location': 'Kankaria'}, {'id': 7, 'name': 'Subway', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/4fe8d129-44fd-469e-9eda-a1416a6dffcd_40831.JPG', 'rating': 4.5, 'duration': '20-25 mins', 'location': 'Navrangpura'}, {'id': 8, 'name': 'Puffiza', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/e33zsf7c1m4nqajtwsx3', 'rating': 4.3, 'duration': '25-30 mins', 'location': 'Shahibaug'}, {'id': 9, 'name': 'PVR cafe', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/ry2ymuywrfq9ahxotrc9', 'rating': 4.3, 'duration': '30-35 mins', 'location': 'Ranip'}, {'id': 10, 'name': 'Chennei Express', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/bfcea2108aea7a98f2b370b78b2fdac0', 'rating': 4.1, 'duration': '30-35 mins', 'location': 'Naranpura'}, {'id': 11, 'name': 'Taco bell', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/d3b3db238b6448c3f297c851e9d0b96b', 'rating': 4.1, 'duration': '25-30 mins', 'location': 'Ellis Bridge'}, {'id': 12, 'name': 'Sasuma', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/eerfdwfchlpyfvuvny1s', 'rating': 4.1, 'duration': '25-30 mins', 'location': 'Vastrapur'}, {'id': 13, 'name': 'Gajanand Food', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/h7otmxc84xjvn3xfq66r', 'rating': 4.1, 'duration': '25-30 mins', 'location': 'Thaltej'}, {'id': 14, 'name': 'South Express', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/wbsodzzctqplmnbc5new', 'rating': 4.4, 'duration': '40-45 mins', 'location': 'Chandkheda'}, {'id': 15, 'name': 'Urban kitli', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/syxpajhzlufu6jvvwvts', 'rating': 4.3, 'duration': '25-30 mins', 'location': 'Ellis Bridge'}, {'id': 16, 'name': 'WOW! China', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/1dd81ffac22f8a400b9544a59ed5e888', 'rating': 4.1, 'duration': '30-35 mins', 'location': 'Alpha One Mall'}, {'id': 17, 'name': 'Paratha Junction', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/1dd81ffac22f8a400b9544a59ed5e888', 'rating': 4.1, 'duration': '25-30 mins', 'location': 'Gota'}, {'id': 18, 'name': 'Hocco Eatery', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/ew55nioravwgq0rujybu', 'rating': 4.5, 'duration': '25-30 mins', 'location': 'Ghodasar'}, {'id': 19, 'name': 'Honest', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/RX_THUMBNAIL/IMAGES/VENDOR/2024/6/4/87ff1fd4-8b7d-4061-9b59-994eca99139d_874541.jpg', 'rating': 4.0, 'duration': '20-25 min', 'location': 'Navrangpura'}, {'id': 20, 'name': 'Jay Bhavani Vadapav', 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/isacdfxhou6xxbzg0fps', 'rating': 4.3, 'duration': '15-20 mins', 'location': 'Navrangpura'}]
    for r in restaurants_data:
        Restaurants.objects.update_or_create(
            id=r['id'],
            defaults={
                'name': r['name'],
                'image': r['image'],
                'rating': r['rating'],
                'duration': r['duration'],
                'location': r['location'],
            }
        )
        
    # Seed Menu
    menu_data = [{'id': 1, 'name': 'Green Mumbai Vadapav', 'price': 50, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/397989560dea888f727f97232806d6e1'}, {'id': 2, 'name': 'Schezwan Vadapav', 'price': 48, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/05a2cb464ffcae1dc829ea3a1af8e95d'}, {'id': 3, 'name': 'Aamchi mumbai Vadapav', 'price': 35, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/2ea652c508e071e470a957e29e3b55d8'}, {'id': 4, 'name': 'Bole To Special Vadapav', 'price': 60, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/fbee4a25694d83f27340562cbce6dafc'}, {'id': 5, 'name': 'Asli Cheese Vadapav', 'price': 48, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/1dcd52b343b9c6d639497a3aefa153ea'}, {'id': 6, 'name': 'Peri Peri Vadapav', 'price': 48, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/98d9fff8bb8efd778e29e3d583af0933'}, {'id': 7, 'name': 'Tangda Tandoori Vadapav', 'price': 48, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/397989560dea888f727f97232806d6e1'}, {'id': 8, 'name': 'Italian Vadapav', 'price': 60, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/ca2ffd59f704892f667354854d17193e'}, {'id': 9, 'name': 'Dilkhush Vadapav', 'price': 60, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/2ea652c508e071e470a957e29e3b55d8'}, {'id': 10, 'name': 'Nawab Vadapav', 'price': 50, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/b6ac2e60e3eaf165057b3a2aa4f46553'}, {'id': 11, 'name': 'Classic Mayo Vadapav', 'price': 48, 'image': 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/05a2cb464ffcae1dc829ea3a1af8e95d'}]
    for m in menu_data:
        Menu.objects.update_or_create(
            id=m['id'],
            defaults={
                'name': m['name'],
                'price': m['price'],
                'image': m['image'],
            }
        )

def rollback_seed_data(apps, schema_editor):
    Restaurants = apps.get_model('myapp', 'Restaurants')
    Menu = apps.get_model('myapp', 'Menu')
    Restaurants.objects.all().delete()
    Menu.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0008_cartitems_delete_cartitem'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
        migrations.RunPython(seed_data, rollback_seed_data),
    ]
