const https = require('https')
const iconv = require("iconv-lite")
const fs = require('fs')
const electron = require('electron')
var userDataPath = (electron.app || electron.remote.app).getPath('userData')

var httpsUtils = {
    get: function(url, callback) {
        https.get(url, (res) => {
            var datas = []
            var size = 0
            res.on('data', function (data) {
                datas.push(data);
                size += data.length
            })
            res.on("end", function () {
                var buff = Buffer.concat(datas, size);
                var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring
                callback(result);
            })
        })
    },
    getFile: function(url, callback) {
        https.get(url, (res) => {
            var datas = []
            var size = 0
            res.on('data', function (data) {
                datas.push(data);
                size += data.length
            })
            res.on("end", function () {
                //fs.writeFile()
                callback(datas);
            })
        })
    }
}

module.exports = httpsUtils