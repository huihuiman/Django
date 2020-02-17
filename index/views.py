import json

from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from .models import *
from .forms import *

def login_views(request):
  if request.method == 'GET':
    #　獲取來訪地址，無則導回首頁
    url = request.META.get('HTTP_REFERER','/')
    #get請求　－　判斷session,判斷cookie
    #先判斷session中是否有登錄訊息
    if 'uid' in request.session and 'uphone' in request.session:
      #有登錄訊息保存在　session
      resp = HttpResponseRedirect(url)
      return resp
    else:
      #沒有登錄訊息保存在　session，繼續判斷cookies中是否有登錄訊息
      if 'uid' in request.COOKIES and 'uphone' in request.COOKIES:
        #cookies中有登錄訊息　
        #将cookies中的內容取出来保存進session
        uid = request.COOKIES['uid']
        uphone = request.COOKIES['uphone']
        request.session['uid']=uid
        request.session['uphone']=uphone
        resp = redirect(url)
        return resp
      else:
        #cookies中没有登錄訊息
        form = LoginForm()
        #將來訪地址保存進cookies中
        resp = render(request,'login.html',locals())
        resp.set_cookie('url',url)
        return resp
  else:
    #post請求
    #獲取帳號密碼
    uphone = request.POST['uphone']
    upwd = request.POST['upwd']
    #判斷號與密碼是否存在
    users=User.objects.filter(uphone=uphone,upwd=upwd)
    if users:
      #登錄成功：先存進session
      request.session['uid']=users[0].id
      request.session['uphone']=uphone
      url = request.COOKIES.get('url','/')
      resp = redirect(url)
      #將url从cookies中删除出去
      if 'url' in request.COOKIES:
        resp.delete_cookie('url')
      #判斷是否要存進cookies
      if 'isSaved' in request.POST:
        expire = 60*60*24*30
        resp.set_cookie('uid',users[0].id,expire)
        resp.set_cookie('uphone',uphone,expire)
      return resp
    else:
      #登錄失敗
      form = LoginForm()
      return render(request,'login.html',locals())

def register_views(request):
  if request.method == 'GET':
    return render(request,'register.html')
  else:
    # 驗證帳號是否已存在
    uphone = request.POST['uphone']
    #接收數據存進數據庫
    upwd = request.POST['upwd']
    uname = request.POST['uname']
    uemail = request.POST['uemail']
    user = User()
    user.uphone = uphone
    user.upwd = upwd
    user.uname = uname
    user.uemail = uemail
    user.save()
    #取出user中的id 和 uphone的值保存進session
    request.session['uid']=user.id
    request.session['uphone']=user.uphone
    return redirect('/')

def check_uphone_views(request):
  uphone = request.GET['uphone']
  users = User.objects.filter(uphone = uphone)
  if users:
    status = 1
    msg = '手機號碼已存在'
  else:
    status = 0
    msg = 'OK'

  dic = {
    'status':status,
    'msg' : msg,
  }
  return HttpResponse(json.dumps(dic))

def check_uemail_views(request):
  uemail = request.GET['uemail']
  uemails = User.objects.filter(uemail = uemail)
  if  uemails:
    status = 1
    msg = 'Email已存在'
  else:
    status = 0
    msg = 'OK'

  dic = {
    'status':status,
    'msg' : msg,
  }
  return HttpResponse(json.dumps(dic))

def check_cpwd_views(request):
  upwd = request.GET['upwd']
  cpwd = request.GET['cpwd']

  if upwd == cpwd:
    status = 0
    msg = '密碼一致'
  else:
    status = 1
    msg = '密碼不一致'

  dic = {
    'status':status,
    'msg' : msg,
  }
  return HttpResponse(json.dumps(dic))


def index_views(request):
  return render(request,'index.html')

