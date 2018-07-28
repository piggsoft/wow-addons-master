'use strict'

const Store = require('electron-store')
const store = new Store();
const electron = require('electron')
const pluginUtils = require('./pluginUtils')
window.$ = window.jQuery = require('jquery')
require('bootstrap')
require('popper.js')
require('jquery.showloading')

const wowPathSub = '/interface/addons'
const wowPathKey = 'wowPath';
const pluginKey = 'plugins'

var plugins = store.get(pluginKey) || []

const dialog = electron.dialog || electron.remote.dialog

console.log((electron.app || electron.remote.app).getPath('userData'))

$(function() {
    $('#wowPath').val(store.get(wowPathKey))
    var size = plugins.length
    var _str = '';
    for (var i=0; i<size; i++) {
        _str += fillTd(plugins[i])
    }
    $("table tbody").append(_str);
})

function fillTd(plugin) {
    return `<tr>
    <td>${plugin.n}</td>
    <td>${plugin.v}</td>
    <td>${plugin.t}</td>
    <td>
        <button class="btn btn-success">更新</button>
        <button class="btn btn-danger">删除</button>
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

async function parse(url) {
    $('body').showLoading();
    var plugin = await pluginUtils.parsePlugin(url)
    var file = await pluginUtils.downloadPlugin(plugin)
    await pluginUtils.unzip(plugin, file, store.get(wowPathKey) + wowPathSub)
    plugins.push(plugin)
    store.set(pluginKey, plugins)
    $('body').hideLoading();
}