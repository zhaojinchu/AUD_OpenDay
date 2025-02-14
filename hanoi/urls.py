from django.urls import path
from .views import hanoi_page

urlpatterns = [
    path("", hanoi_page, name="hanoi_page"),
]
