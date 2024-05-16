from django.shortcuts import render
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
import jwt
import datetime
from django.contrib import auth
import boto3
from django.conf import settings
from .models import User
import os
from operator import itemgetter
from . import aws_step_func


doctors_available_time: dict = [
  {
    "name": "Francisco",
    "speciality": "Evaluation Appointment",
    "availability": {
      "Monday": ["10:00 AM", "2:00 PM"],
      "Tuesday": ["11:00 AM", "3:00 PM"],
      "Wednesday": ["9:00 AM", "1:00 PM"]
    }
  },
  {
    "name": "Bruno",
    "speciality": "Shock Waves",
    "availability": {
      "Monday": ["9:30 AM", "1:30 PM"],
      "Wednesday": ["10:30 AM", "2:30 PM"],
      "Friday": ["11:30 AM", "3:30 PM"]
    }
  },
    {
    "name": "rui",
    "speciality": "musculoskeletal physiotherapy",
    "availability": {
      "Monday": ["9:00 AM", "11:00 AM","2:00 PM"],
      "Tuesday": ["11:00 AM", "1:00 PM","3:00 PM"],
      "Wednesday": ["9:00 AM", "11:00 AM", "1:00 PM","3:00 PM"]
    }
  },
  {
    "name": "Yuri",
    "speciality": "therapeutical massage",
    "availability": {
        "Monday": ["10:00 AM", "2:00 PM"],
        "Tuesday": ["11:00 AM", "3:00 PM"],
        "Wednesday": ["9:00 AM", "1:00 PM"],
        "Thursday": ["9:00 AM", "1:00 PM"],
        "Friday": ["9:00 AM", "1:00 PM"]
    }
  },
    {
    "name": "Pedro",
    "speciality": "Shock Waves",
    "availability": {
      "Monday": ["8:30 AM", "2:30 PM"],
      "Wednesday": ["9:30 AM", "2:30 PM"],
      "Friday": ["11:30 AM", "4:30 PM"]
    }
  }
]

doctors_rooms: dict = [
    {
        "name":"Bruno",
        "room":"C1"
    },
    {
        "name":"Pedro",
        "room":"C2"
    },
    {
        "name":"Yuri",
        "room":"C3"
    },
    {
        "name":"rui",
        "room":"C4"
    },
    {
        "name":"Francisco",
        "room":"C5"
    }
]





