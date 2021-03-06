define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/interface/generalCtr',
    'app/interface/userCtr'
], function(base, Foot, Handlebars, serviceCtr, generalCtr, userCtr) {
    var companyTmpl = __inline('../../ui/negotiate_item.handlebars');
    var code = base.getUrlParam("code");
    var dictData;
    var config = {
    	serviceCode: code
    }
    
    init();
    
    // 初始化页面
    function init() {
        base.showLoading();
        getDictList();
        addListener();
    }
    
    // 公司详情
    function getCompany(companyCode){
        return serviceCtr.getCompany(companyCode)
            .then((data) => {
            	
                var companyHtml = $(companyTmpl(data));
                
                $("#content").html(companyHtml);
            }, () => {});
    }
    
    //获取意向详情
    function getNegotiateDetail(){
        return serviceCtr.getNegotiateDetail(code)
            .then((data) => {
            	
	        	getUserIdDetail(data.cbIntention.submitter,true),
	        	getCompany(data.cbIntention.companyCode,true),
            	$("#mobile").html(data.cbIntention.intMobile)
            	$("#datetime").html(base.formateDateTime(data.cbIntention.submitDatetime))
            	$("#status").html(base.getDictListValue(data.cbIntention.status,dictData))
            	$("#hzContent").html(data.cbIntention.hzContent);
            	$("#remark").html(data.cbIntention.remark);
                
            }, () => {});
    }
    
    //状态数据字典
    function getDictList(){
    	generalCtr.getDictList("cb_status")
    	.then((data) => {
    		
       		dictData = data;
       		
       		$.when(
	        	getNegotiateDetail()
	        ).then(() => base.hideLoading());
	        
        }, () => {});
    }
    
    // 获取用户详情
    function getUserIdDetail(userId,refresh) {
        return userCtr.getUserIdDetail(userId,refresh)
            .then(function(data) {
            	$("#name").html(data.nickname);
            }, () => {});
    }
    
    function addListener() {
    	
    }
});
