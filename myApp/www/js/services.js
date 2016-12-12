angular.module("app.services",[]).service('move',function(){
	var bar=document.getElementById("moveBar");
	var bart=document.getElementById("addressWay");
	var gn=document.getElementsByClassName("gN")[0];
	var wg=document.getElementsByClassName("wG")[0];
	var barWidth=gn.offsetWidth;
	this.MoveLeft=function(){
		bar.style.left="0px";
		gn.style.color="blue";
		wg.style.color="#000";
		
	};
	this.MoveRight=function(){
		bar.style.left=barWidth+"px";
		wg.style.color="blue";
		gn.style.color="#000";
	}
	this.scrollmove=function(){
		return bart.offsetTop;
	}
}).service('getDate',function(){
	this.get=function(){
		var date=new Date();
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		var day=date.getDate();
		var week=date.getDay();
		switch(week){
			case 0: week="星期日";
			break;
			case 1: week="星期一";
			break;
			case 2: week="星期二";
			break;
			case 3: week="星期三";
			break;
			case 4: week="星期四";
			break;
			case 5: week="星期五";
			break;
			case 5: week="星期六";
			break;
		}
		var obj={};
		obj.year=year;
		obj.month=month;
		obj.day=day;
		obj.week=week;
		return obj;
	}
}).service("address",function($http,$q,$rootScope){
	return {
		get:function(){
			navigator.geolocation.getCurrentPosition(function (data) {
				var coords = data.coords;
				// 获取纬度
				var latitude = coords.latitude;
				// 获取经度
				var longitude = coords.longitude;
				var url='http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=39.983424,116.322987&output=json&pois=1&ak=eqeHYHgBuQzBGEbRc75pYgN76tZdD4O8';
        		var map = new BMap.Map("allmap");
				var point = new BMap.Point(longitude,latitude);
				var gc = new BMap.Geocoder();
				gc.getLocation(point, function(rs){
				   var addComp = rs.addressComponents;
				   $rootScope.address=addComp.city;
				   $rootScope.$apply();
				}); 
			})
		}
	}
}).service("localStorage",function(){
	this.get=function(str){
		return JSON.parse(localStorage.getItem(str));
	};
	this.set=function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	};
	this.remove=function(index,arr){
		return arr.splice(index,1);
	};
	this.removeC=function(str){
		localStorage.removeItem(str);
	}

}).service('register',function(){
	this.check=function(tel){
		var reg=/^1[0-9]{10}$/g;
		var flag=false;
		if(!reg.test(tel)){
			console.log(22);
			alert("号码格式不对");
			flag=true;
		}else{
			flag=false;
		}
		return flag;
	};
	this.produce=function(){
		
		var str="";
		while(str.length<4){
			var num=Math.floor(Math.random()*76)+48;
			if(num>=48&&num<=57||num>=65&&num<=90||num>=97&&num<=122){
	           str=str.concat(String.fromCharCode(num));			
			   
			}
		}
		return str;
	}
})
