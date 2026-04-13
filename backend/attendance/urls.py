from django.urls import path
from .views import (  RegisterStudentAPIView,
    MarkAttendanceAPIView,
    StudentListAPIView,
    AttendanceListAPIView,
    StatsAPIView,
    UnmarkAttendanceAPIView,
    TodayAttendanceAPIView)
urlpatterns = [
    path('register/', RegisterStudentAPIView.as_view()),
    path('attendance/', MarkAttendanceAPIView.as_view()),
    path('students/', StudentListAPIView.as_view()),
    path('attendance-list/', AttendanceListAPIView.as_view()),
    path('stats/', StatsAPIView.as_view()),
    path('unmark-attendance/',UnmarkAttendanceAPIView.as_view()),
    path('attendance/today/', TodayAttendanceAPIView.as_view()),
]
