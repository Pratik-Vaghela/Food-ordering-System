import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodOrderingSystem.settings')
django.setup()

from myapp.models import Restaurants, Menu

def seed_menu():
    # Cuisines mapping with high-quality, category-specific food images
    cuisines = {
        'Chinese': {
            'items': [
                ('Veg Hakka Noodles', 199, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Schezwan Fried Rice', 219, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Veg Manchurian Gravy', 189, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Crispy Spring Rolls', 149, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chilli Paneer Dry', 229, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Hot & Sour Soup', 99, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chicken Hakka Noodles', 249, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Veg Fried Rice', 189, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Paneer Momos (6 Pcs)', 129, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Honey Chilli Potato', 169, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Burgers': {
            'items': [
                ('Crispy Veg Burger', 99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Veg Whopper', 149, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheese Melt Burger', 139, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Crispy Chicken Burger', 179, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Double Patty Deluxe Burger', 199, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Peri Peri French Fries', 109, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Classic Salted Fries', 89, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheesy Fries', 129, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Spicy Chicken Wrap', 169, 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Onion Rings (8 Pcs)', 99, 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Pizzas': {
            'items': [
                ('Margherita Pizza', 249, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Tandoori Paneer Pizza', 349, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Farmhouse Veg Pizza', 329, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Pepperoni Feast Pizza', 399, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Spicy Chicken Pizza', 379, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Garlic Breadsticks', 129, 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Stuffed Garlic Bread', 159, 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Paneer Pocket (2 Pcs)', 99, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheese Burst Upgrade', 99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Choco Lava Cake', 99, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Fried Chicken': {
            'items': [
                ('8 Pc Hot & Crispy Chicken', 599, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&h=300&q=80'),
                ('4 Pc Smoky Grilled Chicken', 349, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chicken Zinger Burger', 199, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Popcorn Chicken Large', 229, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Boneless Chicken Strips', 189, 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Hot Wings (6 Pcs)', 149, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Veg Zinger Burger', 169, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Crispy Fries Medium', 99, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Krushers Choco Lash', 129, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Bakery': {
            'items': [
                ('Double Chocolate Brownie', 89, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Pineapple Pastry', 69, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Red Velvet Cake Slice', 99, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Assorted Macarons (4 Pcs)', 149, 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chocolate Croissant', 79, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Vanilla Choco Chip Ice Cream', 79, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Hot Fudge Sundae', 129, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Belgian Waffle with Nutella', 159, 'https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Blueberry Cheesecake Slice', 139, 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Sandwiches': {
            'items': [
                ('Veggie Delite Sub (15cm)', 149, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Paneer Tikka Sub (15cm)', 179, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chicken Teriyaki Sub (15cm)', 219, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Corn & Peas Salad', 139, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Tuna Salad Sub (15cm)', 199, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Aloo Patty Sub (15cm)', 139, 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Oatmeal Raisin Cookie', 39, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chocolate Chip Cookie', 39, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Snacks': {
            'items': [
                ('Butter Popcorn Tub', 180, 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheese Nachos with Salsa', 150, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Salted Caramel Popcorn', 190, 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cold Coffee Classic', 120, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Irani Masala Chai', 40, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Singular Samosa (2 Pcs)', 50, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Bun Maska', 60, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Lemon Iced Tea', 80, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Mint Mojito', 99, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'South Indian': {
            'items': [
                ('Butter Masala Dosa', 120, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Steamed Idli Sambar (2 Pcs)', 60, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Crispy Medu Vada (2 Pcs)', 70, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Onion Uttapam', 100, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Special Filter Coffee', 50, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Tamarind / Lemon Rice', 90, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Hot Semolina Upma', 60, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Mysore Masala Dosa', 140, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Mexican': {
            'items': [
                ('Naked Chicken Taco', 169, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheese Quesadilla', 129, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheesy Fiesta Nachos', 139, 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=300&h=300&q=80'),
                ('7-Layer Burrito Bowl', 199, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Crispy Churros (3 Pcs)', 89, 'https://images.unsplash.com/photo-1628117160759-b8414e9198a2?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        },
        'Gujarati & North Indian': {
            'items': [
                ('Gujarati Thali (Deluxe)', 250, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Aloo Paratha with Curd', 99, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Paneer Paratha with Pickle', 129, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Special Butter Pav Bhaji', 140, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Cheese Butter Pav Bhaji', 160, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Chole Bhature (2 Pcs)', 130, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Paneer Butter Masala', 189, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Tandoori Butter Naan', 45, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Dal Makhani Deluxe', 159, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&h=300&q=80'),
                ('Sweet Punjabi Lassi', 60, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&h=300&q=80')
            ]
        }
    }

    # Map Restaurant IDs to specific Cuisines
    restaurant_cuisines = {
        1: 'Chinese',
        2: 'Burgers',
        3: 'Pizzas',
        4: 'Fried Chicken',
        5: 'Bakery',
        6: 'Burgers',
        7: 'Sandwiches',
        8: 'Pizzas',
        9: 'Snacks',
        10: 'South Indian',
        11: 'Mexican',
        12: 'Gujarati & North Indian',
        13: 'Gujarati & North Indian',
        14: 'South Indian',
        15: 'Snacks',
        16: 'Chinese',
        17: 'Gujarati & North Indian',
        18: 'Bakery',
        19: 'Gujarati & North Indian',
        20: 'Burgers'  # Let's seed fast food for Jay Bhavani Vadapav as well
    }

    # Find the current max id in Menu to avoid key duplication
    from django.db.models import Max
    max_id = Menu.objects.aggregate(Max('id'))['id__max'] or 24
    current_id = max_id + 1

    print(f"Starting seed. Current max ID in Menu is {max_id}. Next ID will be {current_id}.")

    seeded_count = 0
    for r_id, cuisine_name in restaurant_cuisines.items():
        try:
            r = Restaurants.objects.get(id=r_id)
        except Restaurants.DoesNotExist:
            print(f"Restaurant ID {r_id} not found in database. Skipping.")
            continue

        cuisine_data = cuisines[cuisine_name]
        for item_name, price, img_url in cuisine_data['items']:
            # Avoid duplicating names in the same restaurant
            if Menu.objects.filter(name=item_name, restaurant=r).exists():
                continue

            Menu.objects.create(
                id=current_id,
                name=item_name,
                price=price,
                image=img_url,
                restaurant=r
            )
            current_id += 1
            seeded_count += 1

    print(f"Successfully seeded {seeded_count} new menu items across your restaurants!")

if __name__ == '__main__':
    seed_menu()
