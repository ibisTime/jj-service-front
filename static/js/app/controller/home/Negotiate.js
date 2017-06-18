define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/interface/userCtr'
], function(base, Foot, Handlebars, serviceCtr, userCtr) {
    var companyTmpl = __inline('../../ui/negotiate_item.handlebars');
    var companyCode = base.getUrlParam("comCode");
    var code = base.getUrlParam("code");
    var config = {
    	serviceCode: code
    }
    
    init();
    
    // 初始化页面
    function init() {
        Foot.addFoot(0);
        base.showLoading();
        $.when(
        	getUser(true),
        	getCompany(true)
        ).then(() => base.hideLoading());
        addListener();
    }
    
    // 公司详情
    function getCompany(){
        return serviceCtr.getCompany(companyCode)
            .then((data) => {
            	
                var companyHtml = $(companyTmpl(data));
                
                $("#content").html(companyHtml);
            }, () => {});
    }
    
    // 获取用户详情
    function getUser(refresh) {
        return userCtr.getUserInfo(refresh)
            .then(function(data) {
            	$("#name").val(data.nickname)
            }, () => {});
    }
    
    //提交意向
    function getNegotiate(refresh){
        return serviceCtr.getNegotiate(config,refresh)
            .then(function(data) {
				base.hideLoading();
				location.href="../user/myNegotiate.html"
            }, () => {});
    }
    
    function addListener() {
		$("#btn-sub").click(function(){
			
        	base.showLoading();
			if(!$("#mobile").val()||$("#mobile").val()==""){
				base.hideLoading();
				base.showMsg("请输入联系方式");
			}else if(!$("#hzContent").val()||$("#hzContent").val()=="") {
				base.hideLoading();
				base.showMsg("请输入意向描述");
			}else{
				config.intName = $("#name").val();
				config.intMobile = $("#mobile").val();
				config.hzContent = $("#hzContent").val();
				
				getNegotiate(true)
			}
			
		})
		
    }
});
