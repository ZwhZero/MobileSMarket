//允许获取同名session（cookie）
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    }
});

//获取url中传递的所有值存于res[]中
function parseURL(){
	var url = window.location.href;
    var str = url.split("?")[1];
    var para = str.split("&");/*返回数组，本身字符串*/
    var len = para.length;/*len=1*/
    var res = [];/*获取json字符串数组*/
    var arr = [];
    for(var i=0;i<len;i++){
		arr = para[i].split("=");/*["gId","value"]*/
		res.push("{\""+ arr[0] + "\":\"" + arr[1] + "\"}");/*目标：{"gId":"value","key":"value"}*/
//		console.log("res:" + res[i]);
    }
    console.log("获取的url信息为：" + res);
    return res;
};

//获取url中newoId
function getnewoId(){
	var s = parseURL();
//	console.log(s);
	var newoId = 0;
	var obj = [];
	for(var i=0;i<s.length;i++){
		var one = $.parseJSON(s[i]);
//		console.log(one);
		obj.push(one);
	}
	var newoId = obj[0].newoId;
	console.log("获取到的newoId为:"+obj[0].newoId);
	return newoId;
}

//js+Ajax动态加载订单内容(url中：orderId)
$(document).on("pageshow","#buildOrderPage",function(){
	alert("加载订单信息...");
	var newoId = getnewoId();
	console.log("json的newoId为：" + newoId);
	$.ajax({
		async: true,//async:默认是 true，即为异步方式请求,是否得到返回的数据都会往后执行脚本
		type: "post",
		url: "http://localhost:8080/SMarket/order/forderInfo",
		data: {"newoId" : newoId},
		dataType: "json",
		success: function(data){
			console.log(data);
			if(data.error_code == "700") { //未登录状态
				alert("未登录，请先登录！");
				window.location.href = "login.html";
			} else { //已登录
				//遍历data.orderItemList，动态生成订单条目内容
				var cparent = document.getElementById("orderItemList");
				var ctotalNumber = data.orderNumber;
				var ctotalMoney = data.orderPrice;
//				var corderId = data.orderId;
				var ccreateTime = data.createTime
				var cuserName = data.uName
				var cuserPhone = data.phone
				var cuserAddress = data.address
				var cuserRemark = data.remark
				
				for(var i=0;i<data.orderItemList.length;i++) { //遍历data内订单条目list:orderItemList
					//在orderItemList下创建div:orderItembox
					var corderItembox = document.createElement("div");
					corderItembox.className = "orderItembox";
					cparent.appendChild(corderItembox);
					//在orderItembox下创建div：box_name
					var cbox_name = document.createElement("div");
					cbox_name.className = "box_name";
					corderItembox.appendChild(cbox_name);
					var citemName = document.createElement("span");
					citemName.className = "itemName";
					citemName.innerHTML = data.orderItemList[i].gName;
					cbox_name.appendChild(citemName);
					//在orderItembox下创建div：box_price
					var cbox_price = document.createElement("div");
					cbox_price.className = "box_price";
					corderItembox.appendChild(cbox_price);
					var citemPrice = document.createElement("span");
					citemPrice.className = "itemPrice";
					citemPrice.innerHTML = "￥" + data.orderItemList[i].gPrice;
					cbox_price.appendChild(citemPrice);
					//在orderItembox下创建div：box_number
					var cbox_number = document.createElement("div");
					cbox_number.className = "box_number";
					corderItembox.appendChild(cbox_number);
					var citemNum = document.createElement("span");
					citemNum.className = "itemNum";
					citemNum.innerHTML = data.orderItemList[i].gCount;
					//自定义属性gid来记录以方便获取gId
//					citemNum.setAttribute("gid",data.orderItemList[i].gId);
					cbox_number.appendChild(citemNum);
				}
				document.getElementById("totalNumber").innerHTML = ctotalNumber;
				document.getElementById("totalMoney").innerHTML = ctotalMoney;
				document.getElementById("orderId").innerHTML = newoId;
				document.getElementById("createTime").innerHTML = ccreateTime;
				document.getElementById("userName").innerHTML = cuserName;
				document.getElementById("userPhone").value = cuserPhone;
				document.getElementById("userAddress").value = cuserAddress;
				document.getElementById("userRemark").value = cuserRemark;
			}
		},
		error: function(err) {
			console.log("加载错误：" + err.status);
		}
	});
});

//实现单击事件
$(function(){
	//确认订单操作：接口-fsubmitOrder；数据：phone,address,remark
	$("body").on("click","#submitOrder",function(){
		var newoId = getnewoId();
		var thisPhone = document.getElementById("userPhone").value;
		var thisAddress = document.getElementById("userAddress").value;
		var thisRemark = document.getElementById("userRemark").value;
		console.log(thisPhone + "," + thisAddress + "," + thisRemark);
		//Ajax实现更新数据库订单信息以确认最终订单操作
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/order/fsubmitOrder",
			async: true,
			data:{
				"newoId" : newoId,
				"phone" : thisPhone,
				"address" : thisAddress,
				"remark" : thisRemark
			},
			dataType: "json",
			success: function(data){
				console.log(data);
				if(data.error_code == "700"){
					alert("未登录，请先登录！");
					window.location.href = "login.html";
				} else if(data.result == "true"){
					alert("保存成功！即将放回首页。稍后可在\“我的-历史订单\”中查询订单信息");
					window.location.href = "index.html";
				} 
				else {
					alert("保存成功，无法跳转请手动点击首页进行跳转！稍后可在\“我的-历史订单\”中查询订单信息");
				}
			},
			error: function(err){
				console.log("加载错误：" + err.status);
			}
		});
		
				
	});
})

