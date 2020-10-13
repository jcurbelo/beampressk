from flask import Flask
from flask_socketio import SocketIO
from os import environ
from flask_basicauth import BasicAuth

app = Flask(__name__)
app.config['SECRET_KEY'] = environ.get('SECRET_KEY')
app.config['BASIC_AUTH_USERNAME'] = environ.get('BASIC_AUTH_USERNAME')
app.config['BASIC_AUTH_PASSWORD'] = environ.get('BASIC_AUTH_PASSWORD')

socketio = SocketIO(app)
basic_auth = BasicAuth(app)

database = {
    'current_frame': 0,
    'current_slide': 1,
    'volume': 100
}

# import views at the end
import beampressk.views
