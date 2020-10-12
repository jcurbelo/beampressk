from flask import Flask, render_template, request, jsonify, abort
from flask_socketio import SocketIO, send, emit
from decorators import requires_auth


app = Flask(__name__)
app.config['SECRET_KEY'] = '4ed8b4b022d12f40e9c06e6d7fcfd964e13f22810e865717'

socketio = SocketIO(app)

database = {
    'current_frame': 0,
    'current_slide': 1,
    'volume': 100
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
@requires_auth
def index():
    return render_template('index.html',
                           current_frame=database.get('current_frame', 0),
                           current_slide=database.get('current_slide', 0),
                           volume=database.get('volume', 100),
                           name=database.get('name', ''))

# Live Feed Control panel


@app.route('/live-feed')
@requires_auth
def live_feed():
    return render_template('live_feed_control.html',
                           current_frame=database.get('current_frame', 0),
                           current_slide=database.get('current_slide', 0),
                           volume=database.get('volume', 100),
                           name=database.get('name', ''))

# Presentations


@app.route('/presentation/<name>')
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
    database['volume'] = message.get('data', 1) * 1e2
    emit('volume_response', {'data': message.get('data', 1)}, broadcast=True)


@socketio.on('live_feed', namespace='/beampressk')
def beampressk_live_feed(message):
    emit('live_feed_response', {
         'data': message.get('data', {})}, broadcast=True)


@socketio.on('reload', namespace='/beampressk')
def beampressk_reload():
    emit('reload_response', broadcast=True)


@socketio.on('hide_msg', namespace='/beampressk')
def beampressk_hide_msg():
    emit('hide_msg_response', broadcast=True)


@socketio.on('play_random_audio', namespace='/beampressk')
def beampressk_play_rnd(message):
    emit('play_random_audio_response', {
         'data': message.get('data', {})}, broadcast=True)


@socketio.on('stop_random_audio', namespace='/beampressk')
def beampressk_stop_rnd(message):
    emit('stop_random_audio_response', {
         'data': message.get('data', {})}, broadcast=True)

# RESTful requests

# POSTs


@app.route('/action', methods=['POST'])
def beampressk_emit_task():
    if not request.json or not 'action' in request.json:
        abort(400)
    action = request.json['action']
    if action == 'live_feed':
        socketio.emit('live_feed_response', namespace='/beampressk')
    elif action == 'msg':
        data = request.json['data']
        socketio.emit('msg', {'data': data}, namespace='/beampressk')
    return jsonify({'action': action}), 200


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0')
    # app.run(host='0.0.0.0')
