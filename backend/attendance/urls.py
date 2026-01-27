from django.urls import path
from .views import test_api, register_face, mark_attendance

urlpatterns = [
    path('test/', test_api),
    path('register/', register_face),
    path('mark/', mark_attendance),
]
