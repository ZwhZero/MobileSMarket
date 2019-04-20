$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

//Ajax显示个人信息
$(document).on("pagebeforeshow","#myPage",function(){
	alert("个人信息加载中 - 个人信息页即将显示");
});
$(document).on("pageshow","#myPage",function(){
	$.ajax({
		async:true,//async:默认是 true，即为异步方式请求,是否得到返回的数据都会往后执行脚本
		type:"post",
		url:"http://localhost:8080/SMarket/user/getSuser",
		dataType:"json",
		success:function(data){
			console.log(data);
//			var jsonuser = eval("(" + data + ")");/*字符串转对象*/
//			console.log(jsonuser);
			document.getElementById("tbuname").innerHTML = data.uName;
			document.getElementById("tbsex").innerHTML = data.sex;
			document.getElementById("tbage").innerHTML = data.age;
			document.getElementById("tbphone").innerHTML = data.phone;
			document.getElementById("tbaddress").innerHTML = data.address;
			document.getElementById("tbemail").innerHTML = data.email;
		},
		error:function(e){
			console.log("加载错误：" + e.status);
		}
	});
//	var name = "John";
//	document.getElementById("tbuname").innerHTML=name;
	alert("个人信息加载完成 - 现在显示个人信息页");
});

//加载首页商品信息
$(document).on("pageshow","#mainPage",function(){
//	alert("开始加载商品~");
	$.ajax({
		async:true,//async:默认是 true，即为异步方式请求,是否得到返回的数据都会往后执行脚本
		type:"post",
		url:"http://localhost:8080/SMarket/goods/fGoodsList",
		dataType:"json",
		success:function(data){
			alert("获取商品信息成功");
			console.log(data);
			var cparent = document.getElementById("container");
			for (var i=0;i<data.length;i++) {
				//在container下创建div节点goodsbox
				var cgoodsbox = document.createElement("div");
				cgoodsbox.className = "goodsbox";
				cparent.appendChild(cgoodsbox);
				//在goodsbox下创建div：box_img
				var cbox_img = document.createElement("div");
				cbox_img.className = "box_img";
				cgoodsbox.appendChild(cbox_img);
				//在box_img下创建<a>
				var ca = document.createElement("a");
				ca.href = "goodsInfo.html?gId=" + data[i].gId;
				cbox_img.appendChild(ca);
				//在a下创建<img>
				var cimg = document.createElement("img");
				cimg.src = "img/" + data[i].imgurl;
				ca.appendChild(cimg);
				//在goodsbox下创建div：box_name
				var cbox_name = document.createElement("div");
				cbox_name.className = "box_name";
				cgoodsbox.appendChild(cbox_name);
				//在box_name下创建<a>
				var cna = document.createElement("a");
				cna.href = "goodsInfo.html?gId=" + data[i].gId;
				cbox_name.appendChild(cna);
				//在a下创建<p>
				var cnp = document.createElement("p");
				cnp.innerHTML = data[i].gName;
				cna.appendChild(cnp);
				//在goodsbox下创建div:box_price
				var cbox_price = document.createElement("div");
				cbox_price.className = "box_price";
				cgoodsbox.appendChild(cbox_price);
				//在box_price下创建p
				var cpp = document.createElement("p");
				cpp.innerHTML = "￥" + data[i].sellprice;
				cbox_price.appendChild(cpp);
			}
		},
		error:function(e){
			console.log("加载错误：" + e.status);
		}
	});
});

//Ajax显示分类清单
$(document).on("pageshow","#kindPage",function(){
//	alert("加载分类列表~");
	$.ajax({
		async: true,//async:默认是 true，即为异步方式请求,是否得到返回的数据都会往后执行脚本
		type: "post",
		url: "http://localhost:8080/SMarket/category/fKindList",
		dataType: "json",
		success: function(data){
//			alert("加载列表信息成功~");
			console.log(data);
			var cparent = document.getElementById("kindContent");
			for (var i=0;i<data.length;i++) {
				if(data[i].level == 1){ //用i遍历一级类别
					//在kindContent下创建div节点kindField
					var ckindField = document.createElement("div");
					ckindField.className = "kindField";
					cparent.appendChild(ckindField);
					//在kindField下创建div：kindOne
					var ckindOne = document.createElement("div");
					ckindOne.className = "kindOne";
					ckindField.appendChild(ckindOne);
					//在kindOne下创建<span>:kindOneItem
					var ckindOneItem = document.createElement("span");
					ckindOneItem.className = "kindOneItem";
					ckindOneItem.innerHTML = "●" + data[i].cName;
					ckindOne.appendChild(ckindOneItem);
					console.log("一级类别：" + data[i].cName);
					
					//在kindField下创建div：kindTwo
					var ckindTwo = document.createElement("div");
					ckindTwo.className = "kindTwo";
					ckindField.appendChild(ckindTwo);
					for (var j=0;j<data.length;j++) { //用j在指定父节点下遍历其子类别，动态添加子类别
						if(data[i].cId == data[j].pid) {
							//在kindTwo下创建<a>:kindTwoItem
							var ckindTwoItem = document.createElement("a");
							ckindTwoItem.className = "kindTwoItem ui-btn";
							ckindTwoItem.innerHTML = data[j].cName;
							ckindTwoItem.href = "kindGoods.html?cId=" + data[j].cId;
							ckindTwo.appendChild(ckindTwoItem);
							console.log("二级类别：" + data[j].cName); /*test*/
						}
					}
				}
			}
		},
		error: function(e){
			console.log("加载错误：" + e.status); /*test*/
		}
	});
});

