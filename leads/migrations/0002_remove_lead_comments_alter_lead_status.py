# Generated by Django 5.0.7 on 2025-01-04 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leads', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lead',
            name='comments',
        ),
        migrations.AlterField(
            model_name='lead',
            name='status',
            field=models.CharField(default='Pending', max_length=50),
        ),
    ]
