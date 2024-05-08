import boto3
import json

def lambda_handler(event, context):
    nome = event['user']
    appointment_id = event['appointment_id']
    
    client = boto3.client('dynamodb', region_name='us-east-1')
    response = client.get_item(
        TableName='appointments1',
        Key={
            'appointment_id': {'N': appointment_id}
        }
    )
    item = response.get('Item')
    if item:
        status = item.get('status', {}).get('S')
        if status == 'pending_payment':
        # Delete the item from the DynamoDB table
            response = client.delete_item(
                TableName='appointments1',
                Key={
                    'appointment_id': {'N': appointment_id}
                }
            )
            # Check if the delete operation was successful
            if response.get('ResponseMetadata', {}).get('HTTPStatusCode') == 200:
                return {
                    'statusCode': 200,
                    'body': json.dumps('Appointment removed successfully')
                }
            else:
                return {
                    'statusCode': 500,
                    'body': json.dumps('Failed to remove appointment')
                }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps('The appointment was paid in time')
            }
    else:
        return {
            'statusCode': 404,
            'body': json.dumps('Appointment not found')
        }
