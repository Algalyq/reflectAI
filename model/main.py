# main.py
from multiprocessing import Process
import auth
import emotion_model

def run_auth():
    # Run without debug mode to avoid reloader issues
    auth.app.run(host='0.0.0.0', port=5002, debug=False)

def run_model():
    # Run without debug mode to avoid reloader issues
    emotion_model.app.run(host='0.0.0.0', port=5001, debug=False)

if __name__ == '__main__':
    auth_process = Process(target=run_auth)
    model_process = Process(target=run_model)
    
    auth_process.start()
    model_process.start()
    
    auth_process.join()
    model_process.join()