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
//  console.log(str);
    var para = str.split("&");/*返回数组，本身字符串*/
//	console.log(para);
    var len = para.length;/*len=1*/
    var res = [];/*获取json字符串数组*/
    var arr = [];
    for(var i=0;i<len;i++){
		arr = para[i].split("=");/*["gId","value"]*/
//  	console.log("arr=" + arr);
		res.push("{\""+ arr[0] + "\":\"" + arr[1] + "\"}");/*目标：{"gId":"value","key":"value"}*/
//		console.log("res:" + res[i]);
//      res[i] = arr[1];
    }
//  alert(res);
    console.log("获取的url信息为：" + res);
    return res;
};

//获取url中gId
function getgId(){
	var s = parseURL();
//	console.log(s);
	var gId = 0;
	var obj = [];
	for(var i=0;i<s.length;i++){
		var one = $.parseJSON(s[i]);
//		console.log(one);
		obj.push(one);
	}
	var gId = obj[0].gId;
	console.log("获取到的id为:"+obj[0].gId);
	return gId;
}
//$(document).on("pageshow","#mainPage",function(){
$(document).ready(function(){
	//第一次加载无法执行？？
	alert("加载商品信息...");
	var goodsId = getgId();
	$.ajax({
		type: "post",
		url: "http://localhost:8080/SMarket/goods/fFindGoodsById",
		async: true,
		data: {"gId" : goodsId},
		dataType: "json",
		success: function(data){
			console.log("获取到的goods数据:" + data);
			var gsrc = data.imgurl;
			var gname = data.gName;
			var gdescription = data.description;
			var gprice = "￥ " + data.sellprice;
			console.log("价格: " + gprice);
			var gsellcount = data.sellcount;
			var gcount = data.count;
			console.log(gname);/*test*/
//			var ggg = document.getElementById("imgurl").src;
//			console.log("src:" + ggg);
			document.getElementById("imgurl").src = "img/" + gsrc;
			document.getElementById("gname").innerHTML = gname;
			document.getElementById("gdescription").innerHTML = gdescription;
			document.getElementById("gprice").innerHTML = gprice;
			document.getElementById("gsellcount").innerHTML = gsellcount;
			document.getElementById("gcount").innerHTML = gcount;
			
		},
		error: function(err){
			console.log("加载错误：" + err.status);
		}
	});
//	if(document.getElementById("gname").value == "null") {
//		location.replace(location);/*刷新*/
//	}
});
$(document).ready(function(){
	$("#addtocart").click(function(){
//		alert("点击事件触发");
		var goodsId = getgId();
		var goodsCount = document.getElementById("inputCount").value;
		$.ajax({
			type: "post",
			url: "http://localhost:8080/SMarket/cart/addToCart",
			async: true,
			data: {
				"gId" : goodsId,
				"gCount" : goodsCount
			},
			dataType: "json",
			success: function(data){
				if(data.result == "logError") {
					alert("未登录，请先登录");
				} else if(data.result == "sendError") {
					alert("信息不足，查询失败");
				} else if(data.result == "true") {
					alert("添加成功");
				} else {
					console.log("获取结果失败");
				}
			},
			error: function(err){
				console.log("加载错误" + err.status);
			}
		});
	});
});

//按钮点击事件
$(function(){
	//返回跳转到首页商品目录
	$('body').on('click','#gInfoTCcart',function(){
//		alert("即将返回首页...");
		window.location.href = "index.html";
	});

})
