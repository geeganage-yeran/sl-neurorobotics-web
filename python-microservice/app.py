from flask import Flask, request, jsonify
from waitress import serve
from services.chatbot_service import ChatbotService
from config import Config

app = Flask(__name__)


chatbot_service = ChatbotService()

@app.route('/api/chatbot', methods=['POST'])
def chatbot():

    try:

        data = request.get_json()
        if not data:
            return jsonify({
                'response': None,
                'status': 'error',
                'error': 'No data provided'
            }), 400
        
        user_query = data.get('question', '').strip()
        if not user_query:
            return jsonify({
                'response': None,
                'status': 'error',
                'error': 'Question is required'
            }), 400
        
        print(f"{user_query}")
        
        result = chatbot_service.process_query(user_query)
        
        print(f"Response: {result}")
        
        if result['status'] == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        error_msg = f"Server error: {str(e)}"
        print(f"{error_msg}")
        return jsonify({
            'response': None,
            'status': 'error',
            'error': error_msg
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy'})

#testing only
@app.route('/api/test', methods=['GET'])
def test():
    """Test endpoint"""
    return jsonify({
        'message': 'Flask API is working!',
        'timestamp': 1751138768086
    })

if __name__ == '__main__':
    serve(app, host=Config.FLASK_HOST, port=Config.FLASK_PORT)