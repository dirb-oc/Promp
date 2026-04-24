# gallery/urls.py
from django.urls import path
from .views import get_image, list_images

urlpatterns = [
    path("image/", get_image),
    path("images/", list_images),
]