const https = require('https')
const iconv = require("iconv-lite")
const fs = require('fs')
const electron = require('electron')
var userDataPath = (electron.app || electron.remote.app).getPath('userData')
var request = require("request")
var path = require("path")
var unzip = require("unzip")

var httpsUtils = {
    _get: function (url) {
        return new Promise(function (resolve, reject) {
            https.get(url, (res) => {
                var datas = []
                var size = 0
                res.on('data', function (data) {
                    datas.push(data);
                    size += data.length
                })
                res.on("end", function () {
                    resolve({
                        data: datas,
                        size: size
                    });
                })
                res.on("error", function (e) {
                    console.log(e)
                })
            })
        })
    },
    get: async function (url) {
        var result = await this._get(url)
        var buff = Buffer.concat(result.data, result.size)
        return iconv.decode(buff, "utf8")
    },

    getFile: async function (url, fileName) {
        var _path = await dowloadFile(url, fileName)
        return _path
    },

    unzip: async function(src, dest) {
        await _unzip(src, dest)
    }

}

function _unzip(src, dest) {
    return new Promise(function (resolve, reject) {
        var extract = unzip.Extract({
            path: dest
        })
        extract.on('error', function (err) {
            console.log("error++++++++++++++++++++++")
            console.log(err)
            //解压异常处理
        });
        extract.on('finish', function () {
            console.log("解压完成!!")
            resolve()
        });
        fs.createReadStream(src).pipe(extract)
    })
}

function dowloadFile(url, fileName) {

    var _path = path.join(userDataPath, fileName)
    let stream = fs.createWriteStream(_path)
    return new Promise(function (resolve, reject) {
        request(url).pipe(stream).on('close', function () {
            resolve(_path);
        })
    })
}

module.exports = httpsUtils