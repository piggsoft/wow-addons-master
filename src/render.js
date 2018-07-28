'use strict'

const Store = require('electron-store')
const store = new Store();
const electron = require('electron')
const pluginUtils = require('./pluginUtils')
window.$ = require('jquery')
require('bootstrap')
require('popper.js')

var plugins = store.get('plugins') || []

const dialog = electron.dialog ||  electron.remote.dialog

console.log((electron.app || electron.remote.app).getPath('userData'))

$("#wowPathBtn").on('click', function() {
    var path = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})
    if (path) {
        $(this).parent().prev().children('input').val(path)
    }
})


$("#addPlugin").on('click', function() {
    var url = $(this).parent().prev().children('input').val();
    if(!url) {
        alert("请填写插件地址，可在https://www.curseforge.com/wow/addons搜索")
    }
    pluginUtils.parsePlugin(url, function(p) {
        pluginUtils.downloadPlugin(p, function() {
            plugins.push(p)
        })
    })
})
