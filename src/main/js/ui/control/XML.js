// JS-класс, расширяющий функциональность текстового поля, добавляющий
// подсветку синтаксиса XML-текста
// Данный класс используется для поля таблицы Document, см. Documents.bl
// Аргументы Z8.define():
//    - имя определяемого класса
//    - конфигурация класса, в которой определяется:
Z8.define('org.zenframework.z8.template.controls.XML', {
	// Имя наследуемого класса
	extend: 'Z8.form.field.TextArea',
	tag: 'pre',
	completeRender: function() {
		this.callParent();
		var dom = this.getDom();
		var pre = dom.querySelector('.box pre');
		pre.setAttribute('contenteditable', 'true');
		pre.setAttribute("class", "language-xml-doc");
	}
});