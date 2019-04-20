//允许获取同名session（cookie）
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

//Ajax加载历史订单内容
$(document).on("pageshow","#buildOrderPage",function(){
	//ajax请求后台获取所有订单信息，返回包含订单对象list的json数组对象
	$.ajax({
		type: "post",
		url: "http://localhost:8080/SMarket/order/forderList",
		async: true,
//		data: {},
		dataType: "json",
		success: function(data){
			console.log(data);
			if(data.error_code == "700") { //未登录状态
				alert("未登录，请先登录！");
				window.location.href = "login.html";
			} else {
				var cparent = $("#orderContainer");
				alert("加载历史订单...");
//				console.log(data[0].orderItemList[0].gName);
				for (var i=0;i<data.length;i++) { //i遍历orderList，循环添加订单内容oneOrder
					//一条订单内容
					var coneOrder = $("<div class='oneOrder'></div>");
					cparent.append(coneOrder);
					//订单条目List区域
					var coneOrderItemList = $("<div class='oneOrderItemList'></div>");
					coneOrder.append(coneOrderItemList);
					//订单条目内容
					for (var j=0;j<data[i].orderItemList.length;j++) { //j遍历itemList，循环添加订单条目信息orderItembox
						//新建条目盒子，用于储存商品信息
						var corderItembox = $("<div class='orderItembox'></div>");
						coneOrderItemList.append(corderItembox);
						//商品名
						var cbox_name = $("<div class='box_name'></div>");
						corderItembox.append(cbox_name);
						var citemName = $("<span class='itemName'>" + data[i].orderItemList[j].gName + "</span>");
						cbox_name.append(citemName);
						//商品价格
						var cbox_price = $("<div class='box_price'></div>");
						corderItembox.append(cbox_price);
						var citemPrice = $("<span class='itemPrice'>" + data[i].orderItemList[j].gPrice + "</span>");
						cbox_price.append(citemPrice);
						//商品数量
						var cbox_number = $("<div class='box_number'></div>");
						corderItembox.append(cbox_number);
						var citemNum = $("<span class='itemNum'>" + data[i].orderItemList[j].gCount + "</span>");
						cbox_number.append(citemNum);
					}
					
					//统计信息区域盒子
					var corderTotal = $("<div class='orderTotal'></div>");
					coneOrder.append(corderTotal);
					//合计信息div
					var ctotalMessage = $("<div class='totalMessage'></div>");
					corderTotal.append(ctotalMessage);
					//字段1："一共有"
					var ctm1 = $("<span class='tm1'>一共有</span>");
					ctotalMessage.append(ctm1);
					//在字段1后插入商品总数量
					var ctotalNumber = $("<span class='totalNumber'>" + data[i].orderNumber + "</span>");
					ctotalNumber.insertAfter(ctm1);
					//在商品总数量后插入字段2:"件商品；合计"
					var ctm2 = $("<span class='tm2'>件商品；合计 </span>");
					ctm2.insertAfter(ctotalNumber);
					//在字段2 后插入商品总价
					var ctotalMoney = $("<span class='totalMoney'>" + data[i].orderPrice + "</span>");
					ctotalMoney.insertAfter(ctm2);
					//在商品总价后插入字段3 :" 元"
					var ctm3 = $("<span class='tm3'>  元</span>");
					ctm3.insertAfter(ctotalMoney);
					
					//订单信息区域盒子
					var corderMes = $("<div class='orderMes'></div>");
					coneOrder.append(corderMes);
					//订单号
					var corderIdBox = $("<div class='orderIdBox'>订单号：</div>");
					corderMes.append(corderIdBox);
					var corderId = $("<span class='orderId'>" + data[i].orderId + "</span>");
					corderIdBox.append(corderId);
					//订单创建时间
					var ccreateTimeBox = $("<div class='createTimeBox'>创建时间：</div>");
					corderMes.append(ccreateTimeBox);
					var ccreateTime = $("<span class='createTime'>" + data[i].createTime + "</span>");
					ccreateTimeBox.append(ccreateTime);
					//订单用户名
					var cuserNameBox = $("<div class='userNameBox'>用户名：</div>");
					corderMes.append(cuserNameBox);
					var cuserName = $("<span class='userName'>" + data[i].uName + "</span>");
					cuserNameBox.append(cuserName);
					//联系电话
					var cphoneBox = $("<div class='phoneBox'>联系电话：</div>");
					corderMes.append(cphoneBox);
					var cuserPhone = $("<span class='userPhone'>" + data[i].phone + "</span>");
					cphoneBox.append(cuserPhone);
					//地址
					var caddressBox = $("<div class='addressBox'>地址：</div>");
					corderMes.append(caddressBox);
					var cuserAddress = $("<span class='userAddress'>" + data[i].address + "</span>");
					caddressBox.append(cuserAddress);
					//留言
					var cremarkBox = $("<div class='remarkBox'>留言：</div>");
					corderMes.append(cremarkBox);
					var cuserRemark = $("<span class='userRemark'>" + data[i].remark + "</span>");
					cremarkBox.append(cuserRemark);
					//订单状态
					var cstateBox = $("<div class='stateBox'>订单状态：</div>");
					corderMes.append(cstateBox);
					var corderState = $("<span class='orderState'>" + data[i].orderState + "</span>");
					cstateBox.append(corderState);
				}
			}
		},
		error: function(err){
			console.log("加载错误：" + err.status);
		}
	});
	
});

//按钮点击事件
$(function(){
	//返回跳转到首页商品目录
	$('body').on('click','#oListToIndex',function(){
//		alert("即将返回首页...");
		window.location.href = "index.html";
	});
	
})