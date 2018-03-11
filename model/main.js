const fs = require('fs')
const path = require('path')
const {log} = require('../utils.js')


const fileExists = (path) => {
    const exist = fs.existsSync(path)
    // if path is not exist
    if (exist === false) {
        const data = '[]'
        fs.writeFileSync(path, data )
    }
}

const load = (path) => {
    fileExists(path)
    const options = {
        encoding: 'utf8',
    }
    const data = fs.readFileSync(path, options)
    const d = JSON.parse(data)
    return d
}

class Model {
    constructor(form={}){
        this.id = form.id || undefined
        const now = Date.now()
        this.created_time = form.created_time || now
        this.updated_time = form.updated_time || now
    }

    static dbPath() {
        const name = this.name.toLowerCase()
        const file = path.join('db', `${name}.json`)
        // const file = `db/${name}.json`
        // '..' 前后是同级目录----- 动作是遇到.. 返回到上一级目录, 再到上级目录里面找后面的dir
        const p = path.join(__dirname, '..', file)
        return p
    }

    static _newFromMapper(form) {
        const m = new this(form)
        return m
    }

    static all() {
        // User
        // get the path, read the file, return new instances
        const path = this.dbPath()
        let models = load(path)
        let md = models.map( m => this._newFromMapper(m) )
        return md
    }


}


module.exports = Model