def generate_token(id,password):
    return jwt.encode({
        'user_id': id,
        'user_password': password,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


@api_view(['POST'])
def api_login(request):
    data = request.data
    username = data['username']
    password = data['password']

    print(username)
    print(password)
    try:
        user = User.objects.get(username=username, password=password)
        token = generate_token(username, password)

        return Response({
            'message': 'Login successful',
            'access_token': str(token),
            'refresh_token': str(token),
            'id': user.id,
            'valid': '1'
        })
    except User.DoesNotExist:
        return Response({'token': "login_error"})

@api_view(['GET'])
def schedule(request):
    
    
  #  region_name = 'us-east-1'
  #  client = boto3.client('dynamodb',region_name='us-east-1')
  #  
   # db = boto3.resource('dynamodb',region_name='us-east-1')
    
   # table = db.Table('doctors')


    # execute a query that gets all the items in the table in dynamodb
    
  #  response = table.scan()
 #   response['Items']
#    print(response['Items'])


    return Response(doctors_available_time)


@api_view(['GET'])
def test(request):
    region_name = 'us-east-1'
    client = boto3.client('dynamodb',region_name=region_name)
   
    db = boto3.resource('dynamodb',region_name=region_name)
    
    table = db.Table('appointments1')
    speciality = request.GET.get('speciality')
    doctor_name = request.GET.get('doctor')
    print(doctors_available_time)
    # Query available times based on the selected specialty and optionally the doctor's name
    if doctor_name:
        # If the doctor's name is provided, filter by both specialty and doctor's name
        available_times = [{'doctor': doctor['name'], 'availability': doctor['availability']} for doctor in doctors_available_time if doctor['speciality'] == speciality and doctor['name'] == doctor_name]
        # Get the reserved appointments for the selected doctor and selected specialty
        response = client.query(
            TableName='appointments1',
            IndexName='doctor_name-index',
            KeyConditionExpression='doctor_name = :doctor_name',
            FilterExpression='speciality = :speciality',
            ExpressionAttributeValues={
                ':doctor_name': {'S': doctor_name},
                ':speciality': {'S': speciality}
            }
        )
        print("COmeçou#")
        print(response['Items'])
        print("AVAou\n")
        for item in response['Items']:
            if(item['day']['S'] in available_times[0]['availability']):
                if(item['hour']['S'] in available_times[0]['availability'][item['day']['S']]):
                    available_times[0]['availability'][item['day']['S']].remove(item['hour']['S'])
    else:
        # If only the specialty is provided, filter by specialty
        available_times = [{'doctor': doctor['name'], 'availability': doctor['availability']} for doctor in doctors_available_time if doctor['speciality'] == speciality]
        for doctor in available_times:
            dn = doctor['doctor']
            print(dn)
            response = client.query(
                TableName='appointments1',
                IndexName='doctor_name-index',
                KeyConditionExpression='doctor_name = :doctor_name',
                FilterExpression='speciality = :speciality',
                ExpressionAttributeValues={
                    ':doctor_name': {'S': dn},
                    ':speciality': {'S': speciality}
                }
            )
            print(response['Items'])
            for item in response['Items']:
                for times in available_times:
                    if(item['day']['S'] in times['availability']):
                        if(item['hour']['S'] in times['availability'][item['day']['S']]):
                            times['availability'][item['day']['S']].remove(item['hour']['S'])


    print(available_times)
    return Response(available_times)


@api_view(['POST'])
def save(request):

    speciality = request.GET.get('speciality')
    doctor_name = request.GET.get('doctor')
    time_selected = request.GET.get('time')
    day_selected = request.GET.get('day')
    User_id = request.GET.get('user')
    # Save the appointment to the dynamo db database
    print(speciality)
    print(doctor_name)
    print(time_selected)
    print(User_id)
    region_name = 'us-east-1'
    client = boto3.client('dynamodb',region_name='us-east-1')
   
    db = boto3.resource('dynamodb',region_name='us-east-1')
    
    table = db.Table('appointments1')


    response_count = client.scan(
    TableName='appointments1',
    Select='COUNT'  # Get count of items
)
    next_id = response_count['Count'] + 1


    response = table.put_item(
        Item={
            'appointment_id': next_id,
            'doctor_name': str(doctor_name),
            'speciality': str(speciality),
            'day': str(day_selected),
            'hour': str(time_selected),
            'username': str(User_id),
            'status': 'pending_payment'
        }
    )
    status_code = response['ResponseMetadata']['HTTPStatusCode']

    aws_step_func.start_step_function(User_id, str(next_id))
    return Response(status_code)

@api_view(['GET'])
def show(request):
    region_name = 'us-east-1'
    client = boto3.client('dynamodb',region_name='us-east-1')
   
    db = boto3.resource('dynamodb',region_name='us-east-1')
    
    User_id = request.GET.get('user')
    print(User_id)
    response = client.query(
        IndexName='username-index',
        TableName='appointments1',
        KeyConditionExpression='username = :username',
        ExpressionAttributeValues={
            ':username': {'S': User_id}
        }
    )
    print(response['Items'])
    sorted_data = sorted(response['Items'], key=lambda x: (x['day']['S'], x['hour']['S']))
    #sorted_items = sorted(response['Items'], key=itemgetter('day', 'hour'))

    return Response(sorted_data)



@api_view(['GET'])
def info_appointment(request):
    client = boto3.client('dynamodb',region_name='us-east-1')
   
   
    
    User_id = request.GET.get('user')
    
    response = client.query(
        IndexName='username-index',
        TableName='appointments1',
        KeyConditionExpression='username = :username',
       
        ExpressionAttributeValues={
            ':username': {'S': User_id},
           
           
        }
    )

    print(response['Items'])
    
    sorted_data = sorted(response['Items'], key=lambda x: (x['day']['S'], x['hour']['S']))
    schedules = []
    for sched in sorted_data:
        if sched['status']['S'] == 'schedule':
          
            for doctor in doctors_rooms:
                if doctor['name'] == sched['doctor_name']['S']:
                    room = doctor['room']
                    break
           
            sched['room'] = room
            schedules.append(sched)

           
            break
            
       
    return Response(schedules)




@api_view(['GET'])
def listadmin(request):
    
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Replace with your region

    table = dynamodb.Table('appointments1')

   

    response = table.scan()
    items = response['Items']
    

    sorted_items = sorted(items, key=itemgetter('day', 'hour'))
    
    return Response(sorted_items)




@api_view(['PUT'])
def update(request):
    
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Replace with your region

    table = dynamodb.Table('appointments1')

    valor = request.data
   
    update_expression = 'SET #s = :val'
    expression_attribute_names = {'#s': 'status'}
    expression_attribute_values = {':val':  'finished'}
    primary_key = {
    'appointment_id': valor['id']  # Replace with the actual partition key value
    }

    table.update_item( 
    Key=primary_key,
        UpdateExpression=update_expression,
        ExpressionAttributeNames=expression_attribute_names,
        ExpressionAttributeValues=expression_attribute_values,
        ReturnValues='UPDATED_NEW'  # Se desejar retornar os valores atualizados
    )
    
    return Response({
            'message': 'Update successful'
        })

@api_view(['POST'])
def pay(request):
    client = boto3.client('dynamodb', region_name='us-east-1')
    appointment_id = request.GET.get('appointment')
    User_id = request.GET.get('user')
    print(appointment_id)
    print(User_id)
    response = client.get_item(
        TableName='appointments1',
        Key={
            'appointment_id': {'N':appointment_id}
        }
    )
    if 'Item' not in response:
        return Response({
            'message': 'Appointment not found'
        })
    item = response['Item']
    print(item['status']['S'])
    if item['status']['S'] == 'finished':
        return Response({
            'message': 'Payment already done'
        })
    elif item['status']['S'] == 'Payment in progress':
        return Response({
            'message': 'Payment already in progress'
        })
    else:
        item['status'] = {'S':'Payment in progress'}
        client.put_item(
            TableName='appointments1',
            Item=item)
        aws_step_func.payment_step(appointment_id, str(50), User_id)
        return Response({
            'message': 'Payment in progress'
        })


