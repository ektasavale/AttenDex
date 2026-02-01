from django.db import models
from django.utils import timezone
class Student(models.Model):
    student_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.student_id


class FaceEncoding(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    encoding = models.BinaryField()   # stores numpy bytes

    def __str__(self):
        return f"FaceEncoding({self.student.student_id})"
from django.db import models
from django.utils import timezone

class Attendance(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time = models.TimeField(auto_now_add=True)
    status = models.CharField(max_length=10, default='present')  # or add choices if you want

    class Meta:
        unique_together = ('student', 'date')  # Avoid duplicate attendance for same day

    def __str__(self):
        return f"{self.student.name} - {self.date} - {self.status}"
