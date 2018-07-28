const utils = require('./utils')
const cheerio = require('cheerio')
const Plugin = require('./plugin')
var subFix = "files"
var curseforgeUrl = 'https://www.curseforge.com'
const versionReg = /\d+\.\d+\.\d+/

var curseforge = {
    getPluginInfo: async function (url) {
        var _url = url.endsWith("/") ? url + subFix : url + "/" + subFix
        var data = await utils.get(url)
        var $ = cheerio.load(data)
        var meta = $('.project-header__details')
        var v = meta.find('.stats--game-version').text().match(versionReg)[0]
        var t = meta.find('.standard-datetime').attr('data-epoch') * 1000
        var u = _url
        var n = meta.find('.name').text()
        var dUrl = curseforgeUrl + $('.download-button').attr('href')
        var plugin = new Plugin(n, v, t, u, dUrl, 'curseforge')
        return plugin
    },
    downloadPlugin: async function (plugin) {
        var data = await utils.get(plugin.dUrl)
        var $ = cheerio.load(data)
        var url = $('.download__link').attr('href')
        var fileName = plugin.n + '.zip'
        return await utils.getFile(curseforgeUrl + url, fileName)
    },
    unzip: async function(src, dest) {
        await utils.unzip(src, dest)
    }
}


module.exports = curseforge