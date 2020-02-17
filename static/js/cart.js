window.onload = function (){
	/*-----------下拉菜单---------*/

	//1. 获取元素节点
	var currentAddr = document.getElementsByClassName('currentAddress')[0];
	var select = document.getElementsByClassName('select')[0];

	//获取内层列表中地址项
	var address = select.children;
	//为每一项添加点击事件
	for(var i = 0; i < address.length; i ++){
		address[i].onclick = function(){
			//传值
			currentAddr.innerHTML = this.innerHTML;
		};
	}

	/*-----------图片轮播-----------*/
	//1. 获取图片数组
	//2. 定时器实现图片切换
	//3. 图片切换主要切换数组下标，防止数组越界

	var banner = document.getElementsByClassName('wrapper')[0];
	var imgs = banner.children; //图片数组
	var imgNav = document.getElementsByClassName('imgNav')[0];
	var indInfo = imgNav.children; //索引数组
	var imgIndex = 0; //初始下标
	var timer;
	timer = setInterval(autoPlay,2500); //定时器
	function autoPlay(){
		//设置元素隐藏与显示
		imgs[imgIndex].style.display = "none";
		/*
		++ imgIndex;
		if(imgIndex == imgs.length){
			imgIndex = 0;
		}
		*/
		imgIndex = ++ imgIndex == imgs.length ? 0 : imgIndex;

		imgs[imgIndex].style.display = "block";

		for(var i = 0; i < indInfo.length; i ++){
			indInfo[i].style.background = "gray";
		}
		//切换索引 切换背景色
		indInfo[imgIndex].style.background = "red";
	}
	banner.onmouseover = function (){
		//停止定时器
		clearInterval(timer);
	};

	banner.onmouseout = function (){
		timer = setInterval(autoPlay,1500);
	};

};

function check_login(){
  $.get('/check_login/',function(data){
    var html = "";
    if(data.loginStatus == 0){
      html += "<a href='/login/'>[登錄]</a>";
      html += "<a href='/register/'>[註冊]</a>";
    }
    else{
      html += "歡迎："+data.uname;
      html += "<a href='/logout_cart/'>退出</a>";
    }
    $("#login").html(html);
  },'json');
}

function toggle(source) {
    //全選按鈕功能
    checkboxes = document.getElementsByName('checkall');
    for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = source.checked;
    }
}

function loadGoods(){
	$.get('/load_cart/',function(data){
		var show = "";
        show+="<div class='title'>";
        show+="<p class='check-box'>";
        show+="<input name='checkall' type='checkbox' onClick='toggle(this)'>全選";
        show+="</p>";
        show+="<p class='goods'>商品</p>";
        show+="<p class='price'>單價</p>";
        show+="<p class='quantit'>数量</p>";
        show+="<p class='t-sum'>小計</p>";
        show+="<p class='action'>操作</p>";
        show+="</div>";
        var priceTotal = [];
        var ccountTotal = [];
            //加總函數
            function sumData(arr){
                var sum = 0;

                for(var i=0;i<arr.length;i++){
                    sum += arr[i];
                }
                return sum;
            }
        $.each(data,function(i,obj){
            //jsonData = 購物車內容
            //jsonType = 商品內容
            var jsonData = JSON.parse(obj.data);
            var jsonType = JSON.parse(obj.p);
            ccountTotal.push(jsonData.ccount);
            $.each(jsonType,function(i,obj){
            console.log(jsonData.goods_id)
            //購物車內個別商品總金額計算（並轉換成Int）,帶入函數價算總額
            priceTotal.push(parseInt(obj.fields.price*jsonData.ccount));
                show+="<div id='good-content' style='overflow:hidden;'>";
                     show+="<div class='g-item'>";
                            show+="<p class='check-box'>";
                            show+="<input name='checkall' type='checkbox'>";
                            show+="<img src='/"+obj.fields.picture+"'width=100>";
                            show+="</p>";
                            show+="<p class='goods'>"+obj.fields.title+"</p>";
                            show+="<p class='price'>&#36;"+obj.fields.price+"</p>";
                            show+="<p class='quantity'>"+jsonData.ccount+"</p>";
                            show+="<p class='t-sums'>";
                                show+="<b>&#36;"+obj.fields.price*jsonData.ccount+"</b>";
                            show+="</p>";
                            show+="<p class='action'>";
                                show+="<a id='del' href='javascript:del_cart("+jsonData.goods_id+");'>移除</a>";
                            show+="</p>";
                     show+="</div>";
                show+="</div>";
                });
        });
        show+="<div class='title'>";
        show+="<p class='check-box'>";
        show+="<input name='checkall' type='checkbox' onClick='toggle(this)'>全選";
        show+="</p>";
        show+="<p class='goods'>您的商品</p>";
        show+="<p class='price'>總計</p>";
        show+="<p class='quantit'>"+sumData(ccountTotal)+"</p>";
        show+="<p class='t-sum'>&#36;"+sumData(priceTotal)+"</p>";
        show+="<p class='action'>"
            show+= "<a id='dell' href='#'>全部刪除</a>"
        show+="</p>";
        show+="</div>";
        $("#main").html(show);
	},'json');
}

