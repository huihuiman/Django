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
			html += "<a href='/login'>[登錄]</a>";
			html += "<a href='/register'>[註冊]</a>";
		}else{
			html += "歡迎:"+data.uname;
			html += "<a href='/logout'>退出</a>";
		}
		//取得購物車裡的數量
        $.get(
        '/load_cart/',
        function(data){
            var show = "";
            var a = [];
            function sumData(arr){
                var sum = 0;
                for(var i=0;i<arr.length;i++){
                    sum += arr[i];
                }
                return sum;
            }
                $.each(data,function(i,obj){
                    var jsonData = JSON.parse(obj.data);
                    a.push(jsonData.ccount);
              });
                show+="<div id='cart' style='text-align:right;font-size:16px;margin:15px 0;'>";
                show+="<a href='/cart/'>我的購物車("+sumData(a)+")</a>";
                show+="</div>";
             $("#cart").html(show);
        },'json');
        $("#login").html(html);

	},'json');
}

//加載所有的商品類型以及商品訊息（每組取前10樣）
function loadGoods(){
	$.get('/load_type_goods/',function(data){
		//data 為響應回来的JSON對象
		var show = "";
		$.each(data,function(i,obj){
			//从obj中取出type,并转换为json对象
			var jsonType = JSON.parse(obj.type);
            //console.log(jsonType);
			show+="<div class='item' style='overflow:hidden;'>";
				show+="<p class='goodsClass'>";
					show+="<img src='/"+jsonType.picture+"'>";
					show+="<a href='#'>更多</a>";
				show+="</p>";
				show+="<ul>";
					var jsonGoods = JSON.parse(obj.goods);
					$.each(jsonGoods,function(i,good){
						show+="<li ";
						if((i+1) % 5 == 0){
							show+="class='no-margin'";
						}
						show+=">";
							show+="<p>";
								show+="<img src='/"+good.fields.picture+"'>";
							show+="</p>";
							show+="<div class='content'>";
								show+="<a href='javascript:add_cart("+good.pk+");'>";
									show+="<img src='/static/img/cart.png'>";
								show+="</a>";
								show+="<p>"+good.fields.title+"</p>";
								show+="<span>";
									show+="&#36;"+good.fields.price+"/"+good.fields.spec;
								show+="</span>";
							show+="</div>";
						show+="</li>";
					});
				show+="</ul>";
			show+="</div>";
		});
		$("#main").html(show);
	},'json');
}

//gid : 要新增的商品ID
function add_cart(gid){
	$.get('/check_login/',function(data){
		if(data.loginStatus == 0){
			alert('請先登錄！');
		}else{
			//將商品加入購物車
			$.get(
				'/add_cart/',
				{
					'gid':gid
				},function(data){
					if(data.status == 1){
                    //每當新增商品時,異步請求購物車總數
						alert(data.statusText);
                            $.ajax({
                            url:'/load_cart/',
                            type:'get',
                            dataType:'json',
                            async:true,
                            success:function(data){
                            console.log(data)
                            var show = "";
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
                              });
                                 show+="<div id='cart' style='text-align:right;font-size:16px;margin:15px 0;'>";
                                 show+="<a href='/cart/'>我的購物車("+sumData(ccountTotal)+")</a>";
                                 show+="</div>";
                              $("#cart").html(show);
                            }
                            });

                    }
                    else{
                        alert('添加購物車失敗');
					    }
	        },'json');
        }
    },'json');
}
$(function(){
	check_login();
	loadGoods();
});

