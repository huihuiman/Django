from django import forms
from .models import *

#創造登入表格
class LoginForm(forms.ModelForm):
  class Meta:
    #指定關聯的Model
    model = User
    #要顯示的控件
    fields = ["uphone",'upwd']
    #指定每個控件對應的名稱
    labels = {
      "uphone":'電話號碼',
      'upwd':'密碼',
    }
    #指定每個控件的小部件，並給出其他屬性
    widgets = {
      'uphone':forms.TextInput(attrs={
        'class':'form-control',
      }),
      'upwd':forms.PasswordInput(attrs={
        'class':'form-control',
        'placeholder':'請輸入密碼',
      }),
    }






