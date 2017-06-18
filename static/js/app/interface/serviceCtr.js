define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    const serviceCtr = {
        // 分页查询入驻公司
        getPageCompany: (params, refresh) => {
            params.orderColumn = params.orderColumn || "gz_num";
            params.orderDir = params.orderDir || "desc";
            params.gsQuantitys ="1,2,4";
            params.status ="2";
            
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
        // 分页查询关注
        getPageGroupList: (params, refresh) => {
            params.userId = base.getUserId();
            
            return Ajax.get("612035", params, refresh);
        },
        // 关注公司
        attentionComp: (params, refresh) => {
            params.userId = base.getUserId();
            
            return Ajax.post("612030", params, refresh);
        },
        // 取消关注公司
        unAttentionComp: (code) => (
            Ajax.post("612031", {code})
        ),
        // 列表查询关注
        getAttentionList: (groupCode, refresh) => (
            Ajax.get("612036", {
                groupCode: groupCode||"",
                userId: base.getUserId()
            }, refresh)
        ),
        // 分页查询公司资质
        getPageList: (params, refresh) => {
            
            return Ajax.get('612075', params, refresh)
        },
        // 分页查询经典案例
        getPageCase: (code, params, refresh) => {
        	
            return Ajax.get(code, params, refresh)
        },
        // 经典案例详情
        getCaseDetail: (pageCode, code, refresh) =>  (
            Ajax.get(pageCode, {
            	code
            }, refresh)
        ),
        // 新建分组
        addGrouping: (params, refresh) =>  {
        	params.userId = base.getUserId();
        	
            return Ajax.get("612020", params, refresh)
        },
        // 删除分组
        delGrouping: (code, refresh) =>  (
        	
            Ajax.get("612021", {
            	code
            }, refresh)
        ),
        // 修改分组
        editGrouping: (params, refresh) =>  {
        	
            return Ajax.get("612022", params, refresh)
        },
        // 修改分组
        moveGrouping: (params, refresh) =>  {
        	
            return Ajax.get("612032", params, refresh)
        },
        // 分组详情
        detailGrouping: (code, refresh) =>  {
        	
            return Ajax.get("612026", {
            	code
            }, refresh)
        },
        // 洽谈
        getNegotiate: (params, refresh) =>  {
        	params.type = '3';
        	params.submitter = base.getUserId();
        	
            return Ajax.get("612170", params, refresh)
        },
        // 分页查询意向
        getNegotiateList: (params, refresh) => {
            
        	params.submitter = base.getUserId();
            return Ajax.get('612175', params, refresh)
        },
        // 分页查询意向
        getNegotiateDetail: (code, refresh) => {
            
            return Ajax.get('612176', {code}, refresh)
        },
        
    }
    return serviceCtr;
});
