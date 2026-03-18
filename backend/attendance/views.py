import face_recognition
import numpy as np
from datetime import date,time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Student, FaceEncoding, Attendance
from .serializers import RegisterFaceSerializer,AttendanceSerializer

from django.utils import timezone
class StudentListAPIView(APIView):
    def get(self, request):
        students = Student.objects.all().values()
        return Response(students)

class StudentDetailAPIView(APIView):
    def get(self, request, id):
        try:
            student = Student.objects.get(id=id)
            return Response({
                "id": student.id,
                "name": student.name,
                "student_id": student.student_id,
                "email": student.email
            })
        except Student.DoesNotExist:
            return Response({"error": "Student not found"})
class StudentDeleteAPIView(APIView):
    def delete(self, request, id):
        try:
            student = Student.objects.get(id=id)
            student.delete()
            return Response({"message": "Student deleted"})
        except Student.DoesNotExist:
            return Response({"error": "Student not found"})
class AttendanceListAPIView(APIView):
    def get(self, request):
        records = Attendance.objects.all().values(
            'student__name',
            'student__student_id',
            'date',
            'time',
            'status'
        )
        return Response(records)
class AttendanceByDateAPIView(APIView):
    def get(self, request):
        date = request.GET.get('date')

        records = Attendance.objects.filter(date=date).values(
            'student__name',
            'date',
            'time',
            'status'
        )
        return Response(records)
class AttendanceByStudentAPIView(APIView):
    def get(self, request, student_id):
        records = Attendance.objects.filter(
            student__student_id=student_id
        ).values('date', 'time', 'status')

        return Response(records)
from django.urls import path
from .views import *

class MarkAttendanceAPIView(APIView):
    def post(self, request):
        image = request.FILES.get('image')

        if not image:
            return Response({"error": "No image provided"}, status=400)

        # Load image
        img = face_recognition.load_image_file(image)

        # Detect face
        encodings = face_recognition.face_encodings(img)

        if len(encodings) == 0:
            return Response({"error": "No face detected"}, status=400)

        unknown_encoding = encodings[0]

        # Get all stored encodings
        known_faces = FaceEncoding.objects.all()

        for face in known_faces:
            known_encoding = np.frombuffer(face.encoding, dtype=np.float64)

            match = face_recognition.compare_faces(
                [known_encoding],
                unknown_encoding
            )

            if match[0]:
                student = face.student

                # Prevent duplicate attendance
                today = date.today()
                already_marked = Attendance.objects.filter(
                    student=student,
                    date=today
                ).exists()

                if already_marked:
                    return Response({
                        "message": "Attendance already marked",
                        "student": student.name
                    })

                # Mark attendance
                Attendance.objects.create(
                    student=student,
                    date=today,
                    status="PRESENT"
                )

                return Response({
                    "message": "Attendance marked",
                    "student": student.name
                })

        return Response({"error": "No matching student found"}, status=404)

class RegisterFaceAPIView(APIView):

    def post(self, request):
        serializer = RegisterFaceSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        student_id = serializer.validated_data['student_id']
        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        image = serializer.validated_data['image']

        # ---- Read image ----
        image_np = face_recognition.load_image_file(image)

        # ---- Detect faces ----
        face_locations = face_recognition.face_locations(image_np)

        if len(face_locations) == 0:
            return Response(
                {"error": "No face detected"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(face_locations) > 1:
            return Response(
                {"error": "Multiple faces detected. Upload single face image"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---- Extract encoding ----
        face_encoding = face_recognition.face_encodings(
            image_np, face_locations
        )[0]
        
        # ---- Save student ----
        student, created = Student.objects.get_or_create(
            student_id=student_id,
            defaults={"name": name, "email": email}
        )

        # ---- Save encoding ----
        FaceEncoding.objects.update_or_create(
            student=student,
            defaults={
                "encoding": face_encoding.tobytes()
            }
        )

        return Response(
            {"message": "Face registered successfully"},
            status=status.HTTP_201_CREATED
        )
        
