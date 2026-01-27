from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def test_api(request):
    return Response({"message": "Attendance API working"})

@api_view(['POST'])
def register_face(request):
    return Response({"message": "Face registered (dummy)"})

@api_view(['POST'])
def mark_attendance(request):
    return Response({"message": "Attendance marked (dummy)"})
