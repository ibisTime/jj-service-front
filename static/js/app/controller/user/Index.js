define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/interface/userCtr',
    'app/interface/generalCtr',
    'app/module/judgeBindMobile/judgeBindMobile',
], function(base, Foot, scroll, userCtr, generalCtr,JudgeBindMobile) {
    var myScroll;

    init();

    function init() {
        Foot.addFoot(3);
        initIScroll();
        base.showLoading();
        getUser(true).then(() => base.hideLoading());
        // 获取意向数
        getIntentionAmount();
        getTel();
        addListener();
        
//      $("#demo").click(function(){
//      	userCtr.getUserInfo(true)
//                  .then(function(res) {
//                      // 如果未绑定手机号，则绑定
//                          JudgeBindMobile.addCont({
//                              avatar: res.userExt? res.userExt.photo:"",
//                              nickname: res.nickname
//                          }).showCont();
//                  }, function(){
////                      base.goBackUrl("/", true);
//                  });
//      })
        
    }
    // 获取用户详情
    function getUser(refresh) {
        return userCtr.getUserInfo(refresh)
            .then(function(data) {
                $("#nickname").html(data.nickname);
                $("#avatar").attr("src", base.getAvatar(data.userExt?data.userExt.photo:""));
                myScroll.refresh();
            }, () => myScroll.refresh());
    }
    // 获取意向数
    function getIntentionAmount(){

    }
    // 获取服务电话
    function getTel() {
        // return generalCtr.getSysConfig("telephone")
        // .then((data) => {
        // })
    }
    // 初始化iscroll
    function initIScroll() {
        myScroll = scroll.getInstance().getOnlyUpScroll({
            refresh: function() {
                $.when(
                    getUser(true)
                ).then(function() {
                    myScroll.refresh();
                });
            }
        });
    }

    function addListener() {

    }
});
