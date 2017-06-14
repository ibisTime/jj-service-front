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
    // 判断是否查询过某个分组的信息
    function hasFetch(groupCode){
        var fetch = $("#" + groupCode).attr("data-fetch");
        return fetch == "true" ? true : false;
    }
    function addListener() {
        // 手风琴效果
        $("#content").on("click", ".am-accordion-header", function(){
            var me = $(this),
                expanded = me.attr("aria-expanded"),
                code = me.attr("data-code");;
            if(expanded == "false"){
                if(!hasFetch(code)){
                    getAttentionList(code);
                }
                expanded = "true";
                $("#" + code).removeClass("am-accordion-content-inactive");
            }else{
                expanded = "false";
                $("#" + code).addClass("am-accordion-content-inactive");
            }
            me.attr("aria-expanded", expanded);
        });
    }
});
