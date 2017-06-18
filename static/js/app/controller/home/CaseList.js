define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'swiper'
], function(base, Foot, scroll, Handlebars, serviceCtr, Swiper) {
    var myScroll, isEnd = false, isLoading = false;
    var companyCode = base.getUrlParam("code");
    var qfType = base.getUrlParam("qfType");
    var pageCode ;
    var companyTmpl = __inline('../../ui/case_list.handlebars');
    var config = {
    	companyCode: companyCode,
    	status:'1',
        start: 1,
        limit: 10
    };
	
	if(qfType=="2"){//摄影
		pageCode="612086"
	}else if(qfType=="1"){//培训
		pageCode="612096"
	}else if(qfType=="4"){//运营
		pageCode="612116"
	}else{//服务
		pageCode="612140"
	}
	
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
			getPageCase(true)
        );
    }
    // 初始化iscroll
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: getPageCase,
            refresh: () => {
                getInitData();
            }
        });
    }
    // 分页查询入驻公司
    function getPageCase(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return serviceCtr.getPageCase(pageCode, config, refresh)
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
		$("#content").on("click",".caseList",function(){
			
			var code=$(this).attr("data-code");
				
			location.href = `./caseDetail.html?code=${code}&qfType=${qfType}`;
			
		})
    }
});
