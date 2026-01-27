from django.db import models
import pickle

class Student(models.Model):
    name = models.CharField(max_length=100)
    roll_no = models.CharField(max_length=20, unique=True)
    face_encoding = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)
    def set_encoding(self, encoding):
        self.face_encoding = pickle.dumps(encoding)

    def get_encoding(self):
        return pickle.loads(self.face_encoding)

    def __str__(self):
        return f"{self.roll_no} - {self.name}"

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[("Present", "Present")],
        default="Present"
    )
    def __str__(self):
        return f"Attendance: {self.student.name} on {self.date} at {self.time}"
