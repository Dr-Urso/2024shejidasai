from django.apps import AppConfig


class TransapiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "transApi"
    verbose_name = '翻译api管理'