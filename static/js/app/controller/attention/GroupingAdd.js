define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Handlebars, serviceCtr) {
	
	var config = {
		name:""
	}
	
    init();
    // 初始化页面
    function init() {
        addListener();
    }
    
    function addGrouping(refresh){
        return serviceCtr.addGrouping(config, refresh)
            .then((data) => {
        		base.hideLoading();
        		location.href="./grouping.html"
            }, () => {});
    }
    
    function addListener() {
    	
    	
    	$("#btn-addGrouping").click(function(){
    		if(!$("#name").val() || $("#name").val()==""){
    			base.showMsg("请输入新建分组名")
    		}else{
    			config.name = $("#name").val()
	        	base.showLoading();
	        	addGrouping();
    		}
    	})
    	
    }
});
