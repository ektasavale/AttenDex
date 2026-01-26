from django.urls import path
from .views import register_face, mark_attendance

urlpatterns = [
    path('register-face/', register_face, name='register-face'),
    path('mark-attendance/', mark_attendance, name='mark-attendance'),
]