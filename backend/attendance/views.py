import face_recognition
import pickle
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Attendance
import numpy as np

@api_view(['POST'])
def register_face(request):
    name = request.data.get('name')
    roll_no = request.data.get('roll_no')
    image = request.FILES.get('image')

    if not image:
        return Response({"error": "Image required"}, status=400)

    img = face_recognition.load_image_file(image)
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        return Response({"error": "No face detected"}, status=400)

    student = Student(name=name, roll_no=roll_no)
    student.set_encoding(encodings[0])
    student.save()

    return Response({"message": "Face registered successfully"})

@api_view(['POST'])
def mark_attendance(request):
    image = request.FILES.get('image')

    if not image:
        return Response({"error": "Image required"}, status=400)

    img = face_recognition.load_image_file(image)
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        return Response({"error": "No face detected"}, status=400)

    unknown_encoding = encodings[0]

    students = Student.objects.all()

    for student in students:
        known_encoding = student.get_encoding()
        match = face_recognition.compare_faces(
            [known_encoding], unknown_encoding, tolerance=0.45
        )

        if match[0]:
            Attendance.objects.create(student=student)
            return Response({
                "status": "success",
                "student": student.name,
                "message": "Attendance marked"
            })

    return Response({"status": "failed", "message": "Face not recognized"})
