'use strict'

const Store = require('electron-store')
const store = new Store();
const electron = require('electron')
const pluginUtils = require('./pluginUtils')
window.$ = window.jQuery = require('jquery')
require('bootstrap')
require('popper.js')
require('jquery.showloading')
const moment = require('moment')

const defaultPlugins = require('./defaultPlugins')

const wowPathSub = '/interface/addons'
const wowPathKey = 'wowPath';
const pluginKey = 'plugins'

var plugins = store.get(pluginKey) || []

const dialog = electron.dialog || electron.remote.dialog

console.log((electron.app || electron.remote.app).getPath('userData'))

$(function() {
    $('#wowPath').val(store.get(wowPathKey))
    refreshTable();
})

function refreshTable() {
    $("table tbody").html('')
    var size = plugins.length
    var _str = '';
    for (var i=0; i<size; i++) {
        _str += fillTd(plugins[i])
    }
    $("table tbody").append(_str);

    $('.del').on('click', function () {
        var name = $(this).parent().parent().children().first().text()
        pluginUtils.removePlugin(plugins, name)
        store.set(pluginKey, plugins)
        refreshTable()
    })
}

function fillTd(plugin) {
    var _t = moment(new Date(plugin.t)).format("YYYY-MM-DD")
    return `<tr>
    <td>${plugin.n}</td>
    <td>${plugin.v}</td>
    <td>${_t}</td>
    <td>
        <button class="btn btn-success">更新</button>
        <button class="btn btn-danger del">删除</button>
    </td>
    </tr>`
}

$("#wowPathBtn").on('click', function () {
    var path = dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections']
    })
    if (path) {
        $(this).parent().prev().children('input').val(path)
    }
    store.set(wowPathKey, path)
})


$("#addPlugin").on('click', function () {
    var url = $(this).parent().prev().children('input').val();
    if (!url) {
        alert("请填写插件地址，可在https://www.curseforge.com/wow/addons搜索")
        return
    }
    if (!store.has(wowPathKey)) {
        alert("请先设置wow的目录")
        return
    }
    parse(url)
})

$("#addDefault").on('click', function () {
    addDefault()
})

async function addDefault() {
    for(var i=0; i<defaultPlugins.length; i++) {
        await parse(defaultPlugins[i])
    }
}



$('#updateAllPlugin').on('click', function() {
    var size = plugins.length
    for (var i=0; i<size; i++) {
        updateAll()
    }
})

async function updateAll() {
    $('body').showLoading();
    var size = plugins.length
    var _plugins = []
    for (var i=0; i<size; i++) {
        var _plugin = plugins[i]
        var plugin = await pluginUtils.parsePlugin(_plugin.u)
        if (plugin.t > _plugin.t) {
            var file = await pluginUtils.downloadPlugin(plugin)
            await pluginUtils.unzip(plugin, file, wowPath())
            _plugins.push(plugin)
        } else {
            _plugins.push(_plugin)
        }
    }
    plugins = _plugins
    store.set(pluginKey, plugins)
    $('body').hideLoading()
    refreshTable()
}


async function parse(url) {
    $('body').showLoading();
    var plugin = await pluginUtils.parsePlugin(url)
    var file = await pluginUtils.downloadPlugin(plugin)
    await pluginUtils.unzip(plugin, file, wowPath())
    pluginUtils.addPlugin(plugins, plugin)
    store.set(pluginKey, plugins)
    $('body').hideLoading();
    refreshTable();
}

function wowPath() {
    return store.get(wowPathKey) + wowPathSub
}
