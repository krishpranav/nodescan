var spawn = require('child_process');
var os = require('os');
var debug = require('debug')('pranav:getHostName');

function getHostName(ip){
	return new Promise( function(resolve,reject){
		var hostname = '';
		switch(os.type().toLowerCase()){
			case 'linux':
				spawn.exec('avahi-resolve-address ' + ip +" | awk '{print $2}'", function (err, stdout, stderr){
					if(err) debug('['+ip+' hostname not found]: '+stderr);
					else hostname = stdout;
					resolve(hostname);
				});
				break;
			case 'darwin':
				spawn.exec('dig +short -x ' + ip +" -p 5353 @224.0.0.251", function (err, stdout, stderr){
					if(err) debug('['+ip+' hostname not found]: '+stderr); 
					else hostname = stdout;
					resolve(hostname);
				});
				break;
		}
	});
}


module.exports = getHostName;