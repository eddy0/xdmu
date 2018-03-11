const Model = require('./main')
const {log} = require('../utils.js')


class User extends Model {
    constructor (form={}){
        super(form)

    }

}

const test = () => {
    const form = {

    }
    log('md', User.all())


}

test()