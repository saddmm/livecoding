const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const adminSchema = new Schema({
    username: String,
    password: String
})

adminSchema.statics.findByCredentials = async function (username, password) {
    const admin = await this.findOne({username: username})
    const isMatch = await bcrypt.compare(password, admin.password)
    return isMatch ? admin : false
}

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

module.exports = mongoose.model('Admin', adminSchema)