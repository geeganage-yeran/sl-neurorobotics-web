from flask import Flask, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        # Get data from Spring Boot request
        data = request.get_json()
        user_prompt = data.get('prompt', '')
        product_data = data.get('productData', [])
        
        # Format product data for OpenAI context
        product_context = format_product_data(product_data)
        
        # Create system message with product context
        system_message = f"""
        You are a helpful shopping assistant. You have access to the following product information:
        {product_context}
        
        Please help the user with their query about these products. Provide relevant product recommendations 
        and information based on their question.
        """
        
        # Make OpenAI API call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract response content
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'response': ai_response
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def format_product_data(products):
    """Format product data for OpenAI context"""
    if not products:
        return "No products available."
    
    formatted_products = []
    for product in products:
        product_info = f"""
        Product: {product.get('name', 'N/A')}
        Price: ${product.get('price', 'N/A')}
        Description: {product.get('description', 'N/A')}
        Category: {product.get('category', 'N/A')}
        Stock: {product.get('stock', 'N/A')}
        """
        formatted_products.append(product_info)
    
    return "\n".join(formatted_products)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
