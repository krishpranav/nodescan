var debug = require('debug')('pranav:nmap');
var spawn = require('child_process');

var Nmap = function(){}

Nmap.prototype.scanNetwork = function(opts){
	return new Promise( function(resolve,reject){
		var ans = [];
// 		debug('nmap start -----------------------------------------');
		opts = opts || {range: '192.168.1.1/24'};
		var cmd = 'nmap -sn ' + opts.range;
		spawn.exec(cmd, function (err, stdout, stderr){
			if (err) {
				debug(opts.host + ', error code: ' + err.code + stderr);
				reject( ans ); // return empty array
			}
			var info = stdout.split('\n');
			// there is always an empty line and summary at the end, so only go to length-2
			var i = 0;
			while(i < info.length-3){
				var host = {};
				var line = info[i].split(' ');
				if(line[0] === 'Nmap'){
					host.ip = line[4];
					line = info[i+2].split(' ');
					if(line[0] === 'MAC'){
						host.mac = line[2];
						host.vender = info[i+2].split('(')[1].replace(')',''); // some strings are multiple words with spaces in them
						ans.push(host); // only add if we get everything
						i += 3;
					}
					else i++;
				}
				else i++;
			}
			resolve( ans );
		});
	});
}


/**
Use promise to scan and return the nmap response, an array of dicts
input: opts {ports: '1-100', host: '10.10.1.1'}
output: [{"port":"53","protocol":"domain"}] or []
*/
Nmap.prototype.scanPorts = function(opts){
	return new Promise( function(resolve,reject){
		var ans = [];
// 		debug('nmap start -----------------------------------------');
		opts = opts || {ports:'1-3000', host: '192.168.1.1'};
		var cmd = 'nmap -p' + opts.ports + ' ' + opts.host + ' | grep tcp';
		spawn.exec(cmd, function (err, stdout, stderr){
			if (err) {
				debug(opts.host + ', error code: ' + err.code + stderr);
				reject( ans ); // return empty array
			}
			var ports = stdout.split('\n');
			ans.push( opts.host );
			// there is always an empty line at the end, so only go to length-1
			for(var i=0;i<ports.length-1;i++){
				// need to use a regex expression to eat up extra whitespace before split
				var chunk = ports[i].replace(/\s+/g, " ").split(' ');
// 				debug( 'chunk: ' + chunk);
				// should be port   status protocol 
				//           22/tcp  open  ssh
				// use slice to take of the last 4 chars (/tcp) of port
				ans.push( {'port': chunk[0].slice(0,-4), 'protocol': chunk[2]} );
			}
// 			debug( 'nmap ans: ' + JSON.stringify(ans) );
			resolve( ans );
		});
	});
}


module.exports.Nmap =  new Nmap();