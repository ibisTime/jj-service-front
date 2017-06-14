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
    var code = base.getUrlParam("code");
    var companyTmpl = __inline('../../ui/case_list.handlebars');
    var config = {
    	qualifyType: qualifyType,
    	status:'1',
        start: 1,
        limit: 10
    };
	
    init();
    // 初始化页面
    function init() {
        Foot.addFoot(0);
        initIScroll();
        base.showLoading();
        getInitData()
            .then(() => {
                base.hideLoading();
            }, () => {});
        addListener();
    }
    // 初始化数据
    function getInitData() {
    	return $.when(
			getPageCompany(true)
        );
    }
    // 初始化iscroll
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: getPageCompany,
            refresh: () => {
                getInitData();
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

    function addListener() {

    }
});