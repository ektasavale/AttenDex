from rest_framework import serializers
from .models import Student
from .models import Attendance

class RegisterFaceSerializer(serializers.Serializer):
    student_id = serializers.CharField()
    name = serializers.CharField()
    email = serializers.EmailField()
    image = serializers.ImageField()

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
