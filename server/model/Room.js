const _ = require('lodash')
class Room {
    constructor() {
        this.user = []
    }
    createUser(id, name, room) {
        const user = { id, name, room }
        this.user.push(user)
    }
    getUserById(id) {
        // this.user.filter(id => id === this.user.id)
        //lodash lv1
        // const res = _.filter(this.users, user => user.id === id)
        // const user = _.first(res)
        // return user
        //lodash lv2
        return _.chain(this.user)
            .filter(user => user.id === id)
            .first()
            .value()
    }
    removeUser(id) {
        const user = this.getUserById(id)
        this.user = _.filter(this.user, user => user.id !== id)
        return user
    }
    getUserByRoom(room) {
        return _.filter(this.user, user => user.room === room)
    }
}
module.exports = Room