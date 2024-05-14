import json
import boto3
import psycopg2

def lambda_handler(event, context):

  appointment_id = event.get('appointment_id')
  user_id = event.get('user_id')
  payment_amount = event.get('payment_amount')
  client = boto3.client('dynamodb', region_name='us-east-1')

  conn = psycopg2.connect(
        database="postgres", 
        user="postgres", 
        password="postgres", 
        host="database-1.cgakkke3mf3d.us-east-1.rds.amazonaws.com", port="5432")
    
  conn.autocommit = True
  cur = conn.cursor()
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
      cur.execute("SELECT money FROM ebdjango_user WHERE username = %s", (user_id,))
      rows = cur.fetchall()
      user_money = rows[0][0] - int(payment_amount)
      #user_money = 1234
      cur.execute("UPDATE ebdjango_user SET money = %s WHERE username = %s", (user_money, user_id))
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
      'body': json.dumps({'error': str(e)})
    }
