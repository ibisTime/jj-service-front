define([
    'jquery',
    'app/module/validate',
    'app/module/loading',
    'app/interface/userCtr',
    'app/module/smsCaptcha'
], function ($, Validate, loading, userCtr, smsCaptcha) {
    var tmpl = __inline("index.html");
    var defaultOpt = {};
    var smsInstance;
    var first = true;

    function bindMobile(){
        loading.createLoading("绑定中...");
        userCtr.bindMobile({
            "mobile": $("#bind-mobile").val(),
            "smsCaptcha": $("#bind-smsCaptcha").val()
        }).then(function(res){
            loading.hideLoading();
            BMobile.hideCont(defaultOpt.success);
        }, function(){
            smsInstance && smsInstance.clearTimer();
            defaultOpt.error && defaultOpt.error(res.msg || "手机号绑定失败");
        });
    }

    var BMobile = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#bindMobileWrap");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").html(defaultOpt.title);
            var that = this;
            if(first){
                $("#bind-mobile-back")
                    .on("click", function(){
                        BMobile.hideCont(defaultOpt.hideFn);
                    });
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
                $("#bind-mobile-btn")
                    .on("click", function(){
                        if($("#bind-mobile-form").valid()){
                            bindMobile();
                        }
                    });
                $("#bind-mobile-form").validate({
                    'rules': {
                        "bind-smsCaptcha": {
                            sms: true,
                            required: true
                        },
                        "bind-mobile": {
                            required: true,
                            mobile: true
                        }
                    }
                });
                smsInstance = smsCaptcha.init({
                    checkInfo: function () {
                        return $("#bind-mobile").valid();
                    },
                    bizType: "805153",
                    id: "bind-getVerification",
                    mobile: "bind-mobile"
                });
            }

            first = false;
            return this;
        },
        hasCont: function(){
            if(!$("#bindMobileWrap").length)
                return false
            return true;
        },
        showCont: function (){
            if(this.hasCont()){
                var wrap = $("#bindMobileWrap");
                wrap.css("top", $(window).scrollTop()+"px");
                wrap.show().animate({
                    left: 0
                }, 200, function(){
                    defaultOpt.showFun && defaultOpt.showFun();
                });

            }
            return this;
        },
        hideCont: function (func){
            if(this.hasCont()){
                var wrap = $("#bindMobileWrap");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                    func && func($("#bind-mobile").val());
                    $("#bind-mobile").val("");
                    $("#bind-smsCaptcha").val("");
                    wrap.find("label.error").remove();
                });
            }
            return this;
        }
    }
    return BMobile;
});
