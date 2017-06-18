define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Foot, Handlebars, serviceCtr) {
    var companyTmpl = __inline('../../ui/index_item.handlebars'),
        groupTmpl = __inline('../../ui/attention_index_item.handlebars');

    init();
    // 初始化页面
    function init() {
        Foot.addFoot(1);
        base.showLoading();
        getGroupList()
            .then(() => {
                base.hideLoading();
            }, () => {});
        addListener();
    }

    // 列表查询分组
    function getGroupList(refresh){
        return serviceCtr.getPageGroup({
            start: 1,
            limit: 10000
        }, refresh)
            .then((data) => {
                if(data.list.length){
                    $("#content").html(groupTmpl({items: data.list}));
                }
            }, () => {});
    }
    // 详情查询分组
    function getAttentionList(groupCode){
        return serviceCtr.getAttentionList(groupCode)
            .then((data) => {
                var list = data.map((d) => d.company);
                $("#" + groupCode)
                    .attr("data-fetch", "true")
                    .find(".am-accordion-content-box")
                    .html(companyTmpl({items: list}));
            }, () => {})
    }
    function addListener() {
    	
    	$("#content").on("touchstart", ".am-accordion .am-accordion-item .am-accordion-header", function(e){
	    	e.stopPropagation();
	    	var touches = e.originalEvent.targetTouches[0],
	    		me = $(this);
	    	var left = me.offset().left;
	    	me.data("x",touches.clientX);
	    	me.data("offsetLeft", left);
	    });
	    $("#content").on("touchmove", ".am-accordion .am-accordion-item .am-accordion-header", function(e){
	    	e.stopPropagation();
	    	var touches =  e.originalEvent.changedTouches[0],
	    		me = $(this),
	            ex = touches.clientX,
	            xx = parseInt(me.data("x")) - ex,
	    	    left = me.data("offsetLeft");
	        if( xx > 10 ){
	        	me.css({
	        		"transition": "none",
	        		"transform": "translate3d("+(-xx/2)+"px, 0px, 0px)"
	        	});
	        }else if(xx < -10){
	        	var left = me.data("offsetLeft");
	        	me.css({
	        		"transition": "none",
	        		"transform": "translate3d("+(left + (-xx/2))+"px, 0px, 0px)"
	        	});
	        }
	        
	    });
	    $("#content").on("touchend", ".am-accordion .am-accordion-item .am-accordion-header", function(e){
	    	e.stopPropagation();
	    	var me = $(this);
	        var touches = e.originalEvent.changedTouches[0],
	            ex = touches.clientX,
	            xx = parseInt(me.data("x")) - ex;
	    	if( xx > 50 ){
	    		me.css({
	        		"transition": "-webkit-transform 0.2s ease-in",
	        		"transform": "translate3d(-50px, 0px, 0px)"
	        	});
	        }else{
	        	me.css({
	        		"transition": "-webkit-transform 0.2s ease-in",
	        		"transform": "translate3d(0px, 0px, 0px)"
	        	});
	        }
	    });
	    
	    $("#content").on("click","#btn-delgrouping", function(){
        	base.showLoading();
        	serviceCtr.delGrouping($(this).attr("data-code"))
        		.then((data) => {
        			base.hideLoading();
        			window.location.reload();//刷新当前页面
            }, () => {})
	    })
    	
    }
});
