// JS-класс, встраивающий в форму проигрыватель 
// YouTube, демонстрирующий ролик, доступный по ссылке в поле "youtube"
// Данный класс используется для поля таблицы Document, см. Documents.bl
// Аргументы Z8.define():
//    - имя определяемого класса
//    - конфигурация класса, в которой определяется:
Z8.define('org.zenframework.z8.template.controls.Youtube', {
	// Имя наследуемого класса
	extend: 'Z8.form.field.Text',
	getYouTubeId: function(url) {
		/*http://jsfiddle.net/isherwood/cH6e8/*/
		var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    	var match = url.match(regExp);

	    if (match && match[2].length == 11) {
	        return match[2];
	    } else {
	        return 'error';
	    }
	},
	onInput: function(event, target) {
		var dom = this.getDom();
		var target = event.target;
		var value = target.value
		this.setValue(value);
		dom.querySelector('#youtube-preview').setAttribute("src",`https://www.youtube.com/embed/${this.getYouTubeId(value)}`);
	},
	htmlMarkup: function() {
		var url = 'https://www.youtube.com/embed/K-xC_2UM_Xs';
		
		var iframe = this.iframe = new Z8.Component({id: 'youtube-preview', tag: 'iframe', src: url, 'allowfullscreen': 'true', 'frameborder': '0'});
		
		var markup = this.callParent();
		markup.cn.push(this.iframe);
		return markup;
	}
});