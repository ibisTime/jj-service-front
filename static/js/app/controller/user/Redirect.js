define([
    'app/controller/base',
    'app/interface/generalCtr',
    'app/interface/userCtr'
], function(base, generalCtr, userCtr) {
    init();

    function init() {
        var code = base.getUrlParam("code");
        // 第一次没登录进入的页面
        if (!code) {
            base.showLoading();
            getAppID();
            return;
        }
        if (!base.isLogin()) {  // 未登wxLogin录
            base.showLoading("登录中...");
            wxLogin({
                code,
                systemCode: SYSTEM_CODE,
                companyCode: SYSTEM_CODE
            });
        } else {    // 已登陆
            // setTimeout(function() {
            //     base.goBackUrl("../user/index.html");
            // }, 1000);
        }
    }
    // 获取appId并跳转到微信登录页面
    function getAppID() {
        generalCtr.getAppID()
            .then((data) => {
                base.hideLoading();
                if (data.length) {
                    var appid = data[0].password;
                    var redirect_uri = base.getDomain() + "/user/redirect.html";
                    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid +
                        "&redirect_uri=" + redirect_uri + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
                } else {
                    base.showMsg("非常抱歉，微信参数获取失败");
                }
            }, () => {});
    }
    // 微信登录
    function wxLogin(param) {
        userCtr.wxLogin(param)
            .then((data) => {
                base.hideLoading();
                base.setSessionUser(data);
                base.goBackUrl("../user/index.html");
                // userCtr.getUserInfo()
                //     .then((data) => {
                //         base.hideLoading();
                //         // 如果未绑定手机号，则绑定
                //         if (!data.mobile) {
                //             BindMobile.showCont();
                //         } else {
                //             base.goBackUrl("../user/index.html");
                //         }
                //     }, () => {
                //         base.goBackUrl("../user/index.html");
                //     });
            }, () => {});
    }
});
