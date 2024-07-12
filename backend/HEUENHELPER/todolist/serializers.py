from rest_framework import serializers
from .models import Day, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'task_name', 'status']

class DaySerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True)

    class Meta:
        model = Day
        fields = ['id', 'date', 'tasks']

    def create(self, validated_data):
        tasks_data = validated_data.pop('tasks')
        user = self.context['request'].user
        day = Day.objects.create(user=user, **validated_data)

        for task_data in tasks_data:
            Task.objects.create(day=day, **task_data)
        return day