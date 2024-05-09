# physio-es

Overleaf project:
```
https://www.overleaf.com/1191629916gtwrjtycbbmk#ef15c8
```

## Run the react project: 
```
npm install  
npm run build
npm start
```


## Run the elastic beanstalk integration with django
```
review the credentials under /home/.aws
```
using powershell, in the directory ebdjango run:
```
eb create django-env --service-role LabRole --keyname vockey --instance_profile LabInstanceProfile

eb init
```
One time running:
```
eb open
```