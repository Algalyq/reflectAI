# auth.py
from flask import Flask, request, jsonify
import jwt
from datetime import datetime, timedelta
from functools import wraps
import sqlite3

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Locasjdsdjsd32r32njk'  # Secure key

# Database setup
DB_PATH = 'users.db'

def init_db():
    """Initialize the SQLite database and create the users table if it doesn't exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        INSERT OR IGNORE INTO users (username, password) 
        VALUES (?, ?)
    ''', ('testuser', 'testpass123'))
    conn.commit()
    conn.close()

# Call init_db when the app starts
init_db()

# Token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            token = token.split(" ")[1]  # Remove "Bearer " prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except IndexError:
            return jsonify({'message': 'Invalid token format, use Bearer <token>'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            return jsonify({'message': f'Error validating token: {str(e)}'}), 401
        
        return f(*args, **kwargs)
    return decorated

@app.route('/authorize', methods=['POST'])
def authorize():
    """Login endpoint to generate token"""
    auth_data = request.get_json()
    
    if not auth_data or not auth_data.get('username') or not auth_data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    username = auth_data['username']
    password = auth_data['password']
    
    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Query the user from the database
    cursor.execute('SELECT username, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or user[1] != password:  # user[1] is the password column
        return jsonify({'message': 'Invalid credentials'}), 401
    
    try:
        token = jwt.encode(
            {
                'username': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            },
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({
            'message': 'Login successful',
            'token': token
        }), 200
    except Exception as e:
        return jsonify({'message': f'Error generating token: {str(e)}'}), 500

@app.route('/register', methods=['POST'])
def register():
    """Registration endpoint to create a new user"""
    reg_data = request.get_json()
    
    if not reg_data or not reg_data.get('username') or not reg_data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    username = reg_data['username']
    password = reg_data['password']
    
    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if username already exists
        cursor.execute('SELECT username FROM users WHERE username = ?', (username,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'message': 'Username already exists'}), 409  # 409 Conflict
        
        # Insert new user into the database
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        conn.commit()
        
        # Generate token
        token = jwt.encode(
            {
                'username': username,
                'exp': datetime.utcnow() + timedelta(minutes=30)
            },
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        conn.close()
        return jsonify({
            'message': 'Registration successful',
            'token': token
        }), 201  # 201 Created
    
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'Username already exists'}), 409
    except Exception as e:
        conn.close()
        return jsonify({'message': f'Error during registration: {str(e)}'}), 500

# No if __name__ == '__main__' block since it runs via main.py