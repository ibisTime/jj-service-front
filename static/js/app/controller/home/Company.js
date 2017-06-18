define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/module/showInMap',
    'swiper'
], function(base, Foot, Handlebars, serviceCtr, showInMap, Swiper) {
    var companyTmpl = __inline('../../ui/home_company.handlebars');
    var companyCode = base.getUrlParam("code"), groupCode,qfType;

    init();
    // 初始化页面
    function init() {
        if(!companyCode){
            base.showMsg("未传入公司编号");
            return;
        }
        Foot.addFoot(0);
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
    // 列表查询分组
    function getGroupList(refresh){
        return serviceCtr.getPageGroup({
            start: 1,
            limit: 10000
        }, refresh)
            .then((data) => {
            	var html = "";
                if(data.list.length){
                    data.list.forEach(function(d, i){
                    	html+='<li class="am-radio" data-code="'+d.code+'"><p class="fl">'+d.name+'</p><i class="fr"></i></li>'
                    })
                }
                $("#grouping ul").html(html)
                base.hideLoading();
                $("#choseDialog").removeClass("hidden");
            }, () => {});
    }
    // 公司详情
    function getCompany(){
        return serviceCtr.getCompany(companyCode)
            .then((data) => {
            	qfType = data.qualifyType;
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
        	base.showLoading();
        	
        	var me = $(this),
        	focusCode = me.attr("data-code");
        	
        	// 取消关注
            if(focusCode){
                serviceCtr.unAttentionComp(focusCode)
                    .then(() => {
                        $("#compContent .am-button").attr("data-code", "").find("span").text("关注");
                        
                    	base.hideLoading();
                    }).catch(() => {});
            }else{
        		//关注
           		getGroupList();
            }
        })
        
        $("#grouping").on("click","ul li",function(){
        	if($(this).hasClass("am-radio-active")){
    			$(this).removeClass("am-radio-active");
    		}else{
    			$(this).siblings("li").removeClass("am-radio-active");
    			$(this).addClass("am-radio-active");
    		}
        })
        
        //分组弹窗-取消
        $("#cancel").click(function(){
        	$("#choseDialog").addClass("hidden");
        	$("#grouping ul").empty()
        })
        
        //分组弹窗-确认
        $("#confirm").click(function(){
            var focusCode = $("#compContent .am-button").attr("data-code");
            
        	base.showLoading();
        	
            serviceCtr.attentionComp({
                companyCode: companyCode,
                groupCode: $(".am-radio-active").attr("data-code")
            }, true).then((data) => {
            	
                $("#compContent .am-button").attr("data-code", data.code).find("span").text("取消关注");
                
                base.hideLoading();
                $("#choseDialog").addClass("hidden");
    			$("#grouping ul").empty();
            }, () => {});
        	
        })
        
        //显示地址
        $("#compContent").on("click", ".comp_top_dw", function(){
            var me = $(this);
            showInMap.addMap({
                lng: me.attr("data-lng"),
                lat: me.attr("data-lat")
            }).showMap();
        });
        // 经典案例
        $("#jdal").on("click", function(){
            location.href = `./caseList.html?code=${companyCode}&qfType=${qfType}`;
        });
    }
});
