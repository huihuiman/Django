from django.contrib import admin
from .models import *

class GoodsAdmin(admin.ModelAdmin):
  list_display = ('title','goodsType','price','spec','picture')
  readonly_fields = ('picture',)
  def picture(self, obj):
    return u'<img src="%s" height="150"/>' % obj.picture.url

  picture.allow_tags = True
  list_filter = ('goodsType',)
  search_fields = ('title',)

class CartInfoAdmin(admin.ModelAdmin):
  list_display = ('user','goods','ccount',)
  list_filter = ('user',)
  search_fields = ('user',)
# Register your models here.
admin.site.register(GoodsType)
admin.site.register(CartInfo,CartInfoAdmin)
admin.site.register(Goods,GoodsAdmin)
