from app import app, session, request, User, Room, Topic, db, cross_origin, socketio, join_room, leave_room, emit
from datetime import datetime, timedelta

@app.route('/room/create', methods=['POST'])
@cross_origin()
def room_create():
    try:
        data = request.json
        room = Room()
        user = User(username=data['name'], room_code=room.code)
        topic = Topic(
            title=data['title'], 
            description='', 
            room_code=room.code, 
            time_started = datetime.strptime(data['time_started'], "%a, %d %b %Y %H:%M:%S %Z"), 
            time_estimate = timedelta(hours=data['time_estimate']['hours'], minutes=data['time_estimate']['minutes'])
        )
        room.host = user.id
        db.session.add(room)
        db.session.add(user)
        db.session.add(topic)
        db.session.commit()

        return ({'status':'Success', 'data': {
            'message': 'Successfully created a room. Redirecting shortly',
            'code': room.code,
            'id': user.id,
            'hostId': room.host
        }}, 200)
    except TypeError or AttributeError as e:
        print(e)
        return ({'status': 'Error', 'data' : {
            'message': 'There is an error in your form'
        }}, 400)
    except Exception as e: 
        print(e)
        return ({'status': 'Error', 'data' : {
            'message': 'There is an error on our end'
        }}, 500)

@app.route('/room/join', methods=['POST'])
@cross_origin()
def room_join():
    try:
        data = request.json
        room = Room.query.get(data['code'])
        if room:
            user = User(username=data['name'], room_code=data['code'])
            db.session.add(user)
            db.session.commit()

            return ({'status':'Success', 'data': {
                'message': 'You will be redirected to the room. Please wait a moment.',
                'id': user.id,
                'hostId': room.host
                }}, 200)
        else:
            return ({'status':'Error', 'data': {
                'message': 'The room with the code you provided does not exist. Check if it is correct.'
                }}, 404)
    except TypeError or AttributeError as e:
        print(e)
        return ({'status': 'Error', 'data' : {
            'message': 'There is an error in your form'
        }}, 400)
            
    except Exception as e:
        print(e)
        return ({'status': 'Error', 'data' : {
            'message': 'There is an error on our end'
        }}, 500)

@app.route('/room/topics', methods=['POST'])
@cross_origin()
def get_topics():
    try:
        data = request.json
        topics = Topic.query.filter_by(room_code=data['code']).all()
        response = {'topics': [topic.to_json() for topic in topics]} 
        #print(response)
        return ({'status': 'Succeess', 'data' : response}, 200)
    except:
        pass

@socketio.on('connect')
def connect():
    try:
        data = request.args
        room = data['code']
        join_room(room)
        response = {'user_id': 'admin', 'message': f"{data['name']} has joined the room"}
        emit('join_chat', response, broadcast=True, include_self=False, to=room)
    except:
        emit('error', {'message': 'Could not join room. Try joining again'}, to=request.sid)

@socketio.on('message')
def message(data):
    try:
        name = data['name']
        room = data['code']
        message = data['message']
        id = data['id']
        response = {'name': name, 'message': message, 'user_id': id}
        emit('send_message', response, broadcast=True, to=room)
    except:
        print('help here')
        emit('error', {'message': 'Could not send message. Try again'}, to=request.sid)

@socketio.on('get_topics')
def get_topics(data):
    try:
        data = request.json
        topics = Topic.query.filter_by(room_code=data['code']).all()
        response = {'topics': [topic.to_json() for topic in topics]} 
        emit('topics', response, to=request.sid)
    except:
        emit('error', {'message': 'Could not get topics. Try rejoining again'}, to=request.sid)

@socketio.on('add_topic')
def add_topic(data):
    try:
        print(data)
        topic = Topic(
            title=data['title'], 
            description=data['description'], 
            room_code=data['code'], 
            time_started = datetime.strptime(data['time_started'], "%a, %d %b %Y %H:%M:%S %Z"), 
            time_estimate = timedelta(hours=data['time_estimate']['hours'], minutes=data['time_estimate']['minutes'])
        )
        print(topic)
        db.session.add(topic)
        db.session.commit()
        topics = Topic.query.filter_by(room_code=data['code']).all()
        response = {'topics': [topic.to_json() for topic in topics]} 
        #print(response)
        emit('topics', response, boradcast=True, to=data['code'])
    except:
        emit('error', {'message': 'Could not add topic. Try again'}, to=request.sid)

@socketio.on('edit_topic')
def edit_topic(data):
    try:
        topic = Topic.query.get(data['topic_id'])
        room = topic.room_code
        topic.title = data['title']
        topic.description = data['description']
        topic.time_started = datetime.strptime(data['time_started'], "%a, %d %b %Y %H:%M:%S %Z")
        topic.time_estimate = timedelta(hours=data['time_estimate']['hours'], minutes=data['time_estimate']['minutes'])

        db.session.commit()
        topics = Topic.query.filter_by(room_code=room).all()
        topics = [topic.to_json() for topic in topics]
        response = {'topics': topics}
        emit('topics', response, broadcast=True, to=room)
    except:
        emit('error', {'message': 'Could not edit topic. Try again'}, to=request.sid)

@socketio.on('delete_topic')
def delete_topic(data):
    try:
        topic = Topic.query.get(data['topic_id'])
        room = topic.room_code
        db.session.delete(topic)
        db.session.commit()
        topics = Topic.query.filter_by(room_code=room).all()
        topics = [topic.to_json() for topic in topics]
        response = {'topics': topics}
        emit('topics', response, broadcast=True, to=room)
    except:
        emit('error', {'message': 'Could not delete topic. Try again'}, to=request.sid)