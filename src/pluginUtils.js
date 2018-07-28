const pluginType = ['curseforge', 'wowinterface']
const curseforge = require('./curseforgeUtils')

var PluginUtils = {
    checkType: function (url) {
        if (url.indexOf("curseforge") != -1) {
            return pluginType[0]
        }
        return 'unknow'
    },

    parsePlugin: function (url, callback) {
        var type = this.checkType(url);
        switch (type) {
            case pluginType[0]:
                curseforge.getPluginInfo(url, callback)
                break;
        }
    },

    downloadPlugin: function (plugin, callback) {
        var type = plugin.type
        switch (type) {
            case pluginType[0]:
                curseforge.downloadPlugin(plugin, callback)
                break
        }
    }
}

module.exports = PluginUtils