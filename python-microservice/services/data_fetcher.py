import requests
from config import Config

class DataFetcher:
    
    @staticmethod
    def fetch_faqs():
        try:
            response = requests.get(f"{Config.SPRING_BOOT_BASE_URL}/api/faq/all", timeout=10)
            
            if response.status_code == 200:
                faqs = response.json()
                return faqs
            else:
                print(f"Failed to fetch FAQs: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error fetching FAQs: {str(e)}")
            return []
    
    @staticmethod
    def fetch_products():
        try:
            response = requests.get(f"{Config.SPRING_BOOT_BASE_URL}/api/products/chatbot", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                return products
            else:
                print(f"Failed to fetch products: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error fetching products: {str(e)}")
            return []