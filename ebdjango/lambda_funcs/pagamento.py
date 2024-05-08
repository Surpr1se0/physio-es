import json
import boto3

def lambda_handler(event, context):

  appointment_id = event.get('appointment_id')
  user_id = event.get('user_id')
  payment_amount = event.get('payment_amount')
  client = boto3.client('dynamodb', region_name='us-east-1')

  # Perform idempotent payment logic
  try:

    response = client.get_item(
      TableName='appointments1',
      Key={
        'appointment_id': {'N':appointment_id}
      }
    )

    item = response['Item']
    if (item['status']['S'] == 'schedule' or item['status']['S'] == 'finished'):
      return {
        'statusCode': 200,
        'body': {'message': 'Appointment already paid', 'payment_status': 'already_paid'}
      }
    elif (item['status']['S'] == 'pending_payment'):
      return {
        'statusCode': 200,
        'body': {'message': 'Payment not requested by user', "payment_status": "already_paid"}
      }
        
    elif item['status']['S'] == 'Payment in progress':
      item['status'] = {'S':'schedule'}

      client.put_item(TableName='appointments1',Item=item)

      return {
        'statusCode': 200,
        'body': {'message': 'Payment processed successfully', 'payment_status': 'paid'}
      }


  except Exception as e:
    item['status'] = {'S':'pending_payment'}
    client.put_item(TableName='appointments1',Item=item)
    print(f"Error processing payment: {str(e)}")
    return {
      'statusCode': 500,
      'body': json.dumps({'error': 'Failed to process payment'})
    }
