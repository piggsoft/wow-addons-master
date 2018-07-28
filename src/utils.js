const https = require('https')
const iconv = require("iconv-lite")
const fs = require('fs')
const electron = require('electron')
var userDataPath = (electron.app || electron.remote.app).getPath('userData')
var request = require("request")
var path = require("path")
var DecompressZip = require('decompress-zip')

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

    unzip: async function (src, dest) {
        await _unzip(src, dest)
    }

}

function _unzip(src, dest) {
    return new Promise(function (resolve, reject) {

        var unzipper = new DecompressZip(src)

        unzipper.on('error', function (err) {
            console.log('Caught an error', err);
        });

        // Notify when everything is extracted
        unzipper.on('extract', function (log) {
            console.log('Finished extracting', log);
            resolve()
        });

        // Notify "progress" of the decompressed files
        unzipper.on('progress', function (fileIndex, fileCount) {
            console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
        });

        // Start extraction of the content
        unzipper.extract({
            path: dest
            // You can filter the files that you want to unpack using the filter option
            //filter: function (file) {
            //console.log(file);
            //return file.type !== "SymbolicLink";
            //}
        });
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