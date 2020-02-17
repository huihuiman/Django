$(function(){
  //設定註冊狀態(uphone與uemail)
  window.registStatus = 1;
  window.registemailStatus = 1;
  window.registcpwdStatus = 1;

   //驗證手機號碼
  $("input[name='uphone']").blur(function(){
    //如果輸入框沒有東西則返回
    if($(this).val().trim().length == 0)
      return;
    //輸入框有資料則ajax請求判斷此數據是否存在
    $.get(
      '/check_uphone/',
      {'uphone':$(this).val()},
      function(data){
        $("#uphone-tip").html(data.msg);
        //為registStatus賦值
        window.registStatus = data.status;
        //console.log("data.status:"+data.status);
      },'json'
    );
  });

 //驗證email
 $("input[name='uemail']").blur(function(){
    if($(this).val().trim().length == 0)
      return;
    $.get(
      '/check_uemail/',
      {'uemail':$(this).val()},
      function(data){
        $("#uemail-tip").html(data.msg);
        window.registemailStatus = data.status;
      },'json'
    );
  });

 //驗證兩次密碼
 $("input[name='cpwd']").blur(function(){
    if($(this).val().trim().length == 0)
      return;
    $.get(
      '/check_cpwd/',
      {'cpwd':$(this).val(),'upwd':$("input[name='upwd']").val()},
      function(data){
        $("#cpwd-tip").html(data.msg);
        window.registcpwdStatus = data.status;
      },'json'
    );
  });



  $("#formReg").submit(function(){
    //判斷狀態，決定表單內容是否要被提交
    if(window.registStatus == 1 )
      return false;
      else if(window.registemailStatus == 1)
         return false;
         if(window.registcpwdStatus == 1 )
            return false;
    return true;

  });
});