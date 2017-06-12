define([
    'jquery',
    'app/module/validate',
    'app/module/loading',
    'app/interface/userCtr',
    'app/util/dialog'
], function ($, Validate, loading, userCtr, dialog) {
    var tmpl = __inline("index.html");
    var defaultOpt = {};
    var first = true;

    function _changePwd(){
        loading.createLoading("设置中...");
        userCtr.changePwd({
            "oldLoginPwd": $("#chane-pwd-old-password").val(),
            "newLoginPwd": $("#chane-pwd-new-password").val()
        }).then(function(){
            loading.hideLoading();
            obj.hideCont(defaultOpt.success);
        }, function(msg){
            defaultOpt.error && defaultOpt.error(msg || "手机号修改失败");
        });
    }
    function _showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    }
    var obj = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#changePwdModuleWrap");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").html(defaultOpt.title);
            var that = this;
            if(first){
                wrap.find(".right-left-cont-back")
                    .on("click", function(){
                        obj.hideCont(defaultOpt.hideFn);
                    });
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
                $("#chane-pwd-btn")
                    .on("click", function(){
                        if($("#change-pwd-form").valid()){
                            _changePwd();
                        }
                    });
                $("#change-pwd-form").validate({
                    'rules': {
                        "chane-pwd-old-password": {
                            required: true,
                            maxlength: 16,
                            minlength: 6,
                            isNotFace: true
                        },
                        "chane-pwd-new-password": {
                            required: true,
                            maxlength: 16,
                            minlength: 6,
                            isNotFace: true
                        },
                        "chane-pwd-new-confirm-password": {
                            equalTo: "#chane-pwd-new-password"
                        }
                    }
                });
            }

            first = false;
            return this;
        },
        hasCont: function(){
            if(!$("#changePwdModuleWrap").length)
                return false
            return true;
        },
        showCont: function (mobile){
            if(this.hasCont()){
                var wrap = $("#changePwdModuleWrap");
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
                var wrap = $("#changePwdModuleWrap");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                    func && func();
                    $("#chane-pwd-old-password").val("");
                    $("#chane-pwd-new-password").val("");
                    $("#chane-pwd-new-confirm-password").val("");
                    wrap.find("label.error").remove();
                });
            }
            return this;
        }
    }
    return obj;
});
