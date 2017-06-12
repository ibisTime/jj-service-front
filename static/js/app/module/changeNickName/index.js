define([
    'jquery',
    'app/module/validate',
    'app/module/loading',
    'app/interface/userCtr'
], function ($, Validate, loading, userCtr) {
    var tmpl = __inline("index.html");
    var defaultOpt = {};
    var first = true;

    function changeNickName(){
        loading.createLoading("修改中...");
        userCtr.changeNickName({
            "nickname": $("#nicknameChangeName").val()
        }).then(function(){
            loading.hideLoading();
            defaultOpt.defaultName = $("#nicknameChangeName").val();
            CNickName.hideCont(defaultOpt.success);
        }, function(msg){
            defaultOpt.error && defaultOpt.error(msg || "昵称修改失败");
        });
    }
    var CNickName = {
        addCont: function (option) {
            option = option || {};
            defaultOpt = $.extend(defaultOpt, option);
            if(!this.hasCont()){
                var temp = $(tmpl);
                $("body").append(tmpl);
            }
            var wrap = $("#nicknameChangeWrap");
            defaultOpt.title && wrap.find(".right-left-cont-title-name").html(defaultOpt.title);
            var that = this;
            if(first){
                $("#nicknameChangeBack")
                    .on("click", function(){
                        that.hideCont(defaultOpt.hideFn);
                    });
                wrap.find(".right-left-cont-title")
                    .on("touchmove", function(e){
                        e.preventDefault();
                    });
                $("#nicknameChangeBtn")
                    .on("click", function(){
                        if($("#nicknameChangeForm").valid()){
                            changeNickName();
                        }
                    });
                $("#nicknameChangeForm").validate({
                    'rules': {
                        "nicknameChangeName": {
                            required: true,
                            maxlength: 32,
                            isNotFace: true
                        }
                    }
                });
            }

            first = false;
            return this;
        },
        hasCont: function(){
            if(!$("#nicknameChangeWrap").length)
                return false
            return true;
        },
        showCont: function (){
            if(this.hasCont()){
                var wrap = $("#nicknameChangeWrap");
                wrap.css("top", $(window).scrollTop()+"px");
                defaultOpt.defaultName && $("#nicknameChangeName").val(defaultOpt.defaultName);
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
                var wrap = $("#nicknameChangeWrap");
                wrap.animate({
                    left: "100%"
                }, 200, function () {
                    wrap.hide();
                    func && func($("#nicknameChangeName").val());
                    $("#nicknameChangeName").val("");
                    wrap.find("label.error").remove();
                });
            }
            return this;
        }
    }
    return CNickName;
});
