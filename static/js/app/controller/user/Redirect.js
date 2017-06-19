define([
    'app/controller/base',
    'app/util/ajax',
    'app/module/loading/index',
    'app/interface/generalCtr',
    'app/module/judgeBindMobile/judgeBindMobile',
    'app/interface/userCtr'
], function(base, Ajax, loading, generalCtr, JudgeBindMobile, userCtr) {
    init();

    function init() {
        var code = base.getUrlParam("code");
        // 第一次没登录进入的页面
        if (!code) {
            loading.createLoading();
            getAppID();
            return;
        }
        if (!base.isLogin()) {  // 未登录
            loading.createLoading("登录中...");
            wxLogin({
                code: code,
                companyCode: SYSTEM_CODE,
                systemCode: SYSTEM_CODE,
            });
        } else {    // 已登陆
            setTimeout(function() {
                base.goBackUrl("/", true);
            }, 1000);
        }
    }
    // 获取appId并跳转到微信登录页面
    function getAppID() {
         generalCtr.getAppID()
            .then((data) => {
            	
                loading.hideLoading();
                
                if (data.length) {
                    var appid = data[0].password;
                    var redirect_uri = base.getDomain() + "/user/redirect.html";
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid +
                        "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                } else {
                    base.showMsg("非常抱歉，微信参数获取失败");
                }
                    
            },() => {});
    }
    // 微信登录
    function wxLogin(param) {
    	userCtr.wxLogin(param)
            .then((data) => {
            	base.setSessionUser(data);
            	
            	userCtr.getUserInfo(true)
                    .then(function(res) {
                        loading.hideLoading();
                        // 如果未绑定手机号，则绑定
                        if (!res.mobile) {
                            JudgeBindMobile.addCont({
                                avatar: res.userExt ? res.userExt.photo: "",
                                nickname: res.nickname
                            }).showCont();
                        } else {
                            base.goBackUrl("/", true);
                        }
                    }, function(){
                        base.goBackUrl("/", true);
                    });
            }, () => {
            	
                loading.hideLoading();
            })
        
    }
});
