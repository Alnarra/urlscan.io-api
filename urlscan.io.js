'use strict'
var request = require('request')
var agent = require('https').Agent

class urlScan{
    constructor(config){
        this.baseURL = `https://urlscan.io/api/${config.version}/`
        this.agent = new agent({
            ca: config.proxy || null
        }) 
        this.reqOptions = { 
            gzip: true, 
            agent: this.agent, 
            uri: String, 
            method: String, 
            headers: {
                'User-Agent': `${config.userAgent}` || null,
                'Content-Type': 'application/json',
                'API-Key': `${config.apiKey}`,
            }
        }
    }
    _req(path, data){
        this.reqOptions.uri = this.baseURL + path 
        this.reqOptions.method = data.method
        var options = this.reqOptions
        return new Promise((resolve, reject) => {
            request(options,(err, res, body) => {
                err ? reject(err) : ""
                res.statusCode == 200 ?  resolve(body) : reject(`Server response was ${res.statusCode}`)
            })
        })
    }
    async submit(searchTerm){
        var temp = this
        temp.reqOptions.form = {
            url: searchTerm,
            Public: null
        }
        return this._req("scan/",{
            method: "POST"
        }).then(() =>{
            delete temp.reqOptions.form
        })
    }
    async search(searchTerm){
        return this._req(`search/?q=domain:${searchTerm}`,{
            method: "GET"
        })
    }
    async result(uuid){
        return this._req(`result/${uuid}`,{
            method: "GET"
        })
    }
}
module.exports = urlScan
