from PIL import Image
import face_recognition
import random
import string

print('Starting face detection and splitting')

image = face_recognition.load_image_file('./core/identification_image.jpg')
face_locations = face_recognition.face_locations(image)

for face_location in face_locations:
    top, right, bottom, left = face_location

    face_image = image[top:bottom, left:right]
    pil_image = Image.fromarray(face_image)

    res = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    pil_image.save('./core/unknown/' + str(res) + '.jpg')

print("Number of faces detected:", len(face_locations))
print('Completed')
