import boto3

s3 = boto3.resource('s3')

# Get list of objects for indexing
images=[('images/image1.jpg','rui'),
      ('images/image2.jpg','rui'),
      ('images/image3.jpg','bruno'),
      ('images/image4.jpg','bruno'),
      ('images/image5.jpg','francisco'),
      ('images/image6.jpg','francisco')
      ]

# Iterate through list to upload objects to S3   
for image in images:
    file = open(image[0],'rb')
    object = s3.Object('rekognition-bkt','index/'+ image[0])
    ret = object.put(Body=file,
                    Metadata={'FullName':image[1]})