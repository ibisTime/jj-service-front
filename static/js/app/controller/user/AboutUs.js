define([
    'app/controller/base',
    'app/interface/generalCtr'
], function(base, generalCtr) {
    init();
	
	function init(){
		base.showLoading();
		generalCtr.getSysConfig("aboutus")
			.then((data) => {
			 	$("#title").html(data.cvalue);
			 	$("#content").html(data.note);
		 		base.hideLoading()
			}, () => {});
	}
})
