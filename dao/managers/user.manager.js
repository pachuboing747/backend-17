const userModel = require('../models/user.model')
const BaseManager = require ("./base.manager.js")

class UserManager extends BaseManager {

  constructor(){
    super(userModel)
  }

  getById(id) {
    return userModel.findOne({ _id: id }).lean()
  }

  async save(id, user) {
    if (!await this.getById(id)) {
      return
    }

    const {
      email,
      firstname,
      lastname,
      gender,
      age,
      password
    } = user

    await userModel.updateOne({ _id: id }, { 
      $set: {
        email,
        firstname,
        lastname,
        gender,
        age,
        password
      } 
    })
  }

  async delete(id) {
    const existing = await this.getById(id)

    if (!existing) {
      return
    }

    await userModel.deleteOne({ _id: id })
  }

  getByEmail(email) {

    return userModel.findOne({ email }).lean()
  }
}

module.exports = new UserManager()
