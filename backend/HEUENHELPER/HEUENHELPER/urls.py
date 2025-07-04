"""
URL configuration for HEUENHELPER project.

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
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('test/', include('testUtils.urls')),
    path('user/', include('userLogin.urls')),
    path('interactions/', include('Teacher_Student_Interactions.urls')),
    path('forum/', include('bbs.urls')),
    path('trans/', include('transApi.urls')),
    path('todolist/', include('todolist.urls')),
    path('spark/', include('sparkApi.urls')),
    path('essay/', include('essayCorrect.urls')),
    path('generatedoc/', include('generateDoc.urls')),
    path('imgUpload/', include('imgUpload.urls')),
    path('audioText/', include('audioText.urls')),
    path('imageWord/', include('imageWord.urls')),
]
