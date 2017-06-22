define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Handlebars, serviceCtr) {
	
    init();
    // 初始化页面
    function init() {
        addListener();
    }
    
    function addGrouping(name,refresh){
        return serviceCtr.addGrouping(name, refresh)
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
    			var name = $("#name").val()
	        	base.showLoading();
	        	addGrouping(name,true);
    		}
    	})
    	
    }
});
