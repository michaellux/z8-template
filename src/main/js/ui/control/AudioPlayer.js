// JS-класс, расширяющий функциональность текстового поля, встраивающий 
// в форму проигрыватель аудиофайлов
// Данный класс используется для поля таблицы Document, см. Documents.bl
// Аргументы Z8.define():
//    - имя определяемого класса
//    - конфигурация класса, в которой определяется:
Z8.define('org.zenframework.z8.template.controls.AudioPlayer', {
	extend: 'TextBox',
	shortClassName: 'AudioPlayer',
	
	setValue: function(value, displayValue) {
		this.callParent(value, displayValue);
		this.updateTriggers();
	},

	valueToRaw: function(value) {
		if (!Z8.isEmpty(value)) {
			var file = value[0];
			var sourcePath = `${window.location.href}${file.path}?&session=${Application.session}&id=${file.id}`;
			var ext = file.path.match(/\.[0-9a-z]+$/i)[0];
			
			this.getDom().querySelector('audio').setAttribute('src', sourcePath);
		}
	
		return Z8.isEmpty(value) ? '' : value[0].name;
	},

	getCls: function() {
		return Z8.form.field.Text.prototype.getCls.call(this).pushIf('file');
	},

	initTriggers: function (){
		var triggers = this.triggers;
		triggers.push({ icon: 'fa-upload', tooltip: Z8.$('FileBox.uploadAFile'), handler: this.onUploadFile, scope: this });
		triggers.push({ icon: 'fa-download', tooltip: Z8.$('FileBox.downloadAFile'), handler: this.onDownloadFile, scope: this });

		TextBox.prototype.initTriggers.call(this);

		this.uploadTrigger = this.getTrigger(0);
		this.downloadTrigger = this.getTrigger(1);
	},

	completeRender: function() {
		this.callParent();

		var fileInput = this.fileInput = DOM.append(this, { tag: 'input', type: 'file' });

		DOM.on(fileInput, 'change', this.onFileInputChange, this);

		DOM.on(this, 'dragEnter', this.onDragEnter, this);
		DOM.on(this, 'dragOver', this.onDragOver, this);
		DOM.on(this, 'drop', this.onDrop, this);

		DOM.on(window, 'dragEnter', this.onWindowDragEnter, this);
		DOM.on(window, 'dragOver', this.onWindowDragOver, this);
		DOM.on(window, 'dragLeave', this.onWindowDragLeave, this);
		DOM.on(window, 'drop', this.onWindowDrop, this);
	},

	onDestroy: function() {
		DOM.un(window, 'dragEnter', this.onWindowDragEnter, this);
		DOM.un(window, 'dragOver', this.onWindowDragOver, this);
		DOM.un(window, 'dragLeave', this.onWindowDragLeave, this);
		DOM.un(window, 'drop', this.onWindowDrop, this);

		DOM.un(this, 'dragEnter', this.onDragEnter, this);
		DOM.un(this, 'dragOver', this.onDragOver, this);
		DOM.un(this, 'drop', this.onDrop, this);

		DOM.un(this.fileInput, 'change', this.onFileInputChange, this);

		DOM.remove(this.fileInput);

		this.fileInput = null;

		this.callParent();
	},

	getUploadTrigger: function() {
		return this.uploadTrigger;
	},

	getDownloadTrigger: function() {
		return this.downloadTrigger;
	},

	updateTriggers: function () {
		if (this.downloadTrigger != null) {
			this.downloadTrigger.show(!Z8.isEmpty(this.getValue()));
		}
	},

	onUploadFile: function(button) {
		this.fileInput.value = null;
		this.fileInput.click();
	},

	onDownloadFile: function(button) {
		var files = this.getValue();

		if(Z8.isEmpty(files))
			return;

		var callback = function(success) {
			this.getDownloadTrigger().setBusy(false);
		};

		this.getDownloadTrigger().setBusy(true);

		var file = files[0];
		DOM.download(file.path, file.id, null, { fn: callback, scope: this });
	},

	onFileInputChange: function() {
		this.upload(this.fileInput.files);
	},

	onDragEnter: function(event) {
		var dataTransfer = event.dataTransfer;
		if(dataTransfer == null || this.isReadOnly() || !this.isEnabled())
				return;

		dataTransfer.effectAllowed = dataTransfer.dropEffect = 'copy';
		event.stopEvent();
	},

	onDragOver: function(event) {
		if(event.dataTransfer != null && !this.isReadOnly() && this.isEnabled())
			event.stopEvent();
	},

	onDrop: function(event) {
		var dataTransfer = event.dataTransfer;
		if(dataTransfer == null || this.isReadOnly() || !this.isEnabled())
			return;

		dataTransfer.effectAllowed = dataTransfer.dropEffect = 'copy';
		event.stopEvent();

		this.upload(dataTransfer.files);
	},

	onWindowDragEnter: function(event) {
	},

	onWindowDragLeave: function(event) {
	},

	onWindowDragOver: function(event) {
		var dataTransfer = event.dataTransfer;
		if(!event.dataTransfer)
			return;

		dataTransfer.effectAllowed = dataTransfer.dropEffect = 'none';
		event.stopEvent();
	},

	onWindowDrop: function(event) {
		if(event.dataTransfer != null)
			event.stopEvent();
	},

	upload: function(files) {
		if(files.length == 0)
			return;

		this.getUploadTrigger().setBusy(true);

		var callback = function(record, files, success) {
			this.getUploadTrigger().setBusy(false);
		};

		var record = this.getRecord();
		record.attach(this.name, files, { fn: callback, scope: this });
	},
	
	afterRender: function() {
		var player = this.player = document.createElement('audio');
		player.setAttribute("style", "width: 100%;");
		player.setAttribute('controls','controls');
		this.getDom().append(player);
	}
});