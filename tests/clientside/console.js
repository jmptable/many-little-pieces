function Console(scrn, processor) {
	this.buffer = "";
	this.line = "";
	this.screen = scrn;
	this.process = processor;
	
	this.limit = this.screen.width*this.screen.height;
	
	this.x = 0;
	this.y = 0;
	
	this.cursor = false;
	
	setInterval(this.flash.bind(this), 300);
	
	this.reset();
}

Console.prototype = {
	input: function(code) {
		if(this.buffer.length<=this.limit) {
				if(code==13) {
					//ENTER
					this.process(this.line);
				} else if(code==8) {
					//BACKSPACE
					this.del();
				} else if(code>=32 && code<=129) {
					this.print(String.fromCharCode(code));
				}
		}
	},
	
	reset: function() {
		this.buffer = "";
		this.lie = "";
		this.screen.clearText();
		
		this.x = 0;
		this.y = 0;
	},
	
	del: function() {
		this.screen.putText(this.x, this.y, " ");
	
		if(this.buffer.length>0) {
			this.buffer = this.buffer.substring(0, this.buffer.length-1);
			this.line = this.line.substring(0, this.line.length-1);
			
			this.x -= 1;
			if(this.x<0) {
				this.y -= 1;
				this.x = 0;
			}
			
			if(this.y<0) {
				this.y = 0;
			}
			
			this.screen.putText(this.x, this.y, " ");
			this.screen.dirty = true;
		}
	},
	
	newline: function() {
		this.line = "";
		
		this.screen.putText(this.x, this.y, " ");
		this.screen.dirty = true;
			
		this.y += 1;
		this.x = 0;
		
		if(this.y>=this.screen.height) {
			this.y -= 1;
			this.x = this.screen.width-1;
		}
	},
	
	print: function(c) {
		this.buffer += c;
		this.line += c;
		this.screen.putText(this.x, this.y, c);
		this.screen.dirty = true;
		
		//move the cursor
		this.x += 1;
		if(this.x>=this.screen.width) {
			this.y += 1;
			this.x = 0;
		}
		
		if(this.y>=this.screen.height) {
			this.y -= 1;
			this.x = this.screen.width-1;
		}
	},
	
	flash: function() {
		if(this.cursor) {
			this.cursor = false;
			this.screen.putText(this.x, this.y, String.fromCharCode(131));
		} else {
			this.cursor = true;
			this.screen.putText(this.x, this.y, " ");
		}
	}
}
