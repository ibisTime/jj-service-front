define([
    'app/controller/base',
    'app/module/foot',
    'app/util/handlebarsHelpers',
    'app/interface/serviceCtr',
    'app/module/showInMap',
    'swiper'
], function(base, Foot, Handlebars, serviceCtr, showInMap, Swiper) {
    var TmplUrl = __inline('../../ui/case_detail.handlebars');
    var TmplUrl_sy = __inline('../../ui/case_detail_sy.handlebars');
    var TmplUrl_px = __inline('../../ui/case_detail_px.handlebars');
    var TmplUrl_yy = __inline('../../ui/case_detail_yy.handlebars');
    var htmlTmpl;
    
    var qfType = base.getUrlParam("qfType");
    var code = base.getUrlParam("code"), groupCode, companyCode;
    var pageCode;
	
	if(qfType=="2"){//摄影
		pageCode='612087';
		htmlTmpl = TmplUrl_sy;
	}else if(qfType=="1"){//培训
		pageCode='612097';
		htmlTmpl = TmplUrl_px;
	}else if(qfType=="4"){//运营
		pageCode='612117';
		htmlTmpl = TmplUrl_yy;
	}else{//服务
		pageCode='612141';
		htmlTmpl = TmplUrl;
	}
	
    init();
    // 初始化页面
    function init() {
        if(!code){
            base.showMsg("未传入编号");
            return;
        }
        Foot.addFoot(0);
        base.showLoading();
        getCaseDetail(true)
            .then(() => base.hideLoading());
        addListener();
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
    // 案列详情
    function getCaseDetail(){
        return serviceCtr.getCaseDetail(pageCode,code)
            .then((data) => {
            	qfType = data.qualifyType;
                var bannerHtml = "";
                var pics = base.getPicArr(data.pic);
                pics.forEach((pic) => {
                    bannerHtml += `<div class='swiper-slide'><img class='wp100' src='${pic}'></div>`;
                });
                $("#swiper .swiper-wrapper").html(bannerHtml);
                initSwiper();
                
				var html = $(htmlTmpl(data));
				var otherTmpl;
                
                if(qfType=="2"){//摄影
					var works = base.getPic(data.works);
					otherTmpl = `<div class="normal_title">代表作品</div><div class='wp100'><img class='wp100' src='${works}'></div>`
					
//				}else if(qfType=="1"){//培训
//					var resume1 = base.getPic(data.resume1);
//					var resume2 = base.getPic(data.resume2);
//					var resume3 = base.getPic(data.resume3);
//					
//					otherTmpl = `<div class="normal_title">代表作品</div><div class='wp100'><img class='wp100' src='${resume1}'/></div><div class='wp100'><img class='wp100' src='${resume2}'/></div><div class='wp100'><img class='wp100' src='${resume3}'/></div>`
				}
				
				companyCode = data.companyCode;
				
                $("#compContent").html(html);
                $("#other").html(otherTmpl);
                $("#description").html(data.description);
            }, () => {});
    }
    
    function addListener() {
    	
	    Handlebars.registerHelper('formatIsDz', function(num, options){
	        if (num=='1') {
	            return '可定制';
	        }else{
	        	return '';
	        }
	        
	    });
	    
	    $("#compContent").on("click","#btn-negotiate",function(){
	    	var dCode=$(this).attr("data-code")
	    	
	    	location.href=`./negotiate.html?code=${dCode}&comCode=${companyCode}`;
	    })
	    
    }
});
