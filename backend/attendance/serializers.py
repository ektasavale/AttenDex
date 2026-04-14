from rest_framework import serializers
from .models import Student
from .models import Attendance

'''class RegisterFaceSerializer(serializers.Serializer):
    rollNo = serializers.CharField()
    name = serializers.CharField()
    className = serializers.CharField()
    faceImage = serializers.ImageField()

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
from rest_framework import serializers
from .models import Student, Attendance'''

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='student.name', read_only=True)
    rollNo = serializers.CharField(source='student.roll_no', read_only=True)

    class Meta:
        model = Attendance
        fields = ['rollNo', 'name', 'status', 'date']