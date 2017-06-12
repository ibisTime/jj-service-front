define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'app/interface/newsCtr'
], function(base, Handlebars, newsCtr) {
    var newsTmpl = __inline('../../ui/news_detail.handlebars'),
        code = base.getUrlParam("code");

    init();
    // 初始化页面
    function init() {
        base.showLoading();
        getNews();
    }

    // 详情查询资讯
    function getNews(){
        return newsCtr.getNews(code)
            .then((data) => {
                base.hideLoading();
                $("#infos").html(newsTmpl(data));
                $("#content").html(data.content);
            }, () => {});
    }
});
