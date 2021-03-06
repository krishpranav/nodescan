// use arp scan to find hosts on the network
var spawn = require('child_process');

// scan function
function scan(ops) {
    var ans = [];
    return new Promise(function(response,reject) {
        spawn.exec('arp-scan -l -I ' + ops.dev, function(err, stdout, stderr){
            if (err) {
                console.log("child process failed with error code: " + err.code + stderr);
            }
            var net = stdout.split('\n');
            for (var i=2;i<net.lenght-4;i++){
                var chunk = net[i].split('\t');
                ans.push( { 'ip': chunk[0], 'mac': chunk[1].toUpperCase(), 'vendor': chunk[2]} );
            }
            response(ans);
        });
    });
}

module.exports = scan;