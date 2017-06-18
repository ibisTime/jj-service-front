define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/interface/generalCtr',
    'swiper'
], function(base, Foot, scroll, Handlebars, serviceCtr, generalCtr, Swiper) {
    var myScroll, isEnd = false, isLoading = false,dictData;
    var config = {
        start: 1,
        limit: 10
    };
    
    init();
    // 初始化页面
    function init() {
        Foot.addFoot(0);
        initIScroll();
        base.showLoading();
		getDictList()
        addListener();
    }
    // 初始化数据
    function getInitData() {
    	return $.when(
			getNegotiateList(true)
       	)
    }
    
    //状态数据字典
    function getDictList(){
    	generalCtr.getDictList("cb_status")
    	.then((data) => {
    		
       		dictData = data;
       		getInitData();
            base.hideLoading();
        }, () => {});
    }
    
    // 初始化iscroll
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: getNegotiateList,
            refresh: () => {
                getInitData();
            }
        });
    }
    // 分页查询入驻公司
    function getNegotiateList(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return serviceCtr.getNegotiateList(config, refresh)
                .then((data) => {
                    if(data.list.length){
                        var {list} = data;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        var html = "";
                        data.list.forEach(function(d, i){
                        	if(d.company){
                        		html+='<div data-code="'+d.code+'"  data-comCode="'+d.companyCode+'" class="block_a index_content_item caseList">'+
	        					'<div class="am-flexbox am-flexbox-align-top">'+
					           	'<div class="item_img"><img src="'+base.getPicList(d.company.advPic)+'"></div>'+
					            '<div class="item_content am-flexbox am-flexbox-justify-between am-flexbox-dir-column am-flexbox-align-top">'+
				                '<div class="item_title t-3dot">'+d.company.name+'</div>'+
				                '<div class="item_infos clearfix">'+
	                   			'<div class="item_info">'+base.getDictListValue(d.status,dictData)+'</div>'+
	                			'</div><div class="item_stars">'+
	                			'<span class="star_title">'+base.formateDateTime(d.submitDatetime)+'</span>'+
	                			'<span class="stars"></span>'+
	                			'</div></div></div></div>'
                        	}
                        })
                        
                        if(refresh&&config.start==1){
                        	
                        	$("#content").html(html);
                        }else{
                        	$("#content").append(html);
                        }
                        
                        config.start++;
                    }else{
                        isEnd = true;
                    }
                    base.hidePullUp();
                    myScroll.refresh();
                    isLoading = false;
                }, () => {
                    isLoading = false;
                    isEnd = true;
                    base.hidePullUp();
                    myScroll.refresh();
                });
        }

    }

    function addListener() {
    	
		$("#content").on("click",".caseList",function(){
			var code=$(this).attr("data-code");
			var comCode=$(this).attr("data-comCode");
			
			location.href = `./myNegotiate-detail.html?code=${code}&comCode=${comCode}`;
			
		})
    }
});
