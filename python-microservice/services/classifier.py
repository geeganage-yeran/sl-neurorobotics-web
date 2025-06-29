class QueryClassifier:
    
    # FAQ keywords
    FAQ_KEYWORDS = [
        'return', 'policy', 'warranty', 'shipping', 'delivery', 'payment', 
        'refund', 'support', 'help', 'contact', 'hours', 'location', 
        'exchange', 'cancel', 'track', 'status', 'customer service'
    ]
    
    # Product related keywords
    PRODUCT_KEYWORDS = [
        'EEG', 'Prosthetic', 'Chairbed', 'Headset', 'tablet','price', 'buy', 'purchase', 'recommend', 'best', 'cheap', 'affordable',
        'features', 'specifications', 'specs', 'compare', 'review','model', 'available','show me', 'Mind Control', 'Neuroprosthetics',
        'Neurotechnology', 'Brain-Computer Interface', 'BCI', 'Assistive Technology', 'Neurofeedback', 'Cognitive Enhancement'
    ]
    
    @staticmethod
    def classify_query(query):

        query_lower = query.lower()
        
        #Check for FAQ keywords
        has_faq = any(keyword in query_lower for keyword in QueryClassifier.FAQ_KEYWORDS)
        
        #Check for product keywords  
        has_product = any(keyword in query_lower for keyword in QueryClassifier.PRODUCT_KEYWORDS)

        if has_faq and has_product:
            return "BOTH"
        elif has_faq:
            return "FAQ"
        elif has_product:
            return "PRODUCT"
        else:
            return "GENERAL"