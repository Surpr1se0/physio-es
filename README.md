# physio-es

Overleaf project:
```
https://www.overleaf.com/1191629916gtwrjtycbbmk#ef15c8
```


pip install django-cors-headers



# criar a base de dados postgres e depois:

CREATE TABLE ebdjango_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(254),
    password VARCHAR(15) NOT NULL
);


insert into ebdjango_user(name, username, email, password) values ('RUISANTOS', 'rui', 'rui@gmail.com', 'rui')





## Run the django server:
```
python manage.py runserver
```

## Run the react server: 
```
npm install  
npm run build
npm start
```
