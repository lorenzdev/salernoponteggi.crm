var Home = function(content){

	var _this = this;
	_this.content = content;
	
	_this.init = function(elem){
		
		$.get("htmls/Home.html", function(html){
            elem.html(html); 
            _this.content.loader.remove();
        });
	
	}
}