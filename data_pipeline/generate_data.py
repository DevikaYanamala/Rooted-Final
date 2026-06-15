import csv
import random
import uuid
from datetime import datetime, timedelta

# Configuration
NUM_RECORDS = 10000
OUTPUT_FILE = 'synthetic_user_logs.csv'

# Demographics & Geography
POSTCODES = ['NE1', 'NE2', 'NE3', 'M1', 'M14', 'SW1A', 'E1', 'B1', 'B15']
CULTURES = ['Indian', 'Nigerian', 'East Asian', 'Middle Eastern', 'Caribbean']

# Products mapping (Culture -> Products)
PRODUCTS = {
    'Indian': ['Garam Masala', 'Basmati Rice', 'Paneer', 'Turmeric Powder', 'Mango Chutney'],
    'Nigerian': ['Jollof Rice Seasoning', 'Plantain', 'Cassava Flour', 'Palm Oil', 'Maggi Cubes'],
    'East Asian': ['Matcha Powder', 'Mochi', 'Soy Sauce', 'Sriracha', 'Nori Seaweed'],
    'Middle Eastern': ['Zaatar', 'Tahini', 'Sumac', 'Pomegranate Molasses', 'Pita Bread'],
    'Caribbean': ['Jerk Seasoning', 'Scotch Bonnet Peppers', 'Ackee', 'Saltfish', 'Coconut Milk']
}

def generate_data():
    records = []
    start_date = datetime.now() - timedelta(days=90) # Last 90 days of data
    
    print(f"Generating {NUM_RECORDS} synthetic user interactions...")
    
    for _ in range(NUM_RECORDS):
        # 1. User Profile
        user_id = f"usr_{str(uuid.uuid4())[:8]}"
        postcode = random.choice(POSTCODES)
        
        # User has a true cultural background
        true_culture = random.choice(CULTURES)
        
        # 2. Search Behavior (80% of the time they search for their own culture's food, 20% explore others)
        if random.random() < 0.8:
            search_culture = true_culture
        else:
            search_culture = random.choice(CULTURES)
            
        search_query = random.choice(PRODUCTS[search_culture])
        
        # 3. Engagement Metrics
        # Did they click a product? (90% click rate if they searched)
        clicked = 1 if random.random() < 0.9 else 0
        
        # Did they buy it? (Conversion rate depends if it matches their culture)
        purchased = 0
        if clicked:
            buy_chance = 0.6 if search_culture == true_culture else 0.3
            purchased = 1 if random.random() < buy_chance else 0
            
        # 4. Authenticity Rating (Only if purchased)
        rating = ""
        if purchased:
            # People from the native culture rate more strictly (e.g. 3-5), outsiders might just rate high (4-5)
            if search_culture == true_culture:
                # 10% chance of being disappointed by authenticity, 90% chance of rating 4-5
                rating = random.choice([3, 4, 4, 5, 5, 5]) if random.random() > 0.1 else random.choice([1, 2])
            else:
                rating = random.choice([4, 5])
                
        # 5. Timestamp
        random_days = random.randint(0, 90)
        interaction_time = start_date + timedelta(days=random_days, hours=random.randint(0, 23), minutes=random.randint(0, 59))
        
        records.append({
            'timestamp': interaction_time.strftime('%Y-%m-%d %H:%M:%S'),
            'user_id': user_id,
            'user_location': postcode,
            'user_culture_profile': true_culture,
            'search_query': search_query,
            'clicked': clicked,
            'purchased': purchased,
            'authenticity_rating_given': rating
        })

    # Sort by timestamp
    records.sort(key=lambda x: x['timestamp'])

    # Write to CSV
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)
        
    print(f"Success! {NUM_RECORDS} records written to {OUTPUT_FILE}")

if __name__ == '__main__':
    generate_data()
