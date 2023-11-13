const userModel = require('../../models/user.model.js')

class UserManager {
    
    getUsers () {
        return userModel.find({}).lean()
    }

    getById ( id ) {
        return userModel.findOne({ _id: id }).lean()
    }

    getByEmail ( email ) {

        return userModel.findOne({ email }).lean()

    }

    addUser ( user ) {
        return userModel.create( user )
    }

    updateUser ( id, user ) {
        return userModel.updateOne({ _id: id }, user)
    }

    deleteUser ( id ) {
        return userModel.deleteOne({ _id: id })
    }

    changeUserRole(id, newRole) {
        return userModel.updateOne({ _id: id }, { role: newRole });
    }

}

module.exports = new UserManager()