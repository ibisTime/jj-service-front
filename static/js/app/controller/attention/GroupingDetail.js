define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Foot, Handlebars, serviceCtr) {
	var gCode = base.getUrlParam("code");
    var companyTmpl = __inline('../../ui/home_list.handlebars');

    init();
    // 初始化页面
    function init() {
        Foot.addFoot(1);
        base.showLoading();
        $.when(
        	getDetailGrouping(),
        	getAttentionList()
        ).then(() => {
                base.hideLoading();
            }, () => {});
        addListener();
    }
    
    //分组详情
    function getDetailGrouping(refresh){
    	return serviceCtr.detailGrouping(gCode, refresh)
            .then((data) => {
            	$("#name").val(data.name)
            }, () => {});
    }
    
    //修改分组名
    function editGrouping(params,refresh){
    	return serviceCtr.editGrouping(params, refresh)
            .then((data) => {
                base.hideLoading();
            }, () => {});
    }
    
    // 列表查询关注
    function getAttentionList(refresh){
        return serviceCtr.getAttentionList(gCode, refresh)
            .then((data) => {
                if(data.length){
                    $("#content").html(companyTmpl({items: data}));
                }
            }, () => {});
    }
    
    function addListener() {
    	$("#btn-editGrouping").click(function(){
        	base.showLoading();
    		var editConfig = {
    			code:gCode,
    			name: $("#name").val()
    		}
    		editGrouping(editConfig,true);
    	})
    	
    	$("#addFollow").click(function(){
    		location.href=`./grouping-list.html?code=${gCode}`;
    	})
    }
});
