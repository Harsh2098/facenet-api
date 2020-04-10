import cv2
import os
import datetime
import sys
import detect_face
import facenet
import numpy as np
from skimage.transform import resize

#import tensorflow as tf
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()



vidcap = cv2.VideoCapture(str(sys.argv[1]))

def NoOfFaces (imagePointer):
    npy = './npy'

    with tf.Graph().as_default():
        gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.6)
        sess = tf.Session(config=tf.ConfigProto(
            gpu_options=gpu_options, log_device_placement=False))
        with sess.as_default():
            pnet, rnet, onet = detect_face.create_mtcnn(sess, npy)

            minsize = 20  # minimum size of face
            threshold = [0.6, 0.7, 0.7]  # three steps's threshold
            factor = 0.709  # scale factor
            margin = 44
            frame_interval = 3
            batch_size = 1000
            image_size = 182
            input_image_size = 160

            c = 0
            prevTime = 0
            frame = imagePointer
            frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
            timeF = frame_interval

            if (c % timeF == 0):

                if frame.ndim == 2:
                    frame = facenet.to_rgb(frame)
                frame = frame[:, :, 0:3]
                bounding_boxes, _ = detect_face.detect_face(
                    frame, minsize, pnet, rnet, onet, threshold, factor)
                nrof_faces = bounding_boxes.shape[0]
                #print('Face Detected: %d' % nrof_faces)
                return nrof_faces 
            

def getFrame(frameNo,picNo):
    vidcap.set(cv2.CAP_PROP_POS_FRAMES,frameNo)
    hasFrames,image = vidcap.read()
    
    if hasFrames:
        face_count = NoOfFaces(image) 
        
        if face_count == 1: 
            Path = str("train_img/"+sys.argv[2]+"/")

            if not os.path.exists(Path):
                os.mkdir(Path)  

            picNo = picNo + 1
            cv2.imwrite(os.path.join(Path,"image"+str(picNo)+" "+str(datetime.datetime.now())+".jpg"), image)     # save frame as JPG file
            
    return hasFrames, picNo


tot_frame = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT)) # total no of frames in the video
#print (tot_frame)
count = 20  # no of frames selected
frameRate = tot_frame/count 

c = 0 
frameNo = 0
success,c = getFrame(frameNo,c)
while success:   
    frameNo = frameNo + frameRate
    success,c = getFrame(frameNo,c)

print("Images Saved: %d" % c)
os.remove(str(sys.argv[1]))  # delete the video 
print("Completed")
