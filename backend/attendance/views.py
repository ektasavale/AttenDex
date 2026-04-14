import base64
import numpy as np
import cv2
import face_recognition

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Student, Attendance
from datetime import date
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
            lockedClass = className.strip().upper()
            department = request.data.get("department")
            year = request.data.get("year")
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
                department=department,
                year=year,
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

# ✅ 3. Unmark Attendance
class UnmarkAttendanceAPIView(APIView):
    def delete(self, request):
        rollNo = request.data.get("rollNo")
        selected_date = request.data.get("date")  # optional

        if not rollNo:
            return Response({"error": "rollNo required"}, status=400)

        # if date not given, take today
        if not selected_date:
            selected_date = date.today()

        deleted, _ = Attendance.objects.filter(
            student__rollNo=rollNo,
            date=selected_date
        ).delete()

        if deleted == 0:
            return Response({"message": "No attendance found"})
        
        return Response({"message": "Attendance unmarked successfully"})

# ✅ 4. Get Students
class StudentListAPIView(APIView):
    def get(self, request):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


# ✅ 5. Get Attendance
class AttendanceListAPIView(APIView):
    def get(self, request):
        className = request.GET.get("className")
        today = date.today()

        records = Attendance.objects.filter(
            student__className__iexact=className,
            date=today
        ).select_related('student')

        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)

# 4. ✅printlist 

class TodayAttendanceAPIView(APIView):
    def get(self, request):
        today = date.today()
        className = request.GET.get("className")
        records = Attendance.objects.filter(date=today)
        
        if className:
            records = records.filter(student__className__iexact=className.strip())
        records = records.select_related('student')
        data = []
        for r in records:
            data.append({
                "student_name": r.student.name,
                "rollNo": r.student.rollNo,
                "className": r.student.className,
                "department": r.student.department,
                "year": r.student.year,
                "time": r.time,
                "status": r.status,
                "date": r.date
            })

        return Response(data)


# ✅ 5. Stats API

from datetime import date

class StatsAPIView(APIView):
    def get(self, request):
        className = request.GET.get("className")
        today = date.today()

        students = Student.objects.filter(className=className)
        total = students.count()

        today_records = Attendance.objects.filter(
            student__className__iexact=className,
            date=today
        )

        present = today_records.count()
        absent = total - present

        return Response({
            "total": total,
            "present": present,
            "absent": absent
        })
