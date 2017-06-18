define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Handlebars, serviceCtr) {
	var gCode = base.getUrlParam("code");
    var companyTmpl = __inline('../../ui/follow_list.handlebars')

    init();
    // 初始化页面
    function init() {
        base.showLoading();
    	getPageGroupList().then(() => {
            base.hideLoading();
        }, () => {});
        addListener();
    }
    
    // 列表查询关注
    function getPageGroupList(refresh){
        return serviceCtr.getPageGroupList({
            start: 1,
            limit: 10000
        }, refresh)
            .then((data) => {
                if(data.list.length){
                    $("#content").html(companyTmpl({items: data.list}));
                }
            }, () => {});
    }
    
    // 列表查询关注
    function moveGrouping(cCode,refresh){
        return serviceCtr.moveGrouping({
            groupCode: gCode,
            code: cCode
        }, refresh)
            .then((data) => {
            	location.href=`./grouping-detail.html?code=${gCode}`
            }, () => {});
    }
    
    function addListener() {
    	$("#content").on("click",".index_content_item",function(){
    		if($(this).children(".am-radio").hasClass("am-radio-active")){
    			$(this).children(".am-radio").removeClass("am-radio-active");
    		}else{
    			$(this).siblings(".index_content_item").children(".am-radio").removeClass("am-radio-active");
    			$(this).children(".am-radio").addClass("am-radio-active");
    		}
    	})
    	
    	$("#btn-addFollow").click(function(){
    		if($(".am-radio-active").attr("data-code")){
    			moveGrouping($(".am-radio-active").attr("data-code"),true)
    		}else{
    			base.showMsg("请选择要添加的企业")
    		}
    		
    	})
    }
});
