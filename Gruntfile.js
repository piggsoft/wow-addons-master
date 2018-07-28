var grunt = require("grunt");
grunt.config.init({
    pkg: grunt.file.readJSON('package.json'),
    'create-windows-installer': {
        x64: {
            appDirectory: './out/wam-win32-x64',
            authors: 'piggsoft.com',
            exe: 'wam.exe',
            description:"wow单体插件管理器",
        }       
    }
})


grunt.loadNpmTasks('grunt-electron-installer');
grunt.registerTask('default', ['create-windows-installer']);