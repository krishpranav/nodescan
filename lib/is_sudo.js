var spawn = require('child_process');
var debug = require('debug')('pranav:is_sudo')

function is_sudo(){
    var ans = false;
    return new Promise(function(response,reject){
        spawn.exec('whoami', function(err, stdout, stderr){
            if(err) {
                console.log('is_sudo error' + err.code + stderr);
            }
            var usr = stdout.replace('\n','');
            if (usr === 'root') ans = true;
            debug('user is: ' + usr)
            response(ans);
        });
    });
}

module.exports = is_sudo;