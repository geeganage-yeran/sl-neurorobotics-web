from openai import OpenAI
import json
from config import Config
from .classifier import QueryClassifier
from .data_fetcher import DataFetcher


class ChatbotService:

    def __init__(self):
        self.client = OpenAI(api_key=Config.OPENAI_API_KEY)

    def process_query(self, user_query):

        try:
            query_type = QueryClassifier.classify_query(user_query)
            print(f"{query_type}")

            faqs = []
            products = []

            if query_type in ["FAQ", "BOTH", "GENERAL"]:
                faqs = DataFetcher.fetch_faqs()

            if query_type in ["PRODUCT", "BOTH", "GENERAL"]:
                products = DataFetcher.fetch_products()

            context = self._build_context(query_type, faqs, products)

            # OpenAi api call
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": context},
                    {"role": "user", "content": user_query},
                ],
                max_tokens=500,
                temperature=0.7,
            )

            ai_response = response.choices[0].message.content

            return {"response": ai_response, "status": "success", "error": None}

        except Exception as e:
            print(f"Error: {str(e)}")
            return {"response": None, "status": "error", "error": f"Error: {str(e)}"}

    def _build_context(self, query_type, faqs, products):

        context = "You are a helpful shopping assistant. "

        if query_type == "FAQ" and faqs:
            faq_text = self._format_faqs(faqs)
            context += f"Here are FAQs:\n{faq_text}\nAnswer based on these FAQs."

        elif query_type == "PRODUCT" and products:
            product_text = self._format_products(products)
            context += f"Here are products:\n{product_text}\nHelp with product recommendations."

        elif query_type == "BOTH":
            if faqs:
                faq_text = self._format_faqs(faqs)
                context += f"FAQs:\n{faq_text}\n\n"
            if products:
                product_text = self._format_products(products)
                context += f"Products:\n{product_text}\n\nUse both FAQ and product info as needed."

        else:
            if faqs:
                faq_text = self._format_faqs(faqs)
                context += f"FAQs:\n{faq_text}\n\n"
            if products:
                product_text = self._format_products(products)
                context += (
                    f"Products:\n{product_text}\n\nHelp based on what's relevant."
                )

        return context

    def _format_faqs(self, faqs):

        if not faqs:
            return "No FAQs available."

        formatted = []
        for faq in faqs:
            formatted.append(
                f"Q: {faq.get('question', 'N/A')}\nA: {faq.get('answer', 'N/A')}"
            )

        return "\n\n".join(formatted)

    def _format_products(self, products):

        if not products:
            return "No products available."

        formatted = []
        for product in products:
            specs = product.get("specifications", "")
            if specs and isinstance(specs, str):
                try:
                    specs_list = json.loads(specs)
                    specs_text = ", ".join(
                        [
                            f"{spec['name']}: {spec['description']}"
                            for spec in specs_list
                        ]
                    )
                except:
                    specs_text = specs
            else:
                specs_text = specs or "N/A"

            formatted.append(
                f"""
                    Product: {product.get('name', 'N/A')}
                    Description: {product.get('description', 'N/A')}
                    Overview: {product.get('overview', 'N/A')}
                    Specifications: {specs_text}
                """
            )

        return "\n".join(formatted)
