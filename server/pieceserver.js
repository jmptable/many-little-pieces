var Maple = require('../Maple/Maple');

var db = require('mongojs').connect('pieces');
var world = db.collection('world');
var users = db.collection('users');

console.log("world initialized");

function commandLogic(type, data ){
	
	switch(type) {
	
	case MOVE_RIGHT:
		break;	
	case MOVE_LEFT:
		break;
	case MOVE_UP:
		break;
	case MOVE_DOWN:
	}
}


var PieceServer = Maple.Class(function(clientClass) {
	Maple.Server(this, clientClass);

}, Maple.Server, {

	started: function() {
		console.log('Started');
		
		//drop the existing chunks
		world.drop();

		//create some chunks
		for(var y=0; y<8; y++) {
			for(var x=0; x<8; x++) {
				var chunkform = { loc: [ ], data: "" };
				chunkform.loc = [ x*world_info.SCREEN_W ,chunkform.loc.y = y*world_info.SCREEN_H] ;
				
				for(var i=0; i<world_info.SCREEN_H*world_info.SCREEN_W; i++) {
					chunkform.data += "X";//world_info.characters[Math.floor(Math.random()*96+32];
				}
				world.save(chunkform);
			}
		}
		
		//create dummy player
		users.save({
			name: "nehal",
			password: "password",
			loc: [ 32,128 ]
		});
	},

	update: function(t, tick) {
		//this.broadcast(5, ['Hello World']);
		//console.log(this.getClients().length, 'client(s) connected', t, tick, this.getRandom());
	},

	stopped: function() {
		console.log('Stopped');
	},

	connected: function(client) {
		console.log('Connected:', client.id);
	},

	message: function(client, type, tick, data) {
		//console.log('Message:', client, type, tick);
		console.log('Message:', data);
		switch(type) {
			case protocol.type.INIT:
				users.find(data.name, function(err, docs) {
					//if(docs[0].password==data.password) {
						if(docs.length>0) {
							var query = { "loc" : docs[0].loc};
							console.log(query);		
							world.find(query, function(err, docs) {
							console.log(docs[0]);
								srv.broadcast(protocol.INIT, [docs[0]], [client]);
								console.log("map sent");
							});
						} else {
							console.log("bad docs");
						}
					//} else {
						//console.log("password failed. was "+data.password+" and should be "+docs[0].password);
					//}
				});
				break;
			case protocol.type.COMMAND:
				console.log("Key Pressed");
				console.log(data); 			
				break;
		}
	},
	requested: function(req, res) {
		console.log('HTTP Request');
	},

	disconnected: function(client) {
		console.log('Disconnected:', client.id);
	}
});

var protocol = {
	type: {
		INIT: 1,
		COMMAND: 2
	} ,
	cmd: {
		MOVE: 1,
		MINE: 2
	},
	dir: {
		NA: 0,
		UP: 1,
		DOWN: 2,
		LEFT: 3,
		RIGHT: 4
	}
};

var commands = {
		
}
var world_info = {
	SCREEN_W: 32,
	SCREEN_H: 32
};

var srv = new PieceServer();
srv.start({
	port: 4000,
	logicRate: 100
});

