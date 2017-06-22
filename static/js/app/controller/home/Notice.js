define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/generalCtr'
], function(base, Foot, scroll, Handlebars, generalCtr) {
    var myScroll, isEnd = false, isLoading = false,dictData;
    var companyTmpl = __inline('../../ui/notice_list.handlebars');
    var config = {
        start: 1,
        limit: 10
    };
    
    init();
    // 初始化页面
    function init() {
        Foot.addFoot(0);
        base.showLoading();
        initIScroll();
        getInitData();
        addListener();
    }
    // 初始化数据
    function getInitData() {
    	return $.when(
			getNegotiateList(true)
       	)
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
            return generalCtr.getPageNotice(config, refresh)
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
                	base.hideLoading();
                }, () => {
                    isLoading = false;
                    isEnd = true;
                    base.hidePullUp();
                    myScroll.refresh();
               		base.hideLoading();
                });
        }

    }

    function addListener() {
    	
    }
});
