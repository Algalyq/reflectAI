from flask import Flask, request, jsonify
import cv2
import numpy as np
import os
from tensorflow.keras.models import load_model
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load pre-trained Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load custom emotion recognition model
try:
    model = load_model('../face_model.h5')
    emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprised', 'Neutral']
    logger.info("Custom emotion model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load emotion model: {e}")
    raise

def detect_emotion_from_frame(frame):
    """
    Detect emotion from a frame using the custom TensorFlow model.
    """
    try:
        # Detect faces using Haar Cascade
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            return None  # No face detected

        # Take the first detected face
        (x, y, w, h) = faces[0]
        face_roi = gray[y:y+h, x:x+w]

        # Preprocess frame for the model
        face_img = cv2.resize(face_roi, (48, 48))  # Model-specific size (48x48)
        face_img = face_img / 255.0  # Normalize to [0, 1]
        face_img = np.expand_dims(face_img, axis=(0, -1))  # Shape: (1, 48, 48, 1)

        # Predict emotion
        predictions = model.predict(face_img)
        emotion_idx = np.argmax(predictions[0])
        return emotion_labels[emotion_idx]
    except Exception as e:
        logger.error(f"Error in custom model prediction: {e}")
        return None

def detect_emotions_from_video(video_path):
    """Process video and detect emotions across frames."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    emotions_count = {"Happy": 0, "Sad": 0, "Angry": 0, "Neutral": 0, "Surprised": 0, "Disgust": 0, "Fear": 0}
    frame_count = 0
    analyzed_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % 10 == 0:  # Process every 10th frame
            try:
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

    # Calculate emotion distribution and dominant emotion
    total_emotion_votes = sum(emotions_count.values())
    emotion_distribution = {k: (v / total_emotion_votes) * 100 for k, v in emotions_count.items() if total_emotion_votes > 0}
    dominant_emotion = max(emotions_count, key=emotions_count.get)

    return {
        "dominant_emotion": dominant_emotion,
        "emotion_distribution": emotion_distribution,  # Percentage distribution
        "total_frames": frame_count,
        "analyzed_frames": analyzed_frames
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

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)