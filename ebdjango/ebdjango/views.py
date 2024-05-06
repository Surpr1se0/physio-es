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

@api_view(['POST'])
def schedule(request):
    
    
    region_name = 'us-east-1'
    sfn_client = boto3.client('stepfunctions', region_name=region_name)
    
   
    input_data = {
    'inputString': '1'
    }
    input_value = input_data['inputString']
    # COLOQUEM AQUI A VOSSA STEP FUNCTION
    state_machine_arn = 'arn:aws:states:us-east-1:364720497785:stateMachine:MyStateMachine-34p5g5xei'

    response = sfn_client.start_execution(
    stateMachineArn=state_machine_arn,
    input=input_value  
)
   

    return Response(response)