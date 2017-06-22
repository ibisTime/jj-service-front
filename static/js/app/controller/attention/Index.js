define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr'
], function(base, Foot, Handlebars, serviceCtr) {
    var companyTmpl = __inline('../../ui/home_list.handlebars')

    init();
    // 初始化页面
    function init() {
        Foot.addFoot(1);
        base.showLoading();
        $.when(
        	getPageGroup(),
        	getPageGroupList()
        ).then(() => {
                base.hideLoading();
            }, () => {});
        addListener();
    }
	// 分页查询分组
    function getPageGroup(refresh){
        return serviceCtr.getPageGroup({
            start: 1,
            limit: 1
        }, refresh)
            .then((data) => {
                var GroupingNum = data.totalCount ? data.totalCount : "0";
                $("#GroupingNum").html(GroupingNum)
            }, () => {});
    }
    // 列表查询关注
    function getPageGroupList(refresh){
        return serviceCtr.getPageGroupList({
            start: 1,
            limit: 10000
        }, refresh)
            .then((data) => {
                if(data.list.length){
                    $("#content").html(companyTmpl({items: data.list}));
                }
                var followNum = data.totalCount ? data.totalCount : "0";
                $("#followNum").html("("+ followNum +")")
            }, () => {});
    }
    function addListener() {
        
		$(".index_search .search_icon").click(function(){
			location.href = "../home/list.html?s="+$(".index_search .search_input_item input").val();
		})
    }
});
