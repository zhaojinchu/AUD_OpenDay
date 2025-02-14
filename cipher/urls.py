from django.urls import path
from .views import cipher_page, decrypt_text

urlpatterns = [
    path("", cipher_page, name="cipher_page"),
    path('decrypt/', decrypt_text, name='decrypt_text'),
]
