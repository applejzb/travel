app.controller('ctrlHome',function($http,$scope,$ionicSlideBoxDelegate,$timeout){
		$scope.showR = true;
		$scope.list=[];
		$http.get('json/slideBox.json').success(function(res){
			$scope.list=res;
			$ionicSlideBoxDelegate.update();
			//让设备循环播放
			//$ionicSlideBoxDelegate._instances[0]获取到当前的元素
			$ionicSlideBoxDelegate._instances[0].loop(true);
		})
		$scope.goTo=function(i){
			$ionicSlideBoxDelegate.$getByHandle('slidebox0').slide(i);
		}
		$scope.homes=[];
		
		$http.get('json/list.json').success(function(res){
			
			$scope.homes=res.slice(0,5);
//			$ionicSlideBoxDelegate.update();
		})
		var i=2;
		$scope.getDataH = function () {
			$timeout(function(){
				$http.get("json/list.json").success(function (result) {
					var start=5*(i-1);
					var end=5*i;
					var res=result.slice(start,end)
					$scope.homes=$scope.homes.concat(res);
					$scope.$broadcast("scroll.infiniteScrollComplete"); // 通知框架数据已加载完毕
					if(res.length==0){
						$scope.showR=false;
						$scope.loadFG=true;
					}else{
						i++;
					}
				});
			},2000);
		};
		$scope.scrollH=function(){
			$scope.$apply(function(){
				$scope.showR=true;	
			});
		}
		
		
		
		//调用扫二维码的方法
		$scope.scanStart = function () {
		cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          console.log("We got a barcode\n" +
		                "Result: " + result.text + "\n" +
		                "Format: " + result.format + "\n" +
		                "Cancelled: " + result.cancelled);
		      },
		      function (error) {
		          console.log("Scanning failed: " + error);
		      },
		      {
		          "preferFrontCamera" : true, // iOS and Android
		          "showFlipCameraButton" : true, // iOS and Android
		          "prompt" : "Place a barcode inside the scan area", // supported on Android only
		          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
		          "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
		      }
   			);
		};
		
}).controller('ctrlAddress',function($scope,$http,move,$ionicScrollDelegate){
	$scope.list=[];
	
	$scope.inlands=function(){
		move.MoveLeft();
		$http.get("json/destination.json").success(function(res){
			$scope.list=res.inland;
		}).error(function(err){
			alert(err);
		})
	}
	$scope.foreigns=function(){
		move.MoveRight();
		$http.get("json/destination.json").success(function(res){
			$scope.list=res.foreign;
		}).error(function(err){
			alert(err);
		})
	}
	$scope.inlands();
	
}).controller('ctrlFind',function($scope,$http,$ionicSlideBoxDelegate,$ionicScrollDelegate,$timeout){
	$scope.list=[];
	$scope.loadFG=false;
	$http.get('json/find.json').success(function(res){
		$scope.list=res.slice(0,7);
	}).error(function(err){
		alert(err);
	})
	$scope.showR=true;
	$scope.getData = function () {
		$timeout(function(){
			$http.get("json/find.json").success(function (result) {
				$scope.list=$scope.list.concat(result);
				$scope.$broadcast("scroll.infiniteScrollComplete"); // 通知框架数据已加载完毕
				if(result.length==0){
					$scope.showR=false;
					$scope.loadFG=true;
				}
			});			
		},2000)
	};
	$scope.scrollC=function(){
		$scope.$apply(function(){
			$scope.showR=true;	
		});
	}
	//监控滚动条滚动的位置
	$scope.showTop=false;
	
	$scope.scrollBar=function(){
		if($ionicScrollDelegate.getScrollPosition().top>1000){
			$scope.showTop=true;
		}else{
			$scope.showTop=false;
		}
		$scope.$apply();
	}
	var btnW=document.getElementById("moveSlideBar").offsetWidth;
	$scope.isTrue=true;
	$scope.goAll=function(){
		$ionicSlideBoxDelegate.slide(0);
		$scope.progressLeft = 0 + 'px';
		$scope.progressTime="0.3s";
		$scope.isTrue=true;
	}
	$scope.goLocal=function(){
		$ionicSlideBoxDelegate.slide(1);
		$scope.progressLeft = btnW + 'px';
		$scope.progressTime="0.3s";
		$scope.isTrue=false;
	}
	$scope.progressLeft="0px";
	$scope.progressTime="0s";
	var start=0;
	var left=0;
	var startLeft=left;
	
	 $scope.$watch(function () {
            return left;
        }, function () {
        	if(left==0){
        		$scope.isTrue=true;
        	}else{
        		$scope.isTrue=false;
        	}
            $scope.progressLeft = left + 'px';
        });

	$scope.onTouch=function(evt){
		 startX=evt.gesture.center.pageX;
		 startLeft=parseInt($scope.progressLeft);
		 console.log(left)
//		 $scope.progressTime="0.3s";
	}
	
	$scope.onDrag=function(evt){
		moveX=evt.gesture.center.pageX;
		left=-(moveX-startX)*btnW/(evt.target.offsetWidth)+startLeft;
		
	}
	$scope.onRelease=function(evt){
		endx=evt.gesture.center.pageX;
		$scope.progressTime="0.3s";
		var index=$ionicSlideBoxDelegate.currentIndex();
		left=index*btnW;
		
	}
	//touchmove可以用来监控手指的滑动
//	document.addEventListener("touchmove", function(){
//		if($ionicScrollDelegate.getScrollPosition().top>1000){
//			$scope.showTop=true;
//		}else{
//			$scope.showTop=false;
//		}
//		$scope.$apply();
//	}, false);
	$scope.goTop=function(){
		$ionicScrollDelegate.scrollTop(true);
	}
}).controller('ctrlMy',['localStorage','$scope',function(localStorage,$scope){
	$scope.isUser=false;
	$scope.loginMessage="你还没有登录,点击登录注册>";
	var userName=localStorage.get("userName");
	$scope.user="";
	if(userName!=null){
		$scope.isUser=true;
		$scope.user=userName;
		$scope.headIcon="img/user.jpg";
	}else{
		$scope.headIcon="img/user.png";
	}
	
	
	
	
}]).controller('ctrlDetail',function($scope,$http,$ionicSlideBoxDelegate,$stateParams,$ionicHistory,getDate){
	$scope.goFind=function(){
		$ionicHistory.goBack();
	}
    $scope.time=getDate.get();
    $scope.isPtitle=false;
    $scope.showMore=function(){
    	if($scope.isPtitle){
    		$scope.isPtitle=false;
    	}else{
    		$scope.isPtitle=true;
    	}
    }
    $scope.obj={};
    var id=$stateParams.id;
    
    $http.get('json/product.json').success(function(res){
	    	$scope.obj=(res.filter(function(item){
	    		return item.id==id;
	    	}))[0];
	    	 $scope.num=$scope.obj.slideImg.length;
	    	$ionicSlideBoxDelegate.update();
	    	$ionicSlideBoxDelegate._instances[0].loop(true);
	    }).error(function(err){
		alert(err);
	}); 
}).controller('ctrlLogin',['localStorage','$scope','$state','$ionicHistory',function(localStorage,$scope,$state,$ionicHistory){
	$scope.goback=function(){
		$ionicHistory.goBack();
	}
	$scope.obj={};
	$scope.regexUser=/^[a-zA-Z0-9]&/gi;
	$scope.login=function(user,psd){
		if(user==undefined||psd==undefined){
			alert("请输入用户名和密码")
			return false;
		}
		localStorage.set("userName",user);
		localStorage.set("passdword",psd);
		$state.go("my");
	}
	
}]).controller('ctrlDetailAddress',function($scope,$http,$ionicHistory){
	$http.get('json/address.json').success(function(res){
		$scope.adr=res;
	}).error(function(err){
		alert(err);
	})
	$scope.goHome=function(){
		$ionicHistory.goBack();
	}
}).controller('ctrlSearch',function($scope,$http,$ionicHistory){
	$scope.goFind=function(){
		$ionicHistory.goBack();
	}
	$scope.list=[];
	$http.get('json/hotS.json').success(function(res){
		$scope.list=res;
	}).error(function(err){
		alert(err);
	})
}).controller('ctrlList',function($scope,$http){
	
}).controller('ctrlAllAddress',function($scope,$http,$timeout,$ionicBackdrop){
	$scope.list=[];
	$scope.hots=false;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=false;$scope.vises=false;
	$scope.$on("ng-click",function($event){
		console($event.target)
	})
	$scope.hot=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=true;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=false;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[0].hot;	
			})
		},500)
	}
	$scope.circum=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=true;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=false;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[1].circum;	
			})
		},500)
	}
	$scope.inland=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=false;$scope.inlands=true;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=false;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[2].inland;	
			})
		},500)
	}
	$scope.leaveC=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=true;$scope.cruises=false;$scope.tickers=false;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[3].leaveC;	
			})
		},500)
	}
	$scope.cruise=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=true;$scope.tickers=false;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[4].cruise;	
			})
		},500)
	}
	$scope.ticker=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=true;$scope.vises=false;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[5].ticker;	
			})
		},500)
	}
	$scope.vise=function(){
		$scope.list=[];
		$ionicBackdrop.retain();
		$scope.hots=false;$scope.circums=false;$scope.inlands=false;$scope.leaveCs=false;$scope.cruises=false;$scope.tickers=false;$scope.vises=true;
		$timeout(function(){
			$http.get('json/bourn.json').success(function(res){
				$ionicBackdrop.release();
				$scope.list=res[6].vise;	
			})
		},500)
	}
	$scope.hot();
}).controller('ctrlPackaged',function($scope,$http,$timeout){
	$scope.list=[];
	$scope.loadFG=false;
	$http.get('json/find.json').success(function(res){
		$scope.list=res.slice(0,7);
	}).error(function(err){
		alert(err);
	})
	$scope.showR=true;
	$scope.getData = function () {
		$timeout(function(){
			$http.get("json/find.json").success(function (result) {
				$scope.list=$scope.list.concat(result);
				$scope.$broadcast("scroll.infiniteScrollComplete"); // 通知框架数据已加载完毕
				if(result.length==0){
					$scope.showR=false;
					$scope.loadFG=true;
				}
			});
		},2000);
	};
	$scope.scrollC=function(){
		$scope.$apply(function(){
			$scope.showR=true;	
		});
	}
}).controller('ctrlPlane',function($scope,$http){
	$scope.showP=true;  
	$scope.cityData = {};
	$scope.cityData.startCity="";
	$scope.cityData.endCity="";
	$scope.go=function(){
		$scope.showP=true;
	}
	$scope.goBack=function(){
		$scope.showP=false;
	}
	$scope.exchange=function(start,end){
		$scope.cityData.startCity=end;
		$scope.cityData.endCity=start;
		console.log($scope.startCity);
		console.log($scope.endCity);
	}
}).controller('ctrlProduct',function($scope,$http,$ionicSlideBoxDelegate,$timeout,localStorage,$stateParams,$ionicHistory,getDate){
	$scope.isCollect=false;
	
	$scope.goFind=function(){
		$ionicHistory.goBack();
	}
    $scope.time=getDate.get();
    $scope.isPtitle=false;
    $scope.showMore=function(){
    	if($scope.isPtitle){
    		$scope.isPtitle=false;
    	}else{
    		$scope.isPtitle=true;
    	}
    }
    $scope.obj={};
    var id=$stateParams.id;

    $http.get('json/product.json').success(function(res){
	    	$scope.obj=(res.filter(function(item){
	    		return item.id==id;
	    	}))[0];
	    	 $scope.num=$scope.obj.slideImg.length;
	    	$ionicSlideBoxDelegate.update();
	    	$ionicSlideBoxDelegate._instances[0].loop(true);
	    }).error(function(err){
		alert(err);
	}); 
	$scope.collect=function(message,ImgUrl,price){
		$scope.isCollect=true;
		
		var newArr=[]
		var collect=localStorage.get('collect');
		if(collect==null){
			collect=[];
			localStorage.set('collect',collect);
		}else{
			newArr=collect.filter(function(item){
				return item.id==id;
			})
		}
		if(newArr.length!=0){
			alert("收藏夹中已经存在");
		}else{
			$timeout(function(){
				$scope.isCollect=false;
			},500)
			var obj={};
		    obj.message=message;
		    obj.urlImg=ImgUrl[0];
		    obj.price=price;
		    obj.id=id;
		    collect.push(obj);
		    localStorage.set('collect',collect)
		}
	}
	
	
	$scope.Indent=function(message,ImgUrl,price){
		var newArr=[]
		var Indent=localStorage.get('Indent');
		var flag=false;
		if(Indent==null){
			Indent=[];
			localStorage.set('Indent',Indent);
		}else{
			angular.forEach(Indent,function(value,key){
				if(value.id==id){
					value.num++;
					flag=true;
				}
			})
		}
		if(!flag){
			var obj={};
		    obj.message=message;
		    obj.urlImg=ImgUrl[0];
		    obj.price=price;
		    obj.id=id;
		    obj.num=1;
		    Indent=localStorage.get('Indent');
		    Indent.push(obj);
		}
		localStorage.set('Indent',Indent)
	}
	
	
}).controller("ctrlCollect",function($scope,localStorage,$ionicHistory){
	$scope.list=localStorage.get("collect");
	$scope.goMy=function(){
		$ionicHistory.goBack();
	}
	//删除
	$scope.onDelete=function(){
		var id=this.collect.id;
//		console.log(id);
		var arr=localStorage.get("collect");
		var newArr=arr.filter(function(item){
			return item.id!=id;
		})
		localStorage.set("collect",newArr);
		$scope.list=localStorage.get("collect");
	}
}).controller("ctrlIndent",function($scope,localStorage,$ionicHistory){
	$scope.list=localStorage.get("Indent");
	$scope.goMy=function(){
		$ionicHistory.goBack();
	}
	$scope.add=function(){
		var arr=localStorage.get("Indent");
		var id=this.indent.id;
		angular.forEach(arr,function(value,key){
			if(value.id==id){
				value.num++;
			}
		})
	    localStorage.set("Indent",arr);
	    $scope.list=localStorage.get("Indent");
	}
	$scope.subtract=function(){
		var arr=localStorage.get("Indent");
		var id=this.indent.id;
		angular.forEach(arr,function(value,key){
			if(value.id==id){
				value.num--;
				if(value.num==0){
					arr.splice(key,1);
				}
			}
		})
	    localStorage.set("Indent",arr);
	    $scope.list=localStorage.get("Indent");
	}
}).controller("ctrlRegister",function($scope,$timeout,register,$state,$ionicHistory){
	$scope.goBack=function(){
		$ionicHistory.goBack();
	}
	$scope.goLogin=function(yz){
		if(yz.toUpperCase()!=$scope.yzm.toUpperCase()){
			alert("验证码不正确");
		}else{
			$state.go("login");
		}
	}
	$scope.obj={};
	$scope.disable=false;
	$scope.getYz=function(tel){
	    $scope.disable=true;
		if(tel==""||tel==undefined){
			alert("请输入号码")
		}
		else{
			$scope.yzm=register.produce();
			$timeout(function(){
				$scope.disable=false;
				alert($scope.yzm);
			},2000)
		}
	}
	$scope.blur=function(tel){
		var flag=register.check(tel);
		$scope.disable=flag;
	}
}).controller("ctrluserManger",function($scope,localStorage,$ionicHistory){
	$scope.goMy=function(){
		$ionicHistory.goBack();
	}
	$scope.hasUser=true;
	$scope.username=localStorage.get("userName");
	if($scope.username==undefined){
		$scope.hasUser=false;
	}
	
	$scope.removeCount=function(){
		$scope.hasUser=false;
		localStorage.removeC("userName");
		localStorage.removeC("password");
	}
})



