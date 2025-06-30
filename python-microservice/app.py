from flask import Flask, request, jsonify
import os
from openai import OpenAI
from dotenv import load_dotenv
from waitress import serve
import json


load_dotenv()


OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        app.logger.info("Received request: %s", data)
        
        user_prompt = data.get('question', '')
        product_data = data.get('products', [])
        
        product_context = format_product_data(product_data)
        
        system_message = f"""
        You are a helpful shopping assistant. You have access to the following product information:
        {product_context}
        
        Please help the user with their query about these products. Provide relevant product recommendations 
        and information based on their question.
        """
        
        # OpenAI API call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        response_data = {
            'response': ai_response,
            'status': 'success',
            'error': None
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        error_msg = str(e)
        
        error_response = {
            'response': None,
            'status': 'error',
            'error': f'I apologize, but I encountered an error: {error_msg}'
        }
        
        return jsonify(error_response), 500

def format_product_data(products):
    if not products:
        return "No products available."
    
    formatted_products = []
    for product in products:
        specs = product.get('specifications', '')
        if specs and isinstance(specs, str):
            try:
                import json
                specs_list = json.loads(specs)
                specs_text = ', '.join([f"{spec['name']}: {spec['description']}" for spec in specs_list])
            except:
                specs_text = specs
        else:
            specs_text = specs or 'N/A'
        
        product_info = f"""
        Product: {product.get('name', 'N/A')}
        Description: {product.get('description', 'N/A')}
        Overview: {product.get('overview', 'N/A')}
        Specifications: {specs_text}
        """
        formatted_products.append(product_info)
    
    return "\n".join(formatted_products)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True 
    )