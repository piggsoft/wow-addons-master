class Plugin {
    constructor(name, version, lastUpdate, url, dUrl, type) {
        this.n = name
        this.v = version
        this.t = lastUpdate
        this.u = url
        this.type = type
        this.dUrl = dUrl
    }
}

module.exports = Plugin