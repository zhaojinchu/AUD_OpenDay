from django.urls import path
from .views import maze_page

urlpatterns = [
    path("", maze_page, name="maze_page"),
]
