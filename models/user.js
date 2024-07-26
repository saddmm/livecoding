const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    nim: {
        type: Number,
        unique: [true, 'NIM sudah terdaftar'],
        required: [true, 'NIM Harus Terisi']
    },
    nama: {
        type: String,
        required: [true, 'Nama Harus Terisi']
    },
    email: {
        type: String,
        required: [true, 'Email Harus Terisi']
    },
    no_telp: {
        type: Number,
        required: [true, 'No. Telpon Harus Terisi']
    },
    alamat: {
        type: String,
        required: [true, 'Alamat Harus Terisi']
    },
    password: {
        type: String,
        required: [true, 'Password Harus Terisi']
    },
    image: {
        url: {
            type: String,
            default: 'public\\img\\user.png'
        },
        filename: {
            type: String,
            default: 'user.png'
        }
    }
})

userSchema.statics.findByCredentials = async function (nim, password) {
    const user = await this.findOne({ nim: nim })
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch ? user : false
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

module.exports = mongoose.model('User', userSchema)