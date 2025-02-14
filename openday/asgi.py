"""
ASGI config for openday project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from cipher.routing import websocket_urlpatterns  # Import WebSocket routes

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'openday.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Standard HTTP
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
