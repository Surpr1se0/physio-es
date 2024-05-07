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

    # Query available times based on the selected specialty and optionally the doctor's name
    if doctor_name:
        # If the doctor's name is provided, filter by both specialty and doctor's name
        available_times = [{'doctor': doctor['name'], 'availability': doctor['availability']} for doctor in doctors_available_time if doctor['speciality'] == speciality and doctor['name'] == doctor_name]
        # Get the reserved appointments for the selected doctor and selected specialty
        response = client.query(
            TableName='appointments1',
            KeyConditionExpression='doctor_name = :doctor_name',
            FilterExpression='speciality = :speciality',
            ExpressionAttributeValues={
                ':doctor_name': {'S': doctor_name},
                ':speciality': {'S': speciality}
            }
        )
        print(response['Items'])
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


    #print(available_times)
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

    response = table.put_item(
        Item={
            'doctor_name': doctor_name,
            'speciality': str(speciality),
            'day': str(day_selected),
            'hour': str(time_selected),
            'username': str(User_id),
            'status': 'pending_payment'
        }
    )
    status_code = response['ResponseMetadata']['HTTPStatusCode']


    return Response(status_code)

@api_view(['GET'])
def show(request):
    region_name = 'us-east-1'
    client = boto3.client('dynamodb',region_name='us-east-1')
   
    db = boto3.resource('dynamodb',region_name='us-east-1')
    
    table = db.Table('appointments1')
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
    return Response(response['Items'])

@api_view(['GET'])
def listadmin(request):
    
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Replace with your region

    table = dynamodb.Table('appointments1')

    
    response = table.scan()
    items = response['Items']
    valor = []
    for item in items:
        valor.append(item)
    print(valor)

    
    return Response(valor)




@api_view(['PUT'])
def update(request):
    
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # Replace with your region

    table = dynamodb.Table('appointments1')

    print(request.data)
 
   
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



