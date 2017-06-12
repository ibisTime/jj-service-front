define([
    'jquery',
    'app/interface/generalCtr',
    'app/util/dialog'
], function ($, generalCtr, dialog) {
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
    function initSms(opt){
        this.options = $.extend({}, this.defaultOptions, opt);
        this.timer = null;
        var _self = this;
        $("#" + this.options.id).off("click")
            .on("click", function() {
                _self.options.checkInfo() && _self.handleSendVerifiy();
            });
    }
    initSms.prototype.defaultOptions = {
        id: "getVerification",
        mobile: "mobile",
        checkInfo: function () {
            return $("#" + this.options.mobile).valid();
        },
        sendCode: '805904'
    };
    initSms.prototype.handleSendVerifiy = function() {
        var verification = $("#" + this.options.id);
        if(verification.hasClass("am-button-disabled")){
            return;
        }
        verification.addClass("am-button-disabled");
        var _span = verification.find('span');

        generalCtr
            .sendCaptcha($("#" + this.options.mobile).val(), this.options.bizType)
            .then(() => {
                var i = 60;
                this.timer = setInterval(() => {
                    _span.text(i-- + "s");
                    if(i <= 0){
                        clearInterval(this.timer);
                        _span.text("获取验证码");
                        verification.removeClass("am-button-disabled");
                    }
                }, 1e3);
            }, (msg) => {
                this.options.errorFn && this.options.errorFn();
                _span.text("获取验证码");
                verification.removeClass("am-button-disabled");
            });
    }
    initSms.prototype.clearTimer = function() {
        if(this.timer){
            clearInterval(this.timer);
            $("#" + this.options.id)
                .removeClass("am-button-disabled")
                .find('span').text("获取验证码");
        }
    }
    return {
        init: (options) => new initSms(options)
    }
});
