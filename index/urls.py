from django.conf.urls import url
from .views import *
urlpatterns = [
  url(r'^login/$',login_views,name='login'),
  url(r'^register/$',register_views,name='reg'),
  url(r'^check_uphone/$',check_uphone_views),
  url(r'^check_uemail/$', check_uemail_views),
  url(r'^check_cpwd/$',check_cpwd_views),
  url(r'^$',index_views),
  url(r'^check_login/$',check_login_views),
  url(r'^logout/$',logout_views),
  url(r'^logout_cart/$', logout_cart_views),
  url(r'^load_type_goods/$',type_goods_views),
  url(r'^add_cart/$',add_cart_views),
  url(r'^cart/$', cart_views),
  url(r'^load_cart/$', goods_cart_view),
  url(r'^delete/$',delete_cart),
]