function del_cart(gid){
	//1.验证登录账户，如果没有用户登录的话则给出相应的提示
	$.get('/check_login/',function(data){
		if(data.loginStatus == 0){
			alert('請先登錄！');
		}else{
        //2.將商品從購物車移除
            $.get(
                '/delete/',
                {
                    'gid':gid
                },function(data){
                    if(data.status == 1){
                    console.log(data.status)
                        alert(data.statusText);
                        $.ajax({
                            url:'/load_cart/',
                            type:'get',
                            dataType:'json',
                            async:true,
                            success:function(data){
                            console.log(data)
                                var show = "";
                                show+="<div class='title'>"
                                show+="<p class='check-box'>"
                                show+="<input type='checkbox' name='checkall' onClick='toggle(this)'>"
                                show+="</p>"
                                show+="<p class='goods'>商品</p>"
                                show+="<p class='price'>單價</p>"
                                show+="<p class='quantit'>数量</p>"
                                show+="<p class='t-sum'>小計</p>"
                                show+="<p class='action'>操作</p>"
                                show+="</div>"
                                var priceTotal = [];
                                var ccountTotal = [];
                                    function sumData(arr){
                                        var sum = 0;
                                        for(var i=0;i<arr.length;i++){
                                            sum += arr[i];
                                        }
                                        return sum;
                                    }
                                $.each(data,function(i,obj){
                                var jsonData = JSON.parse(obj.data);
                                var jsonType = JSON.parse(obj.p);
                                ccountTotal.push(jsonData.ccount);
                                    $.each(jsonType,function(i,obj){
                                    priceTotal.push(parseInt(obj.fields.price*jsonData.ccount));
                                        show+="<div id='good-content' style='overflow:hidden;'>";
                                            show+="<div class='g-item'>";
                                            show+="<p class='check-box'>";
                                            show+= "<input name='checkall' type='checkbox'>";
                                            show+="<img src='/"+obj.fields.picture+"'width=100>";
                                            show+="</p>";
                                            show+="<p class='goods'>"+obj.fields.title+"</p>";
                                            show+="<p class='price'>&#36;"+obj.fields.price+"</p>";
                                            show+="<p class='quantity'>"+jsonData.ccount+"</p>";
                                            show+="<p class='t-sums'>";
                                                show+="<b>&#36;"+obj.fields.price*jsonData.ccount+"</b>";
                                            show+="</p>";
                                            show+="<p class='action'>";
                                                show+="<a id='del' href='javascript:del_cart("+jsonData.goods_id+");'>移除</a>";
                                            show+="</p>";
                                            show+="</div>";
                                        show+="</div>";
                                    });
                                });
                            show+="<div class='title'>";
                            show+="<p class='check-box'>";
                            show+="<input name='checkall' type='checkbox' onClick='toggle(this)'>全選";
                            show+="</p>";
                            show+="<p class='goods'>您的商品</p>";
                            show+="<p class='price'>總計</p>";
                            show+="<p class='quantit'>"+sumData(ccountTotal)+"</p>";
                            show+="<p class='t-sum'>&#36;"+sumData(priceTotal)+"</p>";
                            show+="<p class='action'>"
                                show+= "<a id='dell' href='#'>全部刪除</a>"
                            show+="</p>";
                            show+="</div>";
                            $("#main").html(show);
                            }
                        });
                    }
                    else{
                    alert('移除購物車失敗');
                    }
                },'json');
        }
	},'json');

}

$(function(){
  check_login();
  loadGoods();
});
