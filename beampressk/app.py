from flask import Flask, render_template, session, request
from flask.ext.socketio import SocketIO, emit, disconnect

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<name>')
def show(name):
    """
    Presentation should be placed at 'templates/<presentation-name>'
    where index.html is the start point of it
    """
    return render_template('%s/index.html' % name)

@socketio.on('next', namespace='/beampressk')
def beampressk_next(message):
    emit('response', {'data': message['data']}, broadcast=True)

@socketio.on('prev', namespace='/beampressk')
def beampressk_prev(message):
    emit('response', {'data': message['data']}, broadcast=True) 

@socketio.on('next cmd', namespace='/beampressk')
def beampressk_next_cmd():
    emit('next cmd response', broadcast=True)

@socketio.on('prev cmd', namespace='/beampressk')
def beampressk_prev_cmd():
    emit('prev cmd response', broadcast=True)       



if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