def check_login_views(request):
  if 'uid' in request.session and 'uphone' in request.session:
    loginStatus = 1
    id = request.session['uid']
    uname=User.objects.get(id=id).uname
    dic = {
      'loginStatus':loginStatus,
      'uname':uname
    }
    return HttpResponse(json.dumps(dic))
  else:
    dic = {
      'loginStatus':0
    }
    return HttpResponse(json.dumps(dic))

#一般退出
def logout_views(request):
  if 'uid' in request.session and 'uphone' in request.session:
    del request.session['uid']
    del request.session['uphone']
    url=request.META.get('HTTP_REFERER','/')
    resp = HttpResponseRedirect(url)
    if 'uid' in request.COOKIES and 'uphone' in request.COOKIES:
      resp.delete_cookie('uid')
      resp.delete_cookie('uphone')
    return resp
  return redirect('/')

# 購物車頁面退出回首頁
def logout_cart_views(request):
  if 'uid' in request.session and 'uphone' in request.session:
    del request.session['uid']
    del request.session['uphone']
    resp = HttpResponseRedirect('/')
    if 'uid' in request.COOKIES and 'uphone' in request.COOKIES:
      resp.delete_cookie('uid')
      resp.delete_cookie('uphone')
    return resp
  return redirect('/')

#加載所有的商品類型以及對應的每個類型底下的前10條數據
def type_goods_views(request):
  all_list = []
  types = GoodsType.objects.all()
  for type in types:
    type_json = json.dumps(type.to_dict())
    g_list = type.goods_set.filter(isActive=True).order_by("-id")[0:10]
    #序列化為json
    g_list_json=serializers.serialize('json',g_list)
    dic = {
      "type":type_json,
      "goods":g_list_json,
    }
    all_list.append(dic)
  return HttpResponse(json.dumps(all_list))
  #return HttpResponse(json.dumps({"data": all_list}), content_type='application/json')

def add_cart_views(request):
  good_id=request.GET['gid']
  user_id = request.session['uid']
  ccount = 1
  cart_list = CartInfo.objects.filter(user_id=user_id,goods_id=good_id)
  if cart_list:
    #用戶已有相同商品,則做+1商品
    cartinfo = cart_list[0]
    cartinfo.ccount = cartinfo.ccount + ccount
    cartinfo.save()
    dic = {
      'status':1,
      'statusText':'更新数量成功'
    }
  else:
    #沒有此商品,做新增商品的動作
    cartinfo = CartInfo()
    cartinfo.user_id = user_id
    cartinfo.goods_id = good_id
    cartinfo.ccount = ccount
    cartinfo.save()
    dic = {
      'status':1,
      'statusText':'添加購物車成功'
    }
  return HttpResponse(json.dumps(dic))

def cart_views(request):
  if 'uid' in request.session and 'uphone' in request.session:
    return render(request, 'cart.html')
  else:
    return redirect('/')


def goods_cart_view(request):
  all_list = []
  user_id = request.session['uid']
  carts = CartInfo.objects.filter(user_id=user_id).all()

  for c in carts:
    c_dump = json.dumps(c.to_dict())
    g = Goods.objects.filter(id=c.goods.id).all()
    g_list_json = serializers.serialize('json', g)
    dic = {
      "data": c_dump,
      "p":g_list_json
    }
    all_list.append(dic)

  return HttpResponse(json.dumps(all_list))
  #return HttpResponse(json.dumps({"data": all_list}), content_type='application/json')

def delete_cart(request):
    good_id = request.GET['gid']
    user_id = request.session['uid']
    cart_list = CartInfo.objects.filter(user_id=user_id, goods_id=good_id)
    # cart_list = CartInfo.objects.filter(user_id=user_id, goods_id=good_id).delete()

    if cart_list:
      cartinfo = cart_list[0]
      cartinfo.delete()
      dic = {
        'status': 1,
        'statusText': '刪除購物車成功'
      }
    else:
      dic = {
        'status': 1,
        'statusText': '狀態異常'
      }
    return HttpResponse(json.dumps(dic))












