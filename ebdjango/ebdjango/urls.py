"""
URL configuration for ebdjango project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.db import router
from django.urls import include, path
from ebdjango.views import api_login
from ebdjango.views import schedule
from ebdjango.views import test
from ebdjango.views import save
from ebdjango.views import show
from ebdjango.views import info_appointment
from ebdjango.views import listadmin
from ebdjango.views import update
from ebdjango.views import pay
from django.views.generic import TemplateView

from ebdjango.views import facial_rec

from rest_framework.schemas import get_schema_view

urlpatterns = [
    path('api_schema', get_schema_view(title='Api Schema',description='API for appointments',version='1.0.0'), name='api_schema'),
    path('swagger-ui/', TemplateView.as_view(
        template_name='docs.html',
        extra_context={'schema_url':'api_schema'}
        ), name='swagger-ui'),
    path("admin/", admin.site.urls),
    path("login/", api_login, name='api_login'),
    path("home/",schedule, name="schedule"),
    path("appointment/",schedule, name='schedule'),
    path("test/",test, name='test'),
    path("save/",save, name='save'),
    path("my-appointments/",show, name="show"),
    path("listadmin/",listadmin,name='listadmin'),
    path("update/",update,name='update'),
    path("payment/",pay,name='pay'),
    path("next_appointment/",info_appointment, name="info_appointment"),
    path("facial-login/",facial_rec, name="facial_rec")
]
