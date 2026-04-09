import face_recognition
import numpy as np

def get_face_encoding(image_file):
    image = face_recognition.load_image_file(image_file)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

     if len(encodings) > 1:
        return None, "Multiple faces detected"

    return encodings[0]
