define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/newsCtr'
], function(base, Foot, scroll, Handlebars, newsCtr) {
    var myScroll, isEnd = false, isLoading = false;
    var newsTmpl = __inline('../../ui/news_index_item.handlebars');
    var config = {
        start: 1,
        limit: 10
    };

    init();
    // 初始化页面
    function init() {
        Foot.addFoot(2);
        initIScroll();
        base.showLoading();
        getPageNews(true)
            .then(() => {
                base.hideLoading();
            }, () => {});
    }
    // 初始化iscroll
    function initIScroll(){
        myScroll = scroll.getInstance().getNormalScroll({
        	loadMore: getPageNews,
            refresh: () => {
                getPageNews(true);
            }
        });
    }
    // 分页查询入驻公司
    function getPageNews(refresh){
    	if(!isLoading && (!isEnd || refresh) ){
            isLoading = true;
            base.showPullUp();
            config.start = refresh && 1 || config.start;
            return newsCtr.getPageNews(config, refresh)
                .then((data) => {
                    if(data.list.length){
                        var {list} = data;
                        if(list.length < config.limit){
                            isEnd = true;
                        }
                        $("#content")[refresh ? "html" : "append"](newsTmpl({items: list}));
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
});
