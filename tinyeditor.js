TINYeditor = function(obj){
	window[obj.varible || 'editor'] = this;
	var c = {
		bold:   ['Bold','a','bold','bold'],
		italic: ['Italic','a','italic','italic'],
		ol:     ['Numbered List','a','insertorderedlist', 'list-ol'],
		ul:     ['Bulleted List','a','insertunorderedlist', 'list-ul'],
		link:   ['Link','i','createlink','link','Enter link address:','http://']
	}
	this.post = function(){ return this.e.body.innerHTML }
	this.action = function(c){ this.e.execCommand(c[2],0,null) }
	this.insert = function(c){
		var val = prompt(c[4], c[5]);
		if(val) this.action(c)
	}
	this.createEl = function(tag, props, children){
		var children = children || []
		var t = document.createElement(tag)
		if (props){
			t.className = props.className || props
			for (key in props){ t[key] = props[key] }
		}
		for (var i=0; i<children.length; i++) { t.appendChild(children[i]) }
		return t
	}
	this.edit = function(){
		this.el = document.getElementById(obj.id || 'tinyEditor');
		this.el.style.display='none';

		this.iframe = this.createEl('iframe', {
			frameBorder: 0,
			width:  obj.width || '100%',
			height: obj.height||'250'
		})

		var h = this.createEl('div', 'teheader', Object.keys(c).map(function(i){
			var f = c[i][1] == 'a' ? 'action' : 'insert'
			return this.createEl('div', {
				className: obj.iclass || 'tecontrol',
				title: c[i][0],
				onclick: this[f].bind(this, c[i]),
				innerHTML: '<i class="fa fa-fw fa-'+c[i][3]+'"></i>'
			})
		}.bind(this)))

		var ed = this.createEl('div', 'te', [h, this.iframe])
		this.el.parentNode.insertBefore(ed, this.el)
		this.iframeContent()
	}
	this.iframeContent = function(){
		var m='<html><head>', bodyid=obj.bodyid?" id=\""+obj.bodyid+"\"":"";
		if(obj.cssfile){m+='<link rel="stylesheet" href="'+obj.cssfile+'" />'}
		if(obj.css){m+='<style type="text/css">'+obj.css+'</style>'}
		m+='</head><body'+bodyid+'>'+(obj.content||this.el.value);
		m+='</body></html>';

		this.e = this.iframe.contentWindow.document;
		this.e.write(m);
		this.e.designMode = 'on';
		this.iframe.contentWindow.onkeyup = function(e){
			if (e.ctrlKey && window.navigator.platform.slice(0,3) == 'Mac')
				return
		    if (e.ctrlKey || e.metaKey)
		    	if (e.keyCode == 66) editor.action('bold')
		    	if (e.keyCode == 71) editor.action('italic')
		}
	}
	return this.edit()
}
