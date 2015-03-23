import redis
from flask import Flask, render_template, session, request, make_response
from flask.ext.socketio import SocketIO, emit, disconnect
from flask_kvsession import KVSessionExtension
from simplekv.memory.redisstore import RedisStore

# store = RedisStore(redis.StrictRedis())
app = Flask(__name__)
app.config['SECRET_KEY'] = '4ed8b4b022d12f40e9c06e6d7fcfd964e13f22810e865717'
# KVSessionExtension(store, app)
socketio = SocketIO(app)

database = {
    'current_frame': 0,
    'current_slide': 1,
}

# Custom errors
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

# Control panel
@app.route('/')
def index():
    return render_template('index.html', 
                           current_frame=database.get('current_frame', 0),
                           current_slide=database.get('current_slide', 0),
                           name=database.get('name', ''))

# Presentations
@app.route('/<name>')
def show(name):
    """
    Presentation should be placed at 'templates/<presentation-name>'
    where index.html is the start point of it
    """
    database['name'] = name
    return render_template('%s/index.html' % name, current_frame=database.get('current_frame', 0),
                           current_slide=database.get('current_slide', 0) - 1)

# Responses
@socketio.on('update_info', namespace='/beampressk')
def beampressk_update_info(message):
    data = message.get('data', {})
    # Updating database
    database['current_frame'] = data.get('currentFrame', 0)
    database['current_slide'] = data.get('currentSlide', 0)
    emit('response', {'data': data}, broadcast=True)

# Actions
@socketio.on('next', namespace='/beampressk')
def beampressk_next():
    emit('next_response', broadcast=True)

@socketio.on('prev', namespace='/beampressk')
def beampressk_prev():
    emit('prev_response', broadcast=True)

@socketio.on('volume', namespace='/beampressk')
def beampressk_volume(message):
    emit('volume_response', {'data': message.get('data', {})}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
