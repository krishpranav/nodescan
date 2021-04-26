var debug = require('debug')('pranav:main');
var program = require('commander');
var http = require('http');

var localhostInfo = require('../lib/getHostInfo.js');
var page = require('../lib/page.js');         // render a webpage
var arpscan = require('../lib/arpscan.js');   // perform the arp scan
var is_sudo = require('../lib/is_sudo.js');   // check for root privileges
var db = require('../lib/database.js').DataBase; 
var os = require('os');

var pck = require('../package.json');

// check privileges
is_sudo().then(function(response){
    if(response === false) {
        console.log('Sorry you root privileges requires, use sudo or run as root')
        console.log(response)
        process.exit();
    }
});

program
	.version(pck.version)
	.description(pck.description)
	.usage(pck.name + ' [options]')
	.option('-d, --dev [interface]','network interface to use for scan, default: en1', 'en1')
	.option('-i, --invert','invert webpage colors for darker screen, default: white background')
	.option('-l, --loc [location]','save file location, default location: ~', os.homedir()+'/')
	.option('-p, --port <port>','Http server port number, default: 8888',parseInt,8888)
	.option('-u, --update [seconds]','update time for arp-scan, default: 60 sec', parseInt, 60)
	.parse(process.argv);

console.log('Starting nodescan on interface: '+program.dev+' every '+program.update);

var options = {'dev': program.dev};
var scan = [];

var saveFile = program.loc+'network_db.json'

function mapNetwork(){
    debug('network scan started...')
    arpscan(options).then(function(response){
        scan = response;
        debug('Scan done: '+scan.length+' hosts found');
        db.update( scan );
        db.write(saveFile);
    });
}

var hostinfo = localhostInfo();

db.read(saveFile);
db.push( hostinfo );

setInterval(function(){
    mapNetwork();
}, program.update*1000);

