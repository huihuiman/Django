from django import forms
from .models import *

class LoginForm(forms.ModelForm):
  class Meta:
    model = User
    fields = ["uphone",'upwd']
    labels = {
      "uphone":'電話號碼',
      'upwd':'密碼',
    }
    widgets = {
      'uphone':forms.TextInput(attrs={
        'class':'form-control',
      }),
      'upwd':forms.PasswordInput(attrs={
        'class':'form-control',
        'placeholder':'請輸入密碼',
      }),
    }






