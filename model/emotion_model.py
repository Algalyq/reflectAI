from flask import Flask, request, jsonify
import cv2
import numpy as np
import os
from tensorflow.keras.models import load_model
import logging
from deepface import DeepFace

import ffmpeg


app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load pre-trained Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load custom emotion recognition model


def get_rotation(video_path):
    try:
        probe = ffmpeg.probe(video_path)
        rotation = next((stream['tags'].get('rotate', 0) for stream in probe['streams'] if 'tags' in stream), 0)
        return int(rotation)
    except Exception as e:
        logger.error(f"Failed to get rotation: {e}")
        return 0

def rotate_frame(frame, rotation_code):
    """Rotate the frame based on the rotation code."""
    if rotation_code == 90:
        return cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
    elif rotation_code == 270:
        return cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)
    elif rotation_code == 180:
        return cv2.rotate(frame, cv2.ROTATE_180)
    return frame  # No rotation if code is 0 or unrecognized

def detect_emotion_from_frame(frame):
    """
    Detect emotion from a frame using DeepFace and/or a custom TensorFlow model.
    """
    try:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        logger.info(f"Detected {len(faces)} faces in frame")

        if len(faces) == 0:
            logger.warning("No faces detected")
            return None

        (x, y, w, h) = faces[0]
        face_color_roi = frame[y:y+h, x:x+w]
        face_analysis = DeepFace.analyze(img_path=face_color_roi, actions=['emotion'], enforce_detection=False)
        deepface_emotion = face_analysis[0]["dominant_emotion"]
        logger.info(f"DeepFace emotion: {deepface_emotion}, Full analysis: {face_analysis[0]['emotion']}")

        face_roi = gray[y:y+h, x:x+w]
        face_img = cv2.resize(face_roi, (48, 48))
        face_img = face_img / 255.0
        face_img = np.expand_dims(face_img, axis=(0, -1))

        return deepface_emotion
    except Exception as e:
        logger.error(f"Error in emotion detection: {e}")
        return None

def detect_emotions_from_video(video_path):
    """Process video and detect emotions across frames, saving correctly oriented frames."""
    shots_dir = "shots"
    if not os.path.exists(shots_dir):
        os.makedirs(shots_dir)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    # Get video rotation metadata (if available)
    # In detect_emotions_from_video:
    rotation = 90
    logger.info(f"Video rotation metadata: {rotation} degrees")

    emotions_count = {"happy": 0, "sad": 0, "angry": 0, "neutral": 0, "surprised": 0, "disgust": 0, "fear": 0}
    frame_count = 0
    analyzed_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Rotate the frame based on metadata
        frame = rotate_frame(frame, rotation)

        if frame_count % 10 == 0:  # Process every 10th frame
            try:
                frame_filename = os.path.join(shots_dir, f"frame_{frame_count}.jpg")
                cv2.imwrite(frame_filename, frame)
                logger.info(f"Saved frame {frame_count} to {frame_filename}")

                emotion = detect_emotion_from_frame(frame)
                if emotion:
                    emotions_count[emotion] += 1
                    analyzed_frames += 1
            except Exception as e:
                logger.error(f"Error processing frame {frame_count}: {e}")

        frame_count += 1

    cap.release()

    if frame_count == 0:
        return {"error": "No frames processed"}
    if analyzed_frames == 0:
        return {"error": "No emotions detected"}

    total_emotion_votes = sum(emotions_count.values())
    emotion_distribution = {k: (v / total_emotion_votes) * 100 for k, v in emotions_count.items() if total_emotion_votes > 0}
    dominant_emotion = max(emotions_count, key=emotions_count.get)
    print(dominant_emotion)
    return {
        "dominant_emotion": dominant_emotion,
        "emotion_distribution": emotion_distribution,
        "total_frames": frame_count,
        "analyzed_frames": analyzed_frames,
        "shots_folder": shots_dir
    }

@app.route('/analyze_emotion', methods=['POST'])
def analyze_emotion():
    """API endpoint to analyze emotion from uploaded video."""
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    video_path = "temp_video.mp4"
    try:
        video_file.save(video_path)
        result = detect_emotions_from_video(video_path)
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)