from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterStudentAPIView.as_view()),
    path('attendance/', MarkAttendanceAPIView.as_view()),
    path('students/', StudentListAPIView.as_view()),
    path('attendance-list/', AttendanceListAPIView.as_view()),
    path('stats/', StatsAPIView.as_view()),
]
