define([
    'app/controller/base',
    'app/interface/userCtr',
    'app/module/bindMobile/bindMobile',
    'app/module/changeMobile/changeMobile',
], function(base, userCtr ,BindMobile ,ChangeMobile) {
	var flag = 0;//0为绑定手机号，1为修改手机号
    init();
	
	function init(){
		base.showLoading();
		getUser(true);
		addListener();
		BindMobile.addMobileCont({
            success: function(res) {
            	$("#mobileTxt").text("修改手机号");
            },
            hideFn: function() {
            },
            error: function(msg) {
            },
            hideBack: 0
        });
		ChangeMobile.addMobileCont({
            success: function(res) {
            },
            hideFn: function() {
            },
            error: function(msg) {
            },
            hideBack: 0
        });
	}
	
	// 获取用户详情
    function getUser(refresh) {
        return userCtr.getUserInfo(refresh)
            .then(function(data) {
            	if(data.mobile){
            		$("#mobileTxt").text("修改手机号");
            		flag = 1
            	}else{
            		$("#mobileTxt").text("绑定手机号");
            		flag = 0
            	}
            	base.hideLoading();
            });
    }
    
    function addListener(){
    	$("#mobile").click(function(){
    		if(flag==0){//绑定手机号
    			BindMobile.showMobileCont();
    		}else{
    			ChangeMobile.showMobileCont();
    		}
    	})
    }
})
