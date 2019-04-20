//允许获取同名session（cookie）
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

//Ajax加载购物车内容
$(document).on("pageshow","#cartPage",function(){
//	alert("加载函数执行");
	$.ajax({
		async: true,//async:默认是 true，即为异步方式请求,是否得到返回的数据都会往后执行脚本
		type: "post",
		url: "http://localhost:8080/SMarket/cart/fcartList",
		dataType: "json",
		success: function(data){
			console.log(data);
			if(data.error_code) { //未登录状态
				alert("未登录，请先登录！");
				window.location.href = "login.html";
			} else { //已登录
				//遍历data，动态显示购物车内容
				//1.itembox2.box_name3.itemName 2.box_price3.itemPrice 2.box_number3.bt_minus itemNum bt_add 2.box_delete3.bt_del
				var cparent = document.getElementById("container");
				var ctotalCount = data.cartTotalCount;
				var ctotalPrice = data.cartTotalPrice;
				for(var i=0;i<data.shopCartList.length;i++) { //遍历data内购物车list:shopCartList
					var citembox = document.createElement("div");
					citembox.className = "itembox";
					cparent.appendChild(citembox);
					
					var cbox_name = document.createElement("div");
					cbox_name.className = "box_name";
					citembox.appendChild(cbox_name);
					var citemName = document.createElement("span");
					citemName.className = "itemName";
					citemName.innerHTML = data.shopCartList[i].gName;
					cbox_name.appendChild(citemName);
					
					var cbox_price = document.createElement("div");
					cbox_price.className = "box_price";
					citembox.appendChild(cbox_price);
					var citemPrice = document.createElement("span");
					citemPrice.className = "itemPrice";
					citemPrice.innerHTML = "￥" + data.shopCartList[i].price;
					cbox_price.appendChild(citemPrice);
					
					var cbox_number = document.createElement("div");
					cbox_number.className = "box_number";
					citembox.appendChild(cbox_number);
					var cbt_minus = document.createElement("button");
					cbt_minus.className = "bt_minus";
					cbt_minus.innerHTML = " - ";
//					cbt_minus.onClick = "reduceGoods()";
					cbox_number.appendChild(cbt_minus);
					var citemNum = document.createElement("input");
					citemNum.type = "text";
					citemNum.className = "itemNum";
					citemNum.value = data.shopCartList[i].gCount;
					//自定义属性gid来记录以方便获取gId
					citemNum.setAttribute("gid",data.shopCartList[i].gId);
					cbox_number.appendChild(citemNum);
					var cbt_add = document.createElement("button");
					cbt_add.className = "bt_add";
					cbt_add.innerHTML = " + ";
//					cbt_add.onClick = "addGoods()";
					cbox_number.appendChild(cbt_add);
					
					var cbox_delete = document.createElement("div");
					cbox_delete.className = "box_delete";
					citembox.appendChild(cbox_delete);
					var cbt_del = document.createElement("a");
					cbt_del.className = "bt_del";
					cbt_del.href = "javascript:void(0);";
					//自定义属性获取记录cartId
					cbt_del.setAttribute("cartid",data.shopCartList[i].cartId);
//					cbt_del.cartId = data.shopCartList[i].cartId;/*无效*/
					cbt_del.innerHTML = "删除";
					cbox_delete.appendChild(cbt_del);
					
				}
				document.getElementById("totalNumber").innerHTML = ctotalCount;
				document.getElementById("totalMoney").innerHTML = ctotalPrice;
			}
		},
		error: function(err) {
			console.log("加载错误：" + err.status);
		}
	});
});

