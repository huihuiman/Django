# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2020-01-23 11:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0004_auto_20200123_1154'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goodstype',
            name='desc',
            field=models.TextField(verbose_name='類型描述'),
        ),
        migrations.AlterField(
            model_name='goodstype',
            name='picture',
            field=models.ImageField(blank=True, null=True, upload_to='static/upload/goodstype', verbose_name='類型圖片'),
        ),
    ]
