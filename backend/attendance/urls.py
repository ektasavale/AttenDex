from django.urls import path
from .views import *

urlpatterns = [
    path('register-face/', RegisterFaceAPIView.as_view()),
    path('mark-attendance/', MarkAttendanceAPIView.as_view()),

    # Student APIs
    path('students/', StudentListAPIView.as_view()),
    path('students/<int:id>/', StudentDetailAPIView.as_view()),
    path('students/delete/<int:id>/', StudentDeleteAPIView.as_view()),

    # Attendance APIs
    path('attendance/', AttendanceListAPIView.as_view()),
    path('attendance-by-date/', AttendanceByDateAPIView.as_view()),
    path('attendance/<str:student_id>/', AttendanceByStudentAPIView.as_view()),
]