app.run(function ($rootScope, $state, $ionicTabsDelegate,$http,address) {
	$rootScope.getFocus=function(){
		$ionicTabsDelegate.showBar(false);
	}
	$rootScope.blur=function(){
		$ionicTabsDelegate.showBar(true);
	}
    $rootScope.$on('$ionicView.beforeEnter', function () {
    	console.log($state.current.name);
        if ($state.current.name === 'yDetail') {
            $ionicTabsDelegate.showBar(false);
        } else if($state.current.name === 'login') {
            $ionicTabsDelegate.showBar(false);
        } else if($state.current.name === 'detailAddress') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'search') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'Packaged') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'plane') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'product') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'collect') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'indent') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'register') {
            $ionicTabsDelegate.showBar(false);
        }else if($state.current.name === 'userManger') {
            $ionicTabsDelegate.showBar(false);
        }else {
            $ionicTabsDelegate.showBar(true);
        }
		
    });
    $rootScope.address="北京";
    
    var app12 = {
	    // Application Constructor
	    initialize: function() {
	        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	    },
	    onDeviceReady: function() {
	    	address.get();
//	    	    alert(11);
//	        	navigator.geolocation.getCurrentPosition(function(position){
//	        		var lat=position.coords.latitude;//维度
//	        		var log=position.coords.longitude;//经度
//	        		var url="http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location="+lat+","+log+"&output=json&pois=1&ak=eqeHYHgBuQzBGEbRc75pYgN76tZdD4O8";
//	        		var map = new BMap.Map("allmap");
//					var point = new BMap.Point(log,lat);
//					var gc = new BMap.Geocoder();
//					alert("aaaaaaa")
//					gc.getLocation(point, function(rs){
//					   alert("bbbbb")
//					   var addComp = rs.addressComponents;
//					   $rootScope.address=addComp.city;
//					   $rootScope.$apply();
//					});        		
//	        	},function(err){
//	        		alert("cccc");
//	        		alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
//	        	})
	    },  
	};
	app12.initialize();
});