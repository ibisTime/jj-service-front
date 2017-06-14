define([
    'app/controller/base',
    'app/module/foot',
    'app/module/scroll',
    'app/util/handlebarsHelpers',
    'app/interface/menuCtr',
    'app/interface/serviceCtr',
    'app/interface/generalCtr',
    'swiper'
], function(base, Foot, scroll, Handlebars, menuCtr, serviceCtr, generalCtr, Swiper) {
    var myScroll, isEnd = false, isLoading = false;
    var companyTmpl = __inline('../ui/index_item.handlebars');
    var config = {
        start: 1,
        limit: 10,
        location: 1
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
			getBanner(true),
            getNotice(),
			getPageCompany(true)
        );
    }
    // 初始化swiper
    function initSwiper(){
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#swiper', {
            'direction': 'horizontal',
            'autoplay': 4000,
            'autoplayDisableOnInteraction': false,
            'pagination': '.swiper-pagination'
        });
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
    // 获取banner
    function getBanner(refresh){
        return menuCtr.getIndexBanner(refresh)
            .then((data) => {
                var bannerHtml = "";
                data.forEach((d) => {
                    var pics = base.getPicArr(d.pic);
                    pics.forEach((pic) => {
                        bannerHtml += `<div class='swiper-slide'><img data-url='${d.url || ""}' class='wp100' src='${pic}'></div>`;
                    });
                });
                $("#swiper .swiper-wrapper").html(bannerHtml);
                initSwiper();
            }, (msg) => {
                base.showMsg(msg || "加载失败");
            });
    }
    // 查询公告
    function getNotice(){
        generalCtr.getPageNotice({
            start: 1,
            limit: 1
        }, true).then((data) => {
            if(data.list.length){
                $("#notice").html(`<div class="news_title">公告</div><div class="news_content t-3dot"><a href="#">${data.list[0].smsContent}</a></div>`);
            }else{
                $("#notice").hide();
            }
        })
    }

    function addListener() {
    	$("#swiper").on("touchstart", ".swiper-slide img", function (e) {
            var touches = e.originalEvent.targetTouches[0],
                me = $(this);
            me.data("x", touches.clientX);
        });
        $("#swiper").on("touchend", ".swiper-slide img", function (e) {
            var me = $(this),
                touches = e.originalEvent.changedTouches[0],
                ex = touches.clientX,
                xx = parseInt(me.data("x")) - ex;
            if(Math.abs(xx) < 6){
                var url = me.attr('data-url');
                if(url)
                    location.href = url;
            }
        });


    }
});
