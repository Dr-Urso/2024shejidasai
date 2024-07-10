import requests
from django.core.cache import cache
from django.conf import settings
import json


class RateLimitException(Exception):
    pass


class InvalidRoleException(Exception):
    pass


class AIAdviceService:
    VALID_ROLES = ['system', 'user', 'assistant']

    def __init__(self):
        self.api_key = settings.XFYUN_API_KEY
        self.api_secret = settings.XFYUN_API_SECRET
        self.endpoint = settings.XFYUN_API_ENDPOINT
        self.data = {
            "model": "generalv3.5",
            "messages": []
        }

    def add_param(self, role, content):
        if role not in self.VALID_ROLES:
            raise InvalidRoleException(f"Invalid role: {role}. Must be one of {', '.join(self.VALID_ROLES)}")

        self.data['messages'].append({"role": role, "content": content})
        return self

    def check_rate_limit(self, user_id):
        cache_key = f"api_rate_{user_id}"
        current_count = cache.get(cache_key, 0)
        if current_count >= settings.API_RATE_LIMIT:
            raise RateLimitException("API rate limit exceeded")
        cache.set(cache_key, current_count + 1, timeout=3600)

    def get_advice(self, user_id):
        self.check_rate_limit(user_id)

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}:{self.api_secret}'
        }
        response = requests.post(self.endpoint, headers=headers, json=self.data)

        if response.status_code == 200:
            return response.json()
        else:
            response.raise_for_status()

# Example usage
# ai_service = AIAdviceService()
# advice = ai_service.add_param('user', '来一个只有程序员能听懂的笑话').get_advice(user_id=1)