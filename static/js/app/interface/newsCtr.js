define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    const newsCtr = {
        // 分页查询资讯
        getPageNews: (params, refresh) => {
            params.orderColumn = params.orderColumn || "update_datetime";
            params.orderDir = params.orderDir || "desc";
            params.type = 1;
            params.status = 1;
            return Ajax.get('612005', params, refresh)
        },
        // 详情查询入驻公司
        getNews: (code, refresh) => (
            Ajax.get("612007", {code}, refresh)
        )
    }
    return newsCtr;
});
