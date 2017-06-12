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
    function changeMobile(){
        loading.createLoading("修改中...");
        userCtr.changeMobile({
            "newMobile": $("#change-mobile").val(),
            "smsCaptcha": $("#change-smsCaptcha").val()
        }).then(function(){
            loading.hideLoading();
            CMobile.hideCont(defaultOpt.success);
        }, function(msg){
            smsInstance && smsInstance.clearTimer();
            defaultOpt.error && defaultOpt.error(msg || "手机号修改失败");
        });
    }
    var CMobile = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#changeMobileWrap");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").html(defaultOpt.title);
            var that = this;
            if(first){
                $("#change-mobile-back")
                    .on("click", function(){
                        CMobile.hideCont(defaultOpt.hideFn);
                    });
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
                $("#change-mobile-btn")
                    .on("click", function(){
                        if($("#change-mobile-form").valid()){
                            changeMobile();
                        }
                    });
                $("#change-mobile-form").validate({
                    'rules': {
                        "change-smsCaptcha": {
                            sms: true,
                            required: true
                        },
                        "change-mobile": {
                            required: true,
                            mobile: true
                        }
                    }
                });
                smsInstance = smsCaptcha.init({
                    checkInfo: function () {
                        return $("#change-mobile").valid();
                    },
                    bizType: "805047",
                    id: "change-getVerification",
                    mobile: "change-mobile"
                });
            }
            first = false;
            return this;
        },
        hasCont: function(){
            if(!$("#changeMobileWrap").length)
                return false
            return true;
        },
        showCont: function (){
            if(this.hasCont()){
                var wrap = $("#changeMobileWrap");
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
                var wrap = $("#changeMobileWrap");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                    func && func($("#change-mobile").val());
                    $("#change-mobile").val("");
                    $("#change-smsCaptcha").val("");
                    // $("#change-trade-pwd").val("");
                    wrap.find("label.error").remove();
                });
            }
            return this;
        }
    }
    return CMobile;
});
