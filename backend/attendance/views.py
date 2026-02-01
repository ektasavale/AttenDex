import face_recognition
import numpy as np

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Student, FaceEncoding, Attendance
from .serializers import RegisterFaceSerializer,AttendanceSerializer

from django.utils import timezone



class MarkAttendanceAPIView(APIView):

    def post(self, request):
        image = request.FILES.get('image')
        if not image:
            return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Load image
        image_np = face_recognition.load_image_file(image)

        # Detect faces
        face_locations = face_recognition.face_locations(image_np)
        if len(face_locations) == 0:
            return Response({"error": "No face detected"}, status=status.HTTP_400_BAD_REQUEST)
        if len(face_locations) > 1:
            return Response({"error": "Multiple faces detected. Upload single face image"}, status=status.HTTP_400_BAD_REQUEST)

        # Get encoding for face in uploaded image
        face_encoding = face_recognition.face_encodings(image_np, face_locations)[0]

        # Fetch all stored face encodings from DB
        stored_encodings = FaceEncoding.objects.all()

        if not stored_encodings.exists():
            return Response({"error": "No registered faces found in database"}, status=status.HTTP_404_NOT_FOUND)

        known_encodings = []
        students = []
        for f in stored_encodings:
            known_encodings.append(np.frombuffer(f.encoding, dtype=np.float64))
            students.append(f.student)

        # Compare uploaded face encoding with all known encodings
        matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)

        if True not in matches:
            return Response({"error": "Face not recognized"}, status=status.HTTP_404_NOT_FOUND)

        # Get matched student
        matched_idx = matches.index(True)
        matched_student = students[matched_idx]

        today = timezone.now().date()

        attendance, created = Attendance.objects.get_or_create(
            student=matched_student,
            date=today,
            defaults={'status': 'present'}
        )

        if not created:
            return Response({"message": "Attendance already marked for today"}, status=status.HTTP_200_OK)

        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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
