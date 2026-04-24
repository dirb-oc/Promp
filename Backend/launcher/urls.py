from django.urls import path
from .views import Prompt

urlpatterns = [
    path('', Prompt),
]