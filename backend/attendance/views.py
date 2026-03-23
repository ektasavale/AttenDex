import base64
import numpy as np
import cv2
import face_recognition

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Student, Attendance
from .serializers import StudentSerializer, AttendanceSerializer


# 🔹 Helper: convert base64 → image
def decode_image(base64_string):
    format, imgstr = base64_string.split(';base64,')
    img_bytes = base64.b64decode(imgstr)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)


# ✅ 1. Register Student
class RegisterStudentAPIView(APIView):
    def post(self, request):
        try:
            rollNo = request.data.get("rollNo")
            name = request.data.get("name")
            className = request.data.get("className")
            faceImage = request.data.get("faceImage")

            if not faceImage:
                return Response({"error": "No image received"}, status=400)

            if Student.objects.filter(rollNo=rollNo).exists():
                return Response({"error": "Student already exists"}, status=400)

            image = decode_image(faceImage)

            if image is None:
                return Response({"error": "Invalid image"}, status=400)

            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            encodings = face_recognition.face_encodings(rgb_image)

            if len(encodings) == 0:
                return Response({"error": "No face detected"}, status=400)

            encoding_bytes = encodings[0].tobytes()

            Student.objects.create(
                rollNo=rollNo,
                name=name,
                className=className,
                face_encodings=encoding_bytes
            )

            return Response({"message": "Student registered successfully"})

        except Exception as e:
            print("ERROR:", str(e))  # 🔥 check terminal
            return Response({"error": "Server error"}, status=500)

# ✅ 2. Mark Attendance
class MarkAttendanceAPIView(APIView):
    def post(self, request):
        try:
            from datetime import date

            className = request.data.get("className")
            faceImage = request.data.get("faceImage")

            # Decode image
            image = decode_image(faceImage)

            if image is None:
                return Response({"error": "Invalid image"}, status=400)

            # Convert to RGB
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Get face encoding
            encodings = face_recognition.face_encodings(rgb_image)

            if len(encodings) == 0:
                return Response({"error": "No face detected"}, status=400)

            unknown_encoding = encodings[0]

            students = Student.objects.filter(className=className)

            best_match = None
            lowest_distance = 1.0  # max distance

            for student in students:
                known_encoding = np.frombuffer(student.face_encodings, dtype=np.float64)

                distance = face_recognition.face_distance(
                    [known_encoding], unknown_encoding
                )[0]

                if distance < lowest_distance:
                    lowest_distance = distance
                    best_match = student

            # 🎯 Threshold (VERY IMPORTANT)
            if best_match and lowest_distance < 0.5:

                # Prevent duplicate attendance
                if Attendance.objects.filter(
                    student=best_match, date=date.today()
                ).exists():
                    return Response({
                        "name": best_match.name,
                        "status": "Already Marked"
                    })

                Attendance.objects.create(
                    student=best_match,
                    status="Present",
                )

                return Response({
                    "name": best_match.name,
                    "status": "Present"
                })

            return Response({"error": "Face not recognized"}, status=404)

        except Exception as e:
            print("ERROR:", str(e))
            return Response({"error": "Server error"}, status=500)

# ✅ 3. Get Students
class StudentListAPIView(APIView):
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


# ✅ 4. Get Attendance
class AttendanceListAPIView(APIView):
    def get(self, request):
        className = request.GET.get("className")

        records = Attendance.objects.filter(
            student__className__iexact=className
        ).select_related('student')

        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)


# ✅ 5. Stats API
class StatsAPIView(APIView):
    def get(self, request):
        className = request.GET.get("className")

        students = Student.objects.filter(className=className)
        total = students.count()

        today_records = Attendance.objects.filter(
            student__className__iexact=className
        )

        present = today_records.count()
        absent = total - present

        return Response({
            "total": total,
            "present": present,
            "absent": absent
        })
'''import face_recognition
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

        rollNo = serializer.validated_data['rollNo']
        name = serializer.validated_data['name']
        className = serializer.validated_data['className']
        faceImage = serializer.validated_data['faceImage']

        # ---- Read image ----
        image_np = face_recognition.load_image_file(faceImage)

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
        '''
