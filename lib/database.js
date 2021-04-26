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
        var bb = parseInt(a.ip.split('.')[3]);
        return aa - bb;
    });
    return s;
}