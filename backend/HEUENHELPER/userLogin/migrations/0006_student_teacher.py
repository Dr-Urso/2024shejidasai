# Generated by Django 5.0.6 on 2024-07-08 03:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userLogin', '0005_alter_student_grade_alter_student_major_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='teacher',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='students', to='userLogin.teacher'),
        ),
    ]
