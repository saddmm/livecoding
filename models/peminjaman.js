const mongoose = require('mongoose')
const Schema = mongoose.Schema

const rentalSchema = new Schema({
    tool: {
        type: Schema.Types.ObjectId,
        ref: 'Tool'
    },
    waktuPinjam: {
        type: Date
    },
    waktuKembali: {
        type: Date,
        expires: 60*60*24*7
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pinjam', 'Kembali'],
        default: 'Pinjam'
    },
    kerusakan: String
})

module.exports = mongoose.model('Rental', rentalSchema)