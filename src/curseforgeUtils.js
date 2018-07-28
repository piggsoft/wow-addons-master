const httpUtils = require('./httpsUtils')
const cheerio = require('cheerio')
const Plugin = require('./plugin')
var subFix = "files"
var curseforgeUrl = 'https://www.curseforge.com'

var curseforge = {
    getPluginInfo: function(url, callback) {
        var _url = url.endsWith("/") ? url + subFix : url + "/" + subFix
        httpUtils.get(url, function(data) {
            var $ = cheerio.load(data)
            var meta = $('.project-header__details')
            var v = meta.find('.stats--game-version').text()
            var t = meta.find('.standard-datetime').attr('data-epoch') * 1000
            var u = _url
            var n = meta.find('.name').text()
            var dUrl = curseforgeUrl + $('.download-button').attr('href')
            var plugin = new Plugin(n, v, t, u, dUrl, 'curseforge')
            callback(plugin)
        })
    },
    downloadPlugin: function(plugin) {
        httpUtils.get(plugin.dUrl, function(data) {
            var $ = cheerio.load(data)
            var _dUrl = $('.download__link').attr('href')
            httpUtils.getFile(_dUrl, function(){})
        })
    }
}


module.exports = curseforge