TINY={};

function T$(i){return document.getElementById(i)}
function T$$$(){return document.all?1:0}

TINY.editor=function(){
	var c=[], offset=-30;
	c['bold']          =[4,'Bold','a','bold',null, null, 'bold'];
	c['italic']        =[5,'Italic','a','italic',null, null, 'italic'];
	c['orderedlist']   =[10,'Numbered List','a','insertorderedlist', null, null, 'list-ol'];
	c['unorderedlist'] =[11,'Bulleted List','a','insertunorderedlist', null, null, 'list-ul'];
	c['link']          =[22,'Link','i','createlink','Enter link address:','http://', 'link'];
	function edit(n,obj){
		var defaults = {
			xhtml: true,
			controlclass: 'tecontrol',
			width: '100%',
			controls: [
				'bold',
				'italic',
				'orderedlist',
				'unorderedlist',
				'link'
			]
		}
		for (p in defaults){ obj[p] = obj[p] || defaults[p] }
		var p = document.createElement('div'),
			w = document.createElement('div'),
			h = document.createElement('div'),
			l = obj.controls.length,
			i = 0;
		this.n = n; window[n] = this;
		this.t = T$(obj.id);
		this.obj = obj;
		this.xhtml = obj.xhtml;
		this.i = document.createElement('iframe');
		this.i.frameBorder=0;
		this.i.width=obj.width;
		this.i.height=obj.height||'250';
		this.ie = T$$$();

		h.className = obj.rowclass||'teheader';
		p.className = obj.cssclass||'te';
		p.style.maxWidth = this.i.width+'px';
		p.appendChild(h);

		for(i;i<l;i++){
			var id=obj.controls[i];
			if(c[id]){
				var div  = document.createElement('div'),
					x    = c[id],
					func = x[2],
					ex;
				div.className = obj.controlclass;
				div.title=x[1];
				ex = func == 'a' ? '.action("'+x[3]+'",0,'+(x[4]||0)+')' :
					'.insert("'+x[4]+'","'+x[5]+'","'+x[3]+'")';
				div.onclick=new Function(this.n+ex);
				if (x[6]) div.innerHTML='<i class="fa fa-fw fa-'+x[6]+'"></i>'
				h.appendChild(div);
			}
		}
		this.t.parentNode.insertBefore(p,this.t);
		this.t.style.width=this.i.width+'px';
		w.appendChild(this.t);
		w.appendChild(this.i);
		p.appendChild(w);
		this.t.style.display='none';
		this.e=this.i.contentWindow.document;
		this.e.open();
		var m='<html><head>', bodyid=obj.bodyid?" id=\""+obj.bodyid+"\"":"";
		if(obj.cssfile){m+='<link rel="stylesheet" href="'+obj.cssfile+'" />'}
		if(obj.css){m+='<style type="text/css">'+obj.css+'</style>'}
		m+='</head><body'+bodyid+'>'+(obj.content||this.t.value);
		m+='</body></html>';
		this.e.write(m);
		this.e.close();
		this.e.designMode='on';
		this.d=1;
	};
	edit.prototype.action=function(cmd,val,ie){
		this.e.execCommand(cmd,0,val||null)
	},
	edit.prototype.insert=function(pro,msg,cmd){
		var val=prompt(pro,msg);
		if(val!=null&&val!=''){this.e.execCommand(cmd,0,val)}
	},
	edit.prototype.toggle=function(post,div){
	    if(!this.d){
	        var v=this.t.value;
	        if(div){div.innerHTML=this.obj.toggle.text||'source'}
	        this.e.body.innerHTML=v;
	        this.t.style.display='none';
	        this.i.style.display='block';
	        this.d=1
	    }else{
	        var v=this.e.body.innerHTML;
	        if(div){div.innerHTML=this.obj.toggle.activetext||'wysiwyg'}
	        this.t.value=v;
	        if(!post){
	            this.t.style.height=this.i.height+'px';
	            this.i.style.display='none'; this.t.style.display='block';
	            this.d=0
	        }
	    }
	},
	edit.prototype.post=function(){
		if(this.d){this.toggle(1)}
	};
	return{edit:edit}
}();

TINY.cursor=function(){
	return{
		top:function(e){
			return T$$$()?window.event.clientY+document.documentElement.scrollTop+document.body.scrollTop:e.clientY+window.scrollY
		}
	}
}();
