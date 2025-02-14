from django.urls import path
from .views import sliding_puzzle_page

urlpatterns = [
    path("", sliding_puzzle_page, name="sliding_puzzle"),
]
