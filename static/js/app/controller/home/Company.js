define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/module/showInMap',
    'swiper'
], function(base, Handlebars, serviceCtr, showInMap, Swiper) {
    var companyTmpl = __inline('../../ui/home_company.handlebars');
    var companyCode = base.getUrlParam("code"), groupCode;

    init();
    // 初始化页面
    function init() {
        if(!companyCode){
            base.showMsg("未传入公司编号");
            return;
        }
        base.showLoading();
        getCompany(true)
            .then(() => base.hideLoading());
        addListener();
    }
    // 初始化swiper
    function initSwiper(){
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
    }
    // 分页查询入驻公司
    function getCompany(){
        return serviceCtr.getCompany(companyCode)
            .then((data) => {
                var bannerHtml = "";
                var pics = base.getPicArr(data.pic);
                pics.forEach((pic) => {
                    bannerHtml += `<div class='swiper-slide'><img class='wp100' src='${pic}'></div>`;
                });
                $("#swiper .swiper-wrapper").html(bannerHtml);
                initSwiper();
                var companyHtml = $(companyTmpl(data));
                if(data.isFocus == "1"){
                    companyHtml
                        .find(".am-button").attr("data-code", data.focusCode)
                        .find("span").text("取消关注");
                }else{
                    companyHtml
                        .find("am-button").find("span").text("关注");
                }
                $("#compContent").html(companyHtml);
                $("#description").html(data.description);
            }, () => {});
    }
    function addListener() {
        // 关注
        $("#compContent").on("click", ".am-button", function(){
            var me = $(this),
                focusCode = me.attr("data-code");
            // 取消关注
            if(focusCode){
                serviceCtr.unAttentionComp(focusCode)
                    .then(() => {
                        me.attr("data-code", "").find("span").text("关注");
                    }).catch(() => {});
            }else{
                serviceCtr.attentionComp({
                    companyCode,
                    groupCode: "Z201706120143522957"
                }).then((data) => {
                    me.attr("data-code", data.code).find("span").text("取消关注");
                }).catch(() => {});
            }
        })
        //显示地址
        .on("click", ".comp_top_dw", function(){
            var me = $(this);
            showInMap.addMap({
                lng: me.attr("data-lng"),
                lat: me.attr("data-lat")
            }).showMap();
        });
        // 经典案例
        $("#jdal").on("click", function(){
            location.href = `./caseList.html?code=${companyCode}`;
        });
    }
});
