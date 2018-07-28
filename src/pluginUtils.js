const pluginType = ['curseforge', 'wowinterface']
const curseforge = require('./curseforgeUtils')

var PluginUtils = {
    checkType: function (url) {
        if (url.indexOf("curseforge") != -1) {
            return pluginType[0]
        }
        return 'unknow'
    },

    parsePlugin: async function (url) {
        var type = this.checkType(url);
        switch (type) {
            case pluginType[0]:
                return await curseforge.getPluginInfo(url)
        }
    },

    downloadPlugin: async function (plugin) {
        var type = plugin.type
        switch (type) {
            case pluginType[0]:
                return await curseforge.downloadPlugin(plugin)
        }
    },

    unzip: async function (plugin, src, dest) {
        var type = plugin.type
        switch (type) {
            case pluginType[0]:
                return await curseforge.unzip(src, dest)
        }
    },

    addPlugin: function (plugins, plugin) {
        var size = plugins.length
        if (size > 0) {
            for (var i = 0; i < size; i++) {
                if (plugins[i].n === plugin.n) {
                    plugins.splice(i, 1)
                    break
                }
            }
        }
        plugins.push(plugin)
    },

    removePlugin: function(plugins, name) {
        var size = plugins.length
        if (size > 0) {
            for (var i = 0; i < size; i++) {
                if (plugins[i].n === name) {
                    plugins.splice(i, 1)
                    break
                }
            }
        }
    }
}

module.exports = PluginUtils