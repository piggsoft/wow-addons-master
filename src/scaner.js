const fs = require('fs')
const path = require('path')

const reg = /\.TOC$/i

function parse(dir) {
    const files = fs.readdirSync(dir)
    const size = files.length
    var toc
    for(var i=0; i<size; i++) {
        var file = files[i]
        if (reg.test(file)) {
            toc = file
        }
    }
    console.log(toc)
}

const scaner = {
    scan: function(dir) {
        const files = fs.readdirSync(dir)
        files.forEach(v => {
            parse(path.join(dir, v))
        })
    }
}


module.exports = scaner