var request = require('request');

function macVendorLookup(mac){
	var ret = '';
	return new Promise(function(resolve,reject){
		request('http://api.macvendors.com/'+mac, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
			ret = body;
		  }
		  resolve(ret);
		});
	});
}

module.exports = macVendorLookup;