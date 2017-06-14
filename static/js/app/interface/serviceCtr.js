define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    const serviceCtr = {
        // 分页查询入驻公司
        getPageCompany: (params, refresh) => {
            params.orderColumn = params.orderColumn || "gz_Num";
            params.orderDir = params.orderDir || "desc";
            
            return Ajax.get('612060', params, refresh)
        },
        // 详情查询入驻公司
        getCompany: (code, refresh) => (
            Ajax.get("612062", {
                code,
                userId: base.getUserId()
            }, refresh)
        ),
        // 分页查询组
        getPageGroup: (params, refresh) => {
            params.userId = base.getUserId();
            return Ajax.get("612025", params, refresh);
        },
        // 关注公司
        attentionComp: (params) => {
            params.userId = base.getUserId();
            return Ajax.post("612030", params);
        },
        // 取消关注公司
        unAttentionComp: (code) => (
            Ajax.post("612031", {code})
        ),
        // 列表查询关注
        getAttentionList: (groupCode = "", refresh) => (
            Ajax.get("612036", {
                groupCode,
                userId: base.getUserId()
            }, refresh)
        ),
        // 分页查询公司资质
        getPageList: (params, refresh) => {
            return Ajax.get('612075', params, refresh)
        },
    }
    return serviceCtr;
});
