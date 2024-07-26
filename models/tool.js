const mongoose = require('mongoose')
const Schema = mongoose.Schema

const toolSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nama Tidak Boleh Kosong']
    },
    image: {
        url: String,
        filename: String
    },
    tag: {
        type: String,
        enum: ['Alat', 'Laboratorium'],
        required: true
    },
    available: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Tool', toolSchema)