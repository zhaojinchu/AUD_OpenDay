from django.urls import re_path
from .consumers import CipheyConsumer

websocket_urlpatterns = [
    re_path(r'ws/cipher/$', CipheyConsumer.as_asgi()),
]
