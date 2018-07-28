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

var plugins = store.get('plugins') || []

const dialog = electron.dialog || electron.remote.dialog

console.log((electron.app || electron.remote.app).getPath('userData'))

$(function() {
    $('#wowPath').val(store.get(wowPathKey))
})

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
    await pluginUtils.unzip(file, store.get(wowPathKey) + wowPathSub)
    plugins.push(plugin)
    $('body').hideLoading();
}