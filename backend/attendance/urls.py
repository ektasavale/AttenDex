from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterStudentAPIView.as_view()),
    path('attendance/', MarkAttendanceAPIView.as_view()),
    path('students/', StudentListAPIView.as_view()),
    path('attendance-list/', AttendanceListAPIView.as_view()),
    path('stats/', StatsAPIView.as_view()),
]
'''urlpatterns = [
    path('api/register', RegisterFaceAPIView.as_view()),
    path('api/mark-attendance', MarkAttendanceAPIView.as_view()),

    # Student APIs
    path('api/students', StudentListAPIView.as_view()),
    path('api/students/<int:id>', StudentDetailAPIView.as_view()),
    path('students/delete/<int:id>/', StudentDeleteAPIView.as_view()),

    # Attendance APIs
    path('attendance/', AttendanceListAPIView.as_view()),
    path('attendance-by-date/', AttendanceByDateAPIView.as_view()),
    path('attendance/<str:student_id>/', AttendanceByStudentAPIView.as_view()),
]'''