//ajax 实现单击事件：动态改变 购物车数量等信息
$(function(){
	//返回跳转到首页商品目录
	$('body').on('click','#cartToIndex',function(){
		alert("即将返回首页...");
		window.location.href = "index.html";
	});
	
//	ajax 实现 动态改变购物车数量信息
	//1.商品数量减一
//	$(".bt_minus").click(function(){ /*动态加载 的无法触发点击事件*/
	$('body').on('click','.bt_minus',function(){
//		alert("---");
		var objNum = $(this).parent().find(".itemNum");
//		var goodsNum = Number(objNum.val()) - 1;
		var goodsNum = parseInt(objNum.val()) - 1;
		console.log(goodsNum);
		ajaxUpdateCart(goodsNum,objNum);
	});
//	})
	//2.商品数量加一
//	$(".bt_add").click(function(){
	$('body').on('click','.bt_add',function(){
//		alert("+++");
		var objNum = $(this).parent().find(".itemNum");
//		var goodsNum = Number(objNum.val()) + 1;
		var goodsNum = parseInt(objNum.val()) + 1;
		console.log(goodsNum);
		ajaxUpdateCart(goodsNum,objNum);
	});
//	})
//	3.ajax 实现删除某条购物车信息
//	$("bt_del").click(function(){
	$('body').on('click','.bt_del',function(){
//		alert("xxx");
		var objDel = $(this).parent().find(".bt_del");
		var cartId = objDel.attr("cartid");
		console.log("删除的cartId：" + cartId);
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/cart/fdeleteItem",
			async: true,
			data:{
				"cartId" : cartId
			},
			dataType: "json",
			success: function(data){ //返回新的购物车成功信息数据，刷新页面
//				console.log(data);
				if(data.error_code) { //未登录状态 返回错误json数据error_code:700
					alert("未登录，请先登录！");
					window.location.href = "login.html";
				} else if(data.result == "true") {
					alert("删除成功！");
					location.replace(location);
				} else {
					alert("传值错误，删除失败！");
					window.history.back(-1);
				} 
			},
			error: function(err){
				console.log("获取反馈信息错误：" + err.status);
			}
		});
	});
//	})
	//初始化订单并跳转至结算页面:buildOrder.html
	$('body').on('click','#submitCart',function(){
		alert("正在生成订单...");
		var cartTotalCount = $("#totalNumber").html();
		var cartTotalPrice = $("#totalMoney").html();
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/order/addOrder",
			async: true,
			data:{
				"cartTotalCount" : cartTotalCount,
				"cartTotalPrice" : cartTotalPrice
			},
			dataType: "json",
			success: function(data){
//				console.log(data);
				console.log(data);
				if(data.err_code == "700") {
					alert("未登录，请先登录");
					window.location.href = "login.html";
				}
				else if(data.result == "true") {
					alert("生成订单成功，即将跳转详情页...");
					//跳转至订单详情页，携带新生成 订单的主键orderId(newoId)
					window.location.href = "buildOrder.html?newoId=" + data.newoId;
				}
			},
			error: function(err){
				console.log("加载失败：" + err.status);
			}
		});
		
	});
	
	//ajx异步修改购物车数据
	function ajaxUpdateCart(goodsNum,objNum){
		if(goodsNum<=0){
			return false;
		}
		var gid = objNum.attr("gid"); /*attr()返回被选元素的属性值。*/
		var goodsId = parseInt(gid);
//		var gCount = parseInt(goodsNum);
		console.log("goodsId:" + goodsId + ",gCount:" + goodsNum);
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/cart/fupdateCart",
			async: true,
			data: {
				"gId" : goodsId,
				"gCount" : goodsNum
			},
			dataType: "json",
			success: function(data){
				console.log("获取的新数据为:" + data);
				alert("更新成功");
				if(data.error_code == 700) { //未登录状态
					alert("未登录，请先登录！");
					window.location.href("login.html");
				} else {
					objNum.val(data.gCount);
					document.getElementById("totalNumber").innerHTML = data.cartTotalCount;
					document.getElementById("totalMoney").innerHTML = data.cartTotalPrice;
				}
				
			},
			error: function(err){
				console.log("加载错误：" + err.status);
			}
			
		});
	}
})
