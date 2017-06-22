define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/interface/generalCtr',
    'swiper'
], function(base, Foot, scroll, Handlebars, serviceCtr, generalCtr, Swiper) {
    var myScroll, isEnd = false, isLoading = false;
    var qualifyCode = base.getUrlParam("qualifyType")||"";
    var searchVal = base.getUrlParam("s");
    var companyTmpl;
    var config = {
    	status:'2',
        start: 1,
        limit: 10
    };
	
    init();
    // 初始化页面
    function init() {
        Foot.addFoot(0);
        initIScroll();
        base.showLoading();
        if(qualifyCode){
        	
    		config.qualifyCode= qualifyCode;
    		companyTmpl = __inline('../../ui/home_list.handlebars');
    		
        	getInitData()
	            .then(() => {
	            }, () => {});
	            
        }else if(searchVal){
        	companyTmpl = __inline('../../ui/index_item.handlebars');
			$(".index_search .search_input_item input").val(searchVal);
			
        	config.name = searchVal;
        	
        	getSearchData()
	            .then(() => {
	            }, () => {});
        }
        base.hideLoading();
        addListener();
    }
    // 初始化数据
    function getInitData() {
    	return $.when(
			getPageList(true)
        );
    }
    
    function getSearchData() {
    	return $.when(
			getPageCompany(true)
        );
    }
    // 初始化iscroll
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: qualifyCode?getPageList:getPageCompany,
            refresh: () => {
            	if(qualifyCode){
            		getInitData();
            	}else{
            		getSearchData();
            	}
               
            }
        });
    }
    
    
    // 分页查询入驻公司
    function getPageCompany(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return serviceCtr.getPageCompany(config, refresh)
                .then((data) => {
                    if(data.list.length){
                        var {list} = data;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](companyTmpl({items: list}));
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
    
    // 分页查询入驻公司
    function getPageList(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return serviceCtr.getPageList(config, refresh)
                .then((data) => {
                    if(data.list.length){
                        var {list} = data;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](companyTmpl({items: list}));
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
		
		$(".index_search .search_icon").click(function(){
			location.href = "./list.html?s="+$(".index_search .search_input_item input").val();
		})
    }
});
