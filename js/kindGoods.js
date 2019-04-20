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
		res.push("{\""+ arr[0] + "\":\"" + arr[1] + "\"}");/*目标：{"gId":"value","key2":"value2"}*/
//		console.log("res:" + res[i]);
    }
    console.log("获取的url传值信息为：" + res);
    return res;
};

//获取url中cId
function getcId(){
	var s = parseURL();
//	console.log(s);
	var cId = 0;
	var obj = [];
	for(var i=0;i<s.length;i++){
		var one = $.parseJSON(s[i]);
//		console.log(one);
		obj.push(one);
	}
	var cId = obj[0].cId;
	console.log("获取到的cid为:"+obj[0].cId);
	return cId;
}

//Ajax加载该类别的商品信息（cid）
$(document).on("pageshow","#kindGoodsPage",function(){
	var cId = getcId();
	$.ajax({
		type: "post",
		url: "http://localhost:8080/SMarket/goods/fFindGoodsBycId",
		async: true,
		data: {"categoryId" : cId},
		dataType: "json",
		success: function(data){
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
		error: function(err){
			console.log("加载错误：" + err.status);
		}
	});

});

//按钮点击事件
$(function(){
	//返回跳转到首页商品目录
	$('body').on('click','#kGoodsToIndex',function(){
//		alert("即将返回首页...");
		window.location.href = "index.html";
	});

})