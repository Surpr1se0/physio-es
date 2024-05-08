import boto3
import datetime

def start_step_function(user, appointment_id):
    client = boto3.client('stepfunctions', region_name='us-east-1')
    response = client.start_execution(
        stateMachineArn='arn:aws:states:us-east-1:930441988510:stateMachine:MyStateMachine-e308nmtp7',
        name='paymentControl' + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S"),
        input='{"user": "' + user + '", "appointment_id": "' + appointment_id + '"}'
    )
    print(response['executionArn'])
    return response['executionArn']
    

#start_step_function("rui", "4")


def payment_step(appointment_id,payment_amount,user):
    client = boto3.client('stepfunctions', region_name='us-east-1')
    response = client.start_execution(
        stateMachineArn='arn:aws:states:us-east-1:930441988510:stateMachine:MyStateMachine-r8pcrrglz',
        name='paymentControl' + datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S"),
        input='{"appointment_id": "' + appointment_id + '","payment_amount": "' + payment_amount + '","user": "' + user +'"}'
    )
    print(response['executionArn'])
    return response['executionArn']
