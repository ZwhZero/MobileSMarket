//用户登录
function userLogin(){
//	获取用户名和密码
	var uName = $("#lName").val();
	var uPassword = $("#lPassword").val();
	if(uName=="" || uPassword==""){
		alert("用户名和密码不能为空");
	}
	else {
//		console.log(uName,uPassword);
		$.ajax({
			url:"http://localhost:8080/SMarket/user/userLogin?callback=?&myparam=test100",
			type:"post",
			//设置携带cookie信息，使session两次使用id相同
			xhrFields: {  
				withCredentials: true  
			},  
//			contentType: 'application/x-www-form-urlencoded',
//			contentType:"application/json",
			data:{
				"uName":uName,
				"uPassword":uPassword
			},
			dataType:"json",
			success:function (data) {
//				console.log(data);
//				var res = JSON.stringify(data);
				console.log(data[0]);
				console.log(data[0].result);
				if(data[0].result == "true"){
					alert("登录成功");
					window.location.href = "index.html";
				} else{
					alert("用户名或密码错误");
				}
			},
			error:function(res){
//				console.log(res.status);
				var msg = "发生错误：" + JSON.stringify(res);
				console.log(msg);
			}
		});
	}
}

//将form数据转化为json
$.fn.changeJson = function() {
	var j = {};
	var f = this.serializeArray();//{[key1 value1],[key2 value2]}
	$.each(f,function() {
		if(j[this.name]) {
			if(!j[this.name].push) {
				j[this.name] = [j[this.name]];
			}
			j[this.name].push(this.value || '');
		} else {
			j[this.name] = this.value || '';
		}
	});
	return j;
};
function register() {
	var formData = $("#registerForm").changeJson();
//	console.log("传出数据为:" + JSON.stringify(formData));
	$.ajax({
		type:"post",
		url:"http://localhost:8080/SMarket/user/faddUser",
		async:true,
		dataType: "json",
		data: formData,
		success: function(data) {
			if(data.result=="true") {
				alert("注册成功");
				window.location.href = "#loginPage";
			}else {
				alert("注册失败");
			}
		},
		error: function(err) {
			console.log("请求失败:" + err.status);
		}
			
	});
}

//页面元素事件（如：按钮点击）
$(function(){
	//失去焦点时验证用户名是否可用
	$("#rName").blur(function(){
		var inputName = $(this).val();
//		alert(inputName);
		if(inputName == ""){ //判空
			$("#nameCheck").html("用户名不能为空!");
		} else{ //用户名不为空
			$("#nameCheck").html("");
			$.ajax({
				type:"post",
				url:"http://localhost:8080/SMarket/user/fcheckName",
				async:true,
				data:{"inputName" : inputName},
				dataType:"json",
				success: function(data){
					$("#nameCheck").html(data.result);
				},
				error: function(err){
					console.log("加载错误：" + err.status);
				}
			});
		}
	});
	
	//失去焦点时验证密码是否为空
	$("#rPassword").blur(function(){
		var inputPwd = $(this).val();
		if(inputPwd == ""){ //判空
			$("#pwdCheck").html("密码不能为空!");
		} else{ //用户名不为空
			$("#pwdCheck").html("");
		}
	});
	
})