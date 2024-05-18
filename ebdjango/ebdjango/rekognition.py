import boto3
import io
from PIL import Image



def recog(image):
    rekognition = boto3.client('rekognition', region_name='us-east-1')
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')


    image = Image.open(image)
    stream = io.BytesIO()
    image.save(stream,format="JPEG")
    image_binary = stream.getvalue()


    response = rekognition.search_faces_by_image(
            CollectionId='facerecognition_collection',
            Image={'Bytes':image_binary}                                       
            )

    found = False
    for match in response['FaceMatches']:
        print (match['Face']['FaceId'],match['Face']['Confidence'])
            
        face = dynamodb.get_item(
            TableName='facerecognition',  
            Key={'RekognitionId': {'S': match['Face']['FaceId']}}
            )
        
        if 'Item' in face:
            print ("Found Person: ",face['Item']['FullName']['S'])
            found = True
            return face['Item']['FullName']['S']

    if not found:
        print("Person cannot be recognized")
        return False