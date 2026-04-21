import pandas as pd
import numpy as np
import random

careers = ['Software Engineer', 'Doctor', 'Teacher', 'Artist', 'Business Owner', 'Lawyer', 'Scientist', 'Writer', 'Marketing', 'Finance']
lifestyles = ['Minimalist', 'Balanced', 'Luxurious', 'Adventure-seeker', 'Family-focused', 'Career-driven']
choices = ['Corporate Ladder', 'Entrepreneurship', 'Creative Pursuit', 'Academic Excellence', 'World Explorer', 'Work-Life Balance']

def generate_synthetic_data(n_samples=2000):
    data = []
    
    for _ in range(n_samples):
        age = random.randint(18, 55)
        career = random.choice(careers)
        lifestyle = random.choice(lifestyles)
        choice = random.choice(choices)
        
        base_happiness = 50
        base_success = 50
        base_finance = 50
        
        if lifestyle == 'Family-focused':
            base_happiness += 15
        elif lifestyle == 'Career-driven':
            base_success += 20
            base_finance += 15
        elif lifestyle == 'Balanced':
            base_happiness += 10
            base_success += 10
            base_finance += 10
        elif lifestyle == 'Adventure-seeker':
            base_happiness += 20
            base_finance -= 10
        elif lifestyle == 'Luxurious':
            base_finance += 20
            base_happiness += 5
        elif lifestyle == 'Minimalist':
            base_happiness += 12
            base_finance -= 5
        
        if choice == 'Corporate Ladder':
            base_success += 25
            base_finance += 20
            base_happiness -= 5
        elif choice == 'Entrepreneurship':
            base_success += 15
            base_finance += random.randint(-10, 30)
            base_happiness += 10
        elif choice == 'Creative Pursuit':
            base_happiness += 25
            base_success += 10
            base_finance -= 10
        elif choice == 'Academic Excellence':
            base_success += 20
            base_happiness += 5
            base_finance += 5
        elif choice == 'World Explorer':
            base_happiness += 30
            base_success += 5
            base_finance -= 15
        elif choice == 'Work-Life Balance':
            base_happiness += 20
            base_success += 10
            base_finance += 5
        
        if career in ['Doctor', 'Lawyer', 'Software Engineer']:
            base_finance += 15
            base_success += 10
        elif career in ['Teacher', 'Writer', 'Artist']:
            base_happiness += 10
            base_finance -= 5
        elif career in ['Business Owner', 'Finance']:
            base_finance += 20
            base_success += 15
        
        age_factor = (age - 18) / 37
        base_success += age_factor * 15
        base_finance += age_factor * 20
        
        noise_h = random.uniform(-10, 10)
        noise_s = random.uniform(-10, 10)
        noise_f = random.uniform(-10, 10)
        
        happiness = max(10, min(100, base_happiness + noise_h))
        success = max(10, min(100, base_success + noise_s))
        finance = max(10, min(100, base_finance + noise_f))
        
        data.append({
            'age': age,
            'career': career,
            'lifestyle': lifestyle,
            'choice': choice,
            'happiness': round(happiness, 2),
            'success': round(success, 2),
            'finance': round(finance, 2)
        })
    
    df = pd.DataFrame(data)
    df.to_csv('altlife-backend/profile_data.csv', index=False)
    print(f"Generated {n_samples} samples and saved to profile_data.csv")
    return df

if __name__ == '__main__':
    generate_synthetic_data(2000)
