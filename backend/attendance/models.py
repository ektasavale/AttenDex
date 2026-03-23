from django.db import models
from django.utils import timezone 
from datetime import datetime,date
class Student(models.Model):
    rollNo = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    className = models.CharField(max_length=50)
    face_encodings = models.BinaryField()

    def __str__(self):
        return f"{self.rollNo} - {self.name}"
'''class FaceEncoding(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="face_encodings"
    )
    encoding = models.BinaryField()
    created_at = datetime.now().time()

    def __str__(self):
        return f"FaceEncoding for {self.student.student_id}"'''
class Attendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('ABSENT', 'Absent'),
    )
    time = models.TimeField(auto_now_add=True)
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance_records"
    )
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    marked_at = datetime.now().time()

    class Meta:
        unique_together = ('student', 'date')

    def __str__(self):
        return f"{self.student.student_id} - {self.date} - {self.status}"