//按钮点击事件
$(function(){
	//查询历史订单，跳转至历史订单页
	$("#myPage").on("click","#myOrderList",function(){
		alert("即将跳转历史订单页面...");
		window.location.href = "orderList.html";
	});
	
	//退出登录
	$("#myPage").on("click","#loginOut",function(){
		alert("即将退出登录并返回登录页面...");
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/user/floginOut",
			async: true,
			dataType: "json",
			success: function(data){
				if(data.result == "true"){
					console.log("您已退出登录，即将返回登录页!");
					window.location.href = "login.html";
				}
			},
			error: function(err){
				console.log("加载错误：" + err.status);
			}
		});
	});
	
	//商品搜索功能
	$("#searchPage").on("click","#searchButton",function(){
//		alert("搜索结果加载中...");
		var searchContent = $("#searchInfo").val();
		console.log(searchContent);
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/goods/fFindGoodsBygName",
			async: true,
			data: {"searchContent" : searchContent},
			dataType: "json",
			success: function(data){
				console.log(data);
				if(data.result == "false"){
					alert("找不到该商品...");
				} else{
//					alert("获取商品信息成功！");
					var cparent = document.getElementById("searchResult");
					for (var i=0;i<data.length;i++) {
						//在container下创建div节点goodsbox
						var cgoodsbox = document.createElement("div");
						cgoodsbox.className = "goodsbox";
						cparent.appendChild(cgoodsbox);
						//在goodsbox下创建div：box_img
						var cbox_img = document.createElement("div");
						cbox_img.className = "box_img";
						cgoodsbox.appendChild(cbox_img);
						//在box_img下创建<a>
						var ca = document.createElement("a");
						ca.href = "goodsInfo.html?gId=" + data[i].gId;
						cbox_img.appendChild(ca);
						//在a下创建<img>
						var cimg = document.createElement("img");
						cimg.src = "img/" + data[i].imgurl;
						ca.appendChild(cimg);
						//在goodsbox下创建div：box_name
						var cbox_name = document.createElement("div");
						cbox_name.className = "box_name";
						cgoodsbox.appendChild(cbox_name);
						//在box_name下创建<a>
						var cna = document.createElement("a");
						cna.href = "goodsInfo.html?gId=" + data[i].gId;
						cbox_name.appendChild(cna);
						//在a下创建<p>
						var cnp = document.createElement("p");
						cnp.innerHTML = data[i].gName;
						cna.appendChild(cnp);
						//在goodsbox下创建div:box_price
						var cbox_price = document.createElement("div");
						cbox_price.className = "box_price";
						cgoodsbox.appendChild(cbox_price);
						//在box_price下创建p
						var cpp = document.createElement("p");
						cpp.innerHTML = "￥" + data[i].sellprice;
						cbox_price.appendChild(cpp);
					}
				}
			},
			error: function(err){
				console.log("加载错误：" + err.status);
			}
		});
	});
	
	//跳转至购物车toMyCart
	$("#mainPage").on("click","#toMyCart",function(){
		alert("即将跳转到购物车...");
		window.location.href = "shoppingCart.html";
	});
	//搜索页跳转至购物车toMyCart
	$("#searchPage").on("click","#searchToCart",function(){
		alert("即将跳转到购物车...");
		window.location.href = "shoppingCart.html";
	});
	//个人信息页跳转至购物车toMyCart
	$("#myPage").on("click","#myPageToCart",function(){
		alert("即将跳转到购物车...");
		window.location.href = "shoppingCart.html";
	});
	//分类页跳转至购物车toMyCart
	$("#kindPage").on("click","#kindToCart",function(){
		alert("即将跳转到购物车...");
		window.location.href = "shoppingCart.html";
	});
	
})
