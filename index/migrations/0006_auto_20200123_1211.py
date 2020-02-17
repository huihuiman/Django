# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2020-01-23 12:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0005_auto_20200123_1159'),
    ]

    operations = [
        migrations.AlterField(
            model_name='goods',
            name='price',
            field=models.DecimalField(decimal_places=0, max_digits=7, verbose_name='商品價格'),
        ),
        migrations.AlterField(
            model_name='goodstype',
            name='picture',
            field=models.ImageField(null=True, upload_to='static/upload/goodstype', verbose_name='類型圖片'),
        ),
    ]
