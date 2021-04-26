var debug = require('debug')('pranav:database');
var getMac = require('../lib/mac.js');
var nmap = require('../lib/nmap.js');
var fs = require('fs');
var getHostName = require('../lib/getHostName.js');
var spawn = require('child_process');

var db = {}

var DataBase = function(){}

DataBase.prototype.getSortedList = function(){
	var s = [];
	Object.keys(db).forEach(function(key){
		s.push(db[key]);
	});
	s.sort(function(a,b){
		var aa = parseInt(a.ip.split('.')[3]);
		var bb = parseInt(b.ip.split('.')[3]);
		return aa - bb;
	});
// 	console.log(s);
	return s;
}

// update the db with a scan
// input: scan (an array of found hosts: [{ip,mac,name},{...])
DataBase.prototype.update = function(scan){
	// clear status flag
	Object.keys(db).forEach(function(key){
		db[key].status='down';
	});

	// pull hosts out of the scan, so scan will be empty at the end of function
	// add host to db if mac not found, otherwise just mark it as up
	while(scan.length > 0){
		var host = scan.pop();
		if( host['mac'] in db ){
			host['mac'].status = 'up';

			// sometimes I get an initially wrong mac/ip matchup, this is to
			// clear it out if the ip addresses don't match, reset them them to
			// the latest
			if(host.ip === db[host.mac].ip);
			else{
				db[host.mac].ip = host.ip;
				db[host.mac].hostname = '';
				db[host.mac].vendor = '';
			}
		}
		else {
// 			db[ host['mac'] ] = {'ip': host['ip'], 'vendor': host['vendor']};
			db[ host['mac'] ] = {'ip': host['ip'], 'vendor': '', 'hostname': '', 'timestamp': new Date(), 'mac': host['mac'], 'status':'up', 'tcp': {}, 'udp': {}};
		}
	}

	// if vendor is empty, then get it
	Object.keys(db).forEach(function(key){
		// only search if vendor is empty
		if(db[key].vendor === ''){
			getMac(key).then(function(response){ db[key]['vendor']=response; });
		}
	});

	// if hostname is empty then get it
	Object.keys(db).forEach(function(key){
		if(db[key].hostname === ''){
			getHostName( db[key].ip ).then( function (response){ db[key].hostname = response; } );
		}
	});
	;
}

// used to add localhost to db
DataBase.prototype.push = function(host){
	db[host['mac']] = host;
}

// is this really useful for my use cases?
DataBase.prototype.getHost = function(mac){
	return db[mac];
}

// write to a file
DataBase.prototype.write = function(file){
	var s = JSON.stringify(db);
	fs.writeFileSync(file, s);
}

// read db from a file
DataBase.prototype.read = function(file){
	try{
		fs.statSync(file); // file exists
		var p = require(file);
		if(Object.keys(obj).length > 0) db = p; // not empty
	}
	catch(err){
		debug('Error: '+file+' not found');
		fs.writeFileSync(file,JSON.stringify({}));
		debug('Error: created empty '+file);
// 		debug(err);
		return;
	}
}

// print out db to console
DataBase.prototype.console = function(){
	console.log(JSON.stringify(db, null, 4));
}

// get copy of entire database
DataBase.prototype.get = function(){
	return db;
}

//module.exports = DataBase;
module.exports.DataBase = new DataBase();