from django.urls import path
from .views import MarkAttendanceAPIView, RegisterFaceAPIView

urlpatterns = [
    path('register-face/', RegisterFaceAPIView.as_view()),
    path('mark-attendance/', MarkAttendanceAPIView.as_view()),
]
