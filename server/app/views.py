from app import app, session, request, User, Room, Topic, db, to_dict, cross_origin
from datetime import datetime, timedelta
import json

@app.route('/room/create', methods=['POST'])
@cross_origin()
def create_room():
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
            'topics': topic.to_json()
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
        }},500)

@app.route('/room/join', methods=['POST'])
@cross_origin()
def join_room():
    try:
        data = request.json
        room = Room.query.get(data['code'])
        if room:
            user = User(username=data['name'], room_code=data['code'])
            db.session.add(user)
            db.session.commit()

            topics = Topic.query.filter_by(room_code=data['code']).all()
            topics = [topic.to_json() for topic in topics]
            return ({'status':'Success', 'data': {
                'message': 'You will be redirected to the room. Please wait a moment.',
                'topics' : topics